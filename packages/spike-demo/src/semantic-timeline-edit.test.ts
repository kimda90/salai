import { applyOperations } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { toElahProject } from "./elah-adapter";
import { createSemanticEditorialFixture } from "./semantic-editorial-fixture";
import { resolveSemanticAssemblyAtMs } from "./semantic-playback-model";
import {
  interpretSemanticTimelineDocumentChange,
  type SemanticTimelineDocument,
} from "./semantic-timeline-edit";
import { toTimelineEditorDocument } from "./timeline-editor-adapter";
import { projectNarrativeToTimeline } from "./timeline-projection";

function cloneDocument<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function setup() {
  const fixture = createSemanticEditorialFixture();
  const projection = projectNarrativeToTimeline(fixture.project);
  const document = toTimelineEditorDocument(projection);
  return { fixture, projection, document };
}

function itemById(document: SemanticTimelineDocument, id: string) {
  const item = document.tracks
    .flatMap((track) => track.items)
    .find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Missing timeline item ${id}`);
  return item;
}

describe("semantic timeline canonical editing", () => {
  it("turns a Beat drag into moveBeat and reprojects canonical order", () => {
    const { fixture, document } = setup();
    const proposed = cloneDocument(document);
    itemById(proposed, "timeline:beat:beat-hook").startMs = 8_000;

    const interpretation = interpretSemanticTimelineDocumentChange(
      fixture.project,
      document,
      proposed,
    );

    expect(interpretation).toMatchObject({
      kind: "canonical",
      operations: [
        {
          op: "moveBeat",
          beatId: "beat-hook",
          toParent: { type: "section", id: "section-problem" },
          toIndex: 1,
        },
      ],
    });
    if (interpretation.kind !== "canonical") throw new Error("Expected canonical edit");

    const result = applyOperations(fixture.project, interpretation.operations);
    expect(result.model.sections["section-problem"]?.childIds).toEqual([
      "beat-friction",
      "beat-hook",
    ]);
    const reprojected = projectNarrativeToTimeline(result.model);
    expect(
      reprojected.tracks
        .find((track) => track.id === "semantic-beats")
        ?.items.map((item) => item.salaiRef.id),
    ).toEqual(["beat-friction", "beat-hook", "beat-demo", "beat-payoff"]);
  });

  it("turns a Cue drag into moveCue without changing Cue identity", () => {
    const { fixture, document } = setup();
    const proposed = cloneDocument(document);
    itemById(proposed, "timeline:cue:cue-demo-import").startMs = 18_000;

    const interpretation = interpretSemanticTimelineDocumentChange(
      fixture.project,
      document,
      proposed,
    );
    expect(interpretation).toMatchObject({
      kind: "canonical",
      operations: [
        {
          op: "moveCue",
          cueId: "cue-demo-import",
          toBeatId: "beat-demo",
          toIndex: 1,
        },
      ],
    });
    if (interpretation.kind !== "canonical") throw new Error("Expected canonical edit");

    const result = applyOperations(fixture.project, interpretation.operations);
    expect(result.model.beats["beat-demo"]?.cueIds).toEqual([
      "cue-demo-result",
      "cue-demo-import",
    ]);
    expect(result.model.cues["cue-demo-import"]?.id).toBe("cue-demo-import");
  });

  it("turns a SourceExcerpt edge trim into an atomic source-range + Cue-duration batch", () => {
    const { fixture, document } = setup();
    const proposed = cloneDocument(document);
    const source = itemById(proposed, "timeline:source:source-juan");
    source.durationMs = 4_000;

    const interpretation = interpretSemanticTimelineDocumentChange(
      fixture.project,
      document,
      proposed,
    );
    expect(interpretation).toMatchObject({
      kind: "canonical",
      operations: [
        {
          op: "trimSourceExcerpt",
          blockId: "source-juan",
          sourceInMs: 10_000,
          sourceOutMs: 14_000,
        },
        {
          op: "updateCue",
          cueId: "cue-friction",
          explicitDurationMs: 4_000,
        },
      ],
    });
    if (interpretation.kind !== "canonical") throw new Error("Expected canonical edit");

    const result = applyOperations(fixture.project, interpretation.operations);
    expect(result.model.blocks["source-juan"]).toMatchObject({
      type: "source_excerpt",
      sourceInMs: 10_000,
      sourceOutMs: 14_000,
    });
    expect(result.model.cues["cue-friction"]?.explicitDurationMs).toBe(4_000);

    const projection = projectNarrativeToTimeline(result.model);
    expect(projection.durationMs).toBe(22_000);
    expect(
      projection.tracks
        .find((track) => track.id === "source-audio")
        ?.items.find((item) => item.salaiRef.id === "source-juan"),
    ).toMatchObject({ durationMs: 4_000, sourceInMs: 10_000, sourceOutMs: 14_000 });

    const elah = toElahProject(projection, fixture.mediaSources, { fps: 30 });
    const assembly = resolveSemanticAssemblyAtMs(projection, elah, 4_000);
    expect(assembly.scene.audios.at(-1)).toMatchObject({
      id: "elah:timeline:source:source-juan",
      sourceFrame: 300,
    });
    expect(elah.clips["salai-audio"]?.find((clip) => clip.id === "elah:timeline:source:source-juan"))
      .toMatchObject({ durationFrames: 120, sourceDurationFrames: 120 });
  });

  it("rejects engine-only media placement and multi-item ripple state", () => {
    const { fixture, document } = setup();
    const mediaMove = cloneDocument(document);
    itemById(mediaMove, "timeline:visual:cue-hook:media-hook-visual").startMs = 1_000;
    expect(
      interpretSemanticTimelineDocumentChange(fixture.project, document, mediaMove),
    ).toMatchObject({ kind: "rejected" });

    const multi = cloneDocument(document);
    itemById(multi, "timeline:beat:beat-hook").startMs = 8_000;
    itemById(multi, "timeline:beat:beat-friction").startMs = 0;
    expect(interpretSemanticTimelineDocumentChange(fixture.project, document, multi)).toMatchObject({
      kind: "rejected",
    });
  });

  it("ignores playhead-only document changes", () => {
    const { fixture, document } = setup();
    const proposed = cloneDocument(document);
    proposed.currentTimeMs = 7_500;
    expect(interpretSemanticTimelineDocumentChange(fixture.project, document, proposed)).toEqual({
      kind: "noop",
    });
  });
});
