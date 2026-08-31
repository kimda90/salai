import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { handleMachineCommand } from "./machine-interface";
import { orderedBeatRefs } from "./model-utils";
import { orderedPaperAudioItems } from "./paper-edit-utils";
import { boardItemIdForReference, moveBoardItem } from "./workspace";

function projectJson(controller: SalaiController): string {
  return JSON.stringify(controller.getSnapshot().project);
}

describe("0C.5 machine and Narrative Lens round trip", () => {
  it("projects one machine normalization through all existing lenses from canonical state", () => {
    const controller = new SalaiController("interview");

    handleMachineCommand(controller, {
      command: "apply",
      payload: [
        {
          op: "updateBeat",
          beatId: "beat_turn",
          title: "The process becomes visible",
        },
        {
          op: "moveCue",
          cueId: "cue_juan",
          toBeatId: "beat_turn",
          toIndex: 0,
        },
      ],
    });

    const { project, workspace } = controller.getSnapshot();

    expect(orderedBeatRefs(project).map((ref) => ref.beatId)).toEqual([
      "beat_manual",
      "beat_turn",
      "beat_result",
    ]);
    expect(project.beats.beat_turn?.title).toBe("The process becomes visible");

    const wallItemId = boardItemIdForReference({ type: "beat", id: "beat_turn" });
    expect(workspace.board.items[wallItemId]?.reference).toEqual({
      type: "beat",
      id: "beat_turn",
    });
    expect(workspace.board.items[wallItemId]).not.toHaveProperty("title");

    expect(project.beats.beat_turn?.cueIds).toEqual(["cue_juan", "cue_bridge"]);
    expect(
      orderedPaperAudioItems(project)
        .filter((item) => item.beatId === "beat_turn")
        .map((item) => item.blockId),
    ).toEqual(["quote_juan", "vo_bridge"]);
  });

  it("keeps Story Wall-only organization out of Narrative IR while exposing Workspace context", () => {
    const controller = new SalaiController("interview");

    handleMachineCommand(controller, {
      command: "apply",
      payload: [
        {
          op: "updateBeat",
          beatId: "beat_turn",
          title: "Machine-normalized turning point",
        },
      ],
    });

    const beforeWorkspaceEdit = projectJson(controller);
    const itemId = boardItemIdForReference({ type: "beat", id: "beat_turn" });
    controller.updateWorkspace((workspace) => moveBoardItem(workspace, itemId, 713, 421));

    expect(projectJson(controller)).toBe(beforeWorkspaceEdit);

    const context = handleMachineCommand(controller, { command: "context" }) as ReturnType<
      SalaiController["getProjectContext"]
    >;
    expect(context.project.beats.beat_turn?.title).toBe("Machine-normalized turning point");
    expect(context.workspace?.board.items[itemId]).toMatchObject({ x: 713, y: 421 });
  });
});
