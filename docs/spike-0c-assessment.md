# Spike 0C — External-Agent Authoring + Narrative Lenses Assessment

## Result

**PASS — external-agent authoring is validated enough to carry forward.**

Human validation was completed with Codex as the external harness. The integration operated correctly against the live Salai project and demonstrated the practical convenience of keeping an agent in the loop for routine narrative manipulation.

This assessment records the evidence actually established by the spike. It does not claim that the four 0B-era Narrative Lenses are the final product UI; the next iteration explicitly reopens the audiovisual interaction model around structural editorial and playback.

## What 0C validated

### External harness is a viable interaction boundary

Codex could operate Salai through the machine interface while Salai remained the owner of canonical project state.

The successful human run validates the boundary established in ADR 0008:

```text
external harness
      ↓
Salai machine interface
      ↓
SalaiProjectService
      ↓
typed canonical operations
      ↓
Narrative IR + Workspace
```

Salai did not need to own model/provider authentication, conversation history, planning, or the harness tool loop.

### Agent mediation materially reduces routine interaction friction

Spike 0B established that direct structured authoring required too much explicit object/parent/operation management for ordinary creative work.

The 0C human run demonstrated the intended contrast: an agent could inspect the live project, translate a creative instruction into canonical operations, and apply the result without requiring the filmmaker to manually serialize the same structural bookkeeping.

The product consequence is now accepted:

> **Agent-mediated authoring is a validated interaction capability, not a speculative replacement for direct UI.**

### Salai remains the project truth

The value came from the harness operating the current Salai project rather than maintaining a parallel story document or relying on conversation memory to reconstruct state.

This preserves the core architecture:

- one canonical Narrative IR;
- one Salai-owned project service/mutation boundary;
- disposable harness session state;
- direct UI and machine changes converging on the same project.

### The machine interface can remain narrow

The spike did not require Salai to expose CLI + MCP + embedded provider SDK + custom agent runtime simultaneously.

The narrow CLI-oriented interface was enough to prove the product interaction. Additional protocols remain unjustified until a concrete integration requires them.

## What 0C does not decide

0C does not decide the final visual organization of Salai.

The existing Outline, Story Wall, AV Script, and Paper/Radio surfaces remain valid evidence that multiple views can share one canonical project. However, 0C does not establish that those four surfaces should become the final top-level product navigation.

The product pivot recorded in ADR 0009 makes the next question temporal and audiovisual: Salai must now prove that its semantic model remains useful when the story is playable and structurally editable without requiring Resolve.

## Consequences

- close Spike 0C;
- retain ADR 0008 and the existing machine/project-service boundary;
- retain the CLI as the first validated harness interface;
- do not build a Salai-owned general agent framework;
- treat Codex as successful validation of the external-harness strategy, not as a mandatory product dependency;
- carry agent-mediated authoring into the next spike as an already-proven capability;
- move the active product risk to a native semantic editorial environment.

## Next step

Proceed to **Spike 0D — Semantic Editorial Environment**.

0D should validate a playable semantic timeline and structural editorial loop over the same Salai project while keeping third-party timeline/rendering engines behind replaceable projection/materialization boundaries.

See [`spike-0d-implementation-plan.md`](spike-0d-implementation-plan.md) and [`adr/0009-salai-owns-structural-editorial.md`](adr/0009-salai-owns-structural-editorial.md).
