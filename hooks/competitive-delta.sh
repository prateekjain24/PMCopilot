#!/usr/bin/env bash
# -----------------------------------------------------------------------
# PostToolUse hook: Competitive Delta Tracker
#
# Fires after any app-store-intel tool call. Compares the current result
# with the last cached result for the same app to compute deltas:
# - Rating changes
# - Review count changes
# - New version detection
# - Sentiment shifts
#
# Stores snapshots in CLAUDE_PLUGIN_DATA/competitive-deltas/
# Outputs a JSON systemMessage when significant deltas are found.
# Exit code 0 always.
# -----------------------------------------------------------------------

set -euo pipefail

PLUGIN_DATA="${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/pmcopilot}"
DELTA_DIR="$PLUGIN_DATA/competitive-deltas"
mkdir -p "$DELTA_DIR"

# Read the PostToolUse payload from stdin
INPUT=$(cat)

DELTA_MSG=$(echo "$INPUT" | python3 -c "
import json, sys, os, hashlib
from datetime import datetime

try:
    data = json.load(sys.stdin)
    tool_name = data.get('tool_name', '')
    tool_input = data.get('tool_input', {})
    tool_response = data.get('tool_response', '')

    # Only process relevant tools
    relevant_tools = [
        'get_app_details', 'search_app_store', 'search_play_store',
        'get_app_reviews', 'get_review_sentiment', 'compare_apps',
        'get_category_rankings', 'track_rating_history'
    ]

    # Extract the short tool name (after mcp__app-store-intel__ prefix)
    short_name = tool_name.split('__')[-1] if '__' in tool_name else tool_name
    if short_name not in relevant_tools:
        sys.exit(0)

    # Parse the response
    if isinstance(tool_response, str):
        try:
            response = json.loads(tool_response)
        except:
            sys.exit(0)
    else:
        response = tool_response

    if not isinstance(response, dict) or response.get('error'):
        sys.exit(0)

    delta_dir = os.environ.get('DELTA_DIR', os.path.expanduser('~/.claude/plugins/data/pmcopilot/competitive-deltas'))

    # For get_app_details -- track rating and version changes per app
    if short_name == 'get_app_details':
        app_id = response.get('app_id', tool_input.get('app_id', ''))
        store = response.get('store', tool_input.get('store', ''))
        if not app_id:
            sys.exit(0)

        safe_id = ''.join(c if c.isalnum() or c in '._-' else '_' for c in str(app_id))
        snapshot_path = os.path.join(delta_dir, f'detail_{store}_{safe_id}.json')

        current = {
            'app_id': app_id,
            'name': response.get('name', ''),
            'rating': response.get('rating'),
            'rating_count': response.get('rating_count', 0),
            'version': response.get('version', ''),
            'timestamp': datetime.utcnow().isoformat()
        }

        deltas = []

        if os.path.exists(snapshot_path):
            try:
                with open(snapshot_path) as f:
                    previous = json.load(f)

                # Rating change
                prev_rating = previous.get('rating')
                curr_rating = current.get('rating')
                if prev_rating is not None and curr_rating is not None:
                    delta = round(curr_rating - prev_rating, 2)
                    if abs(delta) >= 0.05:
                        direction = 'up' if delta > 0 else 'down'
                        deltas.append(f'Rating {direction} {abs(delta)} (was {prev_rating}, now {curr_rating})')

                # Review count change
                prev_count = previous.get('rating_count', 0)
                curr_count = current.get('rating_count', 0)
                count_delta = curr_count - prev_count
                if count_delta > 0:
                    deltas.append(f'{count_delta:,} new reviews since last check')

                # Version change
                prev_version = previous.get('version', '')
                curr_version = current.get('version', '')
                if prev_version and curr_version and prev_version != curr_version:
                    deltas.append(f'New version: {prev_version} -> {curr_version}')

                # Time since last check
                prev_ts = previous.get('timestamp', '')
                if prev_ts:
                    try:
                        prev_dt = datetime.fromisoformat(prev_ts)
                        days_ago = (datetime.utcnow() - prev_dt).days
                        if days_ago > 0:
                            deltas.append(f'Last checked {days_ago} day(s) ago')
                    except:
                        pass

            except:
                pass

        # Save current snapshot
        with open(snapshot_path, 'w') as f:
            json.dump(current, f, indent=2)

        if deltas:
            app_name = current.get('name', app_id)
            msg = f'[Competitive Delta] {app_name} ({store}):\\n'
            msg += '\\n'.join(f'  - {d}' for d in deltas)
            print(json.dumps({'systemMessage': msg}))

    # For get_review_sentiment -- track sentiment shifts
    elif short_name == 'get_review_sentiment':
        app_id = tool_input.get('app_id', '')
        store = tool_input.get('store', '')
        if not app_id:
            sys.exit(0)

        safe_id = ''.join(c if c.isalnum() or c in '._-' else '_' for c in str(app_id))
        snapshot_path = os.path.join(delta_dir, f'sentiment_{store}_{safe_id}.json')

        current = {
            'app_id': app_id,
            'sentiment_score': response.get('sentiment_score'),
            'overall_sentiment': response.get('overall_sentiment', ''),
            'positive_pct': response.get('positive_pct', 0),
            'negative_pct': response.get('negative_pct', 0),
            'timestamp': datetime.utcnow().isoformat()
        }

        deltas = []

        if os.path.exists(snapshot_path):
            try:
                with open(snapshot_path) as f:
                    previous = json.load(f)

                prev_score = previous.get('sentiment_score')
                curr_score = current.get('sentiment_score')
                if prev_score is not None and curr_score is not None:
                    delta = round(curr_score - prev_score, 3)
                    if abs(delta) >= 0.05:
                        direction = 'improved' if delta > 0 else 'declined'
                        deltas.append(f'Sentiment {direction}: {prev_score} -> {curr_score}')

                prev_neg = previous.get('negative_pct', 0)
                curr_neg = current.get('negative_pct', 0)
                neg_delta = curr_neg - prev_neg
                if neg_delta > 5:
                    deltas.append(f'Negative reviews up {neg_delta:.1f}% (was {prev_neg:.1f}%, now {curr_neg:.1f}%)')

            except:
                pass

        with open(snapshot_path, 'w') as f:
            json.dump(current, f, indent=2)

        if deltas:
            msg = f'[Competitive Delta] Sentiment shift for {app_id} ({store}):\\n'
            msg += '\\n'.join(f'  - {d}' for d in deltas)
            print(json.dumps({'systemMessage': msg}))

except Exception:
    pass
" 2>/dev/null || echo "")

if [ -n "$DELTA_MSG" ]; then
  echo "$DELTA_MSG"
fi

exit 0
