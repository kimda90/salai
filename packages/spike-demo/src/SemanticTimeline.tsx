import type {
  TimelineEditorSelection,
  TimelineEditorViewport,
} from "@moritzbrantner/timeline-editor/core";
import { TimelineEditor } from "@moritzbrantner/timeline-editor/react";
import { useMemo, useState } from "react";
import { useSalaiController, useSalaiState } from "./controller";
import {
  canonicalSelectionFromTimelineSelection,
  filterTimelineDocumentForZoom,
  semanticTimelineSummary,
  timelineSelectionForCanonical,
  type SemanticTimelineZoom,
} from "./semantic-timeline-model";
import { toTimelineEditorDocument } from "./timeline-editor-adapter";
import { projectNarrativeToTimeline } from "./timeline-projection";
import "./semantic-timeline.css";

const ZOOMS: readonly {
  key: SemanticTimelineZoom;
  label: string;
  description: string;
}[] = [
  { key: "story", label: "Story", description: "Sections + Beats" },
  { key: "moments", label: "Moments", description: "Beats + Cues" },
  { key: "media", label: "Media", description: "Cues + realization" },
];

function formatSeconds(ms: number): string {
  return `${(ms / 1_000).toFixed(ms % 1_000 === 0 ? 0 : 1)}s`;
}

export function SemanticTimeline() {
  const controller = useSalaiController();
  const state = useSalaiState();
  const [zoom, setZoom] = useState<SemanticTimelineZoom>("story");
  const [viewport, setViewport] = useState<TimelineEditorViewport>({
    pixelsPerSecond: 58,
    scrollLeftMs: 0,
  });

  const projection = useMemo(
    () => projectNarrativeToTimeline(state.project),
    [state.project],
  );
  const completeDocument = useMemo(
    () => toTimelineEditorDocument(projection),
    [projection],
  );
  const document = useMemo(
    () => filterTimelineDocumentForZoom(completeDocument, zoom),
    [completeDocument, zoom],
  );
  const summary = useMemo(() => semanticTimelineSummary(projection), [projection]);
  const selection = useMemo(
    () => timelineSelectionForCanonical(projection, document, state.selection),
    [document, projection, state.selection],
  );

  const handleSelectionChange = (next: TimelineEditorSelection) => {
    controller.select(canonicalSelectionFromTimelineSelection(document, next));
  };

  return (
    <section className="semantic-timeline-surface" aria-label="Semantic timeline">
      <header className="semantic-timeline-header">
        <div>
          <span className="semantic-timeline-eyebrow">PLAY · SEMANTIC TIME</span>
          <h2>Story in time</h2>
          <p>
            The same canonical story, projected from narrative structure into actual duration.
            Timeline-engine state is read-only in this slice.
          </p>
        </div>
        <div className="semantic-timeline-runtime">
          <small>Structural runtime</small>
          <strong>{formatSeconds(projection.durationMs)}</strong>
        </div>
      </header>

      <div className="semantic-timeline-controls">
        <div className="semantic-zoom-control" role="group" aria-label="Semantic zoom">
          {ZOOMS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={zoom === option.key ? "active" : ""}
              aria-pressed={zoom === option.key}
              onClick={() => setZoom(option.key)}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className="semantic-timeline-facts" aria-label="Timeline summary">
          <span>{summary.sections} sections</span>
          <span>{summary.beats} beats</span>
          <span>{summary.cues} cues</span>
          <span>{summary.visualMedia} visuals</span>
          <span>{summary.sourceExcerpts} source excerpts</span>
          <span className={summary.missingVisuals > 0 ? "warning" : ""}>
            {summary.missingVisuals} missing
          </span>
        </div>
      </div>

      <div className="semantic-timeline-editor-frame" data-semantic-zoom={zoom}>
        <TimelineEditor
          document={document}
          selection={selection}
          viewport={viewport}
          frameRate={30}
          readOnly
          onSelectionChange={handleSelectionChange}
          onViewportChange={setViewport}
          renderTrackHeader={({ track }) => (
            <div className="semantic-track-header">
              <strong>{track.label}</strong>
              <span>{track.kind}</span>
            </div>
          )}
          renderItem={({ item, selected }) => {
            const data = item.data;
            const kind = data?.salaiKind ?? item.kind ?? "item";
            return (
              <div
                className={`semantic-timeline-item semantic-timeline-item-${kind}${selected ? " selected" : ""}`}
              >
                <span className="semantic-item-kind">
                  {kind === "missing-visual" ? "NEEDS COVERAGE" : kind.replaceAll("-", " ")}
                </span>
                <span className="semantic-item-label">{item.label}</span>
              </div>
            );
          }}
          aria-label={`${ZOOMS.find((item) => item.key === zoom)?.label ?? zoom} semantic timeline`}
        />
      </div>

      <footer className="semantic-timeline-legend">
        <span><i className="legend-dot beat" /> Narrative progression</span>
        <span><i className="legend-dot cue" /> Audiovisual moment</span>
        <span><i className="legend-dot media" /> Available realization</span>
        <span><i className="legend-dot source" /> Recorded evidence</span>
        <span><i className="legend-dot missing" /> Missing realization</span>
      </footer>
    </section>
  );
}
