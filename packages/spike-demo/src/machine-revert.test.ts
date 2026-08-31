import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { handleMachineCommand } from "./machine-interface";
import { moveBoardItem } from "./workspace";

function firstBeatId(controller: SalaiController): string {
  const beatId = Object.keys(controller.getSnapshot().project.beats)[0];
  if (!beatId) throw new Error("Fixture has no Beat");
  return beatId;
}

function applyMachineTitle(controller: SalaiController, title: string) {
  const beatId = firstBeatId(controller);
  handleMachineCommand(controller, {
    command: "apply",
    payload: [{ op: "updateBeat", beatId, title }],
  });
  return beatId;
}

describe("0C.3 immediate machine-action revert", () => {
  it("restores the exact pre-action project and Workspace", () => {
    const controller = new SalaiController("product");
    const beforeProject = controller.getSnapshot().project;
    const beforeWorkspace = controller.getSnapshot().workspace;

    applyMachineTitle(controller, "Machine revision");
    expect(controller.getSnapshot().canRevertMachineAction).toBe(true);

    expect(controller.revertMachineAction()).toBe(true);
    expect(controller.getSnapshot().project).toBe(beforeProject);
    expect(controller.getSnapshot().workspace).toBe(beforeWorkspace);
    expect(controller.getSnapshot().canRevertMachineAction).toBe(false);
    expect(controller.revertMachineAction()).toBe(false);
  });

  it("invalidates the snapshot after a later direct narrative edit", () => {
    const controller = new SalaiController("product");
    const beatId = applyMachineTitle(controller, "Machine revision");

    expect(
      controller.dispatchNarrative({
        op: "updateBeat",
        beatId,
        summary: "Direct lens revision",
      }),
    ).toBe(true);

    expect(controller.getSnapshot().canRevertMachineAction).toBe(false);
    expect(controller.revertMachineAction()).toBe(false);
    expect(controller.getSnapshot().project.beats[beatId]?.summary).toBe("Direct lens revision");
  });

  it("invalidates the snapshot after a Workspace-only edit", () => {
    const controller = new SalaiController("product");
    applyMachineTitle(controller, "Machine revision");
    const itemId = controller.getSnapshot().workspace.board.itemIds[0];
    if (!itemId) throw new Error("Fixture has no Story Wall item");

    controller.updateWorkspace((workspace) => moveBoardItem(workspace, itemId, 999, 777));

    expect(controller.getSnapshot().canRevertMachineAction).toBe(false);
    expect(controller.revertMachineAction()).toBe(false);
    expect(controller.getSnapshot().workspace.board.items[itemId]).toMatchObject({ x: 999, y: 777 });
  });

  it("does not create or destroy revert state for a failed machine batch", () => {
    const controller = new SalaiController("product");
    const beatId = applyMachineTitle(controller, "Revertible machine revision");
    const afterSuccessfulMachineAction = controller.getSnapshot().project;

    expect(() =>
      handleMachineCommand(controller, {
        command: "apply",
        payload: [
          { op: "updateBeat", beatId, summary: "Would be valid" },
          { op: "updateBeat", beatId: "missing-beat", summary: "Invalid" },
        ],
      }),
    ).toThrow(/unknown Beat/);

    expect(controller.getSnapshot().project).toBe(afterSuccessfulMachineAction);
    expect(controller.getSnapshot().canRevertMachineAction).toBe(true);
    expect(controller.revertMachineAction()).toBe(true);
  });
});
