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
import { describeProjectChanges, directionTargetExists, narrativeLabel, type DirectionProposalInput, type DirectionReview, type DirectionTarget } from "./film-direction";
import {
  createStoryWallWorkspace,
  promoteIdeaCardReference,
  syncWorkspaceWithProject,
  type Workspace,
} from "./workspace";

export type SelectionType = "section" | "scene" | "beat" | "cue" | "block";

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
  projectRevision: number;
  direction: DirectionReview | null;
  directionDraft: { text: string; scope: string };
  workspace: Workspace;
  selection: CanonicalSelection | null;
  activeSurface: "outline" | "story-wall" | "av-script" | "paper-edit" | "timeline" | "film";
  feedback: OperationFeedback;
  canRevertMachineAction: boolean;
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

export type NarrativeBatchOptions = {
  revertible?: boolean;
};

export interface SalaiProjectService {
  getSnapshot: () => SalaiAppState;
  getProjectContext: (options?: ProjectContextOptions) => SalaiProjectContext;
  subscribe: (listener: () => void) => () => void;
  proposeDirection: (input: DirectionProposalInput) => boolean;
  dispatchNarrativeBatch: (
    operations: readonly NarrativeOperation[],
    options?: NarrativeBatchOptions,
  ) => boolean;
}

type RevertSnapshot = {
  project: NarrativeProject;
  workspace: Workspace;
};

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
    projectRevision: 0,
    direction: null,
    directionDraft: { text: "", scope: "cue" },
    workspace: createStoryWallWorkspace(project),
    selection: null,
    activeSurface: fixtureKey === "filmmaking" ? "film" : fixtureKey === "semantic-editorial" ? "timeline" : "outline",
    feedback: EMPTY_FEEDBACK,
    canRevertMachineAction: false,
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
  private revertSnapshot: RevertSnapshot | null = null;

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
    revertible: boolean,
    direction = this.state.direction,
  ): void {
    const selection = this.state.selection;
    const selectionRemoved =
      selection !== null && result.removedIds.includes(selection.id);
    const workspace = changesStoryWallMembership(previousProject, result)
      ? syncWorkspaceWithProject(this.state.workspace, result.model)
      : this.state.workspace;

    this.revertSnapshot = revertible
      ? { project: previousProject, workspace: this.state.workspace }
      : null;

    this.publish({
      ...this.state,
      project: result.model,
      projectRevision: this.state.projectRevision + 1,
      direction,
      workspace,
      selection: selectionRemoved ? null : selection,
      feedback: feedbackFromResult(result),
      canRevertMachineAction: revertible,
    });
  }

  setFixture(fixtureKey: FixtureKey): void {
    this.revertSnapshot = null;
    this.publish({ ...initialState(fixtureKey), projectRevision: this.state.projectRevision + 1 });
  }

  resetFixture(): void {
    this.setFixture(this.state.fixtureKey);
  }

  setSurface(activeSurface: SalaiAppState["activeSurface"]): void {
    this.publish({ ...this.state, activeSurface });
  }

  select(selection: CanonicalSelection | null): void {
    this.publish({ ...this.state, selection });
  }

  updateDirectionDraft(draft: Partial<SalaiAppState["directionDraft"]>): void {
    this.publish({ ...this.state, directionDraft: { ...this.state.directionDraft, ...draft } });
  }

  submitDirection(text: string, target: DirectionTarget, playheadMs: number): boolean {
    try {
      if (!text.trim()) throw new Error("Write a direction note before submitting.");
      if (!directionTargetExists(this.state.project, target)) throw new Error("The direction target no longer exists.");
      if (!Number.isFinite(playheadMs) || playheadMs < 0) throw new Error("Invalid direction playhead.");
      this.publish({ ...this.state, direction: {
        status: "waiting",
        note: {
          id: crypto.randomUUID(), text: text.trim(), target: { ...target },
          targetLabel: narrativeLabel(this.state.project, target.id),
          projectRevision: this.state.projectRevision,
          submittedProject: structuredClone(this.state.project), playheadMs,
        },
      }, feedback: { ...EMPTY_FEEDBACK } });
      return true;
    } catch (error) {
      this.publishError(error);
      return false;
    }
  }

  proposeDirection(input: DirectionProposalInput): boolean {
    try {
      const review = this.state.direction;
      if (!review || review.note.id !== input.noteId || review.status !== "waiting") {
        throw new Error("This note is no longer waiting for a proposal. Read fresh context.");
      }
      // ponytail: any project edit invalidates a proposal; use narrower read sets only if this disrupts real review.
      if (input.baseRevision !== this.state.projectRevision || input.baseRevision !== review.note.projectRevision) {
        throw new Error("The project changed after submission. Submit the note again before proposing changes.");
      }
      if (!input.summary.trim() || !input.operations.length) throw new Error("A proposal needs a summary and operations.");
      const operations = structuredClone(input.operations);
      const result = applyOperations(this.state.project, operations);
      const changes = describeProjectChanges(this.state.project, result.model);
      if (!changes.length) throw new Error("The proposal does not change the project.");
      this.publish({ ...this.state, direction: {
        ...review, status: "proposed",
        proposal: { ...input, operations, id: crypto.randomUUID(), changes, warnings: result.warnings.map((warning) => warning.message) },
      }, feedback: { ...EMPTY_FEEDBACK } });
      return true;
    } catch (error) {
      this.publishError(error);
      return false;
    }
  }

  acceptDirection(proposalId: string): boolean {
    const review = this.state.direction;
    const proposal = review?.proposal;
    if (!review || review.status !== "proposed" || !proposal || proposal.id !== proposalId) return false;
    if (proposal.baseRevision !== this.state.projectRevision || !directionTargetExists(this.state.project, review.note.target)) {
      this.publishError(new Error("The project changed. Submit the note again and review a new proposal."));
      return false;
    }
    try {
      const result = applyOperations(this.state.project, proposal.operations);
      this.publishNarrativeResult(this.state.project, result, true, {
        ...review, status: "applied", appliedRevision: this.state.projectRevision + 1,
      });
      return true;
    } catch (error) {
      this.publishError(error);
      return false;
    }
  }

  dismissDirection(): void {
    if (this.state.direction) this.publish({ ...this.state, direction: { ...this.state.direction, status: "dismissed" } });
  }

  updateWorkspace(update: (workspace: Workspace) => Workspace): void {
    try {
      const workspace = update(this.state.workspace);
      this.revertSnapshot = null;
      this.publish({
        ...this.state,
        workspace,
        feedback: { ...EMPTY_FEEDBACK },
        canRevertMachineAction: false,
      });
    } catch (error) {
      this.publishError(error);
    }
  }

  dispatchNarrativeBatch(
    operations: readonly NarrativeOperation[],
    options: NarrativeBatchOptions = {},
  ): boolean {
    try {
      const previousProject = this.state.project;
      const result = applyOperations(previousProject, operations);
      this.publishNarrativeResult(previousProject, result, options.revertible === true);
      return true;
    } catch (error) {
      this.publishError(error);
      return false;
    }
  }

  dispatchNarrative(operation: NarrativeOperation): boolean {
    return this.dispatchNarrativeBatch([operation]);
  }

  revertMachineAction(): boolean {
    const snapshot = this.revertSnapshot;
    if (!snapshot) return false;

    this.revertSnapshot = null;
    this.publish({
      ...this.state,
      project: snapshot.project,
      projectRevision: this.state.projectRevision + 1,
      direction: this.state.direction?.appliedRevision === this.state.projectRevision
        ? { ...this.state.direction, status: "reverted" } : this.state.direction,
      workspace: snapshot.workspace,
      selection: this.state.selection && directionTargetExists(snapshot.project, this.state.selection) ? this.state.selection : null,
      feedback: { ...EMPTY_FEEDBACK },
      canRevertMachineAction: false,
    });
    return true;
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

      this.revertSnapshot = null;
      this.publish({
        ...this.state,
        project: result.model,
        projectRevision: this.state.projectRevision + 1,
        workspace,
        selection: { type: "beat", id: beatId },
        feedback: feedbackFromResult(result),
        canRevertMachineAction: false,
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
