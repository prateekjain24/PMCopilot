---
description: "Generate user research artifacts: personas, interview guides, JTBD canvases, affinity maps, or transcript analysis"
argument-hint: "[artifact: persona|interview-guide|jtbd|affinity-map|analyze-transcript]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - list_meetings
  - get_meeting_transcript
  - get_meetings
  - query_granola_meetings
model: opus
---

# User Research

Generate user research artifacts grounded in real data. This skill supports the full research lifecycle -- from planning interviews to synthesizing findings into actionable deliverables.

## Artifact Types

Specify the artifact type as the argument. Each type produces a different deliverable:

### 1. persona

Create a detailed user persona based on research data, interviews, or provided context. Personas represent archetypal users with goals, frustrations, behaviors, and context that inform product decisions.

- Output uses the template at `templates/persona.md`
- Grounded in actual user data whenever possible, not assumptions
- Includes behavioral patterns, not just demographics

### 2. interview-guide

Generate a structured interview guide for qualitative user research. Guides include screening criteria, warm-up questions, topic-organized core questions with follow-up probes, and wrap-up procedures.

- Output uses the template at `templates/interview-guide.md`
- Questions are open-ended and non-leading
- Organized by research objective and topic area

### 3. jtbd

Create a Jobs-to-Be-Done canvas that maps the functional, emotional, and social jobs users are trying to accomplish. Includes the 8-step job map with pain points and unmet needs at each step.

- Output uses the template at `templates/jtbd-canvas.md`
- Focuses on the job, not the product or solution
- Identifies opportunities through unmet needs and desired outcomes

### 4. affinity-map

Synthesize qualitative data (interview notes, survey responses, feedback) into an affinity map. Groups raw observations into themes, patterns, and insights.

- Reads source data from provided files or pasted content
- Produces a hierarchical grouping: raw observations -> sub-themes -> themes -> insights
- Each insight is linked back to supporting observations
- Highlights frequency and intensity of themes

### 5. analyze-transcript

Analyze a meeting or interview transcript to extract research insights. Integrates with Granola MCP to pull transcripts from recorded meetings.

- Uses `list_meetings` to find available transcripts
- Uses `get_meeting_transcript` to retrieve transcript content
- Extracts: key quotes, pain points, feature requests, sentiment, and behavioral patterns
- Produces a structured analysis with actionable takeaways

## Granola MCP Integration

This skill connects to Granola for meeting transcript access:

- **list_meetings**: Browse recent meetings to find relevant research sessions
- **get_meetings**: Retrieve meeting metadata
- **get_meeting_transcript**: Pull full transcript text for analysis
- **query_granola_meetings**: Search across meetings by keyword or topic

When analyzing transcripts, the skill automatically identifies participant roles, extracts verbatim quotes, and tags observations by theme.

## Clarification Framework

Before generating any research artifact, apply Principle #1 ("Clarify before you create"). Check pm-profile.json and _Context.md first -- skip any question already answered there or in the user's prompt.

**Must-know (always ask, block execution until answered):**
- What research question are you trying to answer? (The artifact is a means, not an end -- what decision will this inform?)
- Which artifact type do you need? (persona, interview-guide, jtbd, affinity-map, analyze-transcript)

**Should-know (ask unless inferable from context):**
- Who is the target user population for this research?
- Do you have existing data to work from (interview notes, survey results, transcripts, support tickets)?
- What product or feature area does this research support?

**Nice-to-know (skip unless the PM invites depth):**
- What's the timeline -- when do you need to present findings?
- Are there hypotheses you want to validate or is this exploratory?

Ask 2-3 questions conversationally. For transcript analysis, if `--from-granola` is passed, the artifact type is already known -- skip that question.

## Process

1. **Clarify the request**: Determine which artifact type the user needs. If not specified, ask.
   If `--from-granola` is passed, list recent meetings using `list_meetings`
   and present them to the user for selection. Pull the selected transcript with
   `get_meeting_transcript` and use it as the primary data source.
2. **Gather context**: Read any provided files, data, or context. For transcript analysis, connect to Granola.
3. **Research existing materials**: Check for prior research artifacts in the working directory that could inform the new artifact.
4. **Generate the artifact**: Use the appropriate template from `templates/` and fill it with substantive, specific content.
5. **Ground in evidence**: Every claim, persona trait, or insight should trace back to data. Flag any assumptions explicitly.
6. **Review and refine**: Check for internal consistency, completeness, and actionability.

## Ethical Research Practices

Adhere to these principles in all research artifacts:

- **Informed consent**: Interview guides must include a consent and recording disclosure section
- **Privacy**: Never include personally identifiable information (PII) in personas or published artifacts; use anonymized or composite profiles
- **Representation**: Ensure personas and research plans account for diverse user populations; avoid stereotyping
- **Bias awareness**: Flag potential researcher biases (confirmation bias, leading questions, sampling bias) and include mitigation strategies
- **Participant respect**: Interview guides should include fair compensation guidance and clear time commitments
- **Data handling**: Note data retention policies and who has access to raw research data
- **Transparency**: Clearly distinguish between data-backed findings and assumptions or inferences

## Templates

The `templates/` directory contains:

- **persona.md**: User persona template with demographics, goals, frustrations, and behavioral context
- **interview-guide.md**: Structured interview guide with screening, warm-up, core questions, and wrap-up
- **jtbd-canvas.md**: Jobs-to-Be-Done canvas with job map, pain points, and desired outcomes
