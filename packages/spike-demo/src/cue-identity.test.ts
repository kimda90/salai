import { validateNarrativeProject } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";

describe("Cue identity across surfaces", () => {
  it("preserves Cue identity, selection, and content through a cross-Beat move", () => {
    const controller = new SalaiController("product");
    const cueId = "cue_demo_connector";
    const before = controller.getSnapshot().project.cues[cueId];
    if (!before) throw new Error("fixture Cue missing");

    controller.select({ type: "cue", id: cueId });
    for (const surface of ["av-script", "paper-edit", "story-wall", "outline"] as const) {
      controller.setSurface(surface);
      expect(controller.getSnapshot().selection).toEqual({ type: "cue", id: cueId });
    }

    expect(
      controller.dispatchNarrative({
        op: "moveCue",
        cueId,
        toBeatId: "beat_benefit",
        toIndex: 1,
      }),
    ).toBe(true);

    expect(controller.getSnapshot().project.cues[cueId]).toEqual(before);
    expect(controller.getSnapshot().project.beats.beat_demo?.cueIds).not.toContain(cueId);
    expect(controller.getSnapshot().project.beats.beat_benefit?.cueIds).toContain(cueId);
    expect(controller.getSnapshot().selection).toEqual({ type: "cue", id: cueId });
    expect(validateNarrativeProject(controller.getSnapshot().project).valid).toBe(true);
  });
});
