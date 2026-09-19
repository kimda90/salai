import { deserializeNarrativeProject, serializeNarrativeProject, validateNarrativeProject, type NarrativeOperation } from "@salai/script-model";
import { describe, expect, it, vi } from "vitest";
import { SalaiController } from "./controller";
import { describeProjectChanges, filmMoments, type DirectionProposalInput } from "./film-direction";
import { FILMMAKING_MEDIA, createFilmmakingFixture } from "./filmmaking-fixture";
import { handleMachineCommand } from "./machine-interface";
import { toElahProject } from "./elah-adapter";
import { resolveSemanticAssemblyAtMs } from "./semantic-playback-model";
import { projectNarrativeToTimeline } from "./timeline-projection";

function submit(controller: SalaiController): DirectionProposalInput {
  expect(controller.submitDirection("Ivo suspects she is leaving. Hold his guarded reaction.", { type: "cue", id: "cue-f0-reaction" }, 12000)).toBe(true);
  const note = controller.getSnapshot().direction!.note;
  return {
    noteId: note.id, baseRevision: note.projectRevision,
    summary: "Replace surprise with guarded recognition and hold for five seconds.",
    operations: [
      { op: "updateBlock", block: { id: "visual-f0-reaction", type: "visual_description", text: "Ivo watches the letter, guarded. He already suspects she is leaving." } },
      { op: "updateCue", cueId: "cue-f0-reaction", explicitDurationMs: 5000 },
    ],
  };
}

describe("F0 filmmaking review", () => {
  it("builds a valid, deterministic two-scene story with eight linked moments and multiple contents", () => {
    const project = createFilmmakingFixture();
    expect(validateNarrativeProject(project).valid).toBe(true);
    expect(createFilmmakingFixture()).toEqual(project);
    expect(deserializeNarrativeProject(serializeNarrativeProject(project))).toEqual(project);
    expect(Object.keys(project.scenes)).toHaveLength(2);
    expect(filmMoments(project)).toHaveLength(8);
    expect(filmMoments(project).every((moment) => moment.shotIntents.length === 1)).toBe(true);
    expect(project.cues["cue-f0-open-letter"]!.visualBlockIds).toHaveLength(2);
    expect(project.cues["cue-f0-letter"]!.audioBlockIds).toHaveLength(2);
    const projection = projectNarrativeToTimeline(project);
    const playback = toElahProject(projection, FILMMAKING_MEDIA);
    expect(projection.durationMs).toBe(33000);
    expect(resolveSemanticAssemblyAtMs(projection, playback, 12000).scene.images.at(-1)?.src).toBe("/salai/fixtures/f0-4.svg");
  });

  it("freezes the target and submission context while selection, surface, and workspace change", () => {
    const controller = new SalaiController("filmmaking");
    submit(controller);
    const before = structuredClone(controller.getSnapshot().direction!.note);
    controller.select({ type: "cue", id: "cue-f0-train" });
    controller.setSurface("timeline");
    controller.updateWorkspace((workspace) => ({ ...workspace }));
    const context = handleMachineCommand(controller, { command: "context" }) as { direction: { note: typeof before }; projectRevision: number };
    expect(context.direction.note).toEqual(before);
    expect(context.projectRevision).toBe(before.projectRevision);
    expect(context.direction.note.submittedProject).not.toBe(controller.getSnapshot().project);
  });

  it("previews without mutation, accepts once atomically, preserves unrelated data, and reverts", () => {
    const controller = new SalaiController("filmmaking");
    const input = submit(controller);
    const before = controller.getSnapshot().project;
    const result = handleMachineCommand(controller, { command: "proposeDirection", payload: input });
    expect(result).toMatchObject({ projectChanged: false });
    expect(controller.getSnapshot().project).toBe(before);
    const proposal = controller.getSnapshot().direction!.proposal!;
    expect(proposal.changes.map((change) => change.id).sort()).toEqual(["cue-f0-reaction", "visual-f0-reaction"]);
    expect(proposal.changes.find((change) => change.id === "cue-f0-reaction")!.fields).toContainEqual({ label: "Duration", before: "3 s", after: "5 s" });
    input.operations.length = 0;
    const listener = vi.fn();
    controller.subscribe(listener);
    expect(controller.acceptDirection(proposal.id)).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    const after = controller.getSnapshot().project;
    expect(after.cues["cue-f0-reaction"]!.explicitDurationMs).toBe(5000);
    expect(after.shotIntents).toEqual(before.shotIntents);
    expect(after.relationships).toEqual(before.relationships);
    expect(after.mediaSegments).toEqual(before.mediaSegments);
    expect(after.blocks["source-f0-room-tone"]).toEqual(before.blocks["source-f0-room-tone"]);
    expect(after.cues["cue-f0-train"]).toEqual(before.cues["cue-f0-train"]);
    expect(controller.acceptDirection(proposal.id)).toBe(false);
    expect(controller.revertMachineAction()).toBe(true);
    expect(controller.getSnapshot().project).toEqual(before);
    expect(controller.getSnapshot().direction!.status).toBe("reverted");
    expect(controller.acceptDirection(proposal.id)).toBe(false);
  });

  it("rejects delayed proposals and stale acceptance after edits, deletion, reset, or revert", () => {
    for (const edit of [
      (controller: SalaiController) => controller.dispatchNarrative({ op: "updateBeat", beatId: "beat-choice", summary: "Changed later" }),
      (controller: SalaiController) => controller.dispatchNarrative({ op: "deleteCue", cueId: "cue-f0-reaction" }),
      (controller: SalaiController) => controller.resetFixture(),
      (controller: SalaiController) => controller.revertMachineAction(),
    ]) {
      const controller = new SalaiController("filmmaking");
      controller.dispatchNarrativeBatch([{ op: "updateBeat", beatId: "beat-choice", title: "Shared choice" }], { revertible: true });
      const input = submit(controller);
      expect(controller.proposeDirection(input)).toBe(true);
      const proposalId = controller.getSnapshot().direction!.proposal!.id;
      edit(controller);
      const current = controller.getSnapshot().project;
      expect(controller.acceptDirection(proposalId)).toBe(false);
      expect(controller.proposeDirection(input)).toBe(false);
      expect(controller.getSnapshot().project).toBe(current);
    }
    const controller = new SalaiController("filmmaking");
    const input = submit(controller);
    controller.dispatchNarrative({ op: "updateCue", cueId: "cue-f0-lamp", explicitDurationMs: 2000 });
    expect(controller.proposeDirection(input)).toBe(false);
    expect(controller.getSnapshot().feedback.error).toMatch(/changed after submission/);
  });

  it("rejects duplicates, dismissed notes, replaced notes, invalid batches, and malformed inputs without losing accepted work", () => {
    const controller = new SalaiController("filmmaking");
    expect(controller.submitDirection("", { type: "script", id: "script-last-light" }, 0)).toBe(false);
    expect(controller.submitDirection("Note", { type: "cue", id: "deleted" }, 0)).toBe(false);
    expect(controller.submitDirection("Note", { type: "script", id: "script-last-light" }, NaN)).toBe(false);
    const input = submit(controller);
    const before = controller.getSnapshot().project;
    const invalid = { ...input, operations: [...input.operations, { op: "deleteCue", cueId: "missing" } as NarrativeOperation] };
    expect(controller.proposeDirection(invalid)).toBe(false);
    expect(controller.getSnapshot().project).toBe(before);
    expect(controller.getSnapshot().direction!.status).toBe("waiting");
    const block = before.blocks["visual-f0-reaction"]!;
    expect(controller.proposeDirection({ ...input, operations: [{ op: "updateBlock", block: { ...block, id: block.id } }] })).toBe(false);
    const reorderedFields = Object.fromEntries(Object.entries(block).reverse());
    expect(() => handleMachineCommand(controller, { command: "proposeDirection", payload: { ...input, operations: [{ op: "updateBlock", block: reorderedFields }] } })).toThrow(/does not change/);
    expect(() => handleMachineCommand(controller, { command: "proposeDirection", payload: { ...input, baseRevision: "0" } })).toThrow(/requires/);
    expect(() => handleMachineCommand(controller, { command: "proposeDirection", payload: { ...input, operations: [{ op: "generateFilm" }] } })).toThrow(/unknown narrative/);
    expect(() => handleMachineCommand(controller, { command: "proposeDirection", payload: {
      ...input, operations: [{ op: "updateBlock", block: { id: "visual-f0-reaction", type: "visual_description", text: { unexpected: "object" } } }],
    } })).toThrow(/must be a string/);
    expect(() => handleMachineCommand(controller, { command: "apply", payload: [{ op: "updateBeat", beatId: "beat-choice", summary: ["invalid"] }] })).toThrow(/must be a string/);
    expect(controller.proposeDirection(input)).toBe(true);
    const proposal = controller.getSnapshot().direction!.proposal;
    expect(controller.proposeDirection(input)).toBe(false);
    expect(controller.getSnapshot().direction!.proposal).toBe(proposal);
    controller.dismissDirection();
    expect(controller.acceptDirection(proposal!.id)).toBe(false);
    expect(controller.proposeDirection(input)).toBe(false);
    submit(controller);
    expect(controller.proposeDirection(input)).toBe(false);
    expect(controller.getSnapshot().project).toBe(before);
  });

  it("keeps order, duration, text, source evidence, and immediate revert coherent across surfaces", () => {
    const controller = new SalaiController("filmmaking");
    const before = controller.getSnapshot().project;
    controller.select({ type: "cue", id: "cue-f0-reaction" });
    expect(controller.dispatchNarrativeBatch([
      { op: "moveCue", cueId: "cue-f0-reaction", toBeatId: "beat-concealment", toIndex: 0 },
      { op: "updateCue", cueId: "cue-f0-reaction", explicitDurationMs: 5000 },
      { op: "updateBeat", beatId: "beat-concealment", summary: "Ivo suspects departure before seeing the letter." },
    ], { revertible: true })).toBe(true);
    controller.setSurface("timeline");
    controller.setSurface("film");
    expect(controller.getSnapshot().selection?.id).toBe("cue-f0-reaction");
    expect(filmMoments(controller.getSnapshot().project)[2]!.cueId).toBe("cue-f0-reaction");
    expect(controller.getSnapshot().project.blocks["source-f0-room-tone"]).toEqual(before.blocks["source-f0-room-tone"]);
    expect(controller.revertMachineAction()).toBe(true);
    expect(controller.getSnapshot().project).toEqual(before);
    expect(controller.getSnapshot().selection?.id).toBe("cue-f0-reaction");
    controller.dispatchNarrativeBatch([{ op: "updateCue", cueId: "cue-f0-letter", explicitDurationMs: 1000 }], { revertible: true });
    controller.updateWorkspace((workspace) => ({ ...workspace }));
    expect(controller.revertMachineAction()).toBe(false);
  });

  it("shows removed descendants, source trims, order changes, and shared shot links in the review", () => {
    const controller = new SalaiController("filmmaking");
    const before = controller.getSnapshot().project;
    controller.dispatchNarrativeBatch([
      { op: "trimSourceExcerpt", blockId: "source-f0-room-tone", sourceInMs: 3000, sourceOutMs: 5000 },
      { op: "deleteCue", cueId: "cue-f0-reaction" },
      { op: "linkShotIntent", relationshipId: "rel-f0-shared", sourceId: "beat-concealment", shotIntentId: "shot-f0-letter" },
    ]);
    const changes = describeProjectChanges(before, controller.getSnapshot().project);
    expect(changes.find((change) => change.id === "source-f0-room-tone")!.fields).toContainEqual({ label: "Source in", before: "2 s", after: "3 s" });
    expect(changes.find((change) => change.id === "visual-f0-reaction")!.kind).toBe("removed");
    expect(changes.some((change) => change.id === "beat-concealment")).toBe(true);
    expect(filmMoments(controller.getSnapshot().project).find((moment) => moment.cueId === "cue-f0-letter")!.shotIntents).toHaveLength(1);
    expect(controller.getSnapshot().project.shotIntents["shot-f0-reaction"]).toBeDefined();
  });
});
