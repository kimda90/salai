# Agent Development Standard

## Objective

Develop the smallest maintainable implementation that tests the current product question. Salai is now an AI filmmaking interface focused on narrative intent. The loop is Tell → See → Direct → Update → See; it is not an instruction to build a complete production platform.

## Required context

Read [AGENTS.md](../AGENTS.md) and [the documentation map](README.md), then the [PRD](prd.md), [filmmaking interaction contract](filmmaking-interaction.md), [architecture](architecture.md), [active plan](filmmaking-implementation-plan.md), and relevant code/tests. Read [RFC 0004](rfcs/0004-narrative-first-filmmaking-loop.md) before proposed model/execution additions and [Narrative IR](narrative-ir-spec.md) before domain edits.

ADR 0010 accepts product direction. RFC 0004 is proposed technical shape; its explicit review gates must be resolved for the slice being implemented. Do not turn a draft schema into an implemented contract by copying it into code without review.

Standalone 0E is paused, not passed. Consult [editorial-interaction.md](editorial-interaction.md) and RFC 0003 for temporal changes. Historical plans are evidence and reusable work, not current priority instructions.

## Non-negotiable boundaries

- Keep one canonical narrative model in `@salai/script-model` and one human/machine boundary at `SalaiProjectService` (the existing controller, not another state owner).
- Apply canonical changes through validated public operations; multi-operation actions publish atomically through `applyOperations()`.
- Keep authored and recorded source material distinct, and retain existing stable-ID and relationship behavior.
- Preserve multi-block Cues, supported Section/Scene structures, and existing ShotIntent references. Do not silently replace them with a single-parent shot schema.
- Keep renderer/timeline/stage internals derived. UI selection, viewport, playhead, and draft feedback are not another canonical film.
- External harnesses own generic model/auth/session/tool-loop behavior under ADR 0008. A generation adapter does not justify a second agent runtime, secret store inside the project, or unreviewed transport.
- Do not resolve RFC 0003's five deferred timing/editing questions through engine-only fields.

## Procedure

1. Inspect the current branch, implementation, tests, tracker, and owning documents. Separate working code from plans.
2. Name one observable outcome from the active slice. Prefer existing behavior, then native facilities, then an installed dependency, then the smallest justified new dependency.
3. Resolve only the design gate that this outcome reaches. New fields/operations require a concrete contract, migration behavior where relevant, and tests in the owning spec; avoid generic mutation escape hatches.
4. Implement and test the smallest vertical change. Do not bundle infrastructure or framework upgrades unrelated to the question.
5. Review the diff for source preservation, scoped feedback, stable selection, stale requests, failed/duplicate jobs, and accidental global changes.
6. Update canonical docs and the sole active tracker. Implementation and human evidence have different completion criteria.

## Testing priorities

Keep CI deterministic and independent from paid providers. Test interpretation/application boundaries with fixtures or recorded inputs and a fake executor, without treating those as real-generation or human validation.

For new generation work, cover frozen request context, added/removed dependencies, inherited guidance changes, unknown provenance, candidate selection, late responses, removed targets, failures, retry approval, and save/reopen with actual accessible media. Test that unrelated accepted choices remain unchanged. A unit test cannot establish whether a film communicates its intent.

Preserve the existing canonical test suite, grouped revert semantics, and machine discovery. Run focused tests while iterating; for code changes run:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Use the actual browser for changed interaction/playback. Record real provider and human tests separately, with authorization, scope, and limitations. Never label a synthetic pipeline as an end-to-end product pass.

For documentation-only changes, validate links, ownership/status consistency, preserved history, and absence of code changes. Report application checks as not run unless actually executed locally or by CI; do not infer passing tests from a clean documentation diff.

## Machine and provider contracts

Discover implemented tools with `pnpm salai tools`. A future action described in a plan is not callable. When adding a command, update discovery, tests, and [agent usage](agent-usage.md) in the same PR. Commands compile to the same canonical operations used by the UI.

A pending job records the submitted target and inputs; it does not follow later selection. Require explicit approval for external transmission and cost. Do not claim to cancel or make a provider request idempotent unless that backend supports it. Secrets stay outside canonical project state.

## Documentation and Git discipline

Use [docs/README.md](README.md) to find the owner. Preserve accepted ADR history; add an ADR for a changed boundary and mark partial/full supersession explicitly. RFC questions remain in their RFC until resolved. Do not repeat exact field vocabularies in summary documents.

Work on a focused branch. Do not rewrite unrelated history, delete source media, or merge without instruction. The PR states what changed, what remains proposed, tests performed, checks unavailable, and validation still outstanding. A task stays unchecked until its stated criteria are met; no human-validation completion from agent simulation.
