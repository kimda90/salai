import { describe, expect, it } from "vitest";
import { applyOperation, createProductVideoFixture } from "./index.js";

describe("splitBeat relationship policies", () => {
  it("supports explicit manual assignment per Beat-level relationship", () => {
    let project = createProductVideoFixture();
    project = applyOperation(project, {
      op: "linkShotIntent",
      relationshipId: "rel_demo_beat_shot",
      sourceId: "beat_demo",
      shotIntentId: "shot_demo_wide",
    }).model;
    project.mediaSegments.demo_reference = {
      id: "demo_reference",
      sourceInMs: 0,
      sourceOutMs: 10_000,
    };
    project = applyOperation(project, {
      op: "linkMediaSegment",
      relationshipId: "rel_demo_beat_media",
      sourceId: "beat_demo",
      mediaSegmentId: "demo_reference",
    }).model;

    const split = applyOperation(project, {
      op: "splitBeat",
      beatId: "beat_demo",
      newBeatId: "beat_demo_tail",
      leftCueIds: ["cue_demo_wide"],
      rightCueIds: ["cue_demo_connector", "cue_demo_ui"],
      relationshipPolicy: "manual",
      relationshipAssignments: {
        rel_demo_beat_shot: { side: "left" },
        rel_demo_beat_media: {
          side: "both",
          duplicateRelationshipId: "rel_demo_tail_media",
        },
      },
    }).model;

    expect(split.relationships.rel_demo_beat_shot?.sourceId).toBe("beat_demo");
    expect(split.relationships.rel_demo_beat_media?.sourceId).toBe("beat_demo");
    expect(split.relationships.rel_demo_tail_media).toEqual({
      id: "rel_demo_tail_media",
      sourceId: "beat_demo_tail",
      targetId: "demo_reference",
      type: "supported_by_media",
    });
  });
});
