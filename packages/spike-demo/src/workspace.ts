import type { Id, NarrativeProject } from "@salai/script-model";

export type ParkingState = "active" | "parked";

export type CanonicalReference =
  | { type: "scene"; id: Id }
  | { type: "beat"; id: Id };

export type IdeaCard = {
  id: Id;
  text: string;
};

export type BoardItem = {
  id: Id;
  reference?: CanonicalReference;
  ideaCard?: IdeaCard;
  x?: number;
  y?: number;
  parkingState?: ParkingState;
};

export type Board = {
  items: Record<Id, BoardItem>;
  itemIds: Id[];
};

export type Workspace = {
  id: Id;
  name: string;
  kind: "story-wall";
  board: Board;
};

export function createWorkspace(
  name = "Story Wall",
  id = "story-wall-workspace",
): Workspace {
  return {
    id,
    name,
    kind: "story-wall",
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

function referenceKey(reference: CanonicalReference): string {
  return `${reference.type}:${reference.id}`;
}

export function boardItemIdForReference(reference: CanonicalReference): string {
  return `ref:${referenceKey(reference)}`;
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

export function moveBoardItem(
  workspace: Workspace,
  itemId: Id,
  x: number,
  y: number,
): Workspace {
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

export function updateIdeaCardText(
  workspace: Workspace,
  itemId: Id,
  text: string,
): Workspace {
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

function storyWallReferences(project: NarrativeProject): CanonicalReference[] {
  const references: CanonicalReference[] = [];
  for (const sectionId of project.script.sectionIds) {
    const section = project.sections[sectionId];
    if (!section) continue;

    for (const childId of section.childIds) {
      const scene = project.scenes[childId];
      if (scene) {
        references.push({ type: "scene", id: scene.id });
        for (const beatId of scene.beatIds) {
          references.push({ type: "beat", id: beatId });
        }
      } else if (project.beats[childId]) {
        references.push({ type: "beat", id: childId });
      }
    }
  }
  return references;
}

function defaultPosition(index: number): { x: number; y: number } {
  const columns = 4;
  return {
    x: 28 + (index % columns) * 246,
    y: 28 + Math.floor(index / columns) * 170,
  };
}

export function createStoryWallWorkspace(project: NarrativeProject): Workspace {
  let workspace = createWorkspace();
  storyWallReferences(project).forEach((reference, index) => {
    workspace = addBoardReference(
      workspace,
      boardItemIdForReference(reference),
      reference,
      defaultPosition(index),
    );
  });
  return workspace;
}

export function syncWorkspaceWithProject(
  workspace: Workspace,
  project: NarrativeProject,
): Workspace {
  const validReferences = storyWallReferences(project);
  const validKeys = new Set(validReferences.map(referenceKey));

  let next = workspace;
  for (const itemId of workspace.board.itemIds) {
    const item = workspace.board.items[itemId];
    if (item?.reference && !validKeys.has(referenceKey(item.reference))) {
      next = removeBoardItem(next, itemId);
    }
  }

  const existingReferenceKeys = new Set(
    next.board.itemIds.flatMap((itemId) => {
      const reference = next.board.items[itemId]?.reference;
      return reference ? [referenceKey(reference)] : [];
    }),
  );

  let index = next.board.itemIds.length;
  for (const reference of validReferences) {
    const key = referenceKey(reference);
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
