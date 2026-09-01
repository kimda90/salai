# Spike 0C — Human Validation Runbook

## Status

**Completed. Historical validation procedure.**

Human validation was run with Codex as the external harness. The integration operated correctly against the live Salai project and demonstrated the practical convenience of keeping an agent in the loop for routine structural manipulation.

The evidence-backed conclusion is recorded in [`spike-0c-assessment.md`](spike-0c-assessment.md). The active validation iteration is now [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md).

The repository does not manufacture quantitative request/action counts that were not recorded during the run.

## Validation question

Can a filmmaker express ordinary story intent through an external agent harness with materially less structural bookkeeping than 0B while Salai remains the canonical project source of truth?

## Procedure used

The browser prototype and local bridge exposed the live project to the external harness through the Salai CLI.

The harness was required to:

- discover the available Salai commands;
- inspect current project context before changing it;
- use Salai project commands/operations rather than editing project storage or application source;
- reuse canonical IDs from current context;
- group one creative request into one operation batch where practical;
- preserve source-backed wording/ranges/media identity;
- inspect current state again when verification was needed.

The harness remained free to use its own model, planning, memory, and tool-loop behavior because those concerns are external to Salai.

## Scenarios exercised by the 0C validation design

### Script-first creation

Turn rough prose into usable canonical story structure without requiring the user to specify Beat/Cue IDs, parent references, or insertion indexes.

### Natural-language revision

Perform an ordinary reorder/content revision as one creative request rather than a sequence of manual structural operations.

### Source-backed task

Arrange recorded source material while keeping SourceExcerpt wording, ranges, and media identity source-backed and authored bridge material authored.

### Incorrect interpretation / revert

Keep one agent-applied grouped change immediately revertible without requiring the user to understand the underlying operation batch.

### Agent ↔ direct UI round trip

Allow direct human edits and subsequent harness context reads to converge through the current Salai project rather than export/import, chat history, or a shadow synchronization model.

## Observed result

The human run established the product evidence needed to close 0C:

- Codex could operate the live Salai project correctly through the external-harness boundary;
- using an agent materially reduced the inconvenience of routine structural manipulation compared with the 0B direct-management workflow;
- Salai remained the canonical state owner;
- the interaction did not require Salai to own provider auth, model routing, session history, or a general agent runtime.

The run did not establish a new final UI taxonomy for Outline, Story Wall, AV Script, Paper/Radio, or future temporal/spatial surfaces. That product risk is deliberately moved into the post-pivot semantic-editorial work rather than inferred from 0C.

## Closeout

0C is **complete/pass**.

See:

- [`spike-0c-assessment.md`](spike-0c-assessment.md) — result and consequences;
- [`adr/0008-external-harness-owns-agent-runtime.md`](adr/0008-external-harness-owns-agent-runtime.md) — validated agent-runtime boundary;
- [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md) — current validation iteration.
