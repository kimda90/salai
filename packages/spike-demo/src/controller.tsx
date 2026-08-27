import {
  DomainOperationError,
  applyOperation,
  type DomainWarning,
  type NarrativeOperation,
  type NarrativeProject,
  type RelationshipEffect,
} from "@salai/script-model";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useSyncExternalStore,
} from "react";
import { createFixture, getFixtureDefinition, type FixtureKey } from "./fixtures";
import { createWorkspace, type Workspace } from "./workspace";

export type SelectionType = "section" | "scene" | "beat" | "cue" | "source-excerpt";

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

const EMPTY_FEEDBACK: OperationFeedback = {
  error: null,
  warnings: [],
  relationshipEffects: [],
  changedIds: [],
  createdIds: [],
  removedIds: [],
};

function initialState(fixtureKey: FixtureKey): SalaiAppState {
  return {
    fixtureKey,
    project: createFixture(fixtureKey),
    workspace: createWorkspace("story-wall", "Story Wall"),
    selection: null,
    activeSurface: "outline",
    feedback: EMPTY_FEEDBACK,
  };
}

export class SalaiController {
  private state: SalaiAppState;
  private listeners = new Set<() => void>();

  constructor(fixtureKey: FixtureKey = "product") {
    this.state = initialState(fixtureKey);
  }

  getSnapshot = (): SalaiAppState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private publish(nextState: SalaiAppState): void {
    this.state = nextState;
    for (const listener of this.listeners) listener();
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
      this.publish({
        ...this.state,
        feedback: {
          ...EMPTY_FEEDBACK,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  dispatchNarrative(operation: NarrativeOperation): boolean {
    try {
      const result = applyOperation(this.state.project, operation);
      const selection = this.state.selection;
      const selectionRemoved =
        selection !== null && result.removedIds.includes(selection.id);

      this.publish({
        ...this.state,
        project: result.model,
        selection: selectionRemoved ? null : selection,
        feedback: {
          error: null,
          warnings: result.warnings,
          relationshipEffects: result.relationshipEffects,
          changedIds: result.changedIds,
          createdIds: result.createdIds,
          removedIds: result.removedIds,
        },
      });
      return true;
    } catch (error) {
      const message =
        error instanceof DomainOperationError || error instanceof Error
          ? error.message
          : String(error);
      this.publish({
        ...this.state,
        feedback: { ...EMPTY_FEEDBACK, error: message },
      });
      return false;
    }
  }

  clearFeedback(): void {
    this.publish({ ...this.state, feedback: { ...EMPTY_FEEDBACK } });
  }

  getFixtureLabel(): string {
    return getFixtureDefinition(this.state.fixtureKey).label;
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
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
}
