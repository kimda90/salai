import "./style.css";
import {
  createFootageFirstFixture,
  createInterviewFixture,
  createProductVideoFixture,
  estimateNarrativeDuration,
  validateNarrativeProject,
  type NarrativeProject,
} from "../../script-model/src/index.js";

type DemoFixture = {
  key: string;
  label: string;
  description: string;
  project: NarrativeProject;
};

const fixtures: DemoFixture[] = [
  {
    key: "product",
    label: "30s product video",
    description: "Script-first: Hook → Problem → Demo → Benefit → CTA, with ShotIntent coverage.",
    project: createProductVideoFixture(),
  },
  {
    key: "interview",
    label: "Interview / corporate",
    description: "Source-backed interview excerpts, authored VO bridge, and B-roll evidence.",
    project: createInterviewFixture(),
  },
  {
    key: "documentary",
    label: "Footage-first mini-doc",
    description: "Narrative constructed from mocked MediaSegments, then supplemented with authored material.",
    project: createFootageFirstFixture(),
  },
];

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Missing #app root");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function seconds(ms: number): string {
  return `${(ms / 1000).toFixed(ms % 1000 === 0 ? 0 : 1)}s`;
}

function renderCue(project: NarrativeProject, cueId: string): string {
  const cue = project.cues[cueId];
  if (!cue) return "";
  const visual = cue.visualBlockIds
    .map((id) => project.blocks[id])
    .filter(Boolean)
    .map((block) => `<span class="block visual">${escapeHtml(block!.type)}</span>`)
    .join("");
  const audio = cue.audioBlockIds
    .map((id) => project.blocks[id])
    .filter(Boolean)
    .map((block) => `<span class="block audio">${escapeHtml(block!.type)}</span>`)
    .join("");

  return `<div class="cue">
    <div class="cue-id">${escapeHtml(cue.id)}</div>
    <div class="blocks">${visual}${audio}</div>
  </div>`;
}

function renderBeat(project: NarrativeProject, beatId: string): string {
  const beat = project.beats[beatId];
  if (!beat) return "";
  return `<article class="beat-card">
    <div class="eyebrow">Beat</div>
    <h3>${escapeHtml(beat.title ?? beat.id)}</h3>
    ${beat.summary ? `<p>${escapeHtml(beat.summary)}</p>` : ""}
    <div class="cue-list">${beat.cueIds.map((id) => renderCue(project, id)).join("")}</div>
  </article>`;
}

function renderStructure(project: NarrativeProject): string {
  return project.script.sectionIds
    .map((sectionId) => {
      const section = project.sections[sectionId];
      if (!section) return "";
      const children = section.childIds
        .map((childId) => {
          const scene = project.scenes[childId];
          if (scene) {
            return `<div class="scene-group">
              <div class="scene-heading"><span>Scene</span><strong>${escapeHtml(scene.title ?? scene.id)}</strong></div>
              <div class="beat-grid">${scene.beatIds.map((id) => renderBeat(project, id)).join("")}</div>
            </div>`;
          }
          return renderBeat(project, childId);
        })
        .join("");

      return `<section class="section-group">
        <div class="section-heading">
          <span class="eyebrow">Section</span>
          <h2>${escapeHtml(section.title ?? section.id)}</h2>
        </div>
        <div class="beat-grid">${children}</div>
      </section>`;
    })
    .join("");
}

function renderFixture(fixture: DemoFixture): void {
  const project = fixture.project;
  const duration = estimateNarrativeDuration(project, { visualHoldMs: 2000 });
  const validation = validateNarrativeProject(project);
  const target = project.script.targetDurationMs;

  const stats = [
    ["Sections", Object.keys(project.sections).length],
    ["Beats", Object.keys(project.beats).length],
    ["Cues", Object.keys(project.cues).length],
    ["Blocks", Object.keys(project.blocks).length],
    ["Relationships", Object.keys(project.relationships).length],
  ];

  app.innerHTML = `<div class="page-shell">
    <header class="hero">
      <div>
        <div class="brand">SALAI · SPIKE 0A</div>
        <h1>Narrative IR inspector</h1>
        <p>Read-only visualization of the implemented Spike 0A fixtures. The page imports the real TypeScript Narrative IR package; it is not a separate demo schema.</p>
      </div>
      <div class="status ${validation.valid ? "ok" : "bad"}">${validation.valid ? "IR valid" : `${validation.issues.length} validation issues`}</div>
    </header>

    <nav class="fixture-tabs" aria-label="Fixture">
      ${fixtures.map((item) => `<button data-fixture="${item.key}" class="${item.key === fixture.key ? "active" : ""}">${escapeHtml(item.label)}</button>`).join("")}
    </nav>

    <section class="fixture-intro">
      <div>
        <div class="eyebrow">Fixture</div>
        <h2>${escapeHtml(fixture.label)}</h2>
        <p>${escapeHtml(fixture.description)}</p>
      </div>
      <div class="runtime-card">
        <span>Estimated runtime</span>
        <strong>${seconds(duration.scriptMs)}</strong>
        ${target ? `<small>target ${seconds(target)}</small>` : ""}
      </div>
    </section>

    <section class="stats">
      ${stats.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
    </section>

    <section class="structure">
      <div class="section-title-row">
        <div>
          <div class="eyebrow">Narrative structure</div>
          <h2>Section → Scene? / Beat → Cue → blocks</h2>
        </div>
      </div>
      ${renderStructure(project)}
    </section>

    <details class="json-panel">
      <summary>Inspect serialized NarrativeProject</summary>
      <pre>${escapeHtml(JSON.stringify(project, null, 2))}</pre>
    </details>

    <footer>Spike 0A validates the Narrative IR only. Authoring surfaces belong to Spike 0B.</footer>
  </div>`;

  document.querySelectorAll<HTMLButtonElement>("[data-fixture]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = fixtures.find((item) => item.key === button.dataset.fixture);
      if (next) renderFixture(next);
    });
  });
}

renderFixture(fixtures[0]!);
