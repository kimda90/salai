import { applyOperation, createProductVideoFixture } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import {
  createIdeaCard,
  createStoryWallWorkspace,
  syncWorkspaceWithProject,
} from "./workspace";

describe("Story Wall semantics", () => {
  it("keeps structural movement on the Narrative operation path", () => {
    const controller = new SalaiController("product");
    const project = controller.getSnapshot().project;
    const sectionId = project.script.sectionIds[0]!;
    const beatId = project.sections[sectionId]!.childIds[1]!;

    const accepted = controller.dispatchNarrative({
      op: "moveBeat",
      beatId,
      toParent: { type: "section", id: sectionId },
      toIndex: 0,
    });

    expect(accepted).toBe(true);
    expect(controller.getSnapshot().project.sections[sectionId]?.childIds[0]).toBe(
      beatId,
    );
    expect(controller.getSnapshot().project.beats[beatId]?.id).toBe(beatId);
  });

  it("preserves BoardItem identity when an IdeaCard is promoted to a Beat", () => {
    const controller = new SalaiController("product");
    const sectionId = controller.getSnapshot().project.script.sectionIds[0]!;
    const itemId = "idea-item-test";
    controller.updateWorkspace((workspace) =>
      createIdeaCard(
        workspace,
        itemId,
        { id: "idea-test", text: "Cold open with the finished result" },
        { x: 77, y: 91 },
      ),
    );

    const beatCountBefore = Object.keys(controller.getSnapshot().project.beats).length;
    const beatId = controller.promoteIdeaCardToBeat(itemId, {
      type: "section",
      id: sectionId,
    });

    expect(beatId).not.toBeNull();
    expect(Object.keys(controller.getSnapshot().project.beats)).toHaveLength(
      beatCountBefore + 1,
    );
    const item = controller.getSnapshot().workspace.board.items[itemId];
    expect(item?.id).toBe(itemId);
    expect(item?.ideaCard).toBeUndefined();
    expect(item?.reference).toEqual({ type: "beat", id: beatId });
    expect(item?.x).toBe(77);
    expect(item?.y).toBe(91);

    const matchingItems = controller.getSnapshot().workspace.board.itemIds.filter((id) => {
      const reference = controller.getSnapshot().workspace.board.items[id]?.reference;
      return reference?.type === "beat" && reference.id === beatId;
    });
    expect(matchingItems).toEqual([itemId]);
  });

  it("syncs canonical additions without disturbing existing board positions", () => {
    const project = createProductVideoFixture();
    const beatId = project.sections[project.script.sectionIds[0]!]!.childIds[0]!;
    let workspace = createStoryWallWorkspace(project);
    const itemId = `ref:beat:${beatId}`;
    workspace = {
      ...workspace,
      board: {
        ...workspace.board,
        items: {
          ...workspace.board.items,
          [itemId]: { ...workspace.board.items[itemId]!, x: 401, y: 219 },
        },
      },
    };

    const result = applyOperation(project, {
      op: "createBeat",
      beat: { id: "beat_added_from_test", title: "Added", cueIds: [] },
      parent: { type: "section", id: project.script.sectionIds[0]! },
    });
    workspace = syncWorkspaceWithProject(workspace, result.model);

    expect(workspace.board.items[itemId]?.x).toBe(401);
    expect(workspace.board.items[itemId]?.y).toBe(219);
    expect(workspace.board.items["ref:beat:beat_added_from_test"]?.reference).toEqual({
      type: "beat",
      id: "beat_added_from_test",
    });
  });
});
