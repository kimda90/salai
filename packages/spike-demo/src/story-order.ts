import type { NarrativeOperation, NarrativeProject } from "@salai/script-model";

export function createSectionChildMoveOperation(
  project: NarrativeProject,
  sectionId: string,
  childId: string,
  direction: -1 | 1,
): NarrativeOperation | null {
  const section = project.sections[sectionId];
  if (!section) return null;
  const index = section.childIds.indexOf(childId);
  if (index < 0) return null;
  const toIndex = index + direction;
  if (toIndex < 0 || toIndex >= section.childIds.length) return null;

  if (project.scenes[childId]) {
    return {
      op: "moveScene",
      sceneId: childId,
      toSectionId: sectionId,
      toIndex,
    };
  }
  if (project.beats[childId]) {
    return {
      op: "moveBeat",
      beatId: childId,
      toParent: { type: "section", id: sectionId },
      toIndex,
    };
  }
  return null;
}
