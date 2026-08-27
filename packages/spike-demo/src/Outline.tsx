import type { Id, ParentRef } from "@salai/script-model";
import { useMemo } from "react";
import { useSalaiController, useSalaiState } from "./controller";
import {
  findBeatParent,
  formatDuration,
  getDurationEstimate,
  makeId,
} from "./model-utils";

function IconButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="icon-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  );
}

function BeatRow({ beatId, depth }: { beatId: Id; depth: number }) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const beat = project.beats[beatId];
  const duration = useMemo(() => getDurationEstimate(project), [project]);
  if (!beat) return null;

  const parent = findBeatParent(project, beatId);
  if (!parent) return null;
  const parentIds =
    parent.type === "scene"
      ? project.scenes[parent.id]!.beatIds
      : project.sections[parent.id]!.childIds;
  const currentIndex = parentIds.indexOf(beatId);

  const parentOptions: Array<{ value: string; label: string; ref: ParentRef }> = [];
  for (const sectionId of project.script.sectionIds) {
    const section = project.sections[sectionId];
    if (!section) continue;
    parentOptions.push({
      value: `section:${section.id}`,
      label: `Section · ${section.title ?? section.id}`,
      ref: { type: "section", id: section.id },
    });
    for (const childId of section.childIds) {
      const scene = project.scenes[childId];
      if (scene) {
        parentOptions.push({
          value: `scene:${scene.id}`,
          label: `Scene · ${scene.title ?? scene.id}`,
          ref: { type: "scene", id: scene.id },
        });
      }
    }
  }

  return (
    <div
      className={`outline-row beat-row ${selection?.type === "beat" && selection.id === beat.id ? "selected" : ""}`}
      style={{ "--depth": depth } as React.CSSProperties}
      onClick={() => controller.select({ type: "beat", id: beat.id })}
    >
      <div className="row-kind">Beat</div>
      <div className="row-main">
        <input
          className="title-input"
          value={beat.title ?? ""}
          placeholder="Untitled beat"
          onClick={(event) => event.stopPropagation()}
          onChange={(event) =>
            controller.dispatchNarrative({
              op: "updateBeat",
              beatId: beat.id,
              title: event.target.value,
              summary: beat.summary ?? null,
            })
          }
        />
        <textarea
          className="summary-input"
          value={beat.summary ?? ""}
          placeholder="Beat summary"
          rows={1}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) =>
            controller.dispatchNarrative({
              op: "updateBeat",
              beatId: beat.id,
              title: beat.title ?? null,
              summary: event.target.value,
            })
          }
        />
      </div>
      <div className="row-runtime">{formatDuration(duration.beatMs[beat.id])}</div>
      <div className="row-actions" onClick={(event) => event.stopPropagation()}>
        <select
          className="parent-select"
          value={`${parent.type}:${parent.id}`}
          aria-label="Move beat to parent"
          onChange={(event) => {
            const target = parentOptions.find(
              (option) => option.value === event.target.value,
            )?.ref;
            if (!target || (target.type === parent.type && target.id === parent.id)) {
              return;
            }
            const targetIds =
              target.type === "scene"
                ? project.scenes[target.id]!.beatIds
                : project.sections[target.id]!.childIds;
            controller.dispatchNarrative({
              op: "moveBeat",
              beatId: beat.id,
              toParent: target,
              toIndex: targetIds.length,
            });
          }}
        >
          {parentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <IconButton
          label="↑"
          disabled={currentIndex <= 0}
          onClick={() =>
            controller.dispatchNarrative({
              op: "moveBeat",
              beatId: beat.id,
              toParent: parent,
              toIndex: currentIndex - 1,
            })
          }
        />
        <IconButton
          label="↓"
          disabled={currentIndex < 0 || currentIndex >= parentIds.length - 1}
          onClick={() =>
            controller.dispatchNarrative({
              op: "moveBeat",
              beatId: beat.id,
              toParent: parent,
              toIndex: currentIndex + 1,
            })
          }
        />
        <IconButton
          label="Delete"
          onClick={() =>
            controller.dispatchNarrative({ op: "deleteBeat", beatId: beat.id })
          }
        />
      </div>
    </div>
  );
}

function SceneGroup({
  sceneId,
  sectionId,
}: {
  sceneId: Id;
  sectionId: Id;
}) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const scene = project.scenes[sceneId];
  if (!scene) return null;
  const section = project.sections[sectionId];
  if (!section) return null;
  const index = section.childIds.indexOf(sceneId);

  return (
    <div className="scene-block">
      <div
        className={`outline-row scene-row ${selection?.type === "scene" && selection.id === scene.id ? "selected" : ""}`}
        style={{ "--depth": 1 } as React.CSSProperties}
        onClick={() => controller.select({ type: "scene", id: scene.id })}
      >
        <div className="row-kind">Scene</div>
        <div className="row-main">
          <input
            className="title-input"
            value={scene.title ?? ""}
            placeholder="Untitled scene"
            onClick={(event) => event.stopPropagation()}
            onChange={(event) =>
              controller.dispatchNarrative({
                op: "updateScene",
                sceneId: scene.id,
                title: event.target.value,
              })
            }
          />
        </div>
        <div className="row-runtime">
          {formatDuration(getDurationEstimate(project).sceneMs[scene.id])}
        </div>
        <div className="row-actions" onClick={(event) => event.stopPropagation()}>
          <select
            className="parent-select"
            value={sectionId}
            aria-label="Move scene to section"
            onChange={(event) => {
              const target = project.sections[event.target.value];
              if (!target || target.id === sectionId) return;
              controller.dispatchNarrative({
                op: "moveScene",
                sceneId: scene.id,
                toSectionId: target.id,
                toIndex: target.childIds.length,
              });
            }}
          >
            {project.script.sectionIds.map((id) => {
              const item = project.sections[id];
              return item ? (
                <option key={id} value={id}>
                  {item.title ?? id}
                </option>
              ) : null;
            })}
          </select>
          <IconButton
            label="↑"
            disabled={index <= 0}
            onClick={() =>
              controller.dispatchNarrative({
                op: "moveScene",
                sceneId: scene.id,
                toSectionId: sectionId,
                toIndex: index - 1,
              })
            }
          />
          <IconButton
            label="↓"
            disabled={index < 0 || index >= section.childIds.length - 1}
            onClick={() =>
              controller.dispatchNarrative({
                op: "moveScene",
                sceneId: scene.id,
                toSectionId: sectionId,
                toIndex: index + 1,
              })
            }
          />
          <IconButton
            label="Delete"
            onClick={() =>
              controller.dispatchNarrative({ op: "deleteScene", sceneId: scene.id })
            }
          />
        </div>
      </div>
      <div className="scene-children">
        {scene.beatIds.map((beatId) => (
          <BeatRow key={beatId} beatId={beatId} depth={2} />
        ))}
        <button
          className="add-row-button"
          type="button"
          onClick={() => {
            const id = makeId("beat");
            controller.dispatchNarrative({
              op: "createBeat",
              beat: { id, title: "New beat", cueIds: [] },
              parent: { type: "scene", id: scene.id },
            });
            controller.select({ type: "beat", id });
          }}
        >
          + Beat in scene
        </button>
      </div>
    </div>
  );
}

function SectionGroup({ sectionId }: { sectionId: Id }) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const section = project.sections[sectionId];
  if (!section) return null;
  const sectionIndex = project.script.sectionIds.indexOf(sectionId);
  const durations = getDurationEstimate(project);

  return (
    <section className="outline-section">
      <div
        className={`outline-row section-row ${selection?.type === "section" && selection.id === section.id ? "selected" : ""}`}
        style={{ "--depth": 0 } as React.CSSProperties}
        onClick={() => controller.select({ type: "section", id: section.id })}
      >
        <div className="row-kind">Section</div>
        <div className="row-main">
          <input
            className="title-input section-title-input"
            value={section.title ?? ""}
            placeholder="Untitled section"
            onClick={(event) => event.stopPropagation()}
            onChange={(event) =>
              controller.dispatchNarrative({
                op: "updateSection",
                sectionId: section.id,
                title: event.target.value,
              })
            }
          />
        </div>
        <div className="row-runtime">
          {formatDuration(durations.sectionMs[section.id])}
        </div>
        <div className="row-actions" onClick={(event) => event.stopPropagation()}>
          <IconButton
            label="↑"
            disabled={sectionIndex <= 0}
            onClick={() =>
              controller.dispatchNarrative({
                op: "moveSection",
                sectionId: section.id,
                toIndex: sectionIndex - 1,
              })
            }
          />
          <IconButton
            label="↓"
            disabled={sectionIndex >= project.script.sectionIds.length - 1}
            onClick={() =>
              controller.dispatchNarrative({
                op: "moveSection",
                sectionId: section.id,
                toIndex: sectionIndex + 1,
              })
            }
          />
          <IconButton
            label="Delete"
            onClick={() =>
              controller.dispatchNarrative({
                op: "deleteSection",
                sectionId: section.id,
              })
            }
          />
        </div>
      </div>

      <div className="section-children">
        {section.childIds.map((childId) => {
          if (project.scenes[childId]) {
            return (
              <SceneGroup
                key={childId}
                sceneId={childId}
                sectionId={section.id}
              />
            );
          }
          if (project.beats[childId]) {
            return <BeatRow key={childId} beatId={childId} depth={1} />;
          }
          return null;
        })}
      </div>

      <div className="section-add-actions">
        <button
          type="button"
          className="add-row-button"
          onClick={() => {
            const id = makeId("beat");
            controller.dispatchNarrative({
              op: "createBeat",
              beat: { id, title: "New beat", cueIds: [] },
              parent: { type: "section", id: section.id },
            });
            controller.select({ type: "beat", id });
          }}
        >
          + Direct beat
        </button>
        <button
          type="button"
          className="add-row-button"
          onClick={() => {
            const id = makeId("scene");
            controller.dispatchNarrative({
              op: "createScene",
              scene: { id, title: "New scene", beatIds: [] },
              sectionId: section.id,
            });
            controller.select({ type: "scene", id });
          }}
        >
          + Scene
        </button>
      </div>
    </section>
  );
}

export function Outline() {
  const controller = useSalaiController();
  const { project } = useSalaiState();
  const duration = useMemo(() => getDurationEstimate(project), [project]);

  return (
    <div className="surface outline-surface">
      <div className="surface-heading">
        <div>
          <div className="eyebrow">Projection</div>
          <h2>Outline</h2>
          <p>
            Structural authoring over the canonical Narrative IR. Mixed direct
            Beats and Scenes are intentionally visible.
          </p>
        </div>
        <div className="runtime-pill">{formatDuration(duration.scriptMs)}</div>
      </div>

      <div className="outline-list">
        {project.script.sectionIds.map((sectionId) => (
          <SectionGroup key={sectionId} sectionId={sectionId} />
        ))}
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={() => {
          const id = makeId("section");
          controller.dispatchNarrative({
            op: "createSection",
            section: { id, title: "New section", childIds: [] },
          });
          controller.select({ type: "section", id });
        }}
      >
        + Section
      </button>
    </div>
  );
}
