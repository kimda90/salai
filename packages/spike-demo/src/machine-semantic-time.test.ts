import { describe, expect, it } from "vitest";
import { SalaiController } from "./controller";
import { handleMachineCommand } from "./machine-interface";
import type { MachineSemanticTimeContext } from "./machine-semantic-time";

type ContextResult = {
  project: unknown;
  workspace: unknown;
  activeSurface: string;
  semanticTime: MachineSemanticTimeContext;
};

function readContext(controller: SalaiController): ContextResult {
  return handleMachineCommand(controller, { command: "context" }) as ContextResult;
}

describe("machine semantic time context", () => {
  it("exposes concise canonical timing, source evidence, and missing realization", () => {
    const controller = new SalaiController("semantic-editorial");
    const context = readContext(controller);

    expect(context.activeSurface).toBe("timeline");
    expect(context.semanticTime.durationMs).toBe(24_000);
    expect(context.semanticTime.beats.map((beat) => beat.id)).toEqual([
      "beat-hook",
      "beat-friction",
      "beat-demo",
      "beat-payoff",
    ]);
    expect(context.semanticTime.beats.map((beat) => [beat.id, beat.startMs, beat.durationMs])).toEqual([
      ["beat-hook", 0, 4_000],
      ["beat-friction", 4_000, 6_000],
      ["beat-demo", 10_000, 9_000],
      ["beat-payoff", 19_000, 5_000],
    ]);

    expect(context.semanticTime.cues.find((cue) => cue.id === "cue-friction")).toMatchObject({
      beatId: "beat-friction",
      startMs: 4_000,
      durationMs: 6_000,
      visualStatus: "available",
      sourceExcerpts: [
        {
          blockId: "source-juan",
          mediaSegmentId: "media-juan-interview",
          sourceInMs: 10_000,
          sourceOutMs: 16_000,
        },
      ],
    });
    expect(context.semanticTime.cues.find((cue) => cue.id === "cue-payoff")).toMatchObject({
      startMs: 19_000,
      durationMs: 5_000,
      visualStatus: "missing",
      sourceExcerpts: [],
    });
  });

  it("does not expose timeline-editor or Elah documents as machine context", () => {
    const context = readContext(new SalaiController("semantic-editorial"));
    expect(Object.keys(context.semanticTime).sort()).toEqual(["beats", "cues", "durationMs"]);
    const serialized = JSON.stringify(context.semanticTime);
    expect(serialized).not.toContain("timeline-editor");
    expect(serialized).not.toContain("elah");
    expect(serialized).not.toContain("tracks");
    expect(serialized).not.toContain("clips");
  });

  it("derives an empty timing view for an empty canonical story", () => {
    const context = readContext(new SalaiController("scratch"));
    expect(context.semanticTime).toEqual({ durationMs: 0, beats: [], cues: [] });
  });
});
