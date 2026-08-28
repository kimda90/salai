import { validateNarrativeProject } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { getDurationEstimate, orderedBeatRefs } from "./model-utils";
import { orderedPaperAudioItems } from "./paper-edit-utils";
import {
  boardItemIdForReference,
  moveBoardItem,
  setBoardItemParking,
} from "./workspace";

const SURFACES = ["story-wall", "outline", "av-script", "paper-edit", "story-wall"] as const;

function expectValid(controller: SalaiController): void {
  expect(validateNarrativeProject(controller.getSnapshot().project)).toMatchObject({ valid: true });
}

function projectJson(controller: SalaiController): string {
  return JSON.stringify(controller.getSnapshot().project);
}

describe("Spike 0B cross-surface acceptance", () => {
  it("uses one project continuously across all four surfaces while preserving selection and Workspace layout", () => {
    const controller = new SalaiController("product");
    const beatId = "beat_hook";
    const itemId = boardItemIdForReference({ type: "beat", id: beatId });
    const originalProject = controller.getSnapshot().project;

    controller.select({ type: "beat", id: beatId });
    controller.updateWorkspace((workspace) => moveBoardItem(workspace, itemId, 321, 654));

    expect(controller.getSnapshot().project).toBe(originalProject);
    expect(controller.getSnapshot().workspace.board.items[itemId]).toMatchObject({
      x: 321,
      y: 654,
    });

    for (const surface of SURFACES) {
      controller.setSurface(surface);
      expect(controller.getSnapshot().activeSurface).toBe(surface);
      expect(controller.getSnapshot().selection).toEqual({ type: "beat", id: beatId });
    }

    expect(
      controller.dispatchNarrative({
        op: "updateBeat",
        beatId,
        title: "Cross-surface hook",
      }),
    ).toBe(true);

    expect(controller.getSnapshot().project.beats[beatId]?.title).toBe("Cross-surface hook");
    expect(orderedBeatRefs(controller.getSnapshot().project).some((ref) => ref.beatId === beatId)).toBe(true);
    expect(controller.getSnapshot().workspace.board.items[itemId]).toMatchObject({
      x: 321,
      y: 654,
    });
    expectValid(controller);
  });

  it("keeps Workspace-only movement and parking outside Narrative IR, while deletion removes the canonical card", () => {
    const controller = new SalaiController("product");
    const beatId = "beat_hook";
    const itemId = boardItemIdForReference({ type: "beat", id: beatId });
    const before = projectJson(controller);

    controller.updateWorkspace((workspace) => moveBoardItem(workspace, itemId, 111, 222));
    controller.updateWorkspace((workspace) => setBoardItemParking(workspace, itemId, "parked"));

    expect(projectJson(controller)).toBe(before);
    expect(controller.getSnapshot().project.beats[beatId]).toBeDefined();
    expect(controller.getSnapshot().workspace.board.items[itemId]?.parkingState).toBe("parked");

    expect(controller.dispatchNarrative({ op: "deleteBeat", beatId })).toBe(true);
    expect(controller.getSnapshot().project.beats[beatId]).toBeUndefined();
    expect(controller.getSnapshot().workspace.board.items[itemId]).toBeUndefined();
    expectValid(controller);
  });

  it("preserves unrelated Workspace organization through narrative membership changes", () => {
    const controller = new SalaiController("product");
    const hookItemId = boardItemIdForReference({ type: "beat", id: "beat_hook" });

    controller.updateWorkspace((workspace) => moveBoardItem(workspace, hookItemId, 444, 555));
    expect(
      controller.dispatchNarrative({
        op: "createScene",
        sectionId: "section_product",
        scene: { id: "scene_validation", title: "Validation scene", beatIds: [] },
      }),
    ).toBe(true);

    expect(controller.getSnapshot().workspace.board.items[hookItemId]).toMatchObject({
      x: 444,
      y: 555,
    });
    expect(
      controller.getSnapshot().workspace.board.items[
        boardItemIdForReference({ type: "scene", id: "scene_validation" })
      ],
    ).toBeDefined();
    expectValid(controller);
  });

  it("preserves SourceExcerpt identity and ranges while authored material remains independently editable", () => {
    const controller = new SalaiController("interview");
    const sourceBefore = controller.getSnapshot().project.blocks.quote_maria;
    const authoredBefore = controller.getSnapshot().project.blocks.vo_bridge;
    if (sourceBefore?.type !== "source_excerpt") throw new Error("fixture source excerpt missing");
    if (authoredBefore?.type !== "authored_speech") throw new Error("fixture authored bridge missing");

    expect(
      controller.dispatchNarrative({
        op: "moveBlock",
        blockId: sourceBefore.id,
        toCueId: "cue_juan",
        toIndex: 1,
      }),
    ).toBe(true);

    const sourceAfter = controller.getSnapshot().project.blocks.quote_maria;
    expect(sourceAfter).toEqual(sourceBefore);
    expect(controller.getSnapshot().project.cues.cue_juan?.audioBlockIds).toContain(sourceBefore.id);

    expect(
      controller.dispatchNarrative({
        op: "updateBlock",
        block: { ...authoredBefore, text: "A revised authored bridge." },
      }),
    ).toBe(true);

    expect(controller.getSnapshot().project.blocks.vo_bridge).toMatchObject({
      type: "authored_speech",
      text: "A revised authored bridge.",
    });
    expect(controller.getSnapshot().project.blocks.quote_maria).toEqual(sourceBefore);
    expect(orderedPaperAudioItems(controller.getSnapshot().project).map((item) => item.blockId)).toContain(
      sourceBefore.id,
    );
    expectValid(controller);
  });

  it("keeps runtime derivation consistent after a Cue duration edit", () => {
    const controller = new SalaiController("product");
    const before = getDurationEstimate(controller.getSnapshot().project).scriptMs;

    expect(
      controller.dispatchNarrative({
        op: "updateCue",
        cueId: "cue_demo_wide",
        explicitDurationMs: 6_000,
      }),
    ).toBe(true);

    const after = getDurationEstimate(controller.getSnapshot().project).scriptMs;
    expect(after).toBe(before + 2_000);
    expectValid(controller);
  });

  it.each(["product", "interview", "documentary"] as const)(
    "runs the %s fixture through the shared surface/controller boundary",
    (fixture) => {
      const controller = new SalaiController(fixture);
      const projectId = controller.getSnapshot().project.script.id;

      for (const surface of SURFACES) {
        controller.setSurface(surface);
        expect(controller.getSnapshot().project.script.id).toBe(projectId);
        expect(orderedBeatRefs(controller.getSnapshot().project).length).toBeGreaterThan(0);
        expectValid(controller);
      }
    },
  );
});
