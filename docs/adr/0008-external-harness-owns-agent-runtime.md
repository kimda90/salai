# ADR 0008 — External Harness Owns the Agent Runtime

## Status

Accepted.

Supersedes: ADR 0007.

## Context

ADR 0007 correctly moved the durable boundary from a model runtime to `SalaiProjectService`, but it also chose an embedded browser model as the primary Spike 0C path. That still makes Salai responsible for model access, authentication, provider integration, and an authoring surface that are not part of Salai's domain.

The smaller and more durable architecture is for an existing external harness to own model/session behavior and operate Salai through a machine-facing interface. Salai already owns the state and mutation boundary the harness needs: Narrative IR, Workspace state, `SalaiProjectService`, and canonical `NarrativeOperation[]` application.

## Decision

1. **`SalaiProjectService` remains the authoritative human/machine domain boundary.** Narrative IR and justified Workspace state remain the only project truth.
2. **The external harness owns model concerns.** Model choice, authentication, sessions, conversation history, planning, and tool-loop behavior stay outside Salai.
3. **Salai exposes one narrow machine interface for 0C.** Start with a CLI-oriented interface because generic local harnesses can invoke it directly. Add MCP only if a concrete workflow later requires it.
4. **The machine interface delegates to the same project service used by the UI.** It may query task-relevant state and request validated canonical mutations; it must not edit persistence or maintain a shadow project.
5. **A Skill is optional instructions, not architecture.** It may teach a harness how to inspect, change, and verify Salai state, but capability lives in the machine interface and project service.
6. **0C does not embed a model/provider runtime.** No hosted-model SDK, provider authentication, API-key handling, model router, chat session store, or embedded agent runtime belongs in the spike.
7. **Keep synchronization local and minimal.** The current browser prototype may use the smallest local bridge required to let the external harness and UI reach the same live project service. Do not introduce distributed-state infrastructure, CRDTs, or a second canonical store.

## Alternatives considered

### Embedded browser model

Rejected. It optimizes deployment convenience by making Salai own provider/auth/model concerns that are not part of the product's durable domain.

### Agent runtime abstraction inside Salai

Rejected. It is unnecessary while existing harnesses already own model execution and tool loops.

### Direct project-file editing by the harness

Rejected. It bypasses `SalaiProjectService`, canonical validation, Workspace ownership, grouped-action semantics, and future persistence policy.

### Build CLI and MCP together

Rejected. One machine interface is enough to validate the workflow.

## Consequences

- Salai implementation focuses on its narrative/project API instead of generic AI infrastructure.
- Users can bring an existing harness and its existing account/model setup.
- Human and machine changes continue to share one canonical state and validation path.
- A small local bridge may be necessary for the current browser prototype so an external process can reach the live project service.
- GitHub Pages is no longer a requirement for the real agent-mediated 0C workflow; CI remains deterministic and provider-independent.
- ADR 0007 remains the historical record of the project-service decision and the superseded backendless embedded-model path.
