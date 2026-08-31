import { validateNarrativeProject } from "@salai/script-model";
import { useMemo } from "react";
import { AVScript } from "./AVScript";
import { useSalaiController, useSalaiState } from "./controller";
import { FIXTURES, getFixtureDefinition } from "./fixtures";
import { formatDuration, getDurationEstimate } from "./model-utils";
import { Outline } from "./Outline";
import { PaperEdit } from "./PaperEdit";
import { StoryWall } from "./StoryWall";

const SURFACES = [
  { key: "outline", label: "Outline" },
  { key: "story-wall", label: "Story Wall" },
  { key: "av-script", label: "AV Script" },
  { key: "paper-edit", label: "Paper / Radio Edit" },
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
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">S</span>
          <div>
            <div className="brand-name">SALAI</div>
            <div className="brand-subtitle">Spike 0C · External-agent authoring + Narrative Lenses</div>
          </div>
        </div>
        <div className="topbar-status">
          <span className={`validity-dot ${validation.valid ? "valid" : "invalid"}`} />
          {validation.valid
            ? "Narrative IR valid"
            : `${validation.issues.length} IR issues`}
        </div>
      </header>

      <section className="fixture-bar">
        <div className="fixture-copy">
          <label htmlFor="fixture-select">Fixture</label>
          <select
            id="fixture-select"
            value={state.fixtureKey}
            onChange={(event) =>
              controller.setFixture(event.target.value as typeof state.fixtureKey)
            }
          >
            {FIXTURES.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
          <span>{fixture.description}</span>
        </div>
        <div className="fixture-stats">
          <div>
            <small>Runtime</small>
            <strong>{formatDuration(duration.scriptMs)}</strong>
          </div>
          <div>
            <small>Beats</small>
            <strong>{Object.keys(state.project.beats).length}</strong>
          </div>
          <div>
            <small>Cues</small>
            <strong>{Object.keys(state.project.cues).length}</strong>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => controller.resetFixture()}
          >
            Reset fixture
          </button>
        </div>
      </section>

      <nav className="surface-tabs" aria-label="Narrative Lenses">
        {SURFACES.map((surface) => (
          <button
            type="button"
            key={surface.key}
            className={state.activeSurface === surface.key ? "active" : ""}
            onClick={() => controller.setSurface(surface.key)}
          >
            {surface.label}
          </button>
        ))}
      </nav>

      <FeedbackPanel />

      <main className="workspace-frame">
        {state.activeSurface === "outline" ? <Outline /> : null}
        {state.activeSurface === "story-wall" ? <StoryWall /> : null}
        {state.activeSurface === "av-script" ? <AVScript /> : null}
        {state.activeSurface === "paper-edit" ? <PaperEdit /> : null}
      </main>

      <footer className="app-footer">
        <span>Canonical model: @salai/script-model</span>
        <span>
          {state.selection
            ? `Selected ${state.selection.type}: ${state.selection.id}`
            : "No selection"}
        </span>
      </footer>
    </div>
  );
}
