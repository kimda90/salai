import {
  applyOperation,
  applyOperations,
  type DomainWarning,
  type NarrativeOperation,
  type NarrativeProject,
  type OperationResult,
  type ParentRef,
  type RelationshipEffect,
} from "@salai/script-model";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useSyncExternalStore,
} from "react";
import { createFixture, type FixtureKey } from "./fixtures";
import {
  createStoryWallWorkspace,
  promoteIdeaCardReference,
  syncWorkspaceWithProject,
  type Workspace,
} from "./workspace";

export type SelectionType = "section" | "scene" | "beat" | "cue";

export type CanonicalSelection = {
  type: SelectionType;
  id: string;
};

export type OperationFeedback = {
  error: string | null;
  warnings: DomainWarning[];
  relationshipEffects: RelationshipEffect[];
  changedIds: string[];
  createdIds: string[];
  removedIds: string[];
};

export type SalaiAppState = {
  fixtureKey: FixtureKey;
  project: NarrativeProject;
  workspace: Workspace;
  selection: CanonicalSelection | null;
  activeSurface: "outline" | "story-wall" | "av-script" | "paper-edit";
  feedback: OperationFeedback;
};

export type ProjectContextOptions = {
  includeWorkspace?: boolean;
  includeActiveSurface?: boolean;
};

export type SalaiProjectContext = {
  project: NarrativeProject;
  workspace?: Workspace;
  activeSurface?: SalaiAppState["activeSurface"];
};

export interface SalaiProjectService {
  getSnapshot: () => SalaiAppState;
  getProjectContext: (options?: ProjectContextOptions) => SalaiProjectContext;
  subscribe: (listener: () => void) => () => void;
  dispatchNarrativeBatch: (operations: readonly NarrativeOperation[]) => boolean;
}

const EMPTY_FEEDBACK: OperationFeedback = {
  error: null,
  warnings: [],
  relationshipEffects: [],
  changedIds: [],
  createdIds: [],
  removedIds: [],
};

function initialState(fixtureKey: FixtureKey): SalaiAppState {
  const project = createFixture(fixtureKey);
  return {
    fixtureKey,
    project,
    workspace: createStoryWallWorkspace(project),
    selection: null,
    activeSurface: "outline",
    feedback: EMPTY_FEEDBACK,
  };
}

function feedbackFromResult(result: OperationResult): OperationFeedback {
  return {
    error: null,
    warnings: result.warnings,
    relationshipEffects: result.relationshipEffects,
    changedIds: result.changedIds,
    createdIds: result.createdIds,
    removedIds: result.removedIds,
  };
}

function changesStoryWallMembership(
  previous: NarrativeProject,
  result: OperationResult,
): boolean {
  const createsStoryCard = result.createdIds.some(
    (id) => result.model.beats[id] !== undefined || result.model.scenes[id] !== undefined,
  );
  const removesStoryCard = result.removedIds.some(
    (id) => previous.beats[id] !== undefined || previous.scenes[id] !== undefined,
  );
  return createsStoryCard || removesStoryCard;
}

export class SalaiController implements SalaiProjectService {
  private state: SalaiAppState;
  private listeners = new Set<() => void>();

  constructor(fixtureKey: FixtureKey = "product") {
    this.state = initialState(fixtureKey);
  }

  getSnapshot = (): SalaiAppState => this.state;

  getProjectContext = (
    options: ProjectContextOptions = {},
  ): SalaiProjectContext => ({
    project: this.state.project,
    ...(options.includeWorkspace ? { workspace: this.state.workspace } : {}),
    ...(options.includeActiveSurface ? { activeSurface: this.state.activeSurface } : {}),
  });

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private publish(nextState: SalaiAppState): void {
    this.state = nextState;
    for (const listener of this.listeners) listener();
  }

  private publishError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.publish({
      ...this.state,
      feedback: { ...EMPTY_FEEDBACK, error: message },
    });
  }

  private publishNarrativeResult(
    previousProject: NarrativeProject,
    result: OperationResult,
  ): void {
    const selection = this.state.selection;
    const selectionRemoved =
      selection !== null && result.removedIds.includes(selection.id);
    const workspace = changesStoryWallMembership(previousProject, result)
      ? syncWorkspaceWithProject(this.state.workspace, result.model)
      : this.state.workspace;

    this.publish({
      ...this.state,
      project: result.model,
      workspace,
      selection: selectionRemoved ? null : selection,
      feedback: feedbackFromResult(result),
    });
  }

  setFixture(fixtureKey: FixtureKey): void {
    this.publish(initialState(fixtureKey));
  }

  resetFixture(): void {
    this.publish(initialState(this.state.fixtureKey));
  }

  setSurface(activeSurface: SalaiAppState["activeSurface"]): void {
    this.publish({ ...this.state, activeSurface });
  }

  select(selection: CanonicalSelection | null): void {
    this.publish({ ...this.state, selection });
  }

  updateWorkspace(update: (workspace: Workspace) => Workspace): void {
    try {
      this.publish({
        ...this.state,
        workspace: update(this.state.workspace),
        feedback: { ...EMPTY_FEEDBACK },
      });
    } catch (error) {
      this.publishError(error);
    }
  }

  dispatchNarrativeBatch(operations: readonly NarrativeOperation[]): boolean {
    try {
      const previousProject = this.state.project;
      const result = applyOperations(previousProject, operations);
      this.publishNarrativeResult(previousProject, result);
      return true;
    } catch (error) {
      this.publishError(error);
      return false;
    }
  }

  dispatchNarrative(operation: NarrativeOperation): boolean {
    return this.dispatchNarrativeBatch([operation]);
  }

  promoteIdeaCardToBeat(itemId: string, parent: ParentRef): string | null {
    const item = this.state.workspace.board.items[itemId];
    if (!item?.ideaCard) {
      this.publishError(new Error(`BoardItem ${itemId} is not an IdeaCard`));
      return null;
    }

    const beatId = `beat-${crypto.randomUUID()}`;
    try {
      const result = applyOperation(this.state.project, {
        op: "createBeat",
        beat: {
          id: beatId,
          title: item.ideaCard.text.trim() || "New beat",
          cueIds: [],
        },
        parent,
      });
      const workspace = promoteIdeaCardReference(this.state.workspace, itemId, {
        type: "beat",
        id: beatId,
      });

      this.publish({
        ...this.state,
        project: result.model,
        workspace,
        selection: { type: "beat", id: beatId },
        feedback: feedbackFromResult(result),
      });
      return beatId;
    } catch (error) {
      this.publishError(error);
      return null;
    }
  }

  clearFeedback(): void {
    this.publish({ ...this.state, feedback: { ...EMPTY_FEEDBACK } });
  }
}

const ControllerContext = createContext<SalaiController | null>(null);

export function SalaiProvider({
  controller,
  children,
}: PropsWithChildren<{ controller: SalaiController }>) {
  return <ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>;
}

export function useSalaiController(): SalaiController {
  const controller = useContext(ControllerContext);
  if (!controller) throw new Error("useSalaiController must be used inside SalaiProvider");
  return controller;
}

export function useSalaiState(): SalaiAppState {
  const controller = useSalaiController();
  return useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
}
