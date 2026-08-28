import { createInterviewFixture, createProductVideoFixture } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { formatDuration, getDurationEstimate, orderedBeatRefs } from "./model-utils";

describe("model utilities", () => {
  it("formats rounded minute boundaries without producing an invalid :60 remainder", () => {
    expect(formatDuration(59_949)).toBe("59.9s");
    expect(formatDuration(59_999)).toBe("60.0s");
    expect(formatDuration(60_000)).toBe("1:00");
    expect(formatDuration(119_999)).toBe("2:00");
  });

  it("preserves canonical beat order across direct and scene-contained beats", () => {
    const project = createInterviewFixture();
    const refs = orderedBeatRefs(project);

    expect(refs.length).toBe(Object.keys(project.beats).length);
    expect(new Set(refs.map((ref) => ref.beatId)).size).toBe(refs.length);
    for (const ref of refs) {
      expect(project.beats[ref.beatId]).toBeDefined();
      expect(project.sections[ref.sectionId]).toBeDefined();
      if (ref.sceneId) expect(project.scenes[ref.sceneId]?.beatIds).toContain(ref.beatId);
    }
  });

  it("caches duration estimates for the same immutable project identity", () => {
    const project = createProductVideoFixture();

    expect(getDurationEstimate(project)).toBe(getDurationEstimate(project));
  });
});
