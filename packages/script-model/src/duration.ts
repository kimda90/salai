import type { Id, NarrativeProject } from "./types.js";
import { assertValidNarrativeProject } from "./validation.js";

export type DurationOptions = {
  wordsPerMinute?: number;
  visualHoldMs?: number;
};

export type DurationEstimate = {
  scriptMs: number;
  sectionMs: Record<Id, number>;
  sceneMs: Record<Id, number>;
  beatMs: Record<Id, number>;
  cueMs: Record<Id, number>;
};

const DEFAULT_WPM = 150;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/u).length;
}

function speechDurationMs(text: string, wordsPerMinute: number): number {
  return Math.round((countWords(text) / wordsPerMinute) * 60_000);
}

export function estimateNarrativeDuration(
  project: NarrativeProject,
  options: DurationOptions = {},
): DurationEstimate {
  assertValidNarrativeProject(project);
  const wordsPerMinute = options.wordsPerMinute ?? DEFAULT_WPM;
  const visualHoldMs = options.visualHoldMs ?? 0;

  if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) {
    throw new Error("wordsPerMinute must be greater than zero");
  }
  if (!Number.isFinite(visualHoldMs) || visualHoldMs < 0) {
    throw new Error("visualHoldMs must be non-negative");
  }

  const cueMs: Record<Id, number> = {};
  const beatMs: Record<Id, number> = {};
  const sceneMs: Record<Id, number> = {};
  const sectionMs: Record<Id, number> = {};

  for (const cue of Object.values(project.cues)) {
    if (cue.explicitDurationMs !== undefined) {
      cueMs[cue.id] = cue.explicitDurationMs;
      continue;
    }

    let authoredSpeechMs = 0;
    let longestSourceExcerptMs = 0;

    for (const blockId of cue.audioBlockIds) {
      const block = project.blocks[blockId];
      if (block?.type === "authored_speech") {
        authoredSpeechMs += speechDurationMs(block.text, wordsPerMinute);
      } else if (block?.type === "source_excerpt") {
        longestSourceExcerptMs = Math.max(
          longestSourceExcerptMs,
          block.sourceOutMs - block.sourceInMs,
        );
      }
    }

    const cueVisualHoldMs = cue.visualBlockIds.length > 0 ? visualHoldMs : 0;
    cueMs[cue.id] = Math.max(authoredSpeechMs, longestSourceExcerptMs, cueVisualHoldMs);
  }

  for (const beat of Object.values(project.beats)) {
    beatMs[beat.id] = beat.cueIds.reduce((sum, cueId) => sum + cueMs[cueId]!, 0);
  }

  for (const scene of Object.values(project.scenes)) {
    sceneMs[scene.id] = scene.beatIds.reduce((sum, beatId) => sum + beatMs[beatId]!, 0);
  }

  for (const section of Object.values(project.sections)) {
    sectionMs[section.id] = section.childIds.reduce((sum, childId) => {
      if (project.scenes[childId] !== undefined) return sum + sceneMs[childId]!;
      return sum + beatMs[childId]!;
    }, 0);
  }

  const scriptMs = project.script.sectionIds.reduce(
    (sum, sectionId) => sum + sectionMs[sectionId]!,
    0,
  );

  return { scriptMs, sectionMs, sceneMs, beatMs, cueMs };
}
