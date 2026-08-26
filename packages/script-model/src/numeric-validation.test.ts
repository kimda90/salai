import { describe, expect, it } from "vitest";
import {
  createInterviewFixture,
  createProductVideoFixture,
  validateNarrativeProject,
} from "./index.js";

describe("numeric validation", () => {
  it("rejects non-finite target and Cue durations", () => {
    const project = createProductVideoFixture();
    project.script.targetDurationMs = Number.NaN;
    project.cues.cue_demo_wide!.explicitDurationMs = Number.POSITIVE_INFINITY;

    const result = validateNarrativeProject(project);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["invalid_duration"]),
    );
  });

  it("rejects non-finite MediaSegment and SourceExcerpt ranges", () => {
    const project = createInterviewFixture();
    project.mediaSegments.interview_juan!.sourceOutMs = Number.POSITIVE_INFINITY;
    const quote = project.blocks.quote_maria;
    if (quote?.type !== "source_excerpt") throw new Error("expected SourceExcerpt");
    quote.sourceInMs = Number.NaN;

    const result = validateNarrativeProject(project);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["invalid_media_range", "invalid_source_range"]),
    );
  });
});
