# Salai MVP and Validation Roadmap

This document owns the order of product risks, not task checkboxes. See [the active plan](filmmaking-implementation-plan.md) for execution and [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md) for the pivot.

## The next proof

**Can a filmmaker tell a story, see it early, give narrative direction, and review an updated film while preserving accepted work?**

The finish line is a useful iterative short-film draft, not a feature-complete NLE, formal film model, or automatic finished feature. Stills and cheap motion are useful endpoints; HQ is not mandatory.

## Validation sequence

| Step | Risk being tested | Required evidence |
| --- | --- | --- |
| Existing-model fixture | The interaction is understandable without structural bookkeeping | target a moment, inspect intent, apply/review a canonical change |
| Still review and retention | References, candidates, selections, and inputs stay connected | deterministic round-trip, per-use selection, save/reopen, conservative change signals |
| Real still generation | The external path actually supports the loop | approved real requests/results and a useful human-directed revision |
| Spoken story and cheap motion | The original story-to-previs workflow works | preserved recording/transcript, authored interpretation, real moving output, scoped updates |
| Human pilot | Narrative focus helps rather than burdens | observed revision cycles, failures, effort/cost, and retained decisions |

Mocks are appropriate for state/race tests, not generation quality. Developer-assisted execution is useful early evidence but its overhead must be reported. The live pilot must not be declared complete on a fixture-only demonstration.

## After the first loop

Optional 3D shot direction and explicit low/HQ profiles come next as justified by the pilot. Broader real-media workflows and downstream finishing follow demonstrated needs. Keep the current source-evidence model intact without implementing all footage-first production infrastructure in parallel.

Local persistence/media retention sufficient to resume the pilot moves earlier. A full desktop runtime or media-asset-management system does not.

## Previous experiment sequence

0A validated the Narrative IR; 0B retained synchronized views but found routine direct structuring cumbersome; 0C human-validated an external harness; 0D retained playable shared-state architecture but did not validate adequate direct editing usefulness. Original [assessments](README.md) remain evidence, not rewritten success stories.

0E's shape was accepted on September 2, 2026, but its standalone implementation program is now [paused](spike-0e-implementation-plan.md). It is neither passed nor an obligatory gate before generation. Adopt the necessary editing work into the active plan while retaining its valid temporal contracts and unresolved questions.

## Investment rule

Increase implementation breadth only after the preceding loop exposes a concrete need. In particular, do not invest first in a general dependency engine, satisfaction/continuity system, semantic branch/merge, comprehensive 3D editor, or broad provider platform.

Continue when human evidence shows useful narrative-directed iteration with acceptable effort and safe preservation. Narrow or rethink when the semantic context is merely extra bookkeeping, the generated controls do not work reliably enough, or external integration friction dominates. Do not infer product success from architectural elegance or competitor feature omissions.
