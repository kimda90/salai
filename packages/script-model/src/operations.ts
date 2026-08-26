import {
  isAudioBlock,
  isVisualBlock,
  type Beat,
  type ContentBlock,
  type Cue,
  type Id,
  type NarrativeProject,
  type Relationship,
  type Scene,
  type Section,
} from "./types.js";
import { assertValidNarrativeProject } from "./validation.js";

export type ParentRef =
  | { type: "section"; id: Id }
  | { type: "scene"; id: Id };

export type RelationshipEffect = {
  relationshipId: Id;
  effect: "created" | "removed" | "retargeted" | "unresolved";
  fromId?: Id;
  toId?: Id;
  reason?: string;
};

export type DomainWarning = {
  code: string;
  message: string;
  relationshipId?: Id;
};

export type SplitRelationshipAssignment = {
  side: "left" | "right" | "both";
  duplicateRelationshipId?: Id;
};

export type NarrativeOperation =
  | { op: "createSection"; section: Section; index?: number }
  | { op: "createScene"; scene: Scene; sectionId: Id; index?: number }
  | { op: "createBeat"; beat: Beat; parent: ParentRef; index?: number }
  | { op: "createCue"; cue: Cue; beatId: Id; index?: number }
  | { op: "createBlock"; block: ContentBlock; cueId: Id; index?: number }
  | { op: "updateSection"; sectionId: Id; title?: string }
  | { op: "updateScene"; sceneId: Id; title?: string }
  | { op: "updateBeat"; beatId: Id; title?: string; summary?: string }
  | { op: "updateCue"; cueId: Id; explicitDurationMs?: number | null }
  | { op: "updateBlock"; block: ContentBlock }
  | { op: "moveSection"; sectionId: Id; toIndex: number }
  | { op: "moveScene"; sceneId: Id; toSectionId: Id; toIndex: number }
  | { op: "moveBeat"; beatId: Id; toParent: ParentRef; toIndex: number }
  | { op: "moveCue"; cueId: Id; toBeatId: Id; toIndex: number }
  | { op: "moveBlock"; blockId: Id; toCueId: Id; toIndex: number }
  | {
      op: "splitBeat";
      beatId: Id;
      newBeatId: Id;
      leftCueIds: Id[];
      rightCueIds: Id[];
      rightTitle?: string;
      rightSummary?: string;
      relationshipPolicy: "left" | "right" | "both" | "manual";
      duplicateRelationshipIds?: Record<Id, Id>;
      relationshipAssignments?: Record<Id, SplitRelationshipAssignment>;
    }
  | {
      op: "mergeBeats";
      canonicalBeatId: Id;
      mergedBeatIds: Id[];
      cueIds: Id[];
    }
  | { op: "deleteSection"; sectionId: Id }
  | { op: "deleteScene"; sceneId: Id }
  | { op: "deleteBeat"; beatId: Id }
  | { op: "deleteCue"; cueId: Id }
  | { op: "deleteBlock"; blockId: Id }
  | {
      op: "linkShotIntent";
      relationshipId: Id;
      sourceId: Id;
      shotIntentId: Id;
    }
  | { op: "unlinkShotIntent"; relationshipId: Id }
  | {
      op: "linkMediaSegment";
      relationshipId: Id;
      sourceId: Id;
      mediaSegmentId: Id;
    }
  | { op: "unlinkMediaSegment"; relationshipId: Id }
  | {
      op: "trimSourceExcerpt";
      blockId: Id;
      sourceInMs: number;
      sourceOutMs: number;
    };

export type OperationResult = {
  model: NarrativeProject;
  changedIds: Id[];
  createdIds: Id[];
  removedIds: Id[];
  relationshipEffects: RelationshipEffect[];
  warnings: DomainWarning[];
  metadata?: {
    mergedBeatIds?: Id[];
  };
};

export class DomainOperationError extends Error {
  readonly operation: NarrativeOperation["op"];

  constructor(operation: NarrativeOperation["op"], message: string) {
    super(`${operation}: ${message}`);
    this.name = "DomainOperationError";
    this.operation = operation;
  }
}

type MutableResult = {
  changedIds: Set<Id>;
  createdIds: Set<Id>;
  removedIds: Set<Id>;
  relationshipEffects: RelationshipEffect[];
  warnings: DomainWarning[];
  metadata?: { mergedBeatIds?: Id[] };
};

function cloneProject(project: NarrativeProject): NarrativeProject {
  return {
    schemaVersion: project.schemaVersion,
    script: { ...project.script, sectionIds: [...project.script.sectionIds] },
    sections: Object.fromEntries(
      Object.entries(project.sections).map(([id, value]) => [
        id,
        { ...value, childIds: [...value.childIds] },
      ]),
    ),
    scenes: Object.fromEntries(
      Object.entries(project.scenes).map(([id, value]) => [
        id,
        { ...value, beatIds: [...value.beatIds] },
      ]),
    ),
    beats: Object.fromEntries(
      Object.entries(project.beats).map(([id, value]) => [
        id,
        { ...value, cueIds: [...value.cueIds] },
      ]),
    ),
    cues: Object.fromEntries(
      Object.entries(project.cues).map(([id, value]) => [
        id,
        {
          ...value,
          visualBlockIds: [...value.visualBlockIds],
          audioBlockIds: [...value.audioBlockIds],
        },
      ]),
    ),
    blocks: Object.fromEntries(
      Object.entries(project.blocks).map(([id, value]) => [id, { ...value }]),
    ) as NarrativeProject["blocks"],
    relationships: Object.fromEntries(
      Object.entries(project.relationships).map(([id, value]) => [id, { ...value }]),
    ),
    mediaSegments: Object.fromEntries(
      Object.entries(project.mediaSegments).map(([id, value]) => [id, { ...value }]),
    ),
    shotIntents: Object.fromEntries(
      Object.entries(project.shotIntents).map(([id, value]) => [id, { ...value }]),
    ),
  };
}

function newResult(): MutableResult {
  return {
    changedIds: new Set(),
    createdIds: new Set(),
    removedIds: new Set(),
    relationshipEffects: [],
    warnings: [],
  };
}

function asResult(model: NarrativeProject, result: MutableResult): OperationResult {
  return {
    model,
    changedIds: [...result.changedIds],
    createdIds: [...result.createdIds],
    removedIds: [...result.removedIds],
    relationshipEffects: result.relationshipEffects,
    warnings: result.warnings,
    ...(result.metadata === undefined ? {} : { metadata: result.metadata }),
  };
}

function fail(op: NarrativeOperation["op"], message: string): never {
  throw new DomainOperationError(op, message);
}

function requireUniqueId(project: NarrativeProject, id: Id, op: NarrativeOperation["op"]): void {
  if (
    project.script.id === id ||
    project.sections[id] !== undefined ||
    project.scenes[id] !== undefined ||
    project.beats[id] !== undefined ||
    project.cues[id] !== undefined ||
    project.blocks[id] !== undefined ||
    project.relationships[id] !== undefined ||
    project.mediaSegments[id] !== undefined ||
    project.shotIntents[id] !== undefined
  ) {
    fail(op, `ID ${id} already exists`);
  }
}

function insertAt(ids: Id[], id: Id, index: number | undefined, op: NarrativeOperation["op"]): void {
  const target = index ?? ids.length;
  if (!Number.isInteger(target) || target < 0 || target > ids.length) {
    fail(op, `index ${target} is outside 0..${ids.length}`);
  }
  ids.splice(target, 0, id);
}

function moveWithin(ids: Id[], id: Id, toIndex: number, op: NarrativeOperation["op"]): void {
  const fromIndex = ids.indexOf(id);
  if (fromIndex < 0) fail(op, `${id} is not in the expected parent`);
  if (!Number.isInteger(toIndex) || toIndex < 0 || toIndex >= ids.length) {
    fail(op, `toIndex ${toIndex} is outside 0..${Math.max(0, ids.length - 1)}`);
  }
  ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, id);
}

function removeId(ids: Id[], id: Id): boolean {
  const index = ids.indexOf(id);
  if (index < 0) return false;
  ids.splice(index, 1);
  return true;
}

function findSceneSection(project: NarrativeProject, sceneId: Id): Section | undefined {
  return Object.values(project.sections).find((section) => section.childIds.includes(sceneId));
}

function findBeatParent(project: NarrativeProject, beatId: Id): ParentRef | undefined {
  for (const section of Object.values(project.sections)) {
    if (section.childIds.includes(beatId)) return { type: "section", id: section.id };
  }
  for (const scene of Object.values(project.scenes)) {
    if (scene.beatIds.includes(beatId)) return { type: "scene", id: scene.id };
  }
  return undefined;
}

function findCueBeat(project: NarrativeProject, cueId: Id): Beat | undefined {
  return Object.values(project.beats).find((beat) => beat.cueIds.includes(cueId));
}

function findBlockCue(project: NarrativeProject, blockId: Id): Cue | undefined {
  return Object.values(project.cues).find(
    (cue) => cue.visualBlockIds.includes(blockId) || cue.audioBlockIds.includes(blockId),
  );
}

function parentArray(project: NarrativeProject, parent: ParentRef, op: NarrativeOperation["op"]): Id[] {
  if (parent.type === "section") {
    const section = project.sections[parent.id];
    if (section === undefined) fail(op, `unknown Section ${parent.id}`);
    return section.childIds;
  }
  const scene = project.scenes[parent.id];
  if (scene === undefined) fail(op, `unknown Scene ${parent.id}`);
  return scene.beatIds;
}

function blockLane(block: ContentBlock): "visual" | "audio" {
  return isVisualBlock(block) ? "visual" : "audio";
}

function removeRelationshipsForIds(
  project: NarrativeProject,
  removed: Set<Id>,
  result: MutableResult,
): void {
  for (const relationship of Object.values(project.relationships)) {
    if (!removed.has(relationship.sourceId) && !removed.has(relationship.targetId)) continue;
    delete project.relationships[relationship.id];
    result.removedIds.add(relationship.id);
    result.relationshipEffects.push({
      relationshipId: relationship.id,
      effect: "removed",
      reason: "endpoint removed with narrative structure",
    });
  }
}

function deleteBlockInternal(project: NarrativeProject, blockId: Id, result: MutableResult): void {
  const block = project.blocks[blockId];
  if (block === undefined) return;
  const cue = findBlockCue(project, blockId);
  if (cue !== undefined) {
    removeId(cue.visualBlockIds, blockId);
    removeId(cue.audioBlockIds, blockId);
    result.changedIds.add(cue.id);
  }
  delete project.blocks[blockId];
  result.removedIds.add(blockId);
}

function deleteCueInternal(project: NarrativeProject, cueId: Id, result: MutableResult): void {
  const cue = project.cues[cueId];
  if (cue === undefined) return;
  const beat = findCueBeat(project, cueId);
  if (beat !== undefined) {
    removeId(beat.cueIds, cueId);
    result.changedIds.add(beat.id);
  }
  for (const blockId of [...cue.visualBlockIds, ...cue.audioBlockIds]) {
    deleteBlockInternal(project, blockId, result);
  }
  delete project.cues[cueId];
  result.removedIds.add(cueId);
}

function deleteBeatInternal(project: NarrativeProject, beatId: Id, result: MutableResult): void {
  const beat = project.beats[beatId];
  if (beat === undefined) return;
  const parent = findBeatParent(project, beatId);
  if (parent !== undefined) {
    removeId(parentArray(project, parent, "deleteBeat"), beatId);
    result.changedIds.add(parent.id);
  }
  for (const cueId of [...beat.cueIds]) deleteCueInternal(project, cueId, result);
  delete project.beats[beatId];
  result.removedIds.add(beatId);
}

function deleteSceneInternal(project: NarrativeProject, sceneId: Id, result: MutableResult): void {
  const scene = project.scenes[sceneId];
  if (scene === undefined) return;
  const section = findSceneSection(project, sceneId);
  if (section !== undefined) {
    removeId(section.childIds, sceneId);
    result.changedIds.add(section.id);
  }
  for (const beatId of [...scene.beatIds]) deleteBeatInternal(project, beatId, result);
  delete project.scenes[sceneId];
  result.removedIds.add(sceneId);
}

function deleteSectionInternal(project: NarrativeProject, sectionId: Id, result: MutableResult): void {
  const section = project.sections[sectionId];
  if (section === undefined) return;
  removeId(project.script.sectionIds, sectionId);
  result.changedIds.add(project.script.id);
  for (const childId of [...section.childIds]) {
    if (project.scenes[childId] !== undefined) deleteSceneInternal(project, childId, result);
    else if (project.beats[childId] !== undefined) deleteBeatInternal(project, childId, result);
  }
  delete project.sections[sectionId];
  result.removedIds.add(sectionId);
}

function collectOwnedCueIds(project: NarrativeProject, beatIds: Id[]): Id[] {
  return beatIds.flatMap((beatId) => project.beats[beatId]?.cueIds ?? []);
}

function sameSet(a: Id[], b: Id[]): boolean {
  return a.length === b.length && new Set(a).size === a.length && a.every((id) => b.includes(id));
}

function splitRelationshipAssignment(
  operation: Extract<NarrativeOperation, { op: "splitBeat" }>,
  relationshipId: Id,
): SplitRelationshipAssignment {
  if (operation.relationshipPolicy === "manual") {
    const assignment = operation.relationshipAssignments?.[relationshipId];
    if (assignment === undefined) fail(operation.op, `missing manual relationship assignment for ${relationshipId}`);
    return assignment;
  }
  return { side: operation.relationshipPolicy };
}

function duplicateRelationship(
  project: NarrativeProject,
  relationship: Relationship,
  newSourceId: Id,
  duplicateId: Id | undefined,
  operation: Extract<NarrativeOperation, { op: "splitBeat" }>,
  result: MutableResult,
): void {
  const id = duplicateId ?? operation.duplicateRelationshipIds?.[relationship.id];
  if (id === undefined) fail(operation.op, `relationship ${relationship.id} needs a duplicateRelationshipId for policy both`);
  requireUniqueId(project, id, operation.op);
  project.relationships[id] = { ...relationship, id, sourceId: newSourceId };
  result.createdIds.add(id);
  result.relationshipEffects.push({
    relationshipId: id,
    effect: "created",
    fromId: relationship.sourceId,
    toId: newSourceId,
    reason: `duplicated from ${relationship.id} during split`,
  });
}

export function applyOperation(
  input: NarrativeProject,
  operation: NarrativeOperation,
): OperationResult {
  assertValidNarrativeProject(input);
  const project = cloneProject(input);
  const result = newResult();

  switch (operation.op) {
    case "createSection": {
      requireUniqueId(project, operation.section.id, operation.op);
      if (operation.section.childIds.length > 0) fail(operation.op, "new Section must start with no children");
      project.sections[operation.section.id] = { ...operation.section, childIds: [] };
      insertAt(project.script.sectionIds, operation.section.id, operation.index, operation.op);
      result.createdIds.add(operation.section.id);
      result.changedIds.add(project.script.id);
      break;
    }
    case "createScene": {
      requireUniqueId(project, operation.scene.id, operation.op);
      if (operation.scene.beatIds.length > 0) fail(operation.op, "new Scene must start with no Beats");
      const section = project.sections[operation.sectionId];
      if (section === undefined) fail(operation.op, `unknown Section ${operation.sectionId}`);
      project.scenes[operation.scene.id] = { ...operation.scene, beatIds: [] };
      insertAt(section.childIds, operation.scene.id, operation.index, operation.op);
      result.createdIds.add(operation.scene.id);
      result.changedIds.add(section.id);
      break;
    }
    case "createBeat": {
      requireUniqueId(project, operation.beat.id, operation.op);
      if (operation.beat.cueIds.length > 0) fail(operation.op, "new Beat must start with no Cues");
      const ids = parentArray(project, operation.parent, operation.op);
      project.beats[operation.beat.id] = { ...operation.beat, cueIds: [] };
      insertAt(ids, operation.beat.id, operation.index, operation.op);
      result.createdIds.add(operation.beat.id);
      result.changedIds.add(operation.parent.id);
      break;
    }
    case "createCue": {
      requireUniqueId(project, operation.cue.id, operation.op);
      if (operation.cue.visualBlockIds.length > 0 || operation.cue.audioBlockIds.length > 0) {
        fail(operation.op, "new Cue must start with no ContentBlocks");
      }
      const beat = project.beats[operation.beatId];
      if (beat === undefined) fail(operation.op, `unknown Beat ${operation.beatId}`);
      project.cues[operation.cue.id] = { ...operation.cue, visualBlockIds: [], audioBlockIds: [] };
      insertAt(beat.cueIds, operation.cue.id, operation.index, operation.op);
      result.createdIds.add(operation.cue.id);
      result.changedIds.add(beat.id);
      break;
    }
    case "createBlock": {
      requireUniqueId(project, operation.block.id, operation.op);
      const cue = project.cues[operation.cueId];
      if (cue === undefined) fail(operation.op, `unknown Cue ${operation.cueId}`);
      project.blocks[operation.block.id] = { ...operation.block };
      const ids = isVisualBlock(operation.block) ? cue.visualBlockIds : cue.audioBlockIds;
      insertAt(ids, operation.block.id, operation.index, operation.op);
      result.createdIds.add(operation.block.id);
      result.changedIds.add(cue.id);
      break;
    }
    case "updateSection": {
      const section = project.sections[operation.sectionId];
      if (section === undefined) fail(operation.op, `unknown Section ${operation.sectionId}`);
      if (operation.title === undefined) delete section.title;
      else section.title = operation.title;
      result.changedIds.add(section.id);
      break;
    }
    case "updateScene": {
      const scene = project.scenes[operation.sceneId];
      if (scene === undefined) fail(operation.op, `unknown Scene ${operation.sceneId}`);
      if (operation.title === undefined) delete scene.title;
      else scene.title = operation.title;
      result.changedIds.add(scene.id);
      break;
    }
    case "updateBeat": {
      const beat = project.beats[operation.beatId];
      if (beat === undefined) fail(operation.op, `unknown Beat ${operation.beatId}`);
      if (operation.title === undefined) delete beat.title;
      else beat.title = operation.title;
      if (operation.summary === undefined) delete beat.summary;
      else beat.summary = operation.summary;
      result.changedIds.add(beat.id);
      break;
    }
    case "updateCue": {
      const cue = project.cues[operation.cueId];
      if (cue === undefined) fail(operation.op, `unknown Cue ${operation.cueId}`);
      if (operation.explicitDurationMs === null || operation.explicitDurationMs === undefined) {
        delete cue.explicitDurationMs;
      } else {
        cue.explicitDurationMs = operation.explicitDurationMs;
      }
      result.changedIds.add(cue.id);
      break;
    }
    case "updateBlock": {
      const current = project.blocks[operation.block.id];
      if (current === undefined) fail(operation.op, `unknown ContentBlock ${operation.block.id}`);
      if (current.type !== operation.block.type) {
        fail(operation.op, "updateBlock cannot change block type; delete/create to change authored/source semantics");
      }
      project.blocks[operation.block.id] = { ...operation.block };
      result.changedIds.add(operation.block.id);
      break;
    }
    case "moveSection": {
      moveWithin(project.script.sectionIds, operation.sectionId, operation.toIndex, operation.op);
      result.changedIds.add(project.script.id);
      result.changedIds.add(operation.sectionId);
      break;
    }
    case "moveScene": {
      const scene = project.scenes[operation.sceneId];
      if (scene === undefined) fail(operation.op, `unknown Scene ${operation.sceneId}`);
      const current = findSceneSection(project, scene.id);
      const target = project.sections[operation.toSectionId];
      if (current === undefined) fail(operation.op, `Scene ${scene.id} has no parent Section`);
      if (target === undefined) fail(operation.op, `unknown Section ${operation.toSectionId}`);
      if (current.id === target.id) moveWithin(target.childIds, scene.id, operation.toIndex, operation.op);
      else {
        removeId(current.childIds, scene.id);
        insertAt(target.childIds, scene.id, operation.toIndex, operation.op);
        result.changedIds.add(current.id);
      }
      result.changedIds.add(target.id);
      result.changedIds.add(scene.id);
      break;
    }
    case "moveBeat": {
      const beat = project.beats[operation.beatId];
      if (beat === undefined) fail(operation.op, `unknown Beat ${operation.beatId}`);
      const current = findBeatParent(project, beat.id);
      if (current === undefined) fail(operation.op, `Beat ${beat.id} has no parent`);
      const currentIds = parentArray(project, current, operation.op);
      const targetIds = parentArray(project, operation.toParent, operation.op);
      if (current.type === operation.toParent.type && current.id === operation.toParent.id) {
        moveWithin(targetIds, beat.id, operation.toIndex, operation.op);
      } else {
        removeId(currentIds, beat.id);
        insertAt(targetIds, beat.id, operation.toIndex, operation.op);
        result.changedIds.add(current.id);
      }
      result.changedIds.add(operation.toParent.id);
      result.changedIds.add(beat.id);
      break;
    }
    case "moveCue": {
      const cue = project.cues[operation.cueId];
      if (cue === undefined) fail(operation.op, `unknown Cue ${operation.cueId}`);
      const current = findCueBeat(project, cue.id);
      const target = project.beats[operation.toBeatId];
      if (current === undefined) fail(operation.op, `Cue ${cue.id} has no parent Beat`);
      if (target === undefined) fail(operation.op, `unknown Beat ${operation.toBeatId}`);
      if (current.id === target.id) moveWithin(target.cueIds, cue.id, operation.toIndex, operation.op);
      else {
        removeId(current.cueIds, cue.id);
        insertAt(target.cueIds, cue.id, operation.toIndex, operation.op);
        result.changedIds.add(current.id);
      }
      result.changedIds.add(target.id);
      result.changedIds.add(cue.id);
      break;
    }
    case "moveBlock": {
      const block = project.blocks[operation.blockId];
      if (block === undefined) fail(operation.op, `unknown ContentBlock ${operation.blockId}`);
      const current = findBlockCue(project, block.id);
      const target = project.cues[operation.toCueId];
      if (current === undefined) fail(operation.op, `ContentBlock ${block.id} has no parent Cue`);
      if (target === undefined) fail(operation.op, `unknown Cue ${operation.toCueId}`);
      const lane = blockLane(block);
      const currentIds = lane === "visual" ? current.visualBlockIds : current.audioBlockIds;
      const targetIds = lane === "visual" ? target.visualBlockIds : target.audioBlockIds;
      if (current.id === target.id) moveWithin(targetIds, block.id, operation.toIndex, operation.op);
      else {
        removeId(currentIds, block.id);
        insertAt(targetIds, block.id, operation.toIndex, operation.op);
        result.changedIds.add(current.id);
      }
      result.changedIds.add(target.id);
      result.changedIds.add(block.id);
      break;
    }
    case "splitBeat": {
      const beat = project.beats[operation.beatId];
      if (beat === undefined) fail(operation.op, `unknown Beat ${operation.beatId}`);
      requireUniqueId(project, operation.newBeatId, operation.op);
      const all = [...operation.leftCueIds, ...operation.rightCueIds];
      if (!sameSet(all, beat.cueIds)) {
        fail(operation.op, "leftCueIds + rightCueIds must partition the original Cue IDs exactly once");
      }
      const parent = findBeatParent(project, beat.id);
      if (parent === undefined) fail(operation.op, `Beat ${beat.id} has no parent`);
      const ids = parentArray(project, parent, operation.op);
      const index = ids.indexOf(beat.id);
      beat.cueIds = [...operation.leftCueIds];
      const rightBeat: Beat = {
        id: operation.newBeatId,
        cueIds: [...operation.rightCueIds],
        ...(operation.rightTitle === undefined ? {} : { title: operation.rightTitle }),
        ...(operation.rightSummary === undefined ? {} : { summary: operation.rightSummary }),
      };
      project.beats[rightBeat.id] = rightBeat;
      ids.splice(index + 1, 0, rightBeat.id);
      result.changedIds.add(beat.id);
      result.changedIds.add(parent.id);
      result.createdIds.add(rightBeat.id);

      for (const relationship of Object.values(project.relationships).filter((item) => item.sourceId === beat.id)) {
        const assignment = splitRelationshipAssignment(operation, relationship.id);
        if (assignment.side === "left") continue;
        if (assignment.side === "right") {
          const fromId = relationship.sourceId;
          relationship.sourceId = rightBeat.id;
          result.changedIds.add(relationship.id);
          result.relationshipEffects.push({
            relationshipId: relationship.id,
            effect: "retargeted",
            fromId,
            toId: rightBeat.id,
            reason: "splitBeat relationship policy right",
          });
          continue;
        }
        duplicateRelationship(
          project,
          relationship,
          rightBeat.id,
          assignment.duplicateRelationshipId,
          operation,
          result,
        );
      }
      break;
    }
    case "mergeBeats": {
      const canonical = project.beats[operation.canonicalBeatId];
      if (canonical === undefined) fail(operation.op, `unknown canonical Beat ${operation.canonicalBeatId}`);
      const merged = [...new Set(operation.mergedBeatIds)];
      if (merged.includes(canonical.id)) fail(operation.op, "mergedBeatIds must not contain the canonical Beat");
      if (merged.length !== operation.mergedBeatIds.length) fail(operation.op, "mergedBeatIds contains duplicates");
      for (const id of merged) if (project.beats[id] === undefined) fail(operation.op, `unknown merged Beat ${id}`);
      const expectedCueIds = collectOwnedCueIds(project, [canonical.id, ...merged]);
      if (!sameSet(operation.cueIds, expectedCueIds)) {
        fail(operation.op, "cueIds must contain every Cue from all merged Beats exactly once");
      }
      canonical.cueIds = [...operation.cueIds];
      result.changedIds.add(canonical.id);

      for (const mergedId of merged) {
        const parent = findBeatParent(project, mergedId);
        if (parent !== undefined) {
          removeId(parentArray(project, parent, operation.op), mergedId);
          result.changedIds.add(parent.id);
        }
        for (const relationship of Object.values(project.relationships).filter((item) => item.sourceId === mergedId)) {
          const equivalent = Object.values(project.relationships).find(
            (candidate) =>
              candidate.id !== relationship.id &&
              candidate.sourceId === canonical.id &&
              candidate.targetId === relationship.targetId &&
              candidate.type === relationship.type,
          );
          if (equivalent !== undefined) {
            delete project.relationships[relationship.id];
            result.removedIds.add(relationship.id);
            result.relationshipEffects.push({
              relationshipId: relationship.id,
              effect: "removed",
              reason: `normalized duplicate of ${equivalent.id} during merge`,
            });
          } else {
            relationship.sourceId = canonical.id;
            result.changedIds.add(relationship.id);
            result.relationshipEffects.push({
              relationshipId: relationship.id,
              effect: "retargeted",
              fromId: mergedId,
              toId: canonical.id,
              reason: "mergeBeats preserved relationship on canonical Beat",
            });
          }
        }
        delete project.beats[mergedId];
        result.removedIds.add(mergedId);
      }
      result.metadata = { mergedBeatIds: merged };
      break;
    }
    case "deleteSection": {
      if (project.sections[operation.sectionId] === undefined) fail(operation.op, `unknown Section ${operation.sectionId}`);
      deleteSectionInternal(project, operation.sectionId, result);
      removeRelationshipsForIds(project, result.removedIds, result);
      break;
    }
    case "deleteScene": {
      if (project.scenes[operation.sceneId] === undefined) fail(operation.op, `unknown Scene ${operation.sceneId}`);
      deleteSceneInternal(project, operation.sceneId, result);
      removeRelationshipsForIds(project, result.removedIds, result);
      break;
    }
    case "deleteBeat": {
      if (project.beats[operation.beatId] === undefined) fail(operation.op, `unknown Beat ${operation.beatId}`);
      deleteBeatInternal(project, operation.beatId, result);
      removeRelationshipsForIds(project, result.removedIds, result);
      break;
    }
    case "deleteCue": {
      if (project.cues[operation.cueId] === undefined) fail(operation.op, `unknown Cue ${operation.cueId}`);
      deleteCueInternal(project, operation.cueId, result);
      removeRelationshipsForIds(project, result.removedIds, result);
      break;
    }
    case "deleteBlock": {
      if (project.blocks[operation.blockId] === undefined) fail(operation.op, `unknown ContentBlock ${operation.blockId}`);
      deleteBlockInternal(project, operation.blockId, result);
      removeRelationshipsForIds(project, result.removedIds, result);
      break;
    }
    case "linkShotIntent": {
      requireUniqueId(project, operation.relationshipId, operation.op);
      if (project.shotIntents[operation.shotIntentId] === undefined) fail(operation.op, `unknown ShotIntent ${operation.shotIntentId}`);
      if (project.beats[operation.sourceId] === undefined && project.cues[operation.sourceId] === undefined) {
        fail(operation.op, "sourceId must be a Beat or Cue");
      }
      project.relationships[operation.relationshipId] = {
        id: operation.relationshipId,
        sourceId: operation.sourceId,
        targetId: operation.shotIntentId,
        type: "requires_shot_intent",
      };
      result.createdIds.add(operation.relationshipId);
      result.relationshipEffects.push({ relationshipId: operation.relationshipId, effect: "created" });
      break;
    }
    case "unlinkShotIntent": {
      const relationship = project.relationships[operation.relationshipId];
      if (relationship === undefined || relationship.type !== "requires_shot_intent") {
        fail(operation.op, `unknown ShotIntent relationship ${operation.relationshipId}`);
      }
      delete project.relationships[relationship.id];
      result.removedIds.add(relationship.id);
      result.relationshipEffects.push({ relationshipId: relationship.id, effect: "removed" });
      break;
    }
    case "linkMediaSegment": {
      requireUniqueId(project, operation.relationshipId, operation.op);
      if (project.mediaSegments[operation.mediaSegmentId] === undefined) fail(operation.op, `unknown MediaSegment ${operation.mediaSegmentId}`);
      if (
        project.beats[operation.sourceId] === undefined &&
        project.cues[operation.sourceId] === undefined &&
        project.shotIntents[operation.sourceId] === undefined
      ) {
        fail(operation.op, "sourceId must be a Beat, Cue, or ShotIntent");
      }
      project.relationships[operation.relationshipId] = {
        id: operation.relationshipId,
        sourceId: operation.sourceId,
        targetId: operation.mediaSegmentId,
        type: "supported_by_media",
      };
      result.createdIds.add(operation.relationshipId);
      result.relationshipEffects.push({ relationshipId: operation.relationshipId, effect: "created" });
      break;
    }
    case "unlinkMediaSegment": {
      const relationship = project.relationships[operation.relationshipId];
      if (relationship === undefined || relationship.type !== "supported_by_media") {
        fail(operation.op, `unknown MediaSegment relationship ${operation.relationshipId}`);
      }
      delete project.relationships[relationship.id];
      result.removedIds.add(relationship.id);
      result.relationshipEffects.push({ relationshipId: relationship.id, effect: "removed" });
      break;
    }
    case "trimSourceExcerpt": {
      const block = project.blocks[operation.blockId];
      if (block === undefined || block.type !== "source_excerpt") {
        fail(operation.op, `${operation.blockId} is not a SourceExcerpt`);
      }
      block.sourceInMs = operation.sourceInMs;
      block.sourceOutMs = operation.sourceOutMs;
      result.changedIds.add(block.id);
      break;
    }
  }

  assertValidNarrativeProject(project);
  return asResult(project, result);
}

export function applyOperations(
  input: NarrativeProject,
  operations: readonly NarrativeOperation[],
): OperationResult {
  let model = input;
  const combined = newResult();

  for (const operation of operations) {
    const result = applyOperation(model, operation);
    model = result.model;
    result.changedIds.forEach((id) => combined.changedIds.add(id));
    result.createdIds.forEach((id) => combined.createdIds.add(id));
    result.removedIds.forEach((id) => combined.removedIds.add(id));
    combined.relationshipEffects.push(...result.relationshipEffects);
    combined.warnings.push(...result.warnings);
    if (result.metadata?.mergedBeatIds !== undefined) {
      combined.metadata = {
        mergedBeatIds: [
          ...(combined.metadata?.mergedBeatIds ?? []),
          ...result.metadata.mergedBeatIds,
        ],
      };
    }
  }

  return asResult(model, combined);
}
