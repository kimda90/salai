# Spike 0C — Human Validation Runbook

## Status

**Ready to run. Human evidence not yet collected.**

This runbook is the execution guide for the human-only tasks in [`spike-0c-implementation-plan.md`](spike-0c-implementation-plan.md). Automated tests can prove state, provenance, atomicity, and round-trip mechanics; they cannot prove interaction compression or voluntary Narrative Lens use.

## Validation question

Can a filmmaker express ordinary story intent through an external agent harness with materially less structural bookkeeping than 0B, while still choosing a Narrative Lens when the representation itself is creatively useful?

## Setup

From the repository root:

1. Install dependencies with `pnpm install` if needed.
2. Start the prototype with `pnpm --filter @salai/spike-demo dev`.
3. Start the local bridge in a second terminal with `pnpm salai:bridge`.
4. Open the Vite URL printed by the dev server and append `?bridge`.
5. Give the external harness terminal access to the repository.

The harness must interact with the live project only through:

- `pnpm salai context`
- `pnpm salai create-story ...`
- `pnpm salai apply ...`

Do not let the harness edit serialized project files or application source as a substitute for the machine interface.

## Harness bootstrap instruction

Give the harness this instruction once before the scenarios:

> Work against the live Salai project through the Salai CLI. Inspect `pnpm salai context` before deciding what to change. Use `create-story` only for an empty story. For existing stories, use canonical operations through `pnpm salai apply`. Reuse IDs from current context, group one creative request into one operation batch when possible, preserve source-backed wording/ranges/media identity, and do not edit project storage or application source directly. After each change, inspect current context if you need to verify the result.

The harness may use its own model, planning, memory, and tool-loop behavior. Those are external to Salai.

## Evidence to record for every scenario

Record only observable evidence:

| Field | What to capture |
| --- | --- |
| User requests | Count the natural-language requests needed to reach an acceptable result. |
| Manual structural interactions | Count direct structure-management actions required before the result was acceptable. Do not count voluntarily chosen lens edits separately; record those below. |
| Forced representation changes | Note any time the user had to switch surfaces only to accomplish a mechanical operation. |
| Revert | Whether Revert was needed and whether it restored the intended prior state. |
| Voluntary lens use | Which lens, when it was opened, and what the user was trying to perceive or change. |
| Structural bookkeeping | Did the user need to reason explicitly about Beat/Cue IDs, parents, indexes, or operation syntax? |
| Result | Pass/fail plus one sentence of evidence. |

Optional: record rough elapsed time, but do not use speed alone as the pass criterion.

# Scenario 1 — Script-first creation

Select **Blank story** and reset the fixture.

Give the harness only this creative material:

> Maya is buried in a weekly reporting ritual. She imports the same source data into the new workflow and sees a clean result immediately. The saved time lets her focus on the decision instead of formatting the report.

Ask it to turn that into a concise story structure.

Observe:

- whether the user has to specify Beat count, IDs, parents, or indexes;
- how many user requests are required before the structure is acceptable;
- whether the result appears in the Narrative Lenses without export/import.

Pass evidence: a coherent story is created through the harness without routine manual structural bookkeeping.

# Scenario 2 — Natural-language revision

Continue from Scenario 1.

Give exactly this revision:

> Move the payoff before the workflow explanation and tighten the payoff wording.

Observe:

- whether one request results in the grouped structural/content change;
- whether stable identity is preserved where meaning is unchanged;
- whether the user has to choose a special surface merely to perform the mechanics.

Pass evidence: the revision requires materially fewer explicit structure-management interactions than the equivalent 0B workflow.

# Scenario 3 — Source-backed interview task

Switch to the **Interview** fixture and reset it.

Ask the harness:

> Lead the turning point with Juan's recorded line, then use the authored bridge. Tell me whether that bridge currently has supporting media.

Observe:

- whether the harness discovers the source material from current context;
- whether Juan's source-backed block remains source-backed with the same wording, range, and media identity;
- whether the authored bridge remains authored;
- whether the unsupported-material answer comes from current relationships rather than invented coverage.

Pass evidence: the sequence changes without provenance loss or manual source wiring.

# Scenario 4 — Incorrect interpretation and immediate revert

Use any current fixture where the story has enough structure for an ambiguous creative instruction.

Ask for a genuine creative change where more than one interpretation is plausible. If the result is not what the user intended, use **Revert last machine action** immediately.

Do not manufacture a failure if the first interpretation is acceptable; try another ordinary creative request if necessary.

Observe:

- whether one harness request appears as one understandable action;
- whether Revert restores the exact prior Narrative IR and Workspace state;
- whether the user can continue without understanding the operation batch that produced the mistake.

Pass evidence: a real unwanted interpretation is recoverable immediately without erasing later work.

# Scenario 5 — Voluntary Narrative Lens round trip

Start from a project the harness has already normalized.

Ask the user to continue shaping the story, but **do not instruct them to open a particular Narrative Lens**.

Record whether the user voluntarily opens Outline, Story Wall, AV Script, or Paper/Radio Edit because that representation helps them understand or manipulate the story.

If the user voluntarily makes a direct lens edit, then make one follow-up request through the external harness that depends on the edited state.

Observe:

- which lens was chosen and why;
- whether the direct edit is immediately visible to the next harness context;
- whether Story Wall-only organization remains Workspace-only;
- whether any export/import, manual synchronization, or conversation-memory workaround is required.

Pass evidence: at least one existing lens is voluntarily useful and the harness continues coherently from the direct edit.

# Interaction-compression assessment

Compare the observed workflow to the 0B finding that routine direct structured authoring required repeated surface/control/object/parent operations.

0C passes the interaction-friction hypothesis only if the human evidence supports both statements:

1. ordinary creation/revision no longer requires the user to serialize routine structural bookkeeping manually; and
2. at least one Narrative Lens remains voluntarily useful when the representation itself helps creative reasoning.

Do not infer a pass from automated tests or from the mere existence of the CLI.

## Result table

Fill this after the run:

| Scenario | User requests | Manual structural interactions | Forced surface changes | Voluntary lens use | Result / evidence |
| --- | ---: | ---: | ---: | --- | --- |
| 1. Script-first |  |  |  |  |  |
| 2. Revision |  |  |  |  |  |
| 3. Source-backed |  |  |  |  |  |
| 4. Revert |  |  |  |  |  |
| 5. Lens round trip |  |  |  |  |  |

After the run, write `spike-0c-assessment.md` from the observed evidence only. Do not preserve speculative expectations that the run did not support.
