import { assertValidNarrativeProject } from "@salai/script-model";
import { describe, expect, it } from "vitest";
import { toElahProject } from "./elah-adapter";
import { createSemanticEditorialFixture } from "./semantic-editorial-fixture";
import { toTimelineEditorDocument } from "./timeline-editor-adapter";
import { projectNarrativeToTimeline } from "./timeline-projection";

describe("Spike 0D adapter boundaries", () => {
  it("provides a deterministic valid audiovisual fixture", () => {
    const fixture = createSemanticEditorialFixture();

    expect(() => assertValidNarrativeProject(fixture.project)).not.toThrow();
    expect(fixture.project.script.sectionIds).toEqual([
      "section-problem",
      "section-change",
    ]);
    expect(fixture.project.blocks["source-juan"]).toMatchObject({
      type: "source_excerpt",
      mediaSegmentId: "media-juan-interview",
      sourceInMs: 10_000,
      sourceOutMs: 16_000,
    });
    expect(fixture.project.blocks["source-maya"]).toMatchObject({
      type: "source_excerpt",
      mediaSegmentId: "media-maya-interview",
      sourceInMs: 21_000,
      sourceOutMs: 26_000,
    });
  });

  it("projects stable Salai identity into semantic time", () => {
    const { project } = createSemanticEditorialFixture();
    const projection = projectNarrativeToTimeline(project);

    expect(projection.durationMs).toBe(24_000);

    const sectionTrack = projection.tracks.find(
      (track) => track.id === "semantic-sections",
    );
    const beatTrack = projection.tracks.find((track) => track.id === "semantic-beats");
    const cueTrack = projection.tracks.find((track) => track.id === "semantic-cues");

    expect(sectionTrack?.items.map((item) => [item.salaiRef.id, item.startMs, item.durationMs])).toEqual([
      ["section-problem", 0, 10_000],
      ["section-change", 10_000, 14_000],
    ]);
    expect(beatTrack?.items.map((item) => item.salaiRef.id)).toEqual([
      "beat-hook",
      "beat-friction",
      "beat-demo",
      "beat-payoff",
    ]);
    expect(cueTrack?.items.map((item) => item.salaiRef.id)).toEqual([
      "cue-hook",
      "cue-friction",
      "cue-demo-import",
      "cue-demo-result",
      "cue-payoff",
    ]);

    const missing = projection.tracks
      .flatMap((track) => track.items)
      .find((item) => item.kind === "missing-visual");
    expect(missing).toMatchObject({
      cueId: "cue-payoff",
      startMs: 19_000,
      durationMs: 5_000,
    });
  });

  it("preserves source evidence in the timeline projection", () => {
    const { project } = createSemanticEditorialFixture();
    const projection = projectNarrativeToTimeline(project);
    const sourceItems = projection.tracks
      .flatMap((track) => track.items)
      .filter((item) => item.kind === "source-excerpt");

    expect(sourceItems).toHaveLength(2);
    expect(sourceItems[0]).toMatchObject({
      salaiRef: { type: "block", id: "source-juan" },
      mediaSegmentId: "media-juan-interview",
      sourceInMs: 10_000,
      sourceOutMs: 16_000,
    });
    expect(sourceItems[1]).toMatchObject({
      salaiRef: { type: "block", id: "source-maya" },
      mediaSegmentId: "media-maya-interview",
      sourceInMs: 21_000,
      sourceOutMs: 26_000,
    });
  });

  it("adapts the Salai projection to timeline-editor without transferring ownership", () => {
    const fixture = createSemanticEditorialFixture();
    const projection = projectNarrativeToTimeline(fixture.project);
    const document = toTimelineEditorDocument(projection);
    const canonicalBefore = JSON.stringify(fixture.project);

    const beatItem = document.tracks
      .flatMap((track) => track.items)
      .find((item) => item.data?.salaiRef.id === "beat-hook");

    expect(beatItem?.data).toMatchObject({
      salaiRef: { type: "beat", id: "beat-hook" },
      salaiKind: "beat",
    });

    if (beatItem) beatItem.startMs = 99_000;

    expect(JSON.stringify(fixture.project)).toBe(canonicalBefore);
    expect(toTimelineEditorDocument(projectNarrativeToTimeline(fixture.project)))
      .not.toEqual(document);
  });

  it("materializes a disposable Elah project from Salai state", () => {
    const fixture = createSemanticEditorialFixture();
    const projection = projectNarrativeToTimeline(fixture.project);
    const elah = toElahProject(projection, fixture.mediaSources, { fps: 30 });

    expect(fixture.project).not.toHaveProperty("tracks");
    expect(elah.id).toBe("elah:script-semantic-editorial");
    expect(elah.tracks.map((track) => track.kind)).toEqual(["video", "audio"]);
    expect(elah.clips["salai-visual"]).toHaveLength(4);
    expect(elah.clips["salai-audio"]).toHaveLength(2);

    const juan = elah.clips["salai-audio"]?.find(
      (clip) => clip.id === "elah:timeline:source:source-juan",
    );
    expect(juan).toMatchObject({
      type: "audio",
      startFrame: 120,
      durationFrames: 180,
      sourceStartFrame: 300,
      sourceDurationFrames: 180,
    });

    const rebuilt = toElahProject(
      projectNarrativeToTimeline(fixture.project),
      fixture.mediaSources,
      { fps: 30 },
    );
    expect(rebuilt).toEqual(elah);
  });
});
