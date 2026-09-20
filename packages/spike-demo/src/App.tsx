import { validateNarrativeProject } from "@salai/script-model";
import { useMemo } from "react";
import { AVScript } from "./AVScript";
import { useSalaiController, useSalaiState } from "./controller";
import { FIXTURES, getFixtureDefinition } from "./fixtures";
import { FilmReview } from "./FilmReview";
import { formatDuration, getDurationEstimate } from "./model-utils";
import { Outline } from "./Outline";
import { PaperEdit } from "./PaperEdit";
import { SemanticTimeline } from "./SemanticTimeline";
import { StoryWall } from "./StoryWall";

const SURFACES = [
  { key: "film", label: "Film review" },
  { key: "outline", label: "Outline" },
  { key: "story-wall", label: "Story Wall" },
  { key: "av-script", label: "AV Script" },
  { key: "paper-edit", label: "Paper / Radio Edit" },
  { key: "timeline", label: "Timeline" },
] as const;

function FeedbackPanel() {
  const controller = useSalaiController();
  const { feedback } = useSalaiState();
  const hasContent =
    feedback.error ||
    feedback.warnings.length > 0 ||
    feedback.relationshipEffects.length > 0;
  if (!hasContent) return null;

  return (
    <aside
      className={`feedback-panel ${feedback.error ? "feedback-error" : "feedback-warning"}`}
    >
      <div>
        <strong>{feedback.error ? "Operation rejected" : "Operation consequences"}</strong>
        {feedback.error ? <p>{feedback.error}</p> : null}
        {feedback.warnings.map((warning) => (
          <p key={`${warning.code}-${warning.relationshipId ?? warning.message}`}>
            {warning.message}
          </p>
        ))}
        {feedback.relationshipEffects.map((effect) => (
          <p key={`${effect.relationshipId}-${effect.effect}`}>
            {effect.effect}: {effect.relationshipId}
            {effect.reason ? ` — ${effect.reason}` : ""}
          </p>
        ))}
      </div>
      <button
        type="button"
        className="ghost-button"
        onClick={() => controller.clearFeedback()}
      >
        Dismiss
      </button>
    </aside>
  );
}

export function App() {
  const controller = useSalaiController();
  const state = useSalaiState();
  const fixture = getFixtureDefinition(state.fixtureKey);
  const duration = getDurationEstimate(state.project);
  const validation = useMemo(
    () => validateNarrativeProject(state.project),
    [state.project],
  );

  return (
    <div className={`app-shell ${state.activeSurface === "film" ? "film-app" : ""}`}>
      <header className="project-header">
        <span className="project-wordmark">SALAI</span>
        <div className="project-identity">
          <strong>{state.project.script.title ?? "Untitled story"}</strong>
          <span>{formatDuration(duration.scriptMs)} · {Object.keys(state.project.cues).length} moments</span>
        </div>
        <span className="project-temporary">Temporary project</span>
        <nav className="project-navigation" aria-label="Creative surfaces">
          <button className="ghost-button" type="button" disabled={!state.canRevertMachineAction} onClick={() => controller.revertMachineAction()}>Revert last edit</button>
          <label>View
            <select value={state.activeSurface} onChange={(event) => controller.setSurface(event.target.value as typeof state.activeSurface)}>
              {SURFACES.map((surface) => <option key={surface.key} value={surface.key}>{surface.label}</option>)}
            </select>
          </label>
        </nav>
      </header>
      {!validation.valid ? <p className="project-validation-error" role="alert">The project has {validation.issues.length} validation issues. Open development controls for details.</p> : null}

      <FeedbackPanel />

      <main className="workspace-frame">
        {state.activeSurface === "film" ? <FilmReview key={state.fixtureKey} /> : null}
        {state.activeSurface === "outline" ? <Outline /> : null}
        {state.activeSurface === "story-wall" ? <StoryWall /> : null}
        {state.activeSurface === "av-script" ? <AVScript /> : null}
        {state.activeSurface === "paper-edit" ? <PaperEdit /> : null}
        {state.activeSurface === "timeline" ? <SemanticTimeline /> : null}
      </main>

      <details className="development-controls">
        <summary>Development controls</summary>
        <section className="fixture-bar">
          <div className="fixture-copy">
            <label htmlFor="fixture-select">Fixture</label>
            <select id="fixture-select" value={state.fixtureKey} onChange={(event) => controller.setFixture(event.target.value as typeof state.fixtureKey)}>
              {FIXTURES.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
            <span>{fixture.description}</span>
          </div>
          <button className="ghost-button" type="button" onClick={() => controller.resetFixture()}>Reset fixture</button>
        </section>
        <p>{validation.valid ? "Narrative IR valid" : `${validation.issues.length} IR issues`} · Canonical model: @salai/script-model</p>
        {!validation.valid ? <pre>{JSON.stringify(validation.issues, null, 2)}</pre> : null}
        <p>{state.selection ? `Selected ${state.selection.type}: ${state.selection.id}` : "No selection"}</p>
      </details>
    </div>
  );
}
