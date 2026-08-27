import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Id, ParentRef } from "@salai/script-model";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSalaiController, useSalaiState } from "./controller";
import { findBeatParent, findSceneSection, formatDuration, getDurationEstimate, makeId } from "./model-utils";
import {
  createIdeaCard,
  moveBoardItem,
  removeBoardItem,
  setBoardItemParking,
  updateIdeaCardText,
  type BoardItem,
  type CanonicalReference,
} from "./workspace";

function ParentPicker({ value, onChange }: { value: ParentRef; onChange: (parent: ParentRef) => void }) {
  const { project } = useSalaiState();
  const options: Array<{ value: string; label: string; parent: ParentRef }> = [];
  for (const sectionId of project.script.sectionIds) {
    const section = project.sections[sectionId];
    if (!section) continue;
    options.push({
      value: `section:${section.id}`,
      label: `Section · ${section.title ?? section.id}`,
      parent: { type: "section", id: section.id },
    });
    for (const childId of section.childIds) {
      const scene = project.scenes[childId];
      if (!scene) continue;
      options.push({
        value: `scene:${scene.id}`,
        label: `Scene · ${scene.title ?? scene.id}`,
        parent: { type: "scene", id: scene.id },
      });
    }
  }

  return (
    <select
      className="wall-parent-select"
      value={`${value.type}:${value.id}`}
      onChange={(event) => {
        const next = options.find((option) => option.value === event.target.value)?.parent;
        if (next) onChange(next);
      }}
      aria-label="Promotion parent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

function useBoardDraggable(itemId: string) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const element = cardRef.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) return;
    return draggable({
      element,
      dragHandle,
      getInitialData: () => ({ itemId }),
    });
  }, [itemId]);

  return { cardRef, handleRef };
}

function BeatCard({ item, reference }: { item: BoardItem; reference: CanonicalReference & { type: "beat" } }) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const beat = project.beats[reference.id];
  const { cardRef, handleRef } = useBoardDraggable(item.id);
  const duration = useMemo(() => getDurationEstimate(project), [project]);
  if (!beat) return null;

  return (
    <div
      ref={cardRef}
      className={`wall-card beat-wall-card ${selection?.type === "beat" && selection.id === beat.id ? "selected" : ""}`}
      style={{ left: item.x ?? 0, top: item.y ?? 0 }}
      onMouseDown={() => controller.select({ type: "beat", id: beat.id })}
    >
      <div className="wall-card-topline">
        <span className="wall-card-kind">Beat</span>
        <span className="wall-card-runtime">{formatDuration(duration.beatMs[beat.id])}</span>
        <button ref={handleRef} className="drag-handle" type="button" aria-label="Move card">⠿</button>
      </div>
      <input
        className="wall-card-title"
        value={beat.title ?? ""}
        placeholder="Untitled beat"
        onMouseDown={(event) => event.stopPropagation()}
        onChange={(event) => controller.dispatchNarrative({
          op: "updateBeat",
          beatId: beat.id,
          title: event.target.value,
          summary: beat.summary ?? null,
        })}
      />
      <p>{beat.summary || "No summary"}</p>
      <div className="wall-card-footer">
        <span>{beat.cueIds.length} cue{beat.cueIds.length === 1 ? "" : "s"}</span>
        <button
          className="wall-small-button"
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => controller.updateWorkspace((workspace) => setBoardItemParking(workspace, item.id, "parked"))}
        >Park</button>
      </div>
    </div>
  );
}

function SceneCard({ item, reference }: { item: BoardItem; reference: CanonicalReference & { type: "scene" } }) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const scene = project.scenes[reference.id];
  const { cardRef, handleRef } = useBoardDraggable(item.id);
  const duration = useMemo(() => getDurationEstimate(project), [project]);
  if (!scene) return null;

  return (
    <div
      ref={cardRef}
      className={`wall-card scene-wall-card ${selection?.type === "scene" && selection.id === scene.id ? "selected" : ""}`}
      style={{ left: item.x ?? 0, top: item.y ?? 0 }}
      onMouseDown={() => controller.select({ type: "scene", id: scene.id })}
    >
      <div className="wall-card-topline">
        <span className="wall-card-kind">Scene</span>
        <span className="wall-card-runtime">{formatDuration(duration.sceneMs[scene.id])}</span>
        <button ref={handleRef} className="drag-handle" type="button" aria-label="Move card">⠿</button>
      </div>
      <input
        className="wall-card-title"
        value={scene.title ?? ""}
        placeholder="Untitled scene"
        onMouseDown={(event) => event.stopPropagation()}
        onChange={(event) => controller.dispatchNarrative({ op: "updateScene", sceneId: scene.id, title: event.target.value })}
      />
      <div className="scene-beat-preview">
        {scene.beatIds.slice(0, 3).map((beatId) => (
          <span key={beatId}>{project.beats[beatId]?.title ?? beatId}</span>
        ))}
        {scene.beatIds.length > 3 ? <span>+{scene.beatIds.length - 3}</span> : null}
      </div>
      <div className="wall-card-footer">
        <span>{scene.beatIds.length} beat{scene.beatIds.length === 1 ? "" : "s"}</span>
        <button
          className="wall-small-button"
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => controller.updateWorkspace((workspace) => setBoardItemParking(workspace, item.id, "parked"))}
        >Park</button>
      </div>
    </div>
  );
}

function IdeaWallCard({ item }: { item: BoardItem }) {
  const controller = useSalaiController();
  const { project } = useSalaiState();
  const { cardRef, handleRef } = useBoardDraggable(item.id);
  const firstSectionId = project.script.sectionIds[0];
  const [parent, setParent] = useState<ParentRef>(() => ({ type: "section", id: firstSectionId ?? "" }));
  if (!item.ideaCard) return null;

  return (
    <div ref={cardRef} className="wall-card idea-wall-card" style={{ left: item.x ?? 0, top: item.y ?? 0 }}>
      <div className="wall-card-topline">
        <span className="wall-card-kind">Idea</span>
        <button ref={handleRef} className="drag-handle" type="button" aria-label="Move idea card">⠿</button>
      </div>
      <textarea
        className="idea-card-text"
        rows={4}
        value={item.ideaCard.text}
        onMouseDown={(event) => event.stopPropagation()}
        onChange={(event) => controller.updateWorkspace((workspace) => updateIdeaCardText(workspace, item.id, event.target.value))}
      />
      {firstSectionId ? <ParentPicker value={parent} onChange={setParent} /> : null}
      <div className="wall-card-footer">
        <button
          type="button"
          className="wall-small-button"
          disabled={!parent.id}
          onClick={() => controller.promoteIdeaCardToBeat(item.id, parent)}
        >Promote to Beat</button>
        <button type="button" className="wall-small-button danger" onClick={() => controller.updateWorkspace((workspace) => removeBoardItem(workspace, item.id))}>Delete</button>
      </div>
    </div>
  );
}

function ActiveCard({ item }: { item: BoardItem }) {
  if (item.ideaCard) return <IdeaWallCard item={item} />;
  if (item.reference?.type === "beat") return <BeatCard item={item} reference={item.reference as CanonicalReference & { type: "beat" }} />;
  if (item.reference?.type === "scene") return <SceneCard item={item} reference={item.reference as CanonicalReference & { type: "scene" }} />;
  return null;
}

function StoryBoardCanvas() {
  const controller = useSalaiController();
  const { workspace } = useSalaiState();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const activeItems = workspace.board.itemIds
    .map((id) => workspace.board.items[id])
    .filter((item): item is BoardItem => Boolean(item) && item.parkingState !== "parked");

  useEffect(() => {
    const element = boardRef.current;
    if (!element) return;
    return dropTargetForElements({
      element,
      canDrop: ({ source }) => typeof source.data.itemId === "string",
      onDrop: ({ source, location }) => {
        const itemId = source.data.itemId;
        if (typeof itemId !== "string") return;
        const rect = element.getBoundingClientRect();
        const input = location.current.input;
        const x = Math.max(8, Math.round(input.clientX - rect.left - 110));
        const y = Math.max(8, Math.round(input.clientY - rect.top - 28));
        controller.updateWorkspace((current) => moveBoardItem(current, itemId, x, y));
      },
    });
  }, [controller]);

  return (
    <div ref={boardRef} className="story-board-canvas" aria-label="Story Wall board">
      {activeItems.map((item) => <ActiveCard key={item.id} item={item} />)}
      {activeItems.length === 0 ? <div className="empty-board">No active cards. Restore one from the parking lot or add an idea.</div> : null}
    </div>
  );
}

function ParkingLot() {
  const controller = useSalaiController();
  const { project, workspace } = useSalaiState();
  const parkedItems = workspace.board.itemIds
    .map((id) => workspace.board.items[id])
    .filter((item): item is BoardItem => Boolean(item) && item.parkingState === "parked");

  return (
    <aside className="parking-lot">
      <div className="parking-heading">
        <div>
          <div className="eyebrow">Workspace only</div>
          <h3>Parking lot</h3>
        </div>
        <span>{parkedItems.length}</span>
      </div>
      {parkedItems.length === 0 ? <p className="parking-empty">Park uncertain or rejected material here without deleting it.</p> : null}
      <div className="parking-list">
        {parkedItems.map((item) => {
          const label = item.ideaCard?.text ||
            (item.reference?.type === "beat" ? project.beats[item.reference.id]?.title : undefined) ||
            (item.reference?.type === "scene" ? project.scenes[item.reference.id]?.title : undefined) ||
            item.reference?.id || item.id;
          return (
            <div key={item.id} className="parked-item">
              <span>{label}</span>
              <button type="button" className="wall-small-button" onClick={() => controller.updateWorkspace((current) => setBoardItemParking(current, item.id, "active"))}>Restore</button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function OrderButtons({ onUp, onDown, upDisabled, downDisabled }: { onUp: () => void; onDown: () => void; upDisabled: boolean; downDisabled: boolean }) {
  return (
    <span className="order-buttons">
      <button type="button" disabled={upDisabled} onClick={onUp}>↑</button>
      <button type="button" disabled={downDisabled} onClick={onDown}>↓</button>
    </span>
  );
}

function StructuralOrder() {
  const controller = useSalaiController();
  const { project } = useSalaiState();

  return (
    <aside className="story-order-panel">
      <div className="parking-heading">
        <div>
          <div className="eyebrow">Narrative operation</div>
          <h3>Story order</h3>
        </div>
      </div>
      <p className="order-explainer">This explicit list changes canonical story order. Free card position never does.</p>
      {project.script.sectionIds.map((sectionId) => {
        const section = project.sections[sectionId];
        if (!section) return null;
        return (
          <div className="order-section" key={section.id}>
            <strong>{section.title ?? section.id}</strong>
            {section.childIds.map((childId, index) => {
              const scene = project.scenes[childId];
              const beat = project.beats[childId];
              const isScene = Boolean(scene);
              const label = scene?.title ?? beat?.title ?? childId;
              return (
                <div className="order-item" key={childId}>
                  <span><small>{isScene ? "Scene" : "Beat"}</small>{label}</span>
                  <OrderButtons
                    upDisabled={index === 0}
                    downDisabled={index === section.childIds.length - 1}
                    onUp={() => {
                      if (isScene) controller.dispatchNarrative({ op: "moveScene", sceneId: childId, toSectionId: section.id, toIndex: index - 1 });
                      else controller.dispatchNarrative({ op: "moveBeat", beatId: childId, toParent: { type: "section", id: section.id }, toIndex: index - 1 });
                    }}
                    onDown={() => {
                      if (isScene) controller.dispatchNarrative({ op: "moveScene", sceneId: childId, toSectionId: section.id, toIndex: index + 1 });
                      else controller.dispatchNarrative({ op: "moveBeat", beatId: childId, toParent: { type: "section", id: section.id }, toIndex: index + 1 });
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}

export function StoryWall() {
  const controller = useSalaiController();
  const { project } = useSalaiState();

  return (
    <div className="surface story-wall-surface">
      <div className="surface-heading">
        <div>
          <div className="eyebrow">Workspace</div>
          <h2>Story Wall</h2>
          <p>Move cards freely to think spatially. Use Story order only when you intend to change the canonical narrative sequence.</p>
        </div>
        <button
          type="button"
          className="primary-button wall-add-idea"
          onClick={() => {
            const itemId = makeId("idea-item");
            controller.updateWorkspace((workspace) => createIdeaCard(
              workspace,
              itemId,
              { id: makeId("idea"), text: "New idea" },
              { x: 32, y: 32 },
            ));
          }}
        >+ Idea</button>
      </div>
      <div className="story-wall-layout">
        <div className="story-wall-main">
          <StoryBoardCanvas />
          <ParkingLot />
        </div>
        <StructuralOrder />
      </div>
      {project.script.sectionIds.length === 0 ? <div className="wall-notice">Create a Section in Outline before promoting IdeaCards.</div> : null}
    </div>
  );
}
