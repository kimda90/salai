# ADR 0007 — Project Service Is the Human/Machine Boundary

## Status

Superseded by ADR 0008.

Supersedes: ADR 0006.

## Context

Spike 0C needs a low-friction agent-mediated workflow without making a particular model runtime, authentication system, chat session, or transport part of Salai's architecture.

ADR 0006 correctly isolated canonical Salai project state from agent/runtime state, but it made a Codex-specific runtime seam and local host topology central to the 0C implementation. Further architecture review showed that the more durable boundary is the application domain itself: human UI and machine clients should operate on the same authoritative Salai project through Salai-owned queries and commands.

Salai already has the core pieces required for that boundary: canonical Narrative IR, Workspace state, stable IDs, typed `NarrativeOperation[]`, `applyOperations()`, and synchronized Narrative Lenses.

## Decision

### 1. Make a Salai-owned project service the stable application boundary

Salai will expose one application/domain service over the current project. The exact TypeScript shape may evolve, but it owns three responsibilities:

- provide task-relevant project context;
- apply validated canonical changes;
- notify interested clients when project/Workspace state changes.

Conceptually:

```ts
interface SalaiProjectService {
  getContext(request: ContextRequest): ProjectContext;
  applyOperations(
    operations: NarrativeOperation[],
    options?: { expectedRevision?: number; origin?: "agent" | "lens" | "system" },
  ): OperationResult;
  subscribe(listener: (change: ProjectChange) => void): () => void;
}
```

This is an application service over existing model/controller behavior, not a second domain model.

### 2. Keep one authoritative project

Narrative IR and justified Workspace state remain canonical. Narrative Lenses, embedded model integrations, CLI/MCP adapters, and other machine interfaces are clients of the same project service.

No client may establish a shadow narrative model or bypass canonical validation by writing persistence directly.

```text
              SalaiProjectService
                    ↓
             applyOperations()
                    ↓
             Narrative IR
           ↙        ↓        ↘
       Outline   Story Wall   AV Script / Paper Edit
```

### 3. Agent/runtime state is disposable context

Model conversation history, provider sessions, authentication, plans, tool traces, and intermediate prose are not project state.

A new model session or a different machine client must be able to continue from current Salai project context. Conversation history may improve convenience, but it cannot be required to reconstruct canonical work.

### 4. Optimize Spike 0C for a backendless hosted demo

The primary 0C demo path should run in the existing browser/GitHub Pages application without a Salai-operated backend.

The model adapter used for that path must therefore be browser-safe and user-scoped: no developer secret may be embedded in the static bundle. Provider/model choice is an adapter decision and must not affect canonical semantics.

The browser model adapter returns Salai-owned structured changes, which still pass through the project service and `applyOperations()`.

### 5. Treat external-agent integration as another adapter

A future or optional external-agent path may expose the same project service through a machine-oriented interface such as CLI or MCP. A Skill may teach a generic agent when and how to use that interface, but the Skill is instructions rather than state or capability implementation.

External-agent support must not require the core Salai application to adopt the agent's session model, provider, authentication, or storage.

### 6. Use simple local mutation ordering first

0C does not require CRDTs, event sourcing, or a distributed state system.

Use one serialized application mutation boundary. A monotonic project revision may be added when needed so a client can submit `expectedRevision` and receive a stale-revision failure instead of applying work against an outdated project.

## Consequences

Benefits:

- the permanent architectural investment is Salai's domain boundary rather than an agent vendor/runtime;
- human and machine interactions share the same semantic model and validation path;
- the 0C demo can stay backendless and hosted on GitHub Pages;
- model/provider/authentication choices remain replaceable;
- later CLI, MCP, Skill, desktop, or embedded-agent integrations can reuse the same project service;
- direct lens edits are naturally visible to the next machine request because both read the current project.

Costs / constraints:

- a browser-only hosted demo can use only model integrations that are safe for public static clients;
- an external local agent cannot interact live with a pure GitHub Pages in-memory project without some shared bridge; that bridge is deferred until external-agent integration is actually validated;
- subscriptions/revision checks must remain small and application-specific rather than growing into premature distributed-state infrastructure.

## Alternatives considered

### Keep `AgentRuntime` as the central Salai abstraction

Rejected. It organizes the application around model execution rather than around the project that both people and machines edit.

### Make model/chat history the shared collaboration state

Rejected. It creates a second source of narrative truth and makes project continuity depend on a provider/runtime session.

### Let machine clients edit serialized project storage directly

Rejected. It bypasses application validation, operation semantics, Workspace ownership, revert behavior, and future persistence policy.

### Build synchronization infrastructure before it is needed

Rejected. One local authoritative mutation boundary is enough for 0C. Add revision checks, richer subscriptions, CRDTs, or event history only when a validated workflow requires them.

## Superseded decision

ADR 0006 remains the historical record of the earlier Codex app-server plan. Its enduring state-isolation principle is retained here; its Codex-specific runtime seam, local host, authentication, and transport choices are no longer current architecture.
