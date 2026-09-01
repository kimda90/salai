import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { interpretSemanticTimelineDocumentChange } from "./semantic-timeline-edit";
import { toTimelineEditorDocument } from "./timeline-editor-adapter";
import { projectNarrativeToTimeline } from "./timeline-projection";

function cloneDocument<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("semantic timeline direct edit round trip", () => {
  it("publishes one canonical gesture, reprojects it, and reverts it in one step", () => {
    const controller = new SalaiController("semantic-editorial");
    const before = controller.getSnapshot().project;
    const beforeProjection = projectNarrativeToTimeline(before);
    const document = toTimelineEditorDocument(beforeProjection);
    const proposed = cloneDocument(document);
    const hook = proposed.tracks
      .flatMap((track) => track.items)
      .find((item) => item.id === "timeline:beat:beat-hook");
    if (!hook) throw new Error("Missing Beat item");
    hook.startMs = 8_000;

    const interpretation = interpretSemanticTimelineDocumentChange(before, document, proposed);
    expect(interpretation.kind).toBe("canonical");
    if (interpretation.kind !== "canonical") throw new Error("Expected canonical edit");

    expect(
      controller.dispatchNarrativeBatch(interpretation.operations, { revertible: true }),
    ).toBe(true);
    const edited = controller.getSnapshot();
    expect(edited.project.sections["section-problem"]?.childIds).toEqual([
      "beat-friction",
      "beat-hook",
    ]);
    expect(edited.canRevertMachineAction).toBe(true);

    const editedProjection = projectNarrativeToTimeline(edited.project);
    expect(
      editedProjection.tracks
        .find((track) => track.id === "semantic-beats")
        ?.items.slice(0, 2)
        .map((item) => item.salaiRef.id),
    ).toEqual(["beat-friction", "beat-hook"]);

    expect(controller.revertMachineAction()).toBe(true);
    const reverted = controller.getSnapshot();
    expect(reverted.project).toEqual(before);
    expect(reverted.canRevertMachineAction).toBe(false);
  });
});
