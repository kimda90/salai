# Salai Product Discovery Notes

This document records concrete workflow observations gathered during product discovery. These are **observations and research inputs**, not architecture decisions or committed requirements.

When an observation becomes a product requirement, technical proposal, or accepted decision, it should be reflected in the PRD, backlog, RFC, or ADR rather than silently promoted here.

## Narrative thinking is idea-first

The atomic creative concern is the **idea or piece of narrative progression the audience should receive**, not the number of shots, dialogue lines, or graphics needed to express it.

A single idea may require one shot or many audiovisual moments.

This supports the current working distinction:

```text
Beat = smallest intentional unit of narrative progression
Cue  = audiovisual/temporal moment used to express part of a Beat
```

No additional semantic layer below `Cue` has yet been justified by the observed workflow. Add one only if a concrete editing or production behavior requires an independently manipulated lower-level object.

## Creative validation is progressive

Creative intent is tested repeatedly against increasingly concrete representations:

```text
read / imagine
    ↓
shoot or generate
    ↓
watch the material
    ↓
place it in the timeline
    ↓
edit until it feels right
```

Something that works as written can fail when captured. Something that works as footage can still fail in the edit.

The timeline is therefore an important final validation environment, but it should not be the first place where an idea can be evaluated.

## Rejected material is usually retained

When an idea, shot, excerpt, or edit does not work in the active structure, a common behavior is to **move it aside rather than destroy it**.

Examples include:

- parking a card off to the side of a story wall;
- moving clips to the side of a timeline;
- placing material in another timeline/version;
- keeping unused material in an accessible folder/bin for possible reuse.

This suggests that `remove from active structure` and `delete permanently` should remain different user actions wherever practical.

## Spatial proximity matters

Keeping alternatives physically or visually nearby is useful because material can remain "in hand" without cluttering the active sequence.

The Story Wall / workspace parking-lot concept preserves this behavior, but the 0B human test also showed that spatial organization should not become mandatory interaction overhead. Spatial workspaces are useful when users choose to think spatially, not as the required path for every structural change.

## Previs can move the feedback loop earlier

Previsualization is valuable because it lets a creator evaluate whether an idea feels right before committing to a full shoot or edit.

Traditional previs can be expensive enough that it is not used for many ordinary productions. A lower-friction workflow where writing or restructuring can produce an immediate visual approximation could materially change the feedback loop:

```text
write / restructure
      ↓
cheap visual approximation / previs
      ↓
feel the idea earlier
      ↓
revise before expensive production
```

This remains a concrete product opportunity, but it should attach to a low-friction authoring flow rather than require another manual production-planning surface.

## 0B human-test finding — structured authoring creates too much creative friction

The first human test of the 0B prototype produced a cross-cutting observation:

> **The prototype requires too much user interaction to be creatively useful.**

The issue was broader than any one Story Wall, Outline, AV Script, or Paper Edit affordance. The user was repeatedly required to operate the structure of the product instead of simply expressing the intended story change.

Examples of the underlying friction include:

- explicitly creating and parenting narrative objects;
- selecting a structural destination before expressing an idea;
- manually managing the distinction between spatial placement and narrative order;
- switching surfaces because a particular operation is exposed there;
- translating one creative intention into several UI actions;
- thinking about Beat/Cue/Scene mechanics before they are creatively relevant.

This is important evidence because the 0B implementation simultaneously showed that the underlying Narrative IR can support these operations safely. The product problem is therefore not primarily "the model cannot represent the workflow." It is that **the user is being asked to manage the model directly.**

### Research implication

The next hypothesis should move structural bookkeeping behind an agent-mediated normalization layer:

```text
user writes / talks / drops media
             ↓
        Salai interprets
             ↓
 typed narrative / source / workspace changes
             ↓
      canonical project state
```

This direction should be tested before spending more time polishing direct-manipulation forms.

## Free-form multimodal authoring is now an active hypothesis

A previously shelved idea was a PureRef-like workspace where text, images, video, references, and previs could coexist. The 0B friction finding changes the research priority, but not in the direction of a generic canvas.

The stronger hypothesis is now:

- the user needs a **free-form place to think**;
- that place can accept ordinary text, conversational instructions, and media;
- an agent should normalize the material into structured project state;
- structured surfaces should remain available as optional inspection/precision tools;
- the user should not manually serialize creative thought into Salai's domain model.

A spatial canvas may still become one possible Workspace later, but the core research question is **agent-mediated normalization**, not canvas mechanics.

## Agent mediation should not become approval friction

The 0B finding also creates a trust/review research question.

If an agent converts one natural instruction into several operations but the user must approve every operation independently, the product recreates the same interaction burden in a different form.

The next prototype should therefore test grouped, reversible actions:

```text
one creative instruction
        ↓
0..N typed operations
        ↓
one understandable change batch
        ↓
undo / inspect if needed
```

Clarification should be reserved for meaningful creative ambiguity or external/destructive effects, not ordinary model bookkeeping.

## Implications for current validation

The evidence now suggests:

- keep the existing Beat/Cue distinction until messy agent-mediated inputs prove it inadequate;
- preserve the canonical Narrative IR and source-evidence rules validated in 0A/0B;
- stop treating Story Wall, Outline, AV Script, and Paper/Radio Edit as mandatory or likely primary entry points;
- test a free-form text + conversation + media interaction before adding more structured controls;
- make interaction compression a first-class success criterion;
- make grouped undo/history part of the next agent-mediated spike;
- do not introduce a generic canvas or rich-text document as canonical project storage;
- keep Resolve downstream of normalized Salai state rather than letting conversational commands bypass product semantics.

See [`agent-mediated-authoring.md`](agent-mediated-authoring.md) and [`rfcs/0002-agent-mediated-authoring.md`](rfcs/0002-agent-mediated-authoring.md) for the proposed next validation direction.
