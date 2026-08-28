import { createInterviewFixture } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import {
  blockDisplayText,
  sourceExcerptDurationMs,
  sourceRangeLabel,
  updateBlockDisplayText,
} from "./content-utils";

describe("content utilities", () => {
  it("keeps SourceExcerpt evidence immutable through display-text updates", () => {
    const project = createInterviewFixture();
    const source = project.blocks.quote_maria!;

    expect(source.type).toBe("source_excerpt");
    expect(updateBlockDisplayText(source, "rewritten prose")).toBe(source);
    expect(blockDisplayText(source)).toBe("We were spending almost two days doing this manually.");
    expect(sourceRangeLabel(source)).toBe("10.0s–37.0s");
    expect(sourceExcerptDurationMs(source)).toBe(27_000);
  });

  it("returns a new authored block when editable display text changes", () => {
    const project = createInterviewFixture();
    const authored = project.blocks.vo_bridge!;
    const updated = updateBlockDisplayText(authored, "A tighter bridge.");

    expect(updated).not.toBe(authored);
    expect(updated).toMatchObject({
      id: authored.id,
      type: "authored_speech",
      text: "A tighter bridge.",
    });
    expect(project.blocks.vo_bridge).toBe(authored);
  });
});
