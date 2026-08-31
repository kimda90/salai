import { describe, expect, it } from "vitest";
import { SalaiController } from "../controller";
import type { AuthoringAdapter } from "./contract";
import { deterministicAuthoringAdapter } from "./deterministic-adapter";
import { parseAuthoringResult, runAuthoringTurn } from "./result";

function firstBeatId(controller: SalaiController): string {
  const id = Object.keys(controller.getSnapshot().project.beats)[0];
  if (!id) throw new Error("fixture has no Beats");
  return id;
}

describe("authoring pipeline", () => {
  it("runs deterministic input through a structured result and project-service batch", async () => {
    const controller = new SalaiController("product");
    const beatId = firstBeatId(controller);

    const execution = await runAuthoringTurn(
      controller,
      deterministicAuthoringAdapter,
      "A sharper opening",
    );

    expect(execution.applied).toBe(true);
    expect(execution.request.instruction).toBe("A sharper opening");
    expect(execution.request.context.activeSurface).toBe("outline");
    expect(execution.result.summary).toMatch(/Updated the first Beat/);
    expect(controller.getSnapshot().project.beats[beatId]?.title).toBe("A sharper opening");
    expect(controller.getSnapshot().feedback.changedIds).toContain(beatId);
  });

  it("does not mutate canonical state merely by holding working text", () => {
    const controller = new SalaiController("product");
    const before = controller.getSnapshot();
    const workingText = "This text exists only in the authoring surface";

    expect(workingText.length).toBeGreaterThan(0);
    expect(controller.getSnapshot()).toBe(before);
  });

  it("rejects malformed result envelopes before project mutation", async () => {
    const controller = new SalaiController("product");
    const beforeProject = controller.getSnapshot().project;
    const malformedAdapter: AuthoringAdapter = {
      async run() {
        return { summary: 42, operations: [] };
      },
    };

    await expect(
      runAuthoringTurn(controller, malformedAdapter, "Try something"),
    ).rejects.toThrow(/string summary/);
    expect(controller.getSnapshot().project).toBe(beforeProject);
  });

  it("rejects unknown operation vocabulary before project mutation", () => {
    expect(() =>
      parseAuthoringResult({
        summary: "Bad operation",
        operations: [{ op: "mutateAnything", path: "beats" }],
      }),
    ).toThrow(/unknown narrative operation/);
  });

  it("keeps the project unchanged when canonical validation rejects an operation", async () => {
    const controller = new SalaiController("product");
    const beforeProject = controller.getSnapshot().project;
    const invalidDomainAdapter: AuthoringAdapter = {
      async run() {
        return {
          summary: "Invalid update",
          operations: [
            {
              op: "updateBeat",
              beatId: "missing-beat",
              title: "Nope",
            },
          ],
        };
      },
    };

    await expect(
      runAuthoringTurn(controller, invalidDomainAdapter, "Do the invalid thing"),
    ).rejects.toThrow(/unknown Beat/);
    expect(controller.getSnapshot().project).toBe(beforeProject);
  });

  it("supports answer-only results without mutating the project", async () => {
    const controller = new SalaiController("product");
    const beforeProject = controller.getSnapshot().project;
    const answerAdapter: AuthoringAdapter = {
      async run() {
        return {
          summary: "Answered without a change.",
          answer: "There is nothing to apply yet.",
        };
      },
    };

    const execution = await runAuthoringTurn(
      controller,
      answerAdapter,
      "What should change?",
    );

    expect(execution.applied).toBe(false);
    expect(execution.result.answer).toBe("There is nothing to apply yet.");
    expect(controller.getSnapshot().project).toBe(beforeProject);
  });
});
