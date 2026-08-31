# Spike 0C — Engineering Improvements Plan

## Status

**Implemented.** The comprehensive Ponytail-equivalent review of implemented 0C.0–0C.5 produced one concrete engineering cleanup, and that cleanup is complete.

Human validation remains open. No additional engineering work is justified until that run produces new evidence.

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

## Improvement 1 — Remove duplicated operation-name vocabulary — implemented

### Finding

`packages/spike-demo/src/machine-interface.ts` declared its own runtime set of every `NarrativeOperation["op"]` value.

The canonical operation union already belongs to `@salai/script-model`. A future operation added there could have become valid in Salai while remaining rejected by the external-harness boundary until a second list was manually updated.

This was a concrete maintenance/drift risk and violated the reuse-first rule.

### Implemented change

- `@salai/script-model` now owns the runtime operation-name predicate next to the public `NarrativeOperation` API;
- a private `Record<NarrativeOperation["op"], true>` makes TypeScript enforce exhaustive coverage of the canonical operation union;
- the predicate uses native `Object.hasOwn()` rather than introducing another runtime collection or dependency;
- the machine interface imports and reuses that predicate instead of maintaining another operation-name list;
- machine payload behavior remains unchanged: non-empty array, known operation name, then canonical validation/mutation through `applyOperations()`.

### Verified acceptance

- [x] one runtime operation-name vocabulary exists in Salai code;
- [x] adding/removing a canonical operation cannot leave the runtime name vocabulary silently incomplete at typecheck time;
- [x] unknown machine operations are still rejected before mutation;
- [x] existing canonical operation behavior is unchanged;
- [x] typecheck, tests, and build are green.

## Explicitly deferred review observations

These are not implementation tasks yet:

- `NarrativeBatchOptions.revertible` is machine-specific vocabulary on the shared service, but replacing it with a generalized origin/action model would add abstraction without a second proven caller;
- machine command names appear in the browser boundary, bridge, and CLI, but the vocabulary has only three commands and does not yet justify a protocol registry;
- `createStory` uses deterministic machine-oriented IDs, but canonical IDs are opaque and no observed workflow depends on their prefix;
- polling interval, request timeout, body-size limits, multi-client behavior, and richer local transport are prototype concerns until the human run exposes an actual problem;
- a harness Skill or discoverable command schema may reduce setup friction, but that is part of the human validation question rather than a pre-validation assumption.

## Execution result

```text
I1  Centralize runtime NarrativeOperation names        [implemented]
 ↓
Ponytail-equivalent review                             [complete]
 ↓
CI                                                     [green]
 ↓
return to 0C.6 human validation
```

No further engineering work should be pulled forward unless the human validation produces concrete evidence for it.
