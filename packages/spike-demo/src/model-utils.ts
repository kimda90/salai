import {
  estimateNarrativeDuration,
  type Id,
  type NarrativeProject,
  type ParentRef,
} from "@salai/script-model";

const durationCache = new WeakMap<
  NarrativeProject,
  ReturnType<typeof estimateNarrativeDuration>
>();

export type OrderedBeatRef = {
  beatId: Id;
  sectionId: Id;
  sceneId?: Id;
};

export function formatDuration(ms: number | undefined): string {
  const value = ms ?? 0;
  if (value < 1000) return `${value}ms`;

  const seconds = value / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(seconds % 1 === 0 ? 0 : 1)}s`;
  }

  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainder = roundedSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function getDurationEstimate(project: NarrativeProject) {
  const cached = durationCache.get(project);
  if (cached) return cached;

  const estimate = estimateNarrativeDuration(project, { visualHoldMs: 2000 });
  durationCache.set(project, estimate);
  return estimate;
}

export function orderedBeatRefs(project: NarrativeProject): OrderedBeatRef[] {
  const result: OrderedBeatRef[] = [];
  for (const sectionId of project.script.sectionIds) {
    const section = project.sections[sectionId];
    if (!section) continue;

    for (const childId of section.childIds) {
      const scene = project.scenes[childId];
      if (scene) {
        for (const beatId of scene.beatIds) {
          result.push({ beatId, sectionId, sceneId: scene.id });
        }
      } else if (project.beats[childId]) {
        result.push({ beatId: childId, sectionId });
      }
    }
  }
  return result;
}

export function findBeatParent(project: NarrativeProject, beatId: Id): ParentRef | null {
  for (const section of Object.values(project.sections)) {
    if (section.childIds.includes(beatId)) {
      return { type: "section", id: section.id };
    }
  }
  for (const scene of Object.values(project.scenes)) {
    if (scene.beatIds.includes(beatId)) {
      return { type: "scene", id: scene.id };
    }
  }
  return null;
}

export function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
