# RFC 0002 — Agent-Mediated Authoring and Narrative Lenses

## Status

Proposed.

Spike 0B produced two important results:

1. one Narrative IR can support several synchronized structured views; and
2. using those views as the routine path for ordinary creative changes creates too much interaction burden.

A follow-up product insight clarifies that the structured UI is still valuable: it can expose the narrative system, reveal its rhythm and density, and let the creator modify the story from a different angle.

This RFC proposes a dual interaction model over one canonical project.

## Decision proposal

Salai should combine:

- **agent-mediated free-form authoring** for low-friction intent expression and structural normalization; and
- **Narrative Lenses** for intentional structural perception and direct manipulation.

The core principle is:

> **Hide structural bookkeeping, not narrative structure.**

## System shape

```text
free-form text / conversation / media
                 ↓
          Agent / Normalizer
                 ↓
       Salai authoring commands
                 ↓
       typed canonical operations
                 ↓
          canonical project
          ↙      ↓      ↘
        Narrative Lenses
          ↖      ↓      ↗
       direct lens edits
                 ↓
       Resolve materialization
```

The agent, working text, chat history, and individual lenses are not separate sources of truth.

## Agent-mediated authoring

The user should normally state the creative result they want rather than perform incidental model mechanics.

Examples:

```text
Move the result quote before the demo.

Make this section shorter without losing Maria's quote.

Build a rough radio edit from these interviews.
```

A Salai-owned agent adapter interprets the request and invokes typed authoring commands.

The model should not be required to manufacture canonical IDs, calculate array indices, or construct low-level parent references when Salai can resolve those deterministically.

Agent-facing commands therefore compile immediately into public canonical operations:

```text
model tool call
    ↓
Salai resolves existing references
    ↓
Salai allocates new IDs
    ↓
compile NarrativeOperation[]
    ↓
validate complete batch
    ↓
publish canonical state
```

Agent command schemas are transient adapters, not another domain model.

## Narrative Lenses

A **Narrative Lens** is a structured representation of the same canonical project that emphasizes one creative dimension.

Examples:

| Lens | What it reveals |
| --- | --- |
| Outline | hierarchy, progression, proportion |
| Story Wall | spatial rhythm, balance, turning points, alternatives |
| AV Script | audiovisual density and realization over time |
| Paper / Radio Edit | evidence, voice, source pacing |
| Coverage | gaps between intent and available realization |
| later Frame Wall / Selects | visual coverage and alternatives |

A lens is not merely an expert-mode form. It can be a different way to perceive and shape the narrative.

Implementation may use a Projection, Workspace, or combination. “Lens” describes the creative role; Projection/Workspace describe state ownership.

See [`../narrative-lenses.md`](../narrative-lenses.md).

## Useful exposure vs bookkeeping

The system should automate mechanics that add little creative value:

- canonical ID allocation;
- raw parent-reference construction;
- insertion-index calculation;
- routine object creation;
- obvious relationship wiring;
- operation-type selection.

It should expose structure when that exposure helps the creator reason.

Examples:

- one Beat has many more Cues than neighboring Beats;
- one section consumes disproportionate runtime;
- several consecutive Beats rely on the same source voice;
- a Beat has no credible realization;
- the middle of a Story Wall is visually crowded;
- a simple narrative idea requires unexpectedly complex audiovisual coverage.

## Direct manipulation remains first-class

The 0B finding does not imply that direct structured editing should disappear.

Direct manipulation is valuable when the user intentionally chooses the representation because it matches the current creative problem.

Examples:

- rearrange cards while thinking spatially;
- move sourced excerpts while shaping spoken rhythm;
- edit Visual/Audio moments while planning realization;
- restructure hierarchy while intentionally working in Outline.

The failure was making these interactions compulsory for routine creative intent.

## Agent + lens context

The agent should be able to reason with the active lens where useful.

Examples:

```text
Story Wall
Why does the middle feel crowded?

AV Script
Reduce the number of visual changes in this Beat.

Paper Edit
Can we make this section less dependent on Maria?

Coverage
Show only the gaps that block a rough cut.
```

The agent operates on canonical objects and validated Workspace semantics rather than depending on arbitrary presentation state.

## Canonical-state boundary

Narrative IR remains canonical for:

- narrative structure;
- stable identity;
- authored/source-backed content;
- duration;
- source evidence;
- downstream materialization.

Working text and conversation are input/context, not automatically canonical story storage.

0C should not attempt a lossless bidirectional synchronization between scratch text and canonical state. The canonical result can be understood through change summaries and Narrative Lenses.

## Grouped changes and undo

One creative instruction may compile into several operations but should normally appear as one user-visible action batch.

For 0C:

- compile and validate the complete batch before publishing live state;
- publish once on success;
- retain the pre-batch in-memory project/Workspace snapshot;
- allow one-step revert from that snapshot.

Do not introduce a general event-history architecture merely to validate this behavior.

## Trust boundary

Use graduated autonomy.

- Clearly requested, reversible local normalization may apply as one grouped, undoable batch.
- Material creative ambiguity should trigger a focused clarification in creative language.
- High-impact external effects remain behind explicit user action.

Source/provenance semantics remain strict: recorded wording stays source evidence, source ranges remain stable, and agent-created authored material stays authored.

## Narrative IR as both IR and visible system

The Narrative IR has two complementary roles.

### Machine-facing

It provides deterministic identity, validation, source semantics, projections, persistence, and downstream integrations.

### Human-facing through lenses

It can reveal:

- progression;
- pacing;
- density;
- evidence distribution;
- audiovisual complexity;
- coverage gaps;
- alternatives;
- structural balance.

The structure becomes more central while requiring less routine manual maintenance.

## Narrative pulse

“Narrative pulse” is currently a product metaphor for patterns such as pacing, density, repetition, voice distribution, audiovisual complexity, coverage completeness, and structural balance.

0C should test whether several Narrative Lenses and derived indicators make these patterns useful.

Do not introduce a canonical `NarrativePulse` object or universal score without evidence.

## Resolve boundary

Free-form requests and lens edits change canonical Salai state first.

```text
creative intent
      ↓
agent normalization / lens edit
      ↓
canonical Salai project
      ↓
materialization decision
      ↓
Salai Resolve adapter
      ↓
DaVinci Resolve
```

Resolve automation remains downstream from Salai semantics.

## Alternatives considered

### Structured surfaces for every task

Rejected as the sole primary workflow. 0B showed excessive routine interaction burden.

Retained as Narrative Lenses because their representations remain creatively useful.

### Hide all structure behind chat

Rejected. It lowers command friction but makes the narrative system opaque and weakens direct creative manipulation.

### Chat sidebar beside the existing forms

Insufficient. It treats the agent as an accessory while leaving model management as the default workflow.

### Canonical rich-text document

Not proposed. Free-form text is input/context; Narrative IR remains canonical.

### Generic canvas as the main UI

Not required for 0C. A canvas may later become one lens/Workspace if evidence supports it.

## Consequences

### Benefits

- routine interaction can scale with creative decisions rather than domain-operation count;
- creators retain structured ways to inspect and manipulate the story;
- blank-page and footage-first work share one entry surface;
- the agent and lenses operate on the same deterministic state;
- source identity and provenance remain enforceable;
- downstream Resolve integration consumes normalized project state.

### Risks

- the agent can interpret intent incorrectly;
- lens design can expose implementation detail rather than creative structure;
- free-form context vs canonical state can become conceptually unclear;
- active-lens context can overcomplicate the agent interface;
- model latency may interrupt creative flow;
- agent-facing commands can become an accidental second domain API if allowed to grow unchecked.

## Validation plan

Spike 0C must validate two dimensions.

### Interaction compression

Can ordinary creative tasks be completed with materially less model-management interaction than 0B?

### Structural insight

Do users voluntarily open Narrative Lenses because those views reveal useful information or provide a useful way to manipulate the story?

Required scenarios include:

1. blank-page text to rough narrative;
2. messy draft to grouped revision;
3. source/media attachments to source-preserving structure;
4. one-step batch revert;
5. agent result inspected and modified in Narrative Lenses;
6. direct lens edit reflected in the next agent request;
7. a lens revealing a narrative pattern not obvious in prose/chat.

The target outcome is:

> **Users create with low friction, then deliberately move into structured lenses when they want to understand or reshape the narrative system from another angle.**

See [`../agent-mediated-authoring.md`](../agent-mediated-authoring.md).

## Open questions

1. Which Narrative Lenses remain first-class after 0C?
2. Which internal concepts are useful enough to expose in each lens?
3. How should active-lens context affect agent reasoning?
4. Should users be able to ask questions specifically through a lens?
5. Should normalization be explicit, continuous, or both?
6. What is the right grouped-action/undo boundary?
7. Does working text require durable identity later?
8. Does messy agent-mediated input expose a Narrative IR semantic gap?
9. Is narrative pulse best represented through multiple indicators rather than one score?
10. Which agent-facing commands are truly needed rather than direct operation wrappers?

## Decision / outcome

Pending Spike 0C implementation and human validation.