#!/usr/bin/env bash
# -----------------------------------------------------------------------
# PostToolUse hook: Sprint Anomaly Detector
#
# Fires after Jira JQL queries. Parses the response for anomalies:
# - Tickets in "In Progress" for 3+ days with no updates
# - Missing story points
# - High carry-over indicators
# - Blocked tickets
#
# Outputs a JSON systemMessage when anomalies are found.
# Exit code 0 always.
# -----------------------------------------------------------------------

set -euo pipefail

# Read the PostToolUse payload from stdin
INPUT=$(cat)

# Extract the tool response (Jira query results)
ANOMALIES=$(echo "$INPUT" | python3 -c "
import json, sys
from datetime import datetime, timezone, timedelta

try:
    data = json.load(sys.stdin)
    tool_response = data.get('tool_response', '')

    # tool_response might be a string containing JSON
    if isinstance(tool_response, str):
        try:
            response_data = json.loads(tool_response)
        except:
            sys.exit(0)
    else:
        response_data = tool_response

    # Handle different Jira response structures
    issues = []
    if isinstance(response_data, dict):
        issues = response_data.get('issues', [])
    elif isinstance(response_data, list):
        issues = response_data

    if not issues:
        sys.exit(0)

    now = datetime.now(timezone.utc)
    warnings = []

    stale_tickets = []
    no_story_points = []
    blocked_tickets = []
    high_priority_open = []

    for issue in issues:
        if isinstance(issue, str):
            continue

        key = issue.get('key', 'Unknown')
        fields = issue.get('fields', {})
        summary = fields.get('summary', '')[:60]
        status = ''
        status_obj = fields.get('status', {})
        if isinstance(status_obj, dict):
            status = status_obj.get('name', '')
        elif isinstance(status_obj, str):
            status = status_obj

        story_points = fields.get('story_points') or fields.get('customfield_10016') or fields.get('story_point_estimate')
        priority = ''
        priority_obj = fields.get('priority', {})
        if isinstance(priority_obj, dict):
            priority = priority_obj.get('name', '')

        # Check for stale in-progress tickets
        updated = fields.get('updated', '')
        if status.lower() in ['in progress', 'in development', 'in review'] and updated:
            try:
                update_date = datetime.fromisoformat(updated.replace('Z', '+00:00'))
                days_since_update = (now - update_date).days
                if days_since_update >= 3:
                    stale_tickets.append(f'{key}: \"{summary}\" -- no update in {days_since_update} days')
            except:
                pass

        # Check for missing story points on stories/tasks
        issue_type = ''
        type_obj = fields.get('issuetype', {})
        if isinstance(type_obj, dict):
            issue_type = type_obj.get('name', '').lower()

        if issue_type in ['story', 'task', 'feature'] and not story_points:
            no_story_points.append(f'{key}: \"{summary}\"')

        # Check for blocked tickets
        if 'block' in status.lower() or any(
            label.lower() in ['blocked', 'impediment']
            for label in (fields.get('labels', []) if isinstance(fields.get('labels'), list) else [])
        ):
            blocked_tickets.append(f'{key}: \"{summary}\"')

        # Check for high-priority open items
        if priority.lower() in ['highest', 'critical', 'blocker'] and status.lower() not in ['done', 'closed', 'resolved']:
            high_priority_open.append(f'{key} ({priority}): \"{summary}\"')

    # Build warnings
    if stale_tickets:
        warnings.append(f'Stale tickets ({len(stale_tickets)} in progress with no updates for 3+ days):')
        for t in stale_tickets[:5]:
            warnings.append(f'  - {t}')
        if len(stale_tickets) > 5:
            warnings.append(f'  ... and {len(stale_tickets) - 5} more')

    if blocked_tickets:
        warnings.append(f'Blocked tickets ({len(blocked_tickets)}):')
        for t in blocked_tickets[:3]:
            warnings.append(f'  - {t}')

    if no_story_points and len(no_story_points) > 2:
        warnings.append(f'Missing story points ({len(no_story_points)} tickets):')
        for t in no_story_points[:3]:
            warnings.append(f'  - {t}')
        if len(no_story_points) > 3:
            warnings.append(f'  ... and {len(no_story_points) - 3} more')

    if high_priority_open:
        warnings.append(f'High-priority open items ({len(high_priority_open)}):')
        for t in high_priority_open[:3]:
            warnings.append(f'  - {t}')

    # Calculate carry-over indicator
    total = len(issues)
    done_count = sum(1 for i in issues if isinstance(i, dict) and
        isinstance(i.get('fields', {}).get('status', {}), dict) and
        i.get('fields', {}).get('status', {}).get('name', '').lower() in ['done', 'closed', 'resolved'])

    if total > 5 and done_count > 0:
        done_pct = (done_count / total) * 100
        # If less than 30% done and we can infer a sprint is active, flag it
        if done_pct < 30:
            warnings.append(f'Sprint progress: only {done_pct:.0f}% of {total} tickets are done.')

    if warnings:
        print(json.dumps({
            'systemMessage': '[Sprint Anomaly Detection]\\n' + '\\n'.join(warnings)
        }))

except Exception as e:
    # Silently fail -- never block the session
    pass
" 2>/dev/null || echo "")

if [ -n "$ANOMALIES" ]; then
  echo "$ANOMALIES"
fi

exit 0
