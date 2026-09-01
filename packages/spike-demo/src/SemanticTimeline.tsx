import type {
  TimelineEditorSelection,
  TimelineEditorViewport,
} from "@moritzbrantner/timeline-editor/core";
import { TimelineEditor } from "@moritzbrantner/timeline-editor/react";
import { useEffect, useMemo, useState } from "react";
import { useSalaiController, useSalaiState } from "./controller";
import { toElahProject } from "./elah-adapter";
import { createInterviewToneWavBlob } from "./fixture-audio";
import {
  canonicalSelectionFromTimelineSelection,
  filterTimelineDocumentForZoom,
  semanticTimelineSummary,
  timelineSelectionForCanonical,
  type SemanticTimelineZoom,
} from "./semantic-timeline-model";
import {
  createSemanticEditorialFixture,
  type FixtureMediaSource,
} from "./semantic-editorial-fixture";
import { resolveSemanticAssemblyAtMs } from "./semantic-playback-model";
import { interpretSemanticTimelineDocumentChange } from "./semantic-timeline-edit";
import { SemanticViewer } from "./SemanticViewer";
import { toTimelineEditorDocument } from "./timeline-editor-adapter";
import { projectNarrativeToTimeline } from "./timeline-projection";
import { useSemanticPlayback } from "./use-semantic-playback";
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
  const [fixtureAudioUrl, setFixtureAudioUrl] = useState<string | null>(null);
  const [editFeedback, setEditFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (state.fixtureKey !== "semantic-editorial") {
      setFixtureAudioUrl(null);
      return;
    }

    const url = URL.createObjectURL(createInterviewToneWavBlob());
    setFixtureAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [state.fixtureKey]);

  const projection = useMemo(
    () => projectNarrativeToTimeline(state.project),
    [state.project],
  );
  const mediaSources = useMemo<Readonly<Record<string, FixtureMediaSource>>>(() => {
    if (state.fixtureKey !== "semantic-editorial") return {};
    const base = createSemanticEditorialFixture().mediaSources;
    if (!fixtureAudioUrl) return base;

    return Object.fromEntries(
      Object.entries(base).map(([id, source]) => [
        id,
        source.kind === "audio" ? { ...source, src: fixtureAudioUrl } : source,
      ]),
    );
  }, [fixtureAudioUrl, state.fixtureKey]);
  const elahProject = useMemo(
    () => toElahProject(projection, mediaSources, { fps: 30 }),
    [mediaSources, projection],
  );
  const playback = useSemanticPlayback(projection, elahProject);
  const assembly = useMemo(
    () => resolveSemanticAssemblyAtMs(projection, elahProject, playback.currentTimeMs),
    [elahProject, playback.currentTimeMs, projection],
  );
  const completeDocument = useMemo(
    () => toTimelineEditorDocument(projection),
    [projection],
  );
  const document = useMemo(() => {
    const visible = filterTimelineDocumentForZoom(completeDocument, zoom);
    return {
      ...visible,
      currentTimeMs: Math.min(playback.currentTimeMs, projection.durationMs),
    };
  }, [completeDocument, playback.currentTimeMs, projection.durationMs, zoom]);
  const summary = useMemo(() => semanticTimelineSummary(projection), [projection]);
  const selection = useMemo(
    () => timelineSelectionForCanonical(projection, document, state.selection),
    [document, projection, state.selection],
  );

  const handleSelectionChange = (next: TimelineEditorSelection) => {
    controller.select(canonicalSelectionFromTimelineSelection(document, next));
  };

  const handleDocumentChange = (nextDocument: typeof document) => {
    const interpretation = interpretSemanticTimelineDocumentChange(
      state.project,
      document,
      nextDocument,
    );

    if (interpretation.kind === "noop") return;
    if (interpretation.kind === "rejected") {
      setEditFeedback(`Not applied: ${interpretation.reason}`);
      return;
    }

    playback.pause();
    const accepted = controller.dispatchNarrativeBatch(interpretation.operations, {
      revertible: true,
    });
    setEditFeedback(
      accepted
        ? `${interpretation.summary}. Reprojected from canonical Salai state.`
        : "Not applied: canonical Salai validation rejected the timeline gesture.",
    );
  };

  return (
    <section className="semantic-timeline-surface" aria-label="Semantic timeline">
      <header className="semantic-timeline-header">
        <div>
          <span className="semantic-timeline-eyebrow">PLAY · SEMANTIC TIME</span>
          <h2>Story in time</h2>
          <p>
            Drag Beats or Cues to reorder story structure. In Media view, trim a SourceExcerpt
            edge to change its canonical evidence range. Every accepted gesture is reprojected
            from Salai state; engine-only edits are discarded.
          </p>
        </div>
        <div className="semantic-timeline-runtime">
          <small>Structural runtime</small>
          <strong>{formatSeconds(projection.durationMs)}</strong>
        </div>
      </header>

      <SemanticViewer
        assembly={assembly}
        audioSrc={fixtureAudioUrl}
        currentTimeMs={playback.currentTimeMs}
        durationMs={projection.durationMs}
        isPlaying={playback.snapshot.isPlaying}
        onTogglePlayback={playback.toggle}
      />

      {state.fixtureKey !== "semantic-editorial" ? (
        <p className="semantic-playback-note">
          Deterministic picture/audio fixture media is available in “0D semantic editorial”.
          Other fixtures still project semantically but do not invent playback assets.
        </p>
      ) : null}

      <div className="semantic-timeline-controls">
        <div className="semantic-zoom-control" role="group" aria-label="Semantic zoom">
          {ZOOMS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={zoom === option.key ? "active" : ""}
              aria-pressed={zoom === option.key}
              onClick={() => {
                setZoom(option.key);
                setEditFeedback(null);
              }}
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

      {editFeedback ? (
        <p className="semantic-timeline-edit-feedback" role="status">
          {editFeedback}
        </p>
      ) : null}

      <div className="semantic-timeline-editor-frame" data-semantic-zoom={zoom}>
        <TimelineEditor
          document={document}
          selection={selection}
          viewport={viewport}
          frameRate={30}
          editPolicy={{ overlap: "allow", ripple: false }}
          onDocumentChange={handleDocumentChange}
          onSelectionChange={handleSelectionChange}
          onViewportChange={setViewport}
          onCurrentTimeChange={playback.seekMs}
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
