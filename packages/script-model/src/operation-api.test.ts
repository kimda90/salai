import { describe, expect, it } from "vitest";
import {
  NARRATIVE_OPERATION_NAMES,
  applyOperation,
  createProductVideoFixture,
  isNarrativeOperationName,
  type NarrativeOperation,
} from "./index.js";

describe("public patch operation semantics", () => {
  it("preserves omitted fields and clears optional fields with serializable null", () => {
    const initial = createProductVideoFixture();

    const titleOnly: NarrativeOperation = {
      op: "updateBeat",
      beatId: "beat_demo",
      title: "Installation demo",
    };
    const updated = applyOperation(initial, titleOnly).model;
    expect(updated.beats.beat_demo?.title).toBe("Installation demo");
    expect(updated.beats.beat_demo?.summary).toBe("Installation is three simple actions");

    const clearSummary: NarrativeOperation = {
      op: "updateBeat",
      beatId: "beat_demo",
      summary: null,
    };
    const serialized = JSON.parse(JSON.stringify(clearSummary)) as NarrativeOperation;
    const cleared = applyOperation(updated, serialized).model;
    expect(cleared.beats.beat_demo?.title).toBe("Installation demo");
    expect(cleared.beats.beat_demo?.summary).toBeUndefined();
  });

  it("uses null to clear explicit Cue duration", () => {
    const initial = createProductVideoFixture();
    const operation: NarrativeOperation = {
      op: "updateCue",
      cueId: "cue_demo_wide",
      explicitDurationMs: null,
    };
    const updated = applyOperation(initial, JSON.parse(JSON.stringify(operation)) as NarrativeOperation).model;
    expect(updated.cues.cue_demo_wide?.explicitDurationMs).toBeUndefined();
  });

  it("exposes the canonical operation-name vocabulary at runtime", () => {
    expect(isNarrativeOperationName("updateBeat")).toBe(true);
    expect(isNarrativeOperationName("doAnything")).toBe(false);
    expect(new Set(NARRATIVE_OPERATION_NAMES).size).toBe(NARRATIVE_OPERATION_NAMES.length);
  });
});
