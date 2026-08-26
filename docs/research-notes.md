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

The existing Story Wall / workspace parking-lot concept should preserve this behavior: rejected or uncertain material can stay visible and retrievable while being clearly outside the active narrative order.

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

This is a concrete product opportunity, but not part of Narrative IR Spike 0A.

## Shelved research idea — mixed-media spatial canvas

A future research direction is a PureRef-like freeform workspace where users can place:

- text fragments;
- images;
- video clips or excerpts;
- story cards;
- references;
- generated/previs material;

and optionally express relationships between them spatially or with links/arrows.

Potentially, sufficiently structured arrangements could inform or generate projections such as a script, paper edit, previs, or timeline.

This idea is intentionally **shelved rather than committed**. The immediate product should first validate the Narrative IR and familiar workflow surfaces. The canvas should only be promoted if it solves a demonstrated workflow problem better than Story Wall, Paper Edit, AV Script, and related established paradigms.

## Implications for current validation

These observations should pressure-test the product without expanding Spike 0A unnecessarily:

- fixtures should allow one Beat to require several Cues;
- Spike 0A should not add another semantic level below Cue without evidence;
- structural removal should not imply deletion of linked production/source material;
- later workspaces should support visible parking/recovery of alternatives;
- previs should remain a later feedback-loop experiment;
- the mixed-media canvas remains a research item, not a foundational architecture assumption.
