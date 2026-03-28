# Templates Directory

Reusable document templates used by commands and agents to generate structured PM artifacts.

## Categories

| Directory | Used By | Purpose |
|-----------|---------|---------|
| `prd/` | prd command, prd-writer agent | PRD templates (Google, Amazon PRFAQ, Stripe formats) |
| `roadmap/` | roadmap command | Now/Next/Later, Timeline, Outcome-based roadmap layouts |
| `research/` | user-research command, research-synthesizer agent | Persona cards, interview guides, JTBD canvases, affinity maps |
| `communication/` | stakeholder-update command | Weekly, monthly, and executive summary update formats |
| `folder-context/` | setup command | `_Context.md` templates for different PM workflows (competitive research, sprint planning, etc.) |
| `schedules/` | setup command | Scheduled task templates (morning brief, sprint digest, competitive pulse, etc.) |

## Conventions

- Templates are Markdown files with placeholder variables in `{{double_braces}}`
- Each template includes a frontmatter block describing its intended use and required inputs
- Commands reference templates by category and name (e.g., `templates/prd/google.md`)
- Agents select templates based on the user's `--template` flag or `default_prd_template` setting

## Adding a New Template

1. Place the file in the appropriate category directory
2. Include YAML frontmatter with `name`, `description`, and `required_inputs`
3. Use `{{placeholder}}` syntax for dynamic content
4. The command or agent that uses it will substitute values at generation time
