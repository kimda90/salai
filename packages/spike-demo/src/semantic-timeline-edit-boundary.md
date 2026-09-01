# Semantic timeline edit boundary

Spike 0D.3 treats the third-party timeline document as a gesture proposal, never as project state.

Accepted committed gestures:

- Beat temporal move → canonical `moveBeat` within its current simple parent.
- Cue temporal move → canonical `moveCue` within its current Beat.
- SourceExcerpt edge resize → atomic `trimSourceExcerpt` + `updateCue` duration.

Rejected engine-only changes include media placement, missing-coverage movement, Section timing, item creation/deletion, multi-item ripple/push results, and non-temporal item mutation.

After an accepted gesture, Salai publishes the canonical operation batch and immediately rebuilds both timeline-editor and Elah playback projections from the new Narrative IR. The proposed timeline-editor document is never retained.
