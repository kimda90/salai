import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { handleMachineCommand } from "./machine-interface";
import { SOURCE_BACKED_SCENARIO } from "./source-backed-scenario";

function sourceExcerpt(project: ReturnType<SalaiController["getSnapshot"]>["project"], blockId: string) {
  const block = project.blocks[blockId];
  if (!block || block.type !== "source_excerpt") {
    throw new Error(`Expected SourceExcerpt ${blockId}`);
  }
  return block;
}

describe("0C.4 source-backed scenario", () => {
  it("exposes deterministic canonical source material through machine context", () => {
    const controller = new SalaiController(SOURCE_BACKED_SCENARIO.fixture);
    const context = handleMachineCommand(controller, { command: "context" }) as ReturnType<
      SalaiController["getProjectContext"]
    >;

    const mariaSegment = context.project.mediaSegments.interview_maria;
    const juanSegment = context.project.mediaSegments.interview_juan;
    expect(mariaSegment).toMatchObject({ id: "interview_maria", assetId: "asset_maria" });
    expect(juanSegment).toMatchObject({ id: "interview_juan", assetId: "asset_juan" });

    const manualProof = sourceExcerpt(context.project, SOURCE_BACKED_SCENARIO.manualProofBlockId);
    const resultProof = sourceExcerpt(context.project, "quote_result");
    expect(manualProof).toMatchObject({
      mediaSegmentId: SOURCE_BACKED_SCENARIO.manualProofMediaSegmentId,
      sourceInMs: 10_000,
      sourceOutMs: 37_000,
      transcriptSnapshot: "We were spending almost two days doing this manually.",
    });
    expect(mariaSegment?.transcript).toContain(manualProof.transcriptSnapshot);
    expect(mariaSegment?.transcript).toContain(resultProof.transcriptSnapshot);
  });

  it("arranges the source-backed sequence while preserving source evidence", () => {
    const controller = new SalaiController(SOURCE_BACKED_SCENARIO.fixture);
    const before = controller.getSnapshot().project;
    const beforeMaria = sourceExcerpt(before, "quote_maria");
    const beforeJuan = sourceExcerpt(before, "quote_juan");
    const beforeResult = sourceExcerpt(before, "quote_result");

    handleMachineCommand(controller, {
      command: "apply",
      payload: SOURCE_BACKED_SCENARIO.arrangementOperations,
    });

    const after = controller.getSnapshot().project;
    expect(after.beats.beat_turn?.cueIds).toEqual(["cue_juan", "cue_bridge"]);
    expect(sourceExcerpt(after, "quote_maria")).toEqual(beforeMaria);
    expect(sourceExcerpt(after, "quote_juan")).toEqual(beforeJuan);
    expect(sourceExcerpt(after, "quote_result")).toEqual(beforeResult);
    expect(after.blocks.vo_bridge).toMatchObject({
      type: "authored_speech",
      role: "vo",
      text: "The breakthrough was not another form. It was making the process visible as it happened.",
    });
  });

  it("answers the mocked unsupported-material question from relationships only", () => {
    const controller = new SalaiController(SOURCE_BACKED_SCENARIO.fixture);
    const project = controller.getSnapshot().project;
    const supportedByMedia = new Set(
      Object.values(project.relationships)
        .filter((relationship) => relationship.type === "supported_by_media")
        .map((relationship) => relationship.sourceId),
    );

    expect(supportedByMedia.has("cue_maria")).toBe(true);
    expect(supportedByMedia.has(SOURCE_BACKED_SCENARIO.unsupportedCueId)).toBe(false);
  });
});
