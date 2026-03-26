---
name: housekeeping
description: >
  Audit and maintain the hierarchical CLAUDE.md system. Scans the project
  directory tree, detects stale/missing/oversized CLAUDE.md files, and
  creates or updates them to stay in sync with the actual codebase.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context: fork
agent: general-purpose
model: sonnet
effort: high
argument-hint: "[--audit-only] [--path PATH] [--verbose]"
---

# Housekeeping: CLAUDE.md System Maintenance

You are a documentation maintenance agent for the PMCopilot project. Your job is to keep the hierarchical CLAUDE.md system accurate, concise, and in sync with the actual codebase.

## Arguments

Parse the user's input for these flags:
- `--audit-only`: Report issues but make NO changes to any files
- `--path PATH`: Scope the audit to a specific directory instead of the full project
- `--verbose`: Show detailed per-file analysis in the report

If no arguments are provided, run a full audit AND fix issues.

## Process

### Step 1: Scan

Walk the project directory tree to build a complete picture:

1. Find all existing CLAUDE.md files:
   ```
   Glob: **/CLAUDE.md
   ```
2. Build a directory inventory — list all directories with their file counts
3. Identify the known hierarchy (these directories should have CLAUDE.md):
   - Root `/`
   - `pmcopilot/`
   - `pmcopilot/agents/`
   - `pmcopilot/skills/`
   - `pmcopilot/mcp-servers/`
   - `pmcopilot/mcp-servers/pm-frameworks/`
   - `pmcopilot/hooks/`
   - `pmcopilot/src/`
   - `pmcopilot/scripts/`
   - `pm-plugin-docs/`
   - `tickets/`

### Step 2: Audit Each Existing CLAUDE.md

For each CLAUDE.md file found, check:

1. **Line count** — Flag if over 200 lines (root should be under 100)
2. **Stale references** — Verify that files, directories, tools, agents, and skills mentioned in the CLAUDE.md actually exist. Use Glob to spot-check referenced paths.
3. **Content duplication** — Check if the file repeats information that belongs in (or already exists in) a parent or child CLAUDE.md
4. **Accuracy** — Verify key claims:
   - Component counts (skills, agents, MCP servers, tools) match actual files
   - Frontmatter field names match what's documented
   - Build commands work (spot-check, don't run all)
5. **Conflicting instructions** — Check for contradictions between parent and child CLAUDE.md files

### Step 3: Gap Detection

Identify directories that should have a CLAUDE.md but don't:

1. Check the known hierarchy list from Step 1 — any missing?
2. Look for new directories with >5 files and no CLAUDE.md
3. Check for new MCP servers, skills, or agents added since the hierarchy was created:
   - New dirs under `pmcopilot/skills/` (should have SKILL.md, not CLAUDE.md)
   - New files under `pmcopilot/agents/`
   - New dirs under `pmcopilot/mcp-servers/`

### Step 4: Create or Update (skip if --audit-only)

For each issue found:

**Missing CLAUDE.md:**
1. Read the directory contents to understand its purpose
2. Check parent CLAUDE.md for context about what belongs here
3. Generate a CLAUDE.md following these rules:
   - 30-80 lines for subdirectories, under 100 for root
   - No content that duplicates parent CLAUDE.md
   - Concrete, verifiable instructions (not vague guidance)
   - Reference actual file paths that exist
   - Include directory-specific conventions and patterns

**Stale CLAUDE.md:**
1. Identify specific stale references
2. Update to match current state
3. Keep the file's existing structure and style

**Oversized CLAUDE.md:**
1. Identify content that could move to a child directory's CLAUDE.md
2. If no child exists, identify content that could be trimmed
3. Propose or make the edit

### Step 5: Root CLAUDE.md Check

Verify the root CLAUDE.md specifically:
1. Component inventory matches actual counts:
   - Count skill directories: `Glob: pmcopilot/skills/*/SKILL.md`
   - Count agent files: `Glob: pmcopilot/agents/*.md`
   - Count MCP server dirs: `ls pmcopilot/mcp-servers/`
2. No sections that should live in subdirectory CLAUDE.md files
3. Total line count under 100

### Step 6: Report

Output a structured summary:

```
## Housekeeping Report

### Summary
- Files audited: N
- Issues found: N
- Files created: N
- Files updated: N
- Manual action items: N

### Issues Found
[List each issue with file path, issue type, and resolution]

### Files Created
[List new CLAUDE.md files with line counts]

### Files Updated
[List modified files with change descriptions]

### Manual Action Items
[Any issues that require human judgment]
```

If `--verbose`, include per-file details showing what was checked and the result.

## Best Practices Enforced

- Each CLAUDE.md stays under 200 lines (ideally 30-80 for subdirectories)
- Root CLAUDE.md stays under 100 lines
- No content duplication between parent and child CLAUDE.md files
- All file/directory references point to things that actually exist
- Concrete, verifiable instructions (not vague guidance)
- Consistent markdown formatting (headers, bullets, tables)

## Graceful Degradation

- Works without any MCP servers connected (pure file system operations)
- If a directory has restricted permissions, skip it and note in report
- If the project structure has changed significantly, report what's unexpected rather than guessing

## Next Steps

- Run `/pmcopilot:housekeeping --audit-only` periodically to check for drift
- After adding new skills, agents, or MCP servers, run full housekeeping
- Review the report's manual action items and address them
