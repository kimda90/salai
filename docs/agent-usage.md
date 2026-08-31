# Agent usage standard

## Status

Canonical operating standard for external agents that use Salai as a creative/project tool.

This document defines how an agent discovers capabilities, reads project state, applies changes, verifies results, and handles failures. It does not define model/provider behavior, conversation policy, or agent runtime architecture.

## Principles

1. **Discover, do not assume.** Use the CLI discovery command to learn the currently implemented Salai tools.
2. **Read before write.** Fresh Salai project context is required before each creative mutation.
3. **One user intent, one atomic action.** Group the canonical operations needed for one understandable creative change and apply them together.
4. **Project state beats chat memory.** Conversation history is never the authoritative Salai project state.
5. **Preserve identity and provenance.** Keep stable IDs when meaning is unchanged and never rewrite recorded/source-backed evidence as authored copy.
6. **Verify every mutation.** Inspect the machine result, then read fresh context before continuing.
7. **Use the smallest supported surface.** Do not bypass Salai by editing project files, browser state, or persistence directly.

## Startup

Start the local UI and bridge from the repository root:

```bash
pnpm dev
```

Open the browser with bridge participation enabled:

```text
http://localhost:5173/salai/?bridge=1
```

The `?bridge=1` parameter is required by the current browser prototype so the live `SalaiProjectService` polls the local bridge.

An agent may list tools without a running bridge or browser:

```bash
pnpm salai tools
```

Live project commands require the bridge and a connected browser client.

## Tool discovery

At the start of a new agent session, after pulling new Salai code, or whenever a command is rejected as unknown, run:

```bash
pnpm salai tools
```

The command prints machine-readable JSON describing the implemented CLI tools. The runtime output is the source of truth for what the agent may invoke.

Current tools are:

| Tool | Mutates project | Purpose |
| --- | --- | --- |
| `context` | no | Read current canonical project, Workspace context, and active Narrative Lens. |
| `create-story` | yes | Create the initial story on an empty project using Salai-owned ID/placement resolution. |
| `apply` | yes | Apply a non-empty atomic `NarrativeOperation[]` batch to the current project. |

Do not infer additional commands from code, UI controls, prior conversations, or future plans.

## Required operation cycle

For every creative request that may change Salai state, follow this sequence.

### 1. Discover capabilities

Run `pnpm salai tools` once per session or when the interface may have changed.

### 2. Read current state

Run:

```bash
pnpm salai context
```

Use the returned project IDs, source identities, Workspace information, and active surface as authoritative context.

Never manufacture an existing object ID from memory. Never assume a previous context response is still current after a user or Narrative Lens may have edited the project.

### 3. Translate intent into one creative action

Identify the smallest coherent change that satisfies the user's request.

Examples of one action:

- create the initial Beat structure from a rough paragraph;
- revise the summary of one existing Beat;
- reorder several Beats as one narrative restructuring;
- link a source-backed excerpt to the appropriate narrative unit.

Do not combine unrelated creative decisions into one batch merely to reduce calls.

### 4. Choose the highest-level implemented tool that fits

Use `create-story` only when creating the initial story and the current project is empty.

Use `apply` for revisions and other canonical mutations. Its input must be a non-empty public `NarrativeOperation[]` batch as defined by [`narrative-ir-spec.md`](narrative-ir-spec.md).

Do not reimplement Salai-owned ID or placement resolution in the harness when a higher-level Salai command already exists for the scenario.

### 5. Apply atomically

Send all canonical operations for that one creative action in a single `apply` call whenever possible.

A rejected batch must be treated as no change. Do not assume partial success.

### 6. Inspect the result

Read machine feedback, including errors, warnings, created IDs, changed IDs, removed IDs, and relationship effects when present.

If the result is ambiguous or contradicts the intended action, stop rather than layering speculative corrective changes.

### 7. Re-read project context

After every successful mutation, run:

```bash
pnpm salai context
```

Verify that the canonical state reflects the intended result before continuing to the next creative request.

## Tool-specific rules

### `tools`

```bash
pnpm salai tools
```

- does not require the live bridge;
- does not read or mutate the project;
- exists for capability discovery, not as another project/domain command.

### `context`

```bash
pnpm salai context
```

Use before every mutation and after every successful mutation.

The returned Salai project is authoritative. Agent conversation history is only interaction context.

### `create-story`

```bash
pnpm salai create-story '<json>'
```

Input shape:

```text
{
  sectionTitle?: string,
  beats: Array<{
    title?: string,
    summary?: string
  }>
}
```

Rules:

- `beats` must be non-empty;
- use only on an empty story;
- let Salai allocate canonical IDs;
- use for initial script-first creation, not normal revision.

### `apply`

```bash
pnpm salai apply '<NarrativeOperation[] JSON>'
```

JSON may also be piped on stdin.

Rules:

- the batch must be non-empty;
- operations must use the public Narrative IR operation vocabulary;
- use IDs from fresh `context` output;
- preserve existing IDs when the narrative object remains conceptually the same;
- prefer one atomic batch per understandable creative action.

## Source and provenance rules

Recorded evidence remains recorded evidence.

When working with source-backed material:

- preserve source/media identity;
- preserve SourceExcerpt wording and ranges unless an explicit canonical trimming operation allows otherwise;
- do not silently turn source-backed text into editable authored copy;
- do not invent source material, quotes, ranges, or media IDs not present in current context;
- represent unsupported or missing material as missing rather than fabricating coverage.

## Workspace rules

Workspace-only intent remains Workspace-only. Do not convert board organization, layout, or transient planning meaning into canonical Narrative IR unless the user explicitly promotes it into story semantics through a supported action.

## Failure and recovery

### `No Salai browser client responded`

The bridge is running but no browser project service is connected. Ensure the UI is open at:

```text
http://localhost:5173/salai/?bridge=1
```

Then retry `context` before any mutation.

### Validation or command error

Treat the project as unchanged unless a successful result explicitly says otherwise. Read `context` again before constructing a corrected request.

### Successful but semantically wrong change

The current UI may expose an immediate one-step **Revert** for the latest machine action. There is currently no CLI `revert` tool, so an agent must not invent one. If a revert is needed, ask the user to use Salai's immediate Revert control or make an explicit corrective canonical action only when the intended correction is unambiguous.

## Prohibited behavior

An agent using Salai must not:

- directly edit serialized project data or browser storage;
- mutate `@salai/script-model` data outside the Salai machine interface;
- treat conversation/session memory as project persistence;
- create a shadow narrative model in the harness;
- bypass source provenance rules;
- invent unsupported Salai commands;
- introduce a new transport or protocol merely to complete a creative task;
- use repository code modifications as a way to change the filmmaker's live story.

## Session completion

Before reporting a creative task complete:

1. the latest mutation must have succeeded;
2. a fresh `context` must reflect the intended state;
3. any warnings or unsupported material must be surfaced to the user;
4. the agent must not claim changes that are absent from canonical Salai state.