import { describe, expect, it, vi } from "vitest";
import { SalaiController } from "./controller";

function beatIds(controller: SalaiController): string[] {
  return Object.keys(controller.getSnapshot().project.beats);
}

function firstBeatId(controller: SalaiController): string {
  const id = beatIds(controller)[0];
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

  it("publishes one final state for a valid multi-operation batch", () => {
    const controller = new SalaiController("product");
    const [firstId, secondId] = beatIds(controller);
    if (!firstId || !secondId) throw new Error("fixture needs at least two Beats");
    const listener = vi.fn();
    controller.subscribe(listener);

    expect(
      controller.dispatchNarrativeBatch([
        { op: "updateBeat", beatId: firstId, title: "First batch update" },
        { op: "updateBeat", beatId: secondId, title: "Second batch update" },
      ]),
    ).toBe(true);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(controller.getSnapshot().project.beats[firstId]?.title).toBe("First batch update");
    expect(controller.getSnapshot().project.beats[secondId]?.title).toBe("Second batch update");
    expect(controller.getSnapshot().feedback.changedIds).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
  });

  it("does not publish partial canonical state when a later batch operation fails", () => {
    const controller = new SalaiController("product");
    const beatId = firstBeatId(controller);
    const before = controller.getSnapshot();
    const originalTitle = before.project.beats[beatId]?.title;

    const accepted = controller.dispatchNarrativeBatch([
      { op: "updateBeat", beatId, title: "Must not leak" },
      { op: "updateBeat", beatId: "missing-beat", title: "Nope" },
    ]);

    const after = controller.getSnapshot();
    expect(accepted).toBe(false);
    expect(after.project).toBe(before.project);
    expect(after.workspace).toBe(before.workspace);
    expect(after.project.beats[beatId]?.title).toBe(originalTitle);
    expect(after.feedback.error).toMatch(/unknown Beat/);
  });

  it("surfaces domain errors instead of mutating canonical state", () => {
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

  it("surfaces aggregated relationship effects and removed ids from batches", () => {
    const controller = new SalaiController("product");

    expect(
      controller.dispatchNarrativeBatch([{ op: "deleteCue", cueId: "cue_demo_wide" }]),
    ).toBe(true);

    expect(controller.getSnapshot().feedback.relationshipEffects).toContainEqual(
      expect.objectContaining({
        relationshipId: "rel_demo_wide",
        effect: "removed",
      }),
    );
    expect(controller.getSnapshot().feedback.removedIds).toContain("rel_demo_wide");
  });

  it("clears selection when a batch deletes the selected canonical object", () => {
    const controller = new SalaiController("product");
    const beatId = firstBeatId(controller);
    controller.select({ type: "beat", id: beatId });

    controller.dispatchNarrativeBatch([{ op: "deleteBeat", beatId }]);

    expect(controller.getSnapshot().selection).toBeNull();
  });

  it("synchronizes Story Wall membership once from the final batch result", () => {
    const controller = new SalaiController("product");
    const deletedBeatId = firstBeatId(controller);
    const sectionId = controller.getSnapshot().project.script.sectionIds[0];
    if (!sectionId) throw new Error("fixture has no Section");
    const newBeatId = "beat_batch_new";

    expect(controller.getSnapshot().workspace.board.items[`ref:beat:${deletedBeatId}`]).toBeDefined();

    expect(
      controller.dispatchNarrativeBatch([
        {
          op: "createBeat",
          beat: { id: newBeatId, title: "Created in batch", cueIds: [] },
          parent: { type: "section", id: sectionId },
        },
        { op: "deleteBeat", beatId: deletedBeatId },
      ]),
    ).toBe(true);

    const state = controller.getSnapshot();
    expect(state.workspace.board.items[`ref:beat:${deletedBeatId}`]).toBeUndefined();
    expect(state.workspace.board.items[`ref:beat:${newBeatId}`]).toBeDefined();
    expect(state.feedback.createdIds).toContain(newBeatId);
    expect(state.feedback.removedIds).toContain(deletedBeatId);
  });

  it("returns task-relevant project context without presentation state by default", () => {
    const controller = new SalaiController("product");
    controller.setSurface("story-wall");
    controller.select({ type: "beat", id: firstBeatId(controller) });

    const minimal = controller.getProjectContext();
    expect(minimal.project).toBe(controller.getSnapshot().project);
    expect(minimal).not.toHaveProperty("workspace");
    expect(minimal).not.toHaveProperty("activeSurface");
    expect(minimal).not.toHaveProperty("selection");
    expect(minimal).not.toHaveProperty("feedback");

    const expanded = controller.getProjectContext({
      includeWorkspace: true,
      includeActiveSurface: true,
    });
    expect(expanded.workspace).toBe(controller.getSnapshot().workspace);
    expect(expanded.activeSurface).toBe("story-wall");
  });
});
