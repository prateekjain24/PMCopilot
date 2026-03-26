# 05 - App Teardown Engine

The App Teardown Engine is PMCopilot's most differentiated capability. It uses iOS Simulator and Android Emulator to autonomously navigate competitor apps, capture every screen, and produce structured competitive intelligence.

---

## Architecture

```
/pmcopilot:competitive-teardown "Gojek"
         |
         v
+------------------+
| research-        |
| synthesizer      |
| (orchestrator)   |
+--------+---------+
         |
   +-----+-----+
   |             |
   v             v
+--------+  +--------+
|app-tear|  |app-tear|
|down-   |  |down-   |
|agent   |  |agent   |
|(iOS)   |  |(Android|
+---+----+  +---+----+
    |            |
    v            v
+--------+  +--------+
|simulator|  |emulator|
|bridge   |  |bridge  |
|MCP      |  |MCP     |
+---+----+  +---+----+
    |            |
    v            v
xcrun simctl    adb
+ idb           + uiautomator
```

---

## iOS Simulator Deep Dive

### Prerequisites
- Xcode installed (provides `xcrun simctl`)
- At least one iOS Simulator runtime available
- Optional: Facebook's `idb` for advanced interaction
  ```bash
  brew install idb-companion
  pip install fb-idb
  ```

### Core CLI Commands Used

**Device Management**:
```bash
# List all available simulators
xcrun simctl list devices

# Boot a specific simulator
xcrun simctl boot "iPhone 15 Pro"

# Shut down
xcrun simctl shutdown "iPhone 15 Pro"

# Erase (reset to clean state)
xcrun simctl erase "iPhone 15 Pro"
```

**App Management**:
```bash
# Install an app
xcrun simctl install booted /path/to/App.app

# Launch an app
xcrun simctl launch booted com.gojek.consumer

# Terminate an app
xcrun simctl terminate booted com.gojek.consumer

# Uninstall
xcrun simctl uninstall booted com.gojek.consumer

# Open a URL (deep link)
xcrun simctl openurl booted "https://gojek.com/app"
```

**Screenshot and Video**:
```bash
# Take a screenshot
xcrun simctl io booted screenshot /tmp/screen.png
xcrun simctl io booted screenshot --type=jpeg /tmp/screen.jpg

# Record video
xcrun simctl io booted recordVideo /tmp/recording.mp4
# Press Ctrl+C to stop recording

# Supported video codecs: h264, hevc
xcrun simctl io booted recordVideo --codec=h264 /tmp/recording.mp4
```

**Input Simulation (via idb)**:
```bash
# Tap at coordinates
idb ui tap 200 400

# Swipe
idb ui swipe 200 600 200 200 --duration 0.5

# Type text (into focused field)
idb ui text "hello@example.com"

# Press hardware button
idb ui button HOME
idb ui button LOCK

# Get accessibility hierarchy
idb ui describe-all
```

**Accessibility Tree (Understanding Screen Content)**:
```bash
# Dump full accessibility hierarchy
idb ui describe-all --json

# Output example:
{
  "type": "Button",
  "label": "Sign Up",
  "frame": {"x": 100, "y": 500, "width": 200, "height": 44},
  "enabled": true,
  "children": []
}
```

### Navigation Strategy for the Agent

The `app-teardown` agent uses this algorithm:

```
1. Take screenshot + dump accessibility tree
2. Parse accessibility tree to identify all interactive elements
3. For each element, determine:
   - Is it a navigation element (tab, button, link)?
   - Have I already visited the destination screen?
   - What's the priority? (primary nav > secondary > settings)
4. Tap the highest-priority unvisited element
5. Wait for transition (500ms default, configurable)
6. Take screenshot of new screen
7. Check if this is a genuinely new screen (compare to visited screens)
8. If new: add to visited set, repeat from step 2
9. If same: go back and try next element
10. If stuck: use back gesture / home button and try alternative path
```

**Screen Deduplication**:
- Compare accessibility trees (not pixel-level comparison)
- Two screens are "same" if they have >80% element overlap
- Allows minor variations (e.g., different scroll position)

---

## Android Emulator Deep Dive

### Prerequisites
- Android SDK installed (provides `adb` and `emulator`)
- At least one AVD (Android Virtual Device) created
- `ANDROID_HOME` environment variable set

### Core CLI Commands Used

**Device Management**:
```bash
# List available AVDs
emulator -list-avds

# Start an emulator
emulator -avd Pixel_7_API_34 -no-snapshot-load

# List connected devices
adb devices

# Wait for device to be ready
adb wait-for-device
```

**App Management**:
```bash
# Install APK
adb install /path/to/app.apk
adb install -r /path/to/app.apk  # reinstall keeping data

# Launch app
adb shell am start -n com.gojek.app/.MainActivity

# Force stop
adb shell am force-stop com.gojek.app

# Clear app data
adb shell pm clear com.gojek.app

# List installed packages
adb shell pm list packages | grep gojek

# Grant permission
adb shell pm grant com.gojek.app android.permission.ACCESS_FINE_LOCATION
```

**Screenshot and Video**:
```bash
# Screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png /tmp/screenshot.png

# Screen recording (max 180 seconds)
adb shell screenrecord /sdcard/recording.mp4
# Press Ctrl+C to stop
adb pull /sdcard/recording.mp4 /tmp/recording.mp4
```

**Input Simulation**:
```bash
# Tap at coordinates
adb shell input tap 540 960

# Swipe (scroll down)
adb shell input swipe 540 1500 540 500 300

# Type text
adb shell input text "hello@example.com"

# Key events
adb shell input keyevent KEYCODE_BACK      # Back button
adb shell input keyevent KEYCODE_HOME      # Home button
adb shell input keyevent KEYCODE_ENTER     # Enter key
adb shell input keyevent KEYCODE_TAB       # Tab key
adb shell input keyevent KEYCODE_DEL       # Backspace

# Long press (hold at coordinates for 1000ms)
adb shell input swipe 540 960 540 960 1000
```

**UI Hierarchy (Understanding Screen Content)**:
```bash
# Dump UI hierarchy to XML
adb shell uiautomator dump /sdcard/ui.xml
adb pull /sdcard/ui.xml /tmp/ui.xml

# Example output:
<node index="0" text="Sign Up" resource-id="com.gojek:id/btn_signup"
      class="android.widget.Button" package="com.gojek.app"
      bounds="[100,500][300,544]" enabled="true" clickable="true"/>
```

**Logcat (Debug Info)**:
```bash
# Get recent logs for an app
adb logcat -d --pid=$(adb shell pidof com.gojek.app) | tail -100

# Filter by tag
adb logcat -d -s "GojekApp:*" | tail -50
```

### Android vs iOS: Key Differences for Agent

| Capability | iOS (simctl + idb) | Android (adb) |
|-----------|-------------------|---------------|
| Tap simulation | idb (reliable) | adb shell input (reliable) |
| Text input | idb ui text | adb shell input text |
| Accessibility tree | idb ui describe-all (JSON) | uiautomator dump (XML) |
| Screenshot | simctl io screenshot | adb shell screencap + pull |
| App install | simctl install (.app) | adb install (.apk) |
| Deep links | simctl openurl | adb shell am start -a VIEW -d URL |
| Back navigation | No hardware back | adb keyevent BACK |
| Permissions | Automatic in simulator | adb pm grant |

---

## Obtaining Competitor Apps

### iOS
- **App Store downloads**: Apps from App Store are encrypted -- cannot be directly installed on simulator
- **Workaround 1**: Use the web version / PWA in simulator Safari
- **Workaround 2**: Build from source if open-source
- **Workaround 3**: Use TestFlight builds if available
- **Recommended**: Focus on Android emulator for true black-box testing of competitor apps

### Android
- **APK download sites**: APKMirror, APKPure (legal, mirrors of Play Store)
- **Direct from device**: `adb shell pm path com.gojek.app` then `adb pull`
- **Play Store on emulator**: Google Play images available for AVDs
- **Recommended**: Use Google Play-enabled AVD, download directly from Play Store

### Practical Recommendation
For competitive teardowns, **Android emulator is the primary path** because:
1. APKs are easier to obtain (APKMirror, direct download)
2. `adb` provides more reliable black-box testing
3. No code signing / encryption issues
4. uiautomator provides excellent UI hierarchy data

iOS simulator is best for:
1. Analyzing your own app on iOS
2. Testing deep links and web views
3. Comparing iOS-specific UI patterns
4. When iPA/app bundle is available

---

## Example: Full Competitive Teardown Flow

```
User: /pmcopilot:competitive-teardown "Gojek transport feature"

Step 1: Agent checks Android emulator availability
  --> adb devices (emulator running)
  --> Gojek APK found in cache or downloaded from APKMirror

Step 2: Install and launch
  --> adb install gojek.apk
  --> adb shell am start -n com.gojek.app/.SplashActivity
  --> Wait 3s for splash screen
  --> Screenshot: splash_screen.png

Step 3: Onboarding
  --> Dump UI: "Welcome to Gojek" screen detected
  --> Screenshot: welcome_screen.png
  --> Tap "Get Started"
  --> Screenshot: login_screen.png
  --> Type phone number, tap Continue
  --> Screenshot: otp_screen.png
  --> [Skip auth or use test credentials]

Step 4: Home Screen
  --> Screenshot: home_screen.png
  --> Dump UI: identify all service tiles (GoRide, GoCar, GoFood, etc.)
  --> Tap "GoRide"
  --> Screenshot: goride_booking.png

Step 5: Booking Flow
  --> Type pickup location
  --> Screenshot: pickup_selection.png
  --> Type destination
  --> Screenshot: destination_selection.png
  --> Screenshot: ride_options.png (bike, car, etc.)
  --> Screenshot: price_estimate.png

Step 6: Map and Tracking
  --> Screenshot: map_view.png
  --> Identify: real-time tracking, driver info, ETA display

... (continues for all major flows)

Step 7: Synthesis
  --> 47 screenshots captured
  --> 12 unique user flows mapped
  --> Feature inventory: 23 features identified
  --> UX patterns: bottom sheets, floating CTA, tab navigation
  --> Report generated: gojek-teardown-report.md
```

---

## Data Storage

All teardown data is persisted in `${CLAUDE_PLUGIN_DATA}/teardowns/`:

```
teardowns/
|-- gojek/
|   |-- android/
|   |   |-- screenshots/
|   |   |   |-- onboarding/
|   |   |   |-- home/
|   |   |   |-- goride/
|   |   |   +-- settings/
|   |   |-- ui-dumps/
|   |   |-- flows/
|   |   +-- report.md
|   +-- ios/
|       +-- ... (same structure)
|
|-- uber/
|   +-- ...
|
+-- comparison/
    +-- gojek-vs-uber-vs-grab.md
```

This enables:
- **Incremental teardowns**: Don't re-analyze screens you've already captured
- **Historical comparison**: Track how competitor apps change over time
- **Cross-competitor analysis**: Compare the same flow across multiple apps
