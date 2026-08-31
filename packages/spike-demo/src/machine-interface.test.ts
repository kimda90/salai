import { describe, expect, it, vi } from "vitest";
import { SalaiController } from "./controller";
import { handleMachineCommand, parseNarrativeOperationBatch } from "./machine-interface";

function firstBeatId(controller: SalaiController): string {
  const id = Object.keys(controller.getSnapshot().project.beats)[0];
  if (!id) throw new Error("fixture has no Beat");
  return id;
}

describe("machine command surface", () => {
  it("returns current project, Workspace, and active lens context", () => {
    const controller = new SalaiController("product");
    const result = handleMachineCommand(controller, { command: "context" });

    expect(result).toMatchObject({
      project: controller.getSnapshot().project,
      workspace: controller.getSnapshot().workspace,
      activeSurface: "outline",
    });
  });

  it("applies a machine batch through the shared project service with one publish", () => {
    const controller = new SalaiController("product");
    const beatId = firstBeatId(controller);
    const listener = vi.fn();
    controller.subscribe(listener);

    const result = handleMachineCommand(controller, {
      command: "apply",
      payload: [
        { op: "updateBeat", beatId, title: "Machine-updated Beat" },
        { op: "updateBeat", beatId, summary: "Applied as one batch" },
      ],
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(controller.getSnapshot().project.beats[beatId]).toMatchObject({
      title: "Machine-updated Beat",
      summary: "Applied as one batch",
    });
    expect(result).toMatchObject({ feedback: { changedIds: [beatId], error: null } });
  });

  it("leaves live state unchanged when a machine batch is rejected", () => {
    const controller = new SalaiController("product");
    const before = controller.getSnapshot().project;

    expect(() =>
      handleMachineCommand(controller, {
        command: "apply",
        payload: [
          { op: "updateBeat", beatId: firstBeatId(controller), title: "Would be valid" },
          { op: "updateBeat", beatId: "missing-beat", title: "Invalid" },
        ],
      }),
    ).toThrow(/unknown Beat/);

    expect(controller.getSnapshot().project).toBe(before);
  });

  it("rejects malformed or empty machine payloads before canonical mutation", () => {
    expect(() => parseNarrativeOperationBatch({})).toThrow(/non-empty operation array/);
    expect(() => parseNarrativeOperationBatch([])).toThrow(/non-empty operation array/);
    expect(() => parseNarrativeOperationBatch([{ op: "doAnything" }])).toThrow(
      /unknown narrative operation/,
    );
  });

  it("keeps createStory limited to an empty story", () => {
    const controller = new SalaiController("product");
    const before = controller.getSnapshot().project;

    expect(() =>
      handleMachineCommand(controller, {
        command: "createStory",
        payload: { beats: [{ title: "Another story" }] },
      }),
    ).toThrow(/requires an empty story/);

    expect(controller.getSnapshot().project).toBe(before);
  });
});
