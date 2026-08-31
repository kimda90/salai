# Spike 0C — Engineering Improvements Plan

## Status

Current engineering cleanup plan after the comprehensive Ponytail-equivalent review of implemented 0C.0–0C.5.

Human validation remains open. This plan contains only implementation changes justified by the retained code; it does not infer product changes from unrun human tests.

## Review method

Applied in order:

1. YAGNI;
2. reuse existing Salai code;
3. standard library;
4. native platform capability;
5. existing dependency;
6. minimum new code.

Then audited:

- architecture and scope;
- dead or overbuilt code;
- duplicated logic and legibility;
- performance;
- maintenance burden.

## Retain unchanged

The review found no evidence to replace or generalize these 0C choices before human validation:

- browser-owned `SalaiController` / `SalaiProjectService` remains the single live project owner;
- localhost request/response bridge remains simple polling glue;
- `context`, `apply`, and the proven blank-story `create-story` exception remain the only machine commands;
- one pre-action project/Workspace snapshot remains sufficient for immediate machine-action revert;
- no MCP server, event bus, CRDT, persistence layer, agent runtime, provider SDK, or generic command framework should be added;
- no Skill/help/schema layer should be added until the human run shows the external harness actually needs one.

## Improvement 1 — Remove duplicated operation-name vocabulary

### Finding

`packages/spike-demo/src/machine-interface.ts` currently declares its own runtime set of every `NarrativeOperation["op"]` value.

The canonical operation union already belongs to `@salai/script-model`. A future operation added there could be valid in Salai but rejected by the external-harness boundary until a second list is manually updated.

This is a concrete maintenance/drift risk and violates the reuse-first rule.

### Change

- expose one runtime operation-name predicate/list from `@salai/script-model` next to the public `NarrativeOperation` API;
- make the exported list type-checked for exhaustive coverage of `NarrativeOperation["op"]`;
- make the machine interface import and reuse that predicate instead of maintaining another list;
- retain the current machine payload behavior: non-empty array, known operation name, then canonical validation/mutation through `applyOperations()`.

### Acceptance

- one runtime operation-name vocabulary exists in Salai code;
- adding/removing a canonical operation cannot leave the runtime name list silently incomplete;
- unknown machine operations are still rejected before mutation;
- existing canonical operation behavior is unchanged;
- typecheck, tests, and build are green.

## Explicitly deferred review observations

These are not implementation tasks yet:

- `NarrativeBatchOptions.revertible` is machine-specific vocabulary on the shared service, but replacing it with a generalized origin/action model would add abstraction without a second proven caller;
- machine command names appear in the browser boundary, bridge, and CLI, but the vocabulary has only three commands and does not yet justify a protocol registry;
- `createStory` uses deterministic machine-oriented IDs, but canonical IDs are opaque and no observed workflow depends on their prefix;
- polling interval, request timeout, body-size limits, multi-client behavior, and richer local transport are prototype concerns until the human run exposes an actual problem;
- a harness Skill or discoverable command schema may reduce setup friction, but that is part of the human validation question rather than a pre-validation assumption.

## Execution order

```text
I1  Centralize runtime NarrativeOperation names
 ↓
Ponytail-equivalent review
 ↓
CI + merge
 ↓
return to 0C.6 human validation
```

No further engineering work should be pulled forward unless I1 or the human validation produces concrete evidence for it.
