import { validateNarrativeProject } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { handleMachineCommand } from "./machine-interface";
import { SCRIPT_FIRST_SCENARIO } from "./script-first-scenario";

function createScenarioStory(controller: SalaiController) {
  return handleMachineCommand(controller, {
    command: "createStory",
    payload: SCRIPT_FIRST_SCENARIO.createStory,
  });
}

describe("0C.2 script-first scenario", () => {
  it("creates the representative rough-paragraph story in one machine action", () => {
    expect(SCRIPT_FIRST_SCENARIO.roughParagraph.length).toBeGreaterThan(0);
    const controller = new SalaiController("scratch");

    createScenarioStory(controller);

    const project = controller.getSnapshot().project;
    expect(validateNarrativeProject(project).valid).toBe(true);
    expect(project.script.sectionIds).toHaveLength(1);
    const sectionId = project.script.sectionIds[0];
    if (!sectionId) throw new Error("Missing created section");
    expect(project.sections[sectionId]?.title).toBe(SCRIPT_FIRST_SCENARIO.createStory.sectionTitle);

    const beatIds = project.sections[sectionId]?.childIds ?? [];
    expect(beatIds).toHaveLength(3);
    expect(beatIds.map((id) => project.beats[id]?.title)).toEqual(
      SCRIPT_FIRST_SCENARIO.createStory.beats.map((beat) => beat.title),
    );
  });

  it("revises the created story through ordinary canonical operations and preserves identity", () => {
    const controller = new SalaiController("scratch");
    createScenarioStory(controller);
    const before = controller.getSnapshot().project;
    const sectionId = before.script.sectionIds[0];
    if (!sectionId) throw new Error("Missing created section");
    const [frictionId, workflowId, payoffId] = before.sections[sectionId]?.childIds ?? [];
    if (!frictionId || !workflowId || !payoffId) throw new Error("Missing created Beats");

    expect(SCRIPT_FIRST_SCENARIO.revisionInstruction.length).toBeGreaterThan(0);
    handleMachineCommand(controller, {
      command: "apply",
      payload: [
        {
          op: "updateBeat",
          beatId: payoffId,
          title: SCRIPT_FIRST_SCENARIO.revisedPayoff.title,
          summary: SCRIPT_FIRST_SCENARIO.revisedPayoff.summary,
        },
        {
          op: "moveBeat",
          beatId: payoffId,
          toParent: { type: "section", id: sectionId },
          toIndex: 1,
        },
      ],
    });

    const after = controller.getSnapshot().project;
    expect(after.sections[sectionId]?.childIds).toEqual([frictionId, payoffId, workflowId]);
    expect(after.beats[payoffId]).toMatchObject(SCRIPT_FIRST_SCENARIO.revisedPayoff);
    expect(Object.keys(after.beats).sort()).toEqual(Object.keys(before.beats).sort());
  });

  it("rejects malformed creation before mutation", () => {
    const controller = new SalaiController("scratch");
    const before = controller.getSnapshot().project;

    expect(() =>
      handleMachineCommand(controller, {
        command: "createStory",
        payload: { sectionTitle: "Invalid", beats: [{ title: 42 }] },
      }),
    ).toThrow(/title must be a string/);

    expect(controller.getSnapshot().project).toBe(before);
  });

  it("publishes no partial revision when one operation is invalid", () => {
    const controller = new SalaiController("scratch");
    createScenarioStory(controller);
    const before = controller.getSnapshot().project;
    const beatId = Object.keys(before.beats)[0];
    if (!beatId) throw new Error("Missing created Beat");

    expect(() =>
      handleMachineCommand(controller, {
        command: "apply",
        payload: [
          { op: "updateBeat", beatId, title: "Would be valid" },
          { op: "updateBeat", beatId: "missing-beat", title: "Invalid" },
        ],
      }),
    ).toThrow(/unknown Beat/);

    expect(controller.getSnapshot().project).toBe(before);
  });
});
