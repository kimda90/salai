import { describe, expect, it, vi } from "vitest";
import { SalaiController } from "./controller";

function firstBeatId(controller: SalaiController): string {
  const id = Object.keys(controller.getSnapshot().project.beats)[0];
  if (!id) throw new Error("fixture has no Beats");
  return id;
}

describe("SalaiController", () => {
  it("loads and resets deterministic fixtures", () => {
    const controller = new SalaiController("product");
    const original = controller.getSnapshot().project;
    const beatId = firstBeatId(controller);
    const originalTitle = original.beats[beatId]?.title;

    expect(
      controller.dispatchNarrative({
        op: "updateBeat",
        beatId,
        title: "Changed in UI",
        summary: original.beats[beatId]?.summary ?? null,
      }),
    ).toBe(true);
    expect(controller.getSnapshot().project.beats[beatId]?.title).toBe("Changed in UI");

    controller.resetFixture();
    expect(controller.getSnapshot().project.beats[beatId]?.title).toBe(originalTitle);
  });

  it("publishes one canonical operation result to every subscriber", () => {
    const controller = new SalaiController("product");
    const listenerA = vi.fn();
    const listenerB = vi.fn();
    controller.subscribe(listenerA);
    controller.subscribe(listenerB);
    const beatId = firstBeatId(controller);

    controller.dispatchNarrative({
      op: "updateBeat",
      beatId,
      title: "Shared update",
      summary: controller.getSnapshot().project.beats[beatId]?.summary ?? null,
    });

    expect(listenerA).toHaveBeenCalledTimes(1);
    expect(listenerB).toHaveBeenCalledTimes(1);
    expect(controller.getSnapshot().project.beats[beatId]?.title).toBe("Shared update");
    expect(controller.getSnapshot().feedback.changedIds).toContain(beatId);
  });

  it("surfaces domain errors instead of mutating UI-only state", () => {
    const controller = new SalaiController("product");
    const before = controller.getSnapshot().project;

    const accepted = controller.dispatchNarrative({
      op: "updateBeat",
      beatId: "missing-beat",
      title: "Nope",
      summary: null,
    });

    expect(accepted).toBe(false);
    expect(controller.getSnapshot().project).toBe(before);
    expect(controller.getSnapshot().feedback.error).toMatch(/unknown Beat/);
  });

  it("clears selection when the selected canonical object is deleted", () => {
    const controller = new SalaiController("product");
    const beatId = firstBeatId(controller);
    controller.select({ type: "beat", id: beatId });

    controller.dispatchNarrative({ op: "deleteBeat", beatId });

    expect(controller.getSnapshot().selection).toBeNull();
  });
});
