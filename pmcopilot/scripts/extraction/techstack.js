(function () {
  var detected = [];

  function addDetection(name, category, confidence, evidence) {
    detected.push({
      name: name,
      category: category,
      confidence: confidence,
      evidence: evidence
    });
  }

  // --- Frameworks ---

  // React
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    addDetection("React", "framework", "high", "window.__REACT_DEVTOOLS_GLOBAL_HOOK__ present");
  }

  // Vue
  if (window.__VUE__) {
    addDetection("Vue.js", "framework", "high", "window.__VUE__ present");
  }

  // Angular
  var ngVersionEl = document.querySelector("[ng-version]");
  if (ngVersionEl) {
    var ngVer = ngVersionEl.getAttribute("ng-version");
    addDetection("Angular", "framework", "high", "ng-version attribute found: " + ngVer);
  }

  // Next.js
  if (window.__NEXT_DATA__) {
    addDetection("Next.js", "framework", "high", "window.__NEXT_DATA__ present");
  }

  // Nuxt
  if (window.__NUXT__) {
    addDetection("Nuxt.js", "framework", "high", "window.__NUXT__ present");
  }

  // --- Analytics ---

  // GA4 / Google Tag
  if (window.gtag || window.dataLayer) {
    var gaEvidence = [];
    if (window.gtag) gaEvidence.push("window.gtag");
    if (window.dataLayer) gaEvidence.push("window.dataLayer");
    addDetection("Google Analytics / GA4", "analytics", "high", gaEvidence.join(" and ") + " present");
  }

  // Segment
  if (window.analytics && typeof window.analytics.identify === "function") {
    addDetection("Segment", "analytics", "high", "window.analytics with identify method present");
  }

  // Amplitude
  if (window.amplitude) {
    addDetection("Amplitude", "analytics", "high", "window.amplitude present");
  }

  // Mixpanel
  if (window.mixpanel) {
    addDetection("Mixpanel", "analytics", "high", "window.mixpanel present");
  }

  // --- Session Recording / Heatmaps ---

  // Hotjar
  if (window.hj || window._hjSettings) {
    var hjEvidence = [];
    if (window.hj) hjEvidence.push("window.hj");
    if (window._hjSettings) hjEvidence.push("window._hjSettings");
    addDetection("Hotjar", "session-recording", "high", hjEvidence.join(" and ") + " present");
  }

  // FullStory
  if (window.FS) {
    addDetection("FullStory", "session-recording", "high", "window.FS present");
  }

  // --- Support / Chat ---

  // Intercom
  if (window.Intercom) {
    addDetection("Intercom", "support", "high", "window.Intercom present");
  }

  // Zendesk
  if (window.zE) {
    addDetection("Zendesk", "support", "high", "window.zE present");
  }

  // --- Feature Flags / Experimentation ---

  // LaunchDarkly
  if (window.ldclient) {
    addDetection("LaunchDarkly", "feature-flags", "high", "window.ldclient present");
  }

  // Optimizely
  if (window.optimizely) {
    addDetection("Optimizely", "experimentation", "high", "window.optimizely present");
  }

  // --- Script source analysis ---

  var scriptSrcs = [];
  var scripts = document.scripts;
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src) {
      scriptSrcs.push(scripts[i].src.toLowerCase());
    }
  }

  var scriptPatterns = [
    { pattern: /react/, name: "React", category: "framework" },
    { pattern: /vue/, name: "Vue.js", category: "framework" },
    { pattern: /angular/, name: "Angular", category: "framework" },
    { pattern: /next/, name: "Next.js", category: "framework" },
    { pattern: /nuxt/, name: "Nuxt.js", category: "framework" },
    { pattern: /googletagmanager|gtag/, name: "Google Tag Manager", category: "analytics" },
    { pattern: /google-analytics|ga\.js|analytics\.js/, name: "Google Analytics", category: "analytics" },
    { pattern: /segment\.com|segment\.io|cdn\.segment/, name: "Segment", category: "analytics" },
    { pattern: /amplitude/, name: "Amplitude", category: "analytics" },
    { pattern: /mixpanel/, name: "Mixpanel", category: "analytics" },
    { pattern: /hotjar/, name: "Hotjar", category: "session-recording" },
    { pattern: /fullstory/, name: "FullStory", category: "session-recording" },
    { pattern: /intercom/, name: "Intercom", category: "support" },
    { pattern: /zendesk|zdassets/, name: "Zendesk", category: "support" },
    { pattern: /launchdarkly/, name: "LaunchDarkly", category: "feature-flags" },
    { pattern: /optimizely/, name: "Optimizely", category: "experimentation" },
    { pattern: /stripe/, name: "Stripe", category: "payments" },
    { pattern: /sentry/, name: "Sentry", category: "error-tracking" },
    { pattern: /datadog/, name: "Datadog", category: "monitoring" },
    { pattern: /cloudflare/, name: "Cloudflare", category: "cdn" }
  ];

  // Track what has already been detected at high confidence to avoid duplicates
  var alreadyDetected = {};
  for (var d = 0; d < detected.length; d++) {
    alreadyDetected[detected[d].name.toLowerCase()] = true;
  }

  for (var j = 0; j < scriptSrcs.length; j++) {
    for (var k = 0; k < scriptPatterns.length; k++) {
      var sp = scriptPatterns[k];
      if (sp.pattern.test(scriptSrcs[j]) && !alreadyDetected[sp.name.toLowerCase()]) {
        addDetection(sp.name, sp.category, "medium", "Script source matched: " + scriptSrcs[j]);
        alreadyDetected[sp.name.toLowerCase()] = true;
      }
    }
  }

  // --- Resource analysis (CSS, fonts, images from performance entries) ---

  if (typeof performance !== "undefined" && typeof performance.getEntriesByType === "function") {
    var resources = performance.getEntriesByType("resource");
    var resourcePatterns = [
      { pattern: /fonts\.googleapis|typekit|use\.typekit/, name: "Google Fonts / Typekit", category: "typography" },
      { pattern: /cloudflare/, name: "Cloudflare", category: "cdn" },
      { pattern: /fastly/, name: "Fastly", category: "cdn" },
      { pattern: /akamai/, name: "Akamai", category: "cdn" },
      { pattern: /jsdelivr|unpkg|cdnjs/, name: "Public CDN", category: "cdn" },
      { pattern: /sentry/, name: "Sentry", category: "error-tracking" },
      { pattern: /datadog/, name: "Datadog", category: "monitoring" },
      { pattern: /newrelic/, name: "New Relic", category: "monitoring" }
    ];

    for (var r = 0; r < resources.length; r++) {
      var resName = (resources[r].name || "").toLowerCase();
      for (var p = 0; p < resourcePatterns.length; p++) {
        var rp = resourcePatterns[p];
        if (rp.pattern.test(resName) && !alreadyDetected[rp.name.toLowerCase()]) {
          addDetection(rp.name, rp.category, "medium", "Resource URL matched: " + resources[r].name);
          alreadyDetected[rp.name.toLowerCase()] = true;
        }
      }
    }
  }

  return JSON.stringify({
    detected: detected
  });
})();
