import {
  estimateNarrativeDuration,
  type Beat,
  type NarrativeProject,
} from "@salai/script-model";

export type TimelineSalaiRef = {
  type: "section" | "beat" | "cue" | "block" | "media-segment";
  id: string;
};

export type SalaiTimelineItemKind =
  | "section"
  | "beat"
  | "cue"
  | "visual-media"
  | "source-excerpt"
  | "missing-visual";

export type SalaiTimelineItem = {
  id: string;
  trackId: string;
  kind: SalaiTimelineItemKind;
  label: string;
  startMs: number;
  durationMs: number;
  salaiRef: TimelineSalaiRef;
  sectionId?: string;
  beatId?: string;
  cueId?: string;
  mediaSegmentId?: string;
  sourceInMs?: number;
  sourceOutMs?: number;
};

export type SalaiTimelineTrack = {
  id: string;
  label: string;
  kind: "semantic" | "visual" | "audio";
  items: SalaiTimelineItem[];
};

export type SalaiTimelineProjection = {
  scriptId: string;
  durationMs: number;
  tracks: SalaiTimelineTrack[];
};

const TRACKS = {
  sections: "semantic-sections",
  beats: "semantic-beats",
  cues: "semantic-cues",
  visual: "visual-realization",
  audio: "source-audio",
} as const;

function beatLabel(beat: Beat): string {
  return beat.title ?? beat.summary ?? beat.id;
}

function cueLabel(project: NarrativeProject, cueId: string): string {
  const cue = project.cues[cueId];
  if (!cue) return cueId;

  for (const blockId of [...cue.visualBlockIds, ...cue.audioBlockIds]) {
    const block = project.blocks[blockId];
    if (!block) continue;
    if (block.type === "visual_description") return block.text;
    if (block.type === "on_screen_text") return block.text;
    if (block.type === "graphic") return block.description;
    if (block.type === "authored_speech") return block.text;
    if (block.type === "source_excerpt") {
      return block.transcriptSnapshot ?? `Source excerpt ${block.id}`;
    }
  }

  return cue.id;
}

function orderedBeatIds(project: NarrativeProject, sectionId: string): string[] {
  const section = project.sections[sectionId];
  if (!section) return [];

  return section.childIds.flatMap((childId) => {
    const scene = project.scenes[childId];
    return scene ? scene.beatIds : [childId];
  });
}

export function projectNarrativeToTimeline(
  project: NarrativeProject,
): SalaiTimelineProjection {
  const duration = estimateNarrativeDuration(project, { visualHoldMs: 2_000 });
  const sections: SalaiTimelineItem[] = [];
  const beats: SalaiTimelineItem[] = [];
  const cues: SalaiTimelineItem[] = [];
  const visual: SalaiTimelineItem[] = [];
  const audio: SalaiTimelineItem[] = [];

  let sectionStartMs = 0;

  for (const sectionId of project.script.sectionIds) {
    const section = project.sections[sectionId];
    if (!section) continue;

    const sectionDurationMs = duration.sectionMs[sectionId] ?? 0;
    sections.push({
      id: `timeline:section:${sectionId}`,
      trackId: TRACKS.sections,
      kind: "section",
      label: section.title ?? section.id,
      startMs: sectionStartMs,
      durationMs: sectionDurationMs,
      salaiRef: { type: "section", id: sectionId },
      sectionId,
    });

    let beatStartMs = sectionStartMs;
    for (const beatId of orderedBeatIds(project, sectionId)) {
      const beat = project.beats[beatId];
      if (!beat) continue;

      const beatDurationMs = duration.beatMs[beatId] ?? 0;
      beats.push({
        id: `timeline:beat:${beatId}`,
        trackId: TRACKS.beats,
        kind: "beat",
        label: beatLabel(beat),
        startMs: beatStartMs,
        durationMs: beatDurationMs,
        salaiRef: { type: "beat", id: beatId },
        sectionId,
        beatId,
      });

      let cueStartMs = beatStartMs;
      for (const cueId of beat.cueIds) {
        const cue = project.cues[cueId];
        if (!cue) continue;

        const cueDurationMs = duration.cueMs[cueId] ?? 0;
        cues.push({
          id: `timeline:cue:${cueId}`,
          trackId: TRACKS.cues,
          kind: "cue",
          label: cueLabel(project, cueId),
          startMs: cueStartMs,
          durationMs: cueDurationMs,
          salaiRef: { type: "cue", id: cueId },
          sectionId,
          beatId,
          cueId,
        });

        const supportedMedia = Object.values(project.relationships)
          .filter(
            (relationship) =>
              relationship.type === "supported_by_media" &&
              relationship.sourceId === cueId &&
              project.mediaSegments[relationship.targetId] !== undefined,
          )
          .map((relationship) => project.mediaSegments[relationship.targetId]!);

        for (const segment of supportedMedia) {
          visual.push({
            id: `timeline:visual:${cueId}:${segment.id}`,
            trackId: TRACKS.visual,
            kind: "visual-media",
            label: segment.assetId ?? segment.id,
            startMs: cueStartMs,
            durationMs: cueDurationMs,
            salaiRef: { type: "media-segment", id: segment.id },
            sectionId,
            beatId,
            cueId,
            mediaSegmentId: segment.id,
            sourceInMs: segment.sourceInMs,
            sourceOutMs: segment.sourceOutMs,
          });
        }

        if (cue.visualBlockIds.length > 0 && supportedMedia.length === 0) {
          visual.push({
            id: `timeline:missing:${cueId}`,
            trackId: TRACKS.visual,
            kind: "missing-visual",
            label: "Missing visual",
            startMs: cueStartMs,
            durationMs: cueDurationMs,
            salaiRef: { type: "cue", id: cueId },
            sectionId,
            beatId,
            cueId,
          });
        }

        for (const blockId of cue.audioBlockIds) {
          const block = project.blocks[blockId];
          if (block?.type !== "source_excerpt") continue;

          audio.push({
            id: `timeline:source:${block.id}`,
            trackId: TRACKS.audio,
            kind: "source-excerpt",
            label: block.transcriptSnapshot ?? block.id,
            startMs: cueStartMs,
            durationMs: cueDurationMs,
            salaiRef: { type: "block", id: block.id },
            sectionId,
            beatId,
            cueId,
            mediaSegmentId: block.mediaSegmentId,
            sourceInMs: block.sourceInMs,
            sourceOutMs: block.sourceOutMs,
          });
        }

        cueStartMs += cueDurationMs;
      }

      beatStartMs += beatDurationMs;
    }

    sectionStartMs += sectionDurationMs;
  }

  return {
    scriptId: project.script.id,
    durationMs: duration.scriptMs,
    tracks: [
      { id: TRACKS.sections, label: "Sections", kind: "semantic", items: sections },
      { id: TRACKS.beats, label: "Beats", kind: "semantic", items: beats },
      { id: TRACKS.cues, label: "Cues", kind: "semantic", items: cues },
      { id: TRACKS.visual, label: "Visual", kind: "visual", items: visual },
      { id: TRACKS.audio, label: "Source audio", kind: "audio", items: audio },
    ],
  };
}
