import { describe, expect, it } from "vitest";
import { createSemanticEditorialFixture } from "./semantic-editorial-fixture";
import {
  canonicalSelectionFromTimelineSelection,
  filterTimelineDocumentForZoom,
  semanticTimelineSummary,
  timelineSelectionForCanonical,
} from "./semantic-timeline-model";
import { toTimelineEditorDocument } from "./timeline-editor-adapter";
import { projectNarrativeToTimeline } from "./timeline-projection";

function setup() {
  const fixture = createSemanticEditorialFixture();
  const projection = projectNarrativeToTimeline(fixture.project);
  const document = toTimelineEditorDocument(projection);
  return { fixture, projection, document };
}

describe("semantic timeline model", () => {
  it("reveals semantic levels progressively without changing the projection", () => {
    const { projection, document } = setup();

    expect(filterTimelineDocumentForZoom(document, "story").tracks.map((track) => track.id)).toEqual([
      "semantic-sections",
      "semantic-beats",
    ]);
    expect(filterTimelineDocumentForZoom(document, "moments").tracks.map((track) => track.id)).toEqual([
      "semantic-beats",
      "semantic-cues",
    ]);
    expect(filterTimelineDocumentForZoom(document, "media").tracks.map((track) => track.id)).toEqual([
      "semantic-cues",
      "visual-realization",
      "source-audio",
    ]);

    expect(semanticTimelineSummary(projection)).toEqual({
      sections: 2,
      beats: 4,
      cues: 5,
      visualMedia: 4,
      sourceExcerpts: 2,
      missingVisuals: 1,
    });
  });

  it("keeps a Cue perceptually anchored to its Beat when zoomed out", () => {
    const { projection, document } = setup();
    const storyDocument = filterTimelineDocumentForZoom(document, "story");

    const selection = timelineSelectionForCanonical(
      projection,
      storyDocument,
      { type: "cue", id: "cue-demo-result" },
    );

    expect(selection).toEqual({
      itemIds: ["timeline:beat:beat-demo"],
      anchorItemId: "timeline:beat:beat-demo",
    });
  });

  it("keeps a Beat perceptually anchored to its Cues at media zoom", () => {
    const { projection, document } = setup();
    const mediaDocument = filterTimelineDocumentForZoom(document, "media");

    const selection = timelineSelectionForCanonical(
      projection,
      mediaDocument,
      { type: "beat", id: "beat-demo" },
    );

    expect(selection.anchorItemId).toBe("timeline:cue:cue-demo-import");
  });

  it("keeps a Section perceptually anchored to its first visible descendant", () => {
    const { projection, document } = setup();
    const mediaDocument = filterTimelineDocumentForZoom(document, "media");

    const selection = timelineSelectionForCanonical(
      projection,
      mediaDocument,
      { type: "section", id: "section-change" },
    );

    expect(selection.anchorItemId).toBe("timeline:cue:cue-demo-import");
  });

  it("maps media/source selection back to the enclosing canonical Cue", () => {
    const { document } = setup();
    const mediaDocument = filterTimelineDocumentForZoom(document, "media");

    expect(
      canonicalSelectionFromTimelineSelection(mediaDocument, {
        itemIds: ["timeline:source:source-juan"],
        anchorItemId: "timeline:source:source-juan",
      }),
    ).toEqual({ type: "cue", id: "cue-friction" });

    expect(
      canonicalSelectionFromTimelineSelection(mediaDocument, {
        itemIds: ["timeline:missing:cue-payoff"],
        anchorItemId: "timeline:missing:cue-payoff",
      }),
    ).toEqual({ type: "cue", id: "cue-payoff" });
  });

  it("preserves exact canonical identity whenever that semantic level is visible", () => {
    const { projection, document } = setup();
    const momentsDocument = filterTimelineDocumentForZoom(document, "moments");

    const selection = timelineSelectionForCanonical(
      projection,
      momentsDocument,
      { type: "cue", id: "cue-demo-result" },
    );

    expect(selection.anchorItemId).toBe("timeline:cue:cue-demo-result");
    expect(canonicalSelectionFromTimelineSelection(momentsDocument, selection)).toEqual({
      type: "cue",
      id: "cue-demo-result",
    });
  });
});
