import type { NarrativeProject } from "@salai/script-model";
import { projectNarrativeToTimeline } from "./timeline-projection";

export type MachineSourceExcerptTiming = {
  blockId: string;
  mediaSegmentId: string;
  sourceInMs: number;
  sourceOutMs: number;
};

export type MachineCueTiming = {
  id: string;
  beatId: string;
  sectionId: string;
  startMs: number;
  durationMs: number;
  visualStatus: "available" | "missing" | "none";
  sourceExcerpts: MachineSourceExcerptTiming[];
};

export type MachineBeatTiming = {
  id: string;
  sectionId: string;
  title?: string;
  summary?: string;
  startMs: number;
  durationMs: number;
  cueIds: string[];
};

export type MachineSemanticTimeContext = {
  durationMs: number;
  beats: MachineBeatTiming[];
  cues: MachineCueTiming[];
};

export function buildMachineSemanticTimeContext(
  project: NarrativeProject,
): MachineSemanticTimeContext {
  const projection = projectNarrativeToTimeline(project);
  const allItems = projection.tracks.flatMap((track) => track.items);
  const beatItems = allItems.filter((item) => item.kind === "beat");
  const cueItems = allItems.filter((item) => item.kind === "cue");
  const visualMedia = allItems.filter((item) => item.kind === "visual-media");
  const missingVisuals = allItems.filter((item) => item.kind === "missing-visual");
  const sourceExcerpts = allItems.filter((item) => item.kind === "source-excerpt");

  return {
    durationMs: projection.durationMs,
    beats: beatItems.map((item) => {
      const beat = project.beats[item.salaiRef.id];
      return {
        id: item.salaiRef.id,
        sectionId: item.sectionId ?? "",
        ...(beat?.title === undefined ? {} : { title: beat.title }),
        ...(beat?.summary === undefined ? {} : { summary: beat.summary }),
        startMs: item.startMs,
        durationMs: item.durationMs,
        cueIds: beat ? [...beat.cueIds] : [],
      };
    }),
    cues: cueItems.map((item) => {
      const cueId = item.salaiRef.id;
      const hasVisual = visualMedia.some((candidate) => candidate.cueId === cueId);
      const isMissing = missingVisuals.some((candidate) => candidate.cueId === cueId);
      return {
        id: cueId,
        beatId: item.beatId ?? "",
        sectionId: item.sectionId ?? "",
        startMs: item.startMs,
        durationMs: item.durationMs,
        visualStatus: hasVisual ? "available" : isMissing ? "missing" : "none",
        sourceExcerpts: sourceExcerpts
          .filter((candidate) => candidate.cueId === cueId)
          .flatMap((candidate) => {
            if (
              candidate.salaiRef.type !== "block" ||
              candidate.mediaSegmentId === undefined ||
              candidate.sourceInMs === undefined ||
              candidate.sourceOutMs === undefined
            ) {
              return [];
            }
            return [
              {
                blockId: candidate.salaiRef.id,
                mediaSegmentId: candidate.mediaSegmentId,
                sourceInMs: candidate.sourceInMs,
                sourceOutMs: candidate.sourceOutMs,
              },
            ];
          }),
      };
    }),
  };
}
