# Documentation Review Response — 2026-08

This note records how the external documentation review was resolved. It is not a product requirement or architecture decision.

## P0

### Operation vocabulary drift

Resolved. `docs/narrative-ir-spec.md` is the single authoritative source for Spike 0A operations. Summary docs point to it instead of maintaining their own lists.

### Missing operations

Resolved. The authoritative operation set now includes:

- `moveSection`;
- `moveBlock`;
- `deleteSection`;
- `deleteBlock`.

Deletion/reordering semantics are documented in the spec.

### Workspace/Board ownership

Resolved.

- Spike 0B owns the minimum in-memory `Workspace / Board / BoardItem / IdeaCard` model needed to validate Story Wall and Paper/Radio Edit UX.
- Phase 2 owns durable persistence of that workspace state.
- `architecture.md` now includes the workspace layer explicitly.

## P1

### No code for current priority

Stale by the time of this pass. `packages/script-model/` and the TypeScript/pnpm workspace now exist.

### Missing repo-level files

Resolved with:

- `.gitignore`;
- `CONTRIBUTING.md`;
- CI workflow;
- explicit `LICENSE` status notice.

No open-source license has been selected for Salai; dependency licenses do not imply a Salai license.

### Heavy content duplication

Resolved structurally rather than by wording patches. `docs/README.md` now assigns canonical ownership:

- terminology → `glossary.md`;
- implementation contract → `narrative-ir-spec.md`;
- system architecture → `architecture.md`;
- sequencing → `mvp.md`;
- scripting rationale → `scripting.md`.

The large summary documents were reduced accordingly.

## P2

### Glossary

Added `docs/glossary.md`.

### Competitive landscape

Added `docs/competitive-landscape.md` with named adjacent products and positioning pressure tests.

### Business model placeholder

Added to `docs/product-brief.md`; intentionally undecided until product value is validated.

### Open questions mapped to fixtures

Added an explicit open-question/fixture ownership table to `docs/narrative-ir-spec.md`.

### Service-level cross-reference

`docs/service-levels.md` now points to Narrative IR invariants instead of restating a parallel technical contract.
