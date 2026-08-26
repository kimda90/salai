# @salai/script-model

Pure TypeScript implementation of **Spike 0A — Narrative IR**.

The package validates Salai's semantic scripting model independently from Electron, React, persistence, Resolve, editor frameworks, and AI integrations.

## Public surface

The package exports:

- explicit Narrative IR domain types;
- `createEmptyNarrativeProject()`;
- `validateNarrativeProject()` / `assertValidNarrativeProject()`;
- the 27-operation `NarrativeOperation` vocabulary;
- transactional `applyOperation()` / `applyOperations()`;
- runtime estimation;
- validated JSON serialization/deserialization;
- three representative fixture builders used by the Spike 0A tests.

Update operations use JSON-safe patch semantics:

```text
field omitted → preserve
field: null   → clear optional value
```

`docs/narrative-ir-spec.md` is the implementation contract. `docs/spike-0a-assessment.md` records the spike result and the conclusions drawn from the fixtures.

The package deliberately does not contain UI, persistence, Resolve, LLM, or media-analysis infrastructure.
