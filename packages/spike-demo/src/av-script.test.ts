import {
  applyOperation,
  createInterviewFixture,
  createProductVideoFixture,
  estimateNarrativeDuration,
} from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { blockDisplayText, isSourceEvidence, orderedBeatRefs, sourceRangeLabel } from "./av-script-utils";

describe("AV Script projection", () => {
  it("preserves narrative Beat order while exposing multiple Cues", () => {
    const project = createProductVideoFixture();
    const refs = orderedBeatRefs(project);
    expect(refs.map((ref) => ref.beatId)).toEqual([
      "beat_hook",
      "beat_problem",
      "beat_demo",
      "beat_benefit",
      "beat_cta",
    ]);
    expect(project.beats.beat_demo?.cueIds).toEqual([
      "cue_demo_wide",
      "cue_demo_connector",
      "cue_demo_ui",
    ]);
  });

  it("keeps SourceExcerpt blocks identifiable as immutable source evidence", () => {
    const project = createInterviewFixture();
    const block = project.blocks.quote_maria!;
    expect(isSourceEvidence(block)).toBe(true);
    expect(blockDisplayText(block)).toContain("two days");
    expect(sourceRangeLabel(block)).toBe("10.0s–37.0s");
    expect(block.type).toBe("source_excerpt");
    if (block.type === "source_excerpt") {
      expect(block.mediaSegmentId).toBe("interview_maria");
    }
  });

  it("moves Cue identity between Beats without recreating the Cue", () => {
    const project = createProductVideoFixture();
    const before = project.cues.cue_demo_ui;
    const result = applyOperation(project, {
      op: "moveCue",
      cueId: "cue_demo_ui",
      toBeatId: "beat_benefit",
      toIndex: 0,
    });
    expect(result.model.cues.cue_demo_ui?.id).toBe(before?.id);
    expect(result.model.beats.beat_demo?.cueIds).not.toContain("cue_demo_ui");
    expect(result.model.beats.beat_benefit?.cueIds[0]).toBe("cue_demo_ui");
  });

  it("updates runtime immediately when explicit Cue duration changes", () => {
    const project = createProductVideoFixture();
    const before = estimateNarrativeDuration(project, { visualHoldMs: 2000 }).scriptMs;
    const result = applyOperation(project, {
      op: "updateCue",
      cueId: "cue_demo_wide",
      explicitDurationMs: 10_000,
    });
    const after = estimateNarrativeDuration(result.model, { visualHoldMs: 2000 }).scriptMs;
    expect(after).toBeGreaterThan(before);
  });
});
