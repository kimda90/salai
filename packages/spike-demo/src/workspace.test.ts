import { createProductVideoFixture } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import {
  addBoardReference,
  createIdeaCard,
  createWorkspace,
  moveBoardItem,
  setBoardItemParking,
  updateIdeaCardText,
} from "./workspace";

describe("Workspace model", () => {
  it("keeps free spatial movement separate from Narrative IR", () => {
    const project = createProductVideoFixture();
    const projectJson = JSON.stringify(project);
    const beatId = Object.keys(project.beats)[0]!;
    let workspace = createWorkspace();
    workspace = addBoardReference(
      workspace,
      "item-1",
      { type: "beat", id: beatId },
      { x: 20, y: 30 },
    );
    workspace = moveBoardItem(workspace, "item-1", 120, 180);

    expect(workspace.board.items["item-1"]?.x).toBe(120);
    expect(workspace.board.items["item-1"]?.y).toBe(180);
    expect(JSON.stringify(project)).toBe(projectJson);
  });

  it("keeps parking distinct from deletion", () => {
    let workspace = createWorkspace();
    workspace = addBoardReference(workspace, "item-1", {
      type: "beat",
      id: "beat-1",
    });
    workspace = setBoardItemParking(workspace, "item-1", "parked");

    expect(workspace.board.items["item-1"]?.parkingState).toBe("parked");
    expect(workspace.board.itemIds).toContain("item-1");
  });

  it("keeps IdeaCards workspace-only", () => {
    let workspace = createWorkspace();
    workspace = createIdeaCard(workspace, "idea-item", {
      id: "idea-1",
      text: "Maybe start colder",
    });
    workspace = updateIdeaCardText(workspace, "idea-item", "Try a cold open");

    expect(workspace.board.items["idea-item"]?.ideaCard?.text).toBe("Try a cold open");
    expect(workspace.board.items["idea-item"]?.reference).toBeUndefined();
  });
});
