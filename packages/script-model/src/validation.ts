import {
  isAudioBlock,
  isVisualBlock,
  type ContentBlock,
  type Id,
  type NarrativeProject,
} from "./types.js";

export type ValidationIssue = {
  code: string;
  path: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

type EntityKind =
  | "script"
  | "section"
  | "scene"
  | "beat"
  | "cue"
  | "block"
  | "media_segment"
  | "shot_intent"
  | "relationship";

function hasDuplicateIds(ids: readonly Id[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateNarrativeProject(
  project: NarrativeProject,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const idOwners = new Map<Id, string>();
  const hierarchyOwners = new Map<Id, string>();

  const issue = (code: string, path: string, message: string): void => {
    issues.push({ code, path, message });
  };

  const registerId = (id: Id, path: string): void => {
    const existing = idOwners.get(id);
    if (existing !== undefined) {
      issue("duplicate_id", path, `ID ${id} is already used by ${existing}`);
      return;
    }
    idOwners.set(id, path);
  };

  const registerHierarchyOwner = (id: Id, owner: string, path: string): void => {
    const existing = hierarchyOwners.get(id);
    if (existing !== undefined && existing !== owner) {
      issue(
        "multiple_parents",
        path,
        `${id} is referenced by both ${existing} and ${owner}`,
      );
      return;
    }
    hierarchyOwners.set(id, owner);
  };

  const validateOrderedIds = (ids: readonly Id[], path: string): void => {
    if (hasDuplicateIds(ids)) {
      issue("duplicate_order_entry", path, "Ordered ID list contains duplicates");
    }
  };

  if (!Number.isInteger(project.schemaVersion) || project.schemaVersion < 1) {
    issue(
      "invalid_schema_version",
      "schemaVersion",
      "schemaVersion must be a positive integer",
    );
  }

  registerId(project.script.id, "script.id");
  validateOrderedIds(project.script.sectionIds, "script.sectionIds");

  if (
    project.script.targetDurationMs !== undefined &&
    project.script.targetDurationMs < 0
  ) {
    issue(
      "invalid_duration",
      "script.targetDurationMs",
      "targetDurationMs must be non-negative",
    );
  }

  const registerCollection = <T extends { id: Id }>(
    collection: Record<Id, T>,
    kind: EntityKind,
  ): void => {
    for (const [key, entity] of Object.entries(collection)) {
      const path = `${kind}s.${key}`;
      if (key !== entity.id) {
        issue("id_key_mismatch", `${path}.id`, `Map key ${key} does not match ${entity.id}`);
      }
      registerId(entity.id, `${path}.id`);
    }
  };

  registerCollection(project.sections, "section");
  registerCollection(project.scenes, "scene");
  registerCollection(project.beats, "beat");
  registerCollection(project.cues, "cue");
  registerCollection(project.blocks, "block");
  registerCollection(project.mediaSegments, "media_segment");
  registerCollection(project.shotIntents, "shot_intent");
  registerCollection(project.relationships, "relationship");

  const entityKind = (id: Id): EntityKind | undefined => {
    if (id === project.script.id) return "script";
    if (project.sections[id] !== undefined) return "section";
    if (project.scenes[id] !== undefined) return "scene";
    if (project.beats[id] !== undefined) return "beat";
    if (project.cues[id] !== undefined) return "cue";
    if (project.blocks[id] !== undefined) return "block";
    if (project.mediaSegments[id] !== undefined) return "media_segment";
    if (project.shotIntents[id] !== undefined) return "shot_intent";
    if (project.relationships[id] !== undefined) return "relationship";
    return undefined;
  };

  for (const [index, sectionId] of project.script.sectionIds.entries()) {
    const path = `script.sectionIds[${index}]`;
    if (project.sections[sectionId] === undefined) {
      issue("dangling_reference", path, `Unknown Section ${sectionId}`);
    } else {
      registerHierarchyOwner(sectionId, project.script.id, path);
    }
  }

  for (const section of Object.values(project.sections)) {
    validateOrderedIds(section.childIds, `sections.${section.id}.childIds`);
    for (const [index, childId] of section.childIds.entries()) {
      const path = `sections.${section.id}.childIds[${index}]`;
      const isScene = project.scenes[childId] !== undefined;
      const isBeat = project.beats[childId] !== undefined;
      if (!isScene && !isBeat) {
        issue("dangling_reference", path, `Unknown Scene or Beat ${childId}`);
        continue;
      }
      registerHierarchyOwner(childId, section.id, path);
    }
  }

  for (const scene of Object.values(project.scenes)) {
    validateOrderedIds(scene.beatIds, `scenes.${scene.id}.beatIds`);
    for (const [index, beatId] of scene.beatIds.entries()) {
      const path = `scenes.${scene.id}.beatIds[${index}]`;
      if (project.beats[beatId] === undefined) {
        issue("dangling_reference", path, `Unknown Beat ${beatId}`);
      } else {
        registerHierarchyOwner(beatId, scene.id, path);
      }
    }
  }

  for (const beat of Object.values(project.beats)) {
    validateOrderedIds(beat.cueIds, `beats.${beat.id}.cueIds`);
    for (const [index, cueId] of beat.cueIds.entries()) {
      const path = `beats.${beat.id}.cueIds[${index}]`;
      if (project.cues[cueId] === undefined) {
        issue("dangling_reference", path, `Unknown Cue ${cueId}`);
      } else {
        registerHierarchyOwner(cueId, beat.id, path);
      }
    }
  }

  for (const cue of Object.values(project.cues)) {
    validateOrderedIds(cue.visualBlockIds, `cues.${cue.id}.visualBlockIds`);
    validateOrderedIds(cue.audioBlockIds, `cues.${cue.id}.audioBlockIds`);

    if (cue.explicitDurationMs !== undefined && cue.explicitDurationMs < 0) {
      issue(
        "invalid_duration",
        `cues.${cue.id}.explicitDurationMs`,
        "explicitDurationMs must be non-negative",
      );
    }

    const validateBlockRef = (
      blockId: Id,
      path: string,
      lane: "visual" | "audio",
    ): void => {
      const block = project.blocks[blockId];
      if (block === undefined) {
        issue("dangling_reference", path, `Unknown ContentBlock ${blockId}`);
        return;
      }
      const correctLane = lane === "visual" ? isVisualBlock(block) : isAudioBlock(block);
      if (!correctLane) {
        issue(
          "invalid_block_lane",
          path,
          `${block.type} block ${blockId} cannot be placed in the ${lane} lane`,
        );
      }
      registerHierarchyOwner(blockId, cue.id, path);
    };

    cue.visualBlockIds.forEach((blockId, index) =>
      validateBlockRef(blockId, `cues.${cue.id}.visualBlockIds[${index}]`, "visual"),
    );
    cue.audioBlockIds.forEach((blockId, index) =>
      validateBlockRef(blockId, `cues.${cue.id}.audioBlockIds[${index}]`, "audio"),
    );
  }

  const requireHierarchyOwner = (collection: Record<Id, { id: Id }>, kind: string): void => {
    for (const entity of Object.values(collection)) {
      if (hierarchyOwners.has(entity.id)) continue;
      issue("orphaned_entity", `${kind}.${entity.id}`, `${entity.id} is not reachable from the Script hierarchy`);
    }
  };

  requireHierarchyOwner(project.sections, "sections");
  requireHierarchyOwner(project.scenes, "scenes");
  requireHierarchyOwner(project.beats, "beats");
  requireHierarchyOwner(project.cues, "cues");
  requireHierarchyOwner(project.blocks, "blocks");

  for (const segment of Object.values(project.mediaSegments)) {
    if (segment.sourceInMs < 0 || segment.sourceOutMs <= segment.sourceInMs) {
      issue(
        "invalid_media_range",
        `mediaSegments.${segment.id}`,
        "MediaSegment sourceOutMs must be greater than non-negative sourceInMs",
      );
    }
  }

  for (const block of Object.values(project.blocks)) {
    if (block.type !== "source_excerpt") continue;
    validateSourceExcerpt(block, project, issue);
  }

  for (const relationship of Object.values(project.relationships)) {
    const path = `relationships.${relationship.id}`;
    const sourceKind = entityKind(relationship.sourceId);
    const targetKind = entityKind(relationship.targetId);

    if (sourceKind === undefined || sourceKind === "relationship") {
      issue("invalid_relationship_source", `${path}.sourceId`, "Relationship source is invalid");
      continue;
    }
    if (targetKind === undefined || targetKind === "relationship") {
      issue("invalid_relationship_target", `${path}.targetId`, "Relationship target is invalid");
      continue;
    }

    if (
      relationship.type === "requires_shot_intent" &&
      !((sourceKind === "beat" || sourceKind === "cue") && targetKind === "shot_intent")
    ) {
      issue(
        "invalid_relationship_types",
        path,
        "requires_shot_intent must link a Beat/Cue to a ShotIntent",
      );
    }

    if (
      relationship.type === "supported_by_media" &&
      !(
        (sourceKind === "beat" || sourceKind === "cue" || sourceKind === "shot_intent") &&
        targetKind === "media_segment"
      )
    ) {
      issue(
        "invalid_relationship_types",
        path,
        "supported_by_media must link a Beat/Cue/ShotIntent to a MediaSegment",
      );
    }

    if (relationship.type === "source_excerpt_of") {
      const sourceBlock = project.blocks[relationship.sourceId];
      if (
        sourceKind !== "block" ||
        sourceBlock?.type !== "source_excerpt" ||
        targetKind !== "media_segment"
      ) {
        issue(
          "invalid_relationship_types",
          path,
          "source_excerpt_of must link a SourceExcerpt to a MediaSegment",
        );
      } else if (sourceBlock.mediaSegmentId !== relationship.targetId) {
        issue(
          "source_relationship_mismatch",
          path,
          "source_excerpt_of target must match SourceExcerpt.mediaSegmentId",
        );
      }
    }
  }

  return { valid: issues.length === 0, issues };
}

function validateSourceExcerpt(
  block: Extract<ContentBlock, { type: "source_excerpt" }>,
  project: NarrativeProject,
  issue: (code: string, path: string, message: string) => void,
): void {
  const path = `blocks.${block.id}`;
  const segment = project.mediaSegments[block.mediaSegmentId];
  if (segment === undefined) {
    issue(
      "dangling_reference",
      `${path}.mediaSegmentId`,
      `Unknown MediaSegment ${block.mediaSegmentId}`,
    );
    return;
  }

  if (block.sourceInMs < 0 || block.sourceOutMs <= block.sourceInMs) {
    issue(
      "invalid_source_range",
      path,
      "SourceExcerpt sourceOutMs must be greater than non-negative sourceInMs",
    );
    return;
  }

  if (
    block.sourceInMs < segment.sourceInMs ||
    block.sourceOutMs > segment.sourceOutMs
  ) {
    issue(
      "source_range_outside_segment",
      path,
      `SourceExcerpt range must stay within MediaSegment ${segment.id}`,
    );
  }
}

export function assertValidNarrativeProject(project: NarrativeProject): void {
  const result = validateNarrativeProject(project);
  if (result.valid) return;
  const detail = result.issues.map((item) => `${item.path}: ${item.message}`).join("\n");
  throw new Error(`Invalid NarrativeProject:\n${detail}`);
}
