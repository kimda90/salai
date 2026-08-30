# ADR 0006 — Codex Runtime Behind a Salai Agent Seam

## Status

Superseded by ADR 0007.

This is an implementation/runtime decision for the current validation milestone, not a permanent commitment that Salai must always use Codex or OpenAI models.

## Context

Spike 0C should optimize for **time to a real demo** without buying technical debt that quickly blocks the next product iteration.

Salai needs model authentication, turn/session execution, structured model output, and basic runtime lifecycle. Building those as Salai-owned infrastructure would spend time on commodity plumbing before the agent-mediated authoring hypothesis is validated.

At the same time, allowing one provider/runtime to leak through the UI, controller, Narrative IR, or Narrative Lenses would make later replacement expensive.

Codex app-server already provides a local agent runtime with:

- ChatGPT account authentication managed by Codex;
- thread/turn lifecycle;
- model execution and event delivery;
- a final-output JSON Schema constraint through `turn/start.outputSchema`;
- stdio/JSONL as the default supported local transport.

Its WebSocket listener is currently documented as experimental/unsupported, so Salai should not make direct browser-to-Codex WebSockets an architectural dependency.

The canonical Salai state boundary is already established independently: agent output must become Salai-owned canonical changes and pass through `@salai/script-model` / `applyOperations()` before project state is published.

## Decision

### 1. Use Codex app-server as the concrete Spike 0C agent runtime

For the real local 0C path, Salai will launch/connect to `codex app-server` and use Codex-managed **ChatGPT OAuth** rather than implementing OpenAI API-key storage, OAuth token persistence/refresh, or a general provider credential subsystem.

Salai must not extract or persist reusable ChatGPT OAuth tokens itself.

### 2. Put one small Salai-owned seam in front of Codex

Salai will define only the minimum runtime contract needed by the validated scenarios, conceptually:

```ts
interface AgentRuntime {
  start(): Promise<void>;
  runTurn(input: AgentTurnInput): Promise<AgentTurnResult>;
  stop(): Promise<void>;
}
```

The exact interface may change during implementation, but these rules are fixed:

- inputs/results exposed outside the adapter use Salai-owned types;
- Codex JSON-RPC/thread/turn/auth types stay inside `CodexRuntime`;
- the interface must remain small enough that a later runtime can replace Codex without changing Narrative IR, controller, or lens code;
- do not build a generic provider/plugin framework around this seam in 0C.

A deterministic/mock runtime implements the same Salai seam for CI and the hosted prototype.

### 3. Use structured final output before inventing a Salai tool protocol

The first 0C vertical slice should use Codex `turn/start.outputSchema` to constrain the final assistant result to a small Salai-owned schema.

That result may contain public `NarrativeOperation[]` directly or the minimum scenario-specific Salai authoring commands already allowed by the 0C contract.

Do not add MCP, a generic tool registry, or a second agent command language unless an implemented scenario proves structured final output is insufficient.

### 4. Keep Codex state disposable and Salai state canonical

State ownership is explicit:

```text
Codex state
thread / turn / auth / model context
        ↓ disposable runtime context

Salai agent state
current request / selected project context / proposed result
        ↓ transient normalization context

Salai project state
Narrative IR / Workspace / source relationships
        ↓ canonical product state
```

A Codex restart or fresh thread must not lose or redefine the Salai project. Salai should be able to start a new agent thread, provide current task-relevant project context, and continue.

Conversation history is not canonical project storage.

### 5. Use the supported local transport; keep the browser bridge minimal

For 0C:

```text
React/Vite UI
     ↓ small localhost request boundary
local Salai agent host
     ↓ stdio / JSONL
codex app-server
     ↓
ChatGPT-authenticated Codex service
```

The local host owns process lifecycle and Codex protocol translation.

The browser-facing contract only needs what the product validation requires: submit a request, expose coarse status/error information, and return a final structured result. Token-by-token chat streaming and a durable chat transcript are not 0C requirements.

The existing GitHub Pages build cannot spawn a local Codex process. It therefore continues to use a deterministic/mock runtime for hosted demos while the real authenticated path runs locally.

### 6. Preserve the existing canonical change boundary

Codex never owns Salai narrative state and never mutates Resolve directly.

```text
creative request
      ↓
Salai agent context
      ↓
AgentRuntime
      ↓
CodexRuntime
      ↓
structured Salai result
      ↓
NarrativeOperation[]
      ↓
applyOperations()
      ↓
canonical Narrative IR
      ↓
Narrative Lenses
```

If a later OpenCode/Luna, local-model, or other runtime is justified, it should replace `CodexRuntime` behind the same Salai-owned boundary rather than changing canonical semantics.

## Alternatives considered

### Build Salai-owned API-key/OAuth/model infrastructure now

Rejected for 0C. It spends validation time on commodity authentication, credential storage, provider billing, session, and transport concerns.

### Embed an API key in the GitHub Pages client

Rejected. Browser-delivered secrets are extractable and unsuitable for a public static application.

### Browser connects directly to Codex WebSocket transport

Rejected as the architectural baseline because Codex currently documents WebSocket transport as experimental/unsupported. A supported stdio boundary behind a local host is more stable and maps naturally to the later desktop process boundary.

### Adopt a general agent framework or multi-provider abstraction now

Rejected. There is one concrete runtime requirement. The small `AgentRuntime` seam is an anti-corruption boundary, not a new framework.

### Adopt OpenCode/Luna now

Deferred. Luna/OpenCode may later offer attractive price/performance, but the current priority is validating the Salai workflow with the least credential/runtime plumbing. A later runtime comparison should occur behind the Salai seam if inference economics become important.

### Make Codex threads the Salai project/session model

Rejected. Codex context is runtime state; Narrative IR and Workspace remain canonical product state.

## Consequences

Benefits:

- faster path to a real authenticated 0C demo;
- no Salai-owned OpenAI API keys or OAuth-token lifecycle;
- no need to build a general chat/session/provider framework;
- deterministic mock mode remains available for CI and GitHub Pages;
- Codex-specific protocol churn is isolated to one adapter;
- later runtime replacement remains feasible without changing Narrative IR or lenses.

Costs / accepted short-term debt:

- the real agent path requires a local host/process and cannot be browser-only GitHub Pages;
- 0C initially depends on Codex availability and ChatGPT/Codex entitlement;
- the localhost bridge may be intentionally rough and later replaced by desktop IPC;
- agent threads/history may be ephemeral and are not product persistence;
- the first UI may expose only status + final result rather than polished token streaming.

## Revisit triggers

Reconsider or supersede this ADR when one of these becomes true:

- model cost/quality makes a non-Codex runtime materially preferable;
- users require provider choice;
- offline/local inference becomes a validated requirement;
- Codex runtime constraints block a validated Salai workflow;
- the desktop runtime creates a better stable process/IPC integration;
- agent behavior requires richer interactive tools than structured final output can support.

Until then, optimize implementation speed behind this boundary rather than generalizing it.

## References

Current Codex protocol facts used by this decision:

- [`codex app-server` protocol/readme](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md) — app-server role, default stdio/JSONL transport, thread/turn model, and experimental WebSocket status;
- [`TurnStartParams.outputSchema`](https://github.com/openai/codex/blob/main/codex-rs/app-server-protocol/schema/typescript/v2/TurnStartParams.ts) — JSON Schema constraint for final assistant output;
- [`LoginAccountParams`](https://github.com/openai/codex/blob/main/codex-rs/app-server-protocol/schema/typescript/v2/LoginAccountParams.ts) and [`LoginAccountResponse`](https://github.com/openai/codex/blob/main/codex-rs/app-server-protocol/schema/typescript/v2/LoginAccountResponse.ts) — ChatGPT login request and browser authorization URL.
