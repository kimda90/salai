import type { Id, NarrativeProject } from "@salai/script-model";

export type WorkspaceKind = "story-wall" | "paper-edit";
export type ParkingState = "active" | "parked";
export type CanonicalReferenceType = "section" | "scene" | "beat" | "cue" | "source-excerpt";

export type CanonicalReference = {
  type: CanonicalReferenceType;
  id: Id;
};

export type IdeaCard = {
  id: Id;
  text: string;
  kind?: "idea" | "question" | "alternative";
};

export type BoardItem = {
  id: Id;
  reference?: CanonicalReference;
  ideaCard?: IdeaCard;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  rotation?: number;
  label?: string;
  note?: string;
  lane?: string;
  parkingState?: ParkingState;
};

export type Board = {
  items: Record<Id, BoardItem>;
  itemIds: Id[];
};

export type Workspace = {
  id: Id;
  name: string;
  kind: WorkspaceKind;
  board: Board;
};

export function createWorkspace(kind: WorkspaceKind, name: string, id = `${kind}-workspace`): Workspace {
  return {
    id,
    name,
    kind,
    board: { items: {}, itemIds: [] },
  };
}

function withBoardItem(workspace: Workspace, item: BoardItem): Workspace {
  const exists = workspace.board.items[item.id] !== undefined;
  return {
    ...workspace,
    board: {
      items: { ...workspace.board.items, [item.id]: item },
      itemIds: exists ? workspace.board.itemIds : [...workspace.board.itemIds, item.id],
    },
  };
}

export function boardItemIdForReference(reference: CanonicalReference): string {
  return `ref:${reference.type}:${reference.id}`;
}

export function addBoardReference(
  workspace: Workspace,
  itemId: Id,
  reference: CanonicalReference,
  position: { x?: number; y?: number } = {},
): Workspace {
  return withBoardItem(workspace, {
    id: itemId,
    reference,
    parkingState: "active",
    ...position,
  });
}

export function moveBoardItem(workspace: Workspace, itemId: Id, x: number, y: number): Workspace {
  const item = workspace.board.items[itemId];
  if (!item) throw new Error(`Unknown BoardItem: ${itemId}`);
  return withBoardItem(workspace, { ...item, x, y });
}

export function setBoardItemParking(
  workspace: Workspace,
  itemId: Id,
  parkingState: ParkingState,
): Workspace {
  const item = workspace.board.items[itemId];
  if (!item) throw new Error(`Unknown BoardItem: ${itemId}`);
  return withBoardItem(workspace, { ...item, parkingState });
}

export function removeBoardItem(workspace: Workspace, itemId: Id): Workspace {
  if (!workspace.board.items[itemId]) return workspace;
  const items = { ...workspace.board.items };
  delete items[itemId];
  return {
    ...workspace,
    board: {
      items,
      itemIds: workspace.board.itemIds.filter((id) => id !== itemId),
    },
  };
}

export function createIdeaCard(
  workspace: Workspace,
  itemId: Id,
  ideaCard: IdeaCard,
  position: { x?: number; y?: number } = {},
): Workspace {
  return withBoardItem(workspace, {
    id: itemId,
    ideaCard,
    parkingState: "active",
    ...position,
  });
}

export function updateIdeaCardText(workspace: Workspace, itemId: Id, text: string): Workspace {
  const item = workspace.board.items[itemId];
  if (!item?.ideaCard) throw new Error(`BoardItem ${itemId} is not an IdeaCard`);
  return withBoardItem(workspace, {
    ...item,
    ideaCard: { ...item.ideaCard, text },
  });
}

export function promoteIdeaCardReference(
  workspace: Workspace,
  itemId: Id,
  reference: CanonicalReference,
): Workspace {
  const item = workspace.board.items[itemId];
  if (!item?.ideaCard) throw new Error(`BoardItem ${itemId} is not an IdeaCard`);
  return withBoardItem(workspace, {
    ...item,
    ideaCard: undefined,
    reference,
  });
}

export type MovementIntent =
  | { kind: "workspace"; itemId: Id; x: number; y: number }
  | {
      kind: "narrative";
      objectType: "beat" | "scene" | "section";
      objectId: Id;
      targetParentId?: Id;
      targetParentType?: "section" | "scene";
      toIndex: number;
    };

export function interpretMovementIntent(input: {
  mode: "free" | "structural";
  itemId: Id;
  reference?: CanonicalReference;
  x?: number;
  y?: number;
  toIndex?: number;
  targetParentId?: Id;
  targetParentType?: "section" | "scene";
}): MovementIntent {
  if (input.mode === "free") {
    return {
      kind: "workspace",
      itemId: input.itemId,
      x: input.x ?? 0,
      y: input.y ?? 0,
    };
  }

  if (!input.reference || !["beat", "scene", "section"].includes(input.reference.type)) {
    throw new Error("Structural movement requires a section, scene, or beat reference");
  }

  return {
    kind: "narrative",
    objectType: input.reference.type as "beat" | "scene" | "section",
    objectId: input.reference.id,
    targetParentId: input.targetParentId,
    targetParentType: input.targetParentType,
    toIndex: input.toIndex ?? 0,
  };
}

export function projectWorkspaceReferences(project: NarrativeProject): CanonicalReference[] {
  const refs: CanonicalReference[] = [];
  for (const sectionId of project.script.sectionIds) {
    refs.push({ type: "section", id: sectionId });
    const section = project.sections[sectionId];
    if (!section) continue;
    for (const childId of section.childIds) {
      const scene = project.scenes[childId];
      if (scene) {
        refs.push({ type: "scene", id: scene.id });
        for (const beatId of scene.beatIds) refs.push({ type: "beat", id: beatId });
      } else if (project.beats[childId]) {
        refs.push({ type: "beat", id: childId });
      }
    }
  }
  return refs;
}

function defaultPosition(index: number): { x: number; y: number } {
  const columns = 4;
  return {
    x: 28 + (index % columns) * 246,
    y: 28 + Math.floor(index / columns) * 170,
  };
}

export function createStoryWallWorkspace(project: NarrativeProject): Workspace {
  let workspace = createWorkspace("story-wall", "Story Wall");
  const references = projectWorkspaceReferences(project).filter(
    (reference) => reference.type === "scene" || reference.type === "beat",
  );
  references.forEach((reference, index) => {
    workspace = addBoardReference(
      workspace,
      boardItemIdForReference(reference),
      reference,
      defaultPosition(index),
    );
  });
  return workspace;
}

export function syncWorkspaceWithProject(workspace: Workspace, project: NarrativeProject): Workspace {
  const validReferences = projectWorkspaceReferences(project).filter(
    (reference) => reference.type === "scene" || reference.type === "beat",
  );
  const validKeys = new Set(validReferences.map((reference) => `${reference.type}:${reference.id}`));

  let next = workspace;
  for (const itemId of workspace.board.itemIds) {
    const item = workspace.board.items[itemId];
    if (!item?.reference) continue;
    const key = `${item.reference.type}:${item.reference.id}`;
    if (!validKeys.has(key)) next = removeBoardItem(next, itemId);
  }

  const existingReferenceKeys = new Set(
    next.board.itemIds.flatMap((itemId) => {
      const reference = next.board.items[itemId]?.reference;
      return reference ? [`${reference.type}:${reference.id}`] : [];
    }),
  );

  let index = next.board.itemIds.length;
  for (const reference of validReferences) {
    const key = `${reference.type}:${reference.id}`;
    if (existingReferenceKeys.has(key)) continue;
    next = addBoardReference(
      next,
      boardItemIdForReference(reference),
      reference,
      defaultPosition(index),
    );
    existingReferenceKeys.add(key);
    index += 1;
  }

  return next;
}
