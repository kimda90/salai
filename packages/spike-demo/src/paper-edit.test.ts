import { applyOperation, createInterviewFixture } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { orderedPaperAudioItems, sourceExcerptDurationMs } from "./paper-edit-utils";

describe("Paper / Radio Edit projection", () => {
  it("orders source-backed and authored audio in canonical story order", () => {
    const project = createInterviewFixture();
    const items = orderedPaperAudioItems(project);
    expect(items.map((item) => item.blockId)).toEqual([
      "quote_maria",
      "vo_bridge",
      "quote_juan",
      "quote_result",
    ]);
    expect(items[0]?.block.type).toBe("source_excerpt");
    expect(items[1]?.block.type).toBe("authored_speech");
  });

  it("derives source duration directly from preserved media ranges", () => {
    const project = createInterviewFixture();
    const block = project.blocks.quote_maria!;
    expect(sourceExcerptDurationMs(block)).toBe(27_000);
  });

  it("moves a SourceExcerpt between Cues without changing wording, type, or range", () => {
    const project = createInterviewFixture();
    const before = project.blocks.quote_maria!;
    const result = applyOperation(project, {
      op: "moveBlock",
      blockId: "quote_maria",
      toCueId: "cue_juan",
      toIndex: 1,
    });
    const after = result.model.blocks.quote_maria!;
    expect(after).toEqual(before);
    expect(after.type).toBe("source_excerpt");
    if (after.type === "source_excerpt") {
      expect(after.mediaSegmentId).toBe("interview_maria");
      expect(after.sourceInMs).toBe(10_000);
      expect(after.sourceOutMs).toBe(37_000);
      expect(after.transcriptSnapshot).toBe("We were spending almost two days doing this manually.");
    }
    expect(result.model.cues.cue_maria?.audioBlockIds).not.toContain("quote_maria");
    expect(result.model.cues.cue_juan?.audioBlockIds).toContain("quote_maria");
  });

  it("keeps authored bridge semantics after movement and editing", () => {
    const project = createInterviewFixture();
    const moved = applyOperation(project, {
      op: "moveBlock",
      blockId: "vo_bridge",
      toCueId: "cue_result",
      toIndex: 1,
    });
    const block = moved.model.blocks.vo_bridge!;
    expect(block.type).toBe("authored_speech");
    if (block.type !== "authored_speech") throw new Error("expected authored speech");

    const edited = applyOperation(moved.model, {
      op: "updateBlock",
      block: { ...block, text: "A shorter authored bridge." },
    });
    expect(edited.model.blocks.vo_bridge).toMatchObject({
      type: "authored_speech",
      text: "A shorter authored bridge.",
      role: "vo",
    });
  });
});
