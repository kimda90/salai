# Salai Product Discovery Notes

This document records concrete workflow observations gathered during product discovery. These are **observations and research inputs**, not architecture decisions or committed requirements.

When an observation becomes a product requirement, technical proposal, or accepted decision, it should be reflected in the PRD, backlog, RFC, or ADR rather than silently promoted here.

## Narrative thinking is idea-first

The atomic creative concern is the **idea or piece of narrative progression the audience should receive**, not the number of shots, dialogue lines, or graphics needed to express it.

A single idea may require one shot or many audiovisual moments.

This supports keeping Beat and Cue separate:

- Beat = intended narrative progression;
- Cue = audiovisual moment used to express that progression.

## Creative validation is progressive

A production idea is rarely validated once.

A common loop is closer to:

```text
read / imagine
    ↓
shoot or generate
    ↓
watch the material
    ↓
place it in context
    ↓
edit until it feels right
```

An idea may read well and fail when captured; footage may look good and fail in context.

Salai should preserve intent and alternatives as work moves through these levels rather than treating an early decision as permanently committed.

## Rejected material is often moved aside, not destroyed

Editors commonly keep rejected ideas, takes, scenes, or alternate structures nearby rather than deleting them immediately.

This suggests that `remove from active structure` and `delete permanently` should remain distinct concepts.

## Spatial proximity can keep alternatives “in hand”

Keeping alternatives physically or visually nearby is useful because material can remain accessible without cluttering the active sequence.

The Story Wall / Workspace parking-lot concept preserves this behavior.

The 0B human test also showed that spatial organization should not become mandatory interaction overhead. Spatial organization is useful when the creator chooses to think spatially.

## Previs can move the feedback loop earlier

Low-friction previs may let the creator feel the idea before expensive production or timeline work.

```text
write / restructure
       ↓
cheap visual approximation
       ↓
feel the idea earlier
       ↓
revise before expensive production
```

This remains a product opportunity, but it should connect to the same low-friction authoring and Narrative Lens model rather than becoming a separate GenAI workflow.

# Spike 0B human-test findings

## Finding 1 — routine structured authoring creates too much creative friction

The first human test of the 0B prototype produced a cross-cutting observation:

> **The prototype requires too much user interaction to be creatively useful as the routine authoring path.**

The issue was broader than any one Story Wall, Outline, AV Script, or Paper Edit affordance.

The user was repeatedly required to operate the structure of the product instead of simply expressing the intended story change.

Examples of friction include:

- explicitly creating and parenting narrative objects;
- selecting a structural destination before expressing an idea;
- manually managing spatial placement vs narrative order;
- switching surfaces because a particular operation is exposed there;
- translating one creative intention into several UI actions;
- thinking about Beat/Cue/Scene mechanics before those distinctions are creatively relevant.

This is important because the implementation simultaneously showed that the Narrative IR can support these operations safely.

The problem is therefore not primarily:

> “The model cannot represent the workflow.”

It is:

> **“The user is being asked to manage the model too often.”**

## Finding 2 — exposing the narrative system can still be creatively useful

Follow-up reflection on the 0B test produced an important qualification.

The structured views themselves can be useful precisely because they expose the internal narrative system.

A creator may want to see:

- hierarchy;
- progression;
- spatial balance;
- turning points;
- audiovisual density;
- source/evidence distribution;
- missing realizations;
- runtime proportion;
- alternatives.

This can help the creator understand the story's **pulse** and modify it from a different angle.

Therefore the 0B result should **not** be interpreted as:

> “Hide the Narrative IR completely and replace the product with chat.”

A better interpretation is:

> **Hide structural bookkeeping, not narrative structure.**

The structured surfaces remain potentially valuable when the representation itself contributes to the creative decision.

## Narrative Lenses hypothesis

The follow-up concept is a **Narrative Lens**: a structured representation of the same canonical project that emphasizes one creative dimension.

Examples:

- Outline → hierarchy/proportion;
- Story Wall → spatial rhythm/alternatives;
- AV Script → audiovisual density/realization;
- Paper/Radio → evidence/voice/source pacing;
- Coverage → gaps between intent and realization.

A creator can deliberately enter a lens when that representation helps them think.

Direct manipulation inside the lens remains useful when the structure being manipulated is itself the creative question.

This is distinct from being forced into the lens because Salai exposes an operation only there.

## Agent mediation and lenses are complementary

The next hypothesis is:

```text
user writes / talks / drops media
             ↓
        Salai interprets
             ↓
 typed canonical project changes
             ↓
      Narrative IR
       ↙   ↓   ↘
   Narrative Lenses
```

The agent reduces routine model-management work.

The lenses preserve structural legibility and alternate creative modes.

The strongest product loop may be:

```text
express intent
     ↓
Salai structures it
     ↓
see through a useful lens
     ↓
reshape directly or conversationally
     ↓
continue
```

## Agent mediation should not become approval friction

If one natural instruction becomes several operations but the user must approve every operation independently, the product recreates the same interaction burden.

The next prototype should test grouped, reversible actions:

```text
one creative instruction
        ↓
0..N typed operations
        ↓
one understandable change batch
        ↓
revert / inspect if needed
```

Clarification should be reserved for meaningful creative ambiguity rather than ordinary model bookkeeping.

## Narrative pulse is a metaphor, not yet a model

“Narrative pulse” currently describes patterns the creator may perceive through one or more lenses:

- pacing;
- density;
- alternation;
- repetition;
- source/voice distribution;
- audiovisual complexity;
- coverage completeness;
- structural balance.

This should not yet become a canonical `Pulse` object or universal AI quality score.

0C should first test whether simple derived indicators and existing lenses make these patterns meaningfully useful.

# Implications for current validation

The evidence now suggests:

- keep the existing Beat/Cue distinction until messy agent-mediated inputs prove it inadequate;
- preserve canonical Narrative IR and source-evidence rules validated in 0A/0B;
- stop treating Story Wall, Outline, AV Script, and Paper/Radio Edit as mandatory stages;
- retain those views as first-class Narrative Lenses when their representation adds creative value;
- test free-form text + conversation + media before adding more routine structured controls;
- test agent + active-lens interaction, not agent and views as separate product modes;
- make interaction compression a first-class success criterion;
- make structural insight a second first-class success criterion;
- make grouped revert/history part of the next spike;
- do not introduce a generic canvas or rich-text document as canonical storage;
- keep Resolve downstream of normalized Salai state.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md), [`narrative-lenses.md`](narrative-lenses.md), and [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md).