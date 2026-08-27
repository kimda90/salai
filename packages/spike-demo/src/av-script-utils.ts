import type { ContentBlock, Id, NarrativeProject } from "@salai/script-model";

export type OrderedBeatRef = {
  beatId: Id;
  sectionId: Id;
  sceneId?: Id;
};

export function orderedBeatRefs(project: NarrativeProject): OrderedBeatRef[] {
  const result: OrderedBeatRef[] = [];
  for (const sectionId of project.script.sectionIds) {
    const section = project.sections[sectionId];
    if (!section) continue;
    for (const childId of section.childIds) {
      const scene = project.scenes[childId];
      if (scene) {
        for (const beatId of scene.beatIds) result.push({ beatId, sectionId, sceneId: scene.id });
      } else if (project.beats[childId]) {
        result.push({ beatId: childId, sectionId });
      }
    }
  }
  return result;
}

export function blockDisplayText(block: ContentBlock): string {
  switch (block.type) {
    case "visual_description":
    case "on_screen_text":
    case "authored_speech":
      return block.text;
    case "graphic":
    case "sfx":
      return block.description;
    case "music":
      return block.description ?? "Music";
    case "source_excerpt":
      return block.transcriptSnapshot ?? "Source excerpt";
  }
}

export function isSourceEvidence(block: ContentBlock): boolean {
  return block.type === "source_excerpt";
}

export function sourceRangeLabel(block: ContentBlock): string | null {
  if (block.type !== "source_excerpt") return null;
  const format = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  return `${format(block.sourceInMs)}–${format(block.sourceOutMs)}`;
}
