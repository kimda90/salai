# Salai Product Discovery Notes

## September 18, 2026 — narrative-first AI filmmaking pivot

This record separates **user direction**, **observed earlier evidence**, **design inference**, and **unvalidated hypotheses**. It is not a second PRD or implementation tracker. Previous discovery is preserved verbatim in [research-notes-before-filmmaking-pivot.md](research-notes-before-filmmaking-pivot.md).

### Where the discussion began

The user described a spoken-story workflow: transcribe the telling, interpret it as a screenplay, identify narrative structure and characters/locations/props/time, assemble a timeline, compose generation guidance across scopes, and generate stills, draft previs, low-quality motion, or high-quality results. The user also wanted a per-shot 3D space for placing subjects, camera, and lights.

The important need was not the taxonomy. It was to see a story early, direct what is wrong, and avoid restarting the film each time a creative decision changes.

### What changed during discovery

1. **The feature pipeline is not unique.** The discussion initially overemphasized the integration of screenplay, breakdown, storyboard, generation, and timeline. Current vendor descriptions overlap substantially; see the dated [competitive evidence](competitive-landscape.md). This does not establish either equivalence or a unique Salai advantage without hands-on comparison.
2. **Narrative intent matters most during revision.** “She is pretending to be frightened” differs from “make her look frightened.” The interesting question is whether Salai retains why a moment exists while changing its audiovisual expression. This is a hypothesis to test, not a claim that the system understands the film's complete causality.
3. **Industrial analogies clarified the problem but inflated the solution.** One artifact with multiple representations, traceable inputs, scoped overrides, and change review are useful lessons. Importing PLM, formal satisfaction graphs, a universal constraint engine, semantic branches, or a build-system UI would create too much structure before proving user value.
4. **The user explicitly asked for simplification twice.** A large graph architecture was reduced to one project, existing narrative identity, references, outputs, and recorded generation inputs. The product loop was then reduced to Tell → See → Direct → Update → See. Breakdown and reference collection should assist this loop, not become compulsory setup tasks.
5. **Similarity to Nolan is acceptable.** The final user direction is “AI filmmaking interface with heavy focus on narrative intents.” We do not need to invent a new category or prove a moat before testing the workflow. Narrative-centered iteration is the focus; its advantage remains to be demonstrated.

### Lessons retained from previous human evidence

The [0B assessment](spike-0b-assessment.md) warns against requiring manual parent/child construction for ordinary creative work. The [0C assessment](spike-0c-assessment.md) supports an external agent operating one canonical project. The [0D assessment](spike-0d-assessment.md) warns that passive semantic labels and shallow editing do not make the story usefully editable.

These findings support a low-friction loop with meaningful direct correction. They do not prove that generation works, that a new viewer is usable, or that an agent can correctly predict every narrative consequence. Pausing 0E changes the next experiment; it does not erase its motivation or validate its unfinished editor.

### Corrections to earlier architectural claims

- A dependency-input comparison can show that a result was made from older information. It cannot prove the image or performance is now wrong. Use “inputs changed” / “review needed,” not automatic creative failure.
- IDs plus increasing revision numbers do not reconstruct old inputs. Preserve the actual request and sufficient versioned/snapshotted context alongside durable media. They still do not guarantee identical regeneration from a nondeterministic or changed external model.
- Captured or imported footage is source material. Linking it to a Beat later does not mean that Beat generated the recording. Separate source provenance from generated-output provenance and from the current editorial selection.
- A global character record should not absorb scene-specific motivation, costume, or performance merely to propagate an edit. Scope feedback deliberately; a local change should not accidentally affect the whole film.
- “No graph” means no graph database or graph-authoring subsystem is required. Ordinary references still encode relationships. Missing references, newly added inputs, hierarchy changes, overrides, and pending jobs must be handled explicitly.
- One Shot object sounded simpler, but replacing current ShotIntent links with a single `cueId` would silently discard supported relationships. Reuse the implemented model first; any new binding/migration belongs in RFC 0004.
- A clip existing is not proof of narrative coverage. The filmmaker judges whether the intended meaning is conveyed. Automatic satisfaction scores are not required.
- Broad statements that competitors lack these mechanisms were not established. Absence from a public page is not evidence of absence from a product.

### Analogies worth retaining, without adopting their stacks

[Bazel's dependency documentation](https://bazel.build/basics/dependencies) illustrates why recorded inputs and dependency granularity matter for incremental work. Salai should borrow the discipline, not assume every creative change is a deterministic rebuild.

[OpenUSD's introduction](https://openusd.org/release/intro.html) describes layered composition and overrides. The useful lesson is non-destructive, scoped contributions with understandable provenance; it is not a commitment to OpenUSD storage or a promise that upstream changes automatically repair artistic results.

[MathWorks requirements traceability](https://www.mathworks.com/discovery/requirements-traceability.html) links requirements to design and verification. This inspired keeping intent visible alongside realization, not treating audience interpretation as mechanically verified engineering compliance.

Primary pages checked September 18, 2026. Revit/BIM, PLM, Altium, Houdini, Onshape, and data-lineage systems were additional discussion analogies, not selected dependencies or fresh verified capability comparisons in this decision.

### Decisions versus retained ideas

Accepted product decisions are in [ADR 0010](adr/0010-narrative-first-ai-filmmaking.md): accept the AI-filmmaking category, focus on narrative-directed iteration, start with stills/cheap motion, preserve one project, keep human control, and remove standalone 0E as the prerequisite gate.

The following remain desired but staged: contextual 3D blocking/camera/lights; higher-quality generation; mixed imported/generated media; scoped readable guidance history. The following remain exploratory: inferred long-range continuity, narrative satisfaction checks, automatic minimal regeneration, alternate story branches, and broad compositional world constraints. Neither list authorizes a new subsystem by itself.

### Questions the next experiment must answer

Can a filmmaker express a narrative correction without rewriting every shot prompt? Does the changed film convey the intended change? Are unaffected choices actually preserved? Is the explanation of affected material understandable rather than noisy? Do stills and cheap motion reveal different useful decisions? Can the creator stop with a useful result instead of being pushed toward expensive generation?

Compare the same small story and revision tasks against a plain shot-prompt workflow and, when accessible, current competing products. Record time to a useful preview, revision effort, incorrect affected-shot suggestions, lost decisions, generation cost/latency, and human judgment. No market validation or new human pass is recorded by this documentation PR.
