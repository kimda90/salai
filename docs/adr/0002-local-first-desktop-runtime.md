# ADR 0002 — Local-First Desktop Runtime

## Status

Accepted for the broader application architecture. Not part of Spike 0A implementation.

## Context

Salai needs persistent access to local production files, large camera originals, generated assets, project directories, NAS/network paths, filesystem watchers, local tools such as FFmpeg/ComfyUI, and DaVinci Resolve.

A browser-only application would make those workflows dependent on restrictive file APIs, repeated user grants, uploads, or awkward local bridges.

The product UI is naturally suited to React/TypeScript, while the media/production integration layer has strong Python ecosystem dependencies.

## Decision

The broader Salai application will be local-first.

Planned runtime boundary:

```text
Electron
- main process / OS integration
- secure preload
- React + TypeScript renderer

        ↓ localhost HTTP / WebSocket

Python local service
- FastAPI
- persistence
- media/integration processes
```

The Electron renderer will not receive unrestricted Node access. Use a narrow preload API with `contextIsolation: true` and `nodeIntegration: false`.

## Alternatives considered

### Browser-only WebUI

Rejected as the primary production runtime because Salai requires persistent privileged local-file/process integration.

A browser may remain useful for development/debugging or future review-only workflows.

### Tauri/Rust

Not selected because the current product does not justify adding Rust/Cargo and platform WebView variability when the project already centers on TypeScript/React and Resolve workflow integrations are Electron-based.

### Electron-only Node backend

Not selected as the current direction because Resolve/media/ML/OpenAssetIO/OpenTimelineIO integrations have a strong Python ecosystem fit.

## Consequences

Positive:

- reliable local filesystem/process access;
- one React/TypeScript UI model can be reused by desktop and Resolve integration surfaces;
- Python remains available for media/AI pipeline work;
- local-first usage does not require uploading camera originals.

Costs:

- distribution must package/manage two runtimes;
- Electron has a larger footprint than OS-webview shells;
- process lifecycle and localhost API security must be designed carefully.

## Scope note

Spike 0A intentionally does not implement this runtime. The Narrative IR must remain independent from Electron and Python.
