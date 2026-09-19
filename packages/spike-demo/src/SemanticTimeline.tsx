import type {
  TimelineEditorItem,
  TimelineEditorSelection,
  TimelineEditorViewport,
} from "@moritzbrantner/timeline-editor/core";
import { TimelineEditor } from "@moritzbrantner/timeline-editor/react";
import {
  isVisualBlock,
  type ContentBlock,
  type NarrativeOperation,
  type NarrativeProject,
  type ParentRef,
} from "@salai/script-model";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type CanonicalSelection,
  useSalaiController,
  useSalaiState,
} from "./controller";
import { toElahProject } from "./elah-adapter";
import { FILMMAKING_MEDIA } from "./filmmaking-fixture";
import { createInterviewFixtureWavBlob } from "./fixture-audio";
import {
  canonicalSelectionFromTimelineSelection,
  filterTimelineDocumentForExpansion,
  resolveSemanticInsertionContext,
  semanticTimelineSummary,
  timelineSelectionForCanonical,
} from "./semantic-timeline-model";
import {
  createSemanticEditorialFixture,
  type FixtureMediaSource,
} from "./semantic-editorial-fixture";
import { resolveSemanticAssemblyAtMs } from "./semantic-playback-model";
import {
  interpretSemanticTimelineDocumentChange,
  type SemanticTimelineDocument,
} from "./semantic-timeline-edit";
import { SemanticViewer } from "./SemanticViewer";
import { toTimelineEditorDocument, type TimelineEditorSalaiData } from "./timeline-editor-adapter";
import { projectNarrativeToTimeline } from "./timeline-projection";
import {
  shouldToggleSemanticPlayback,
  useSemanticPlayback,
} from "./use-semantic-playback";
import "./semantic-timeline.css";

type TimelineItem = TimelineEditorItem<TimelineEditorSalaiData>;
type Commit = (
  operations: readonly NarrativeOperation[],
  summary: string,
  selection?: CanonicalSelection,
) => void;

function formatSeconds(ms: number): string {
  return `${(ms / 1_000).toFixed(ms % 1_000 === 0 ? 0 : 1)}s`;
}

function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function beatParent(project: NarrativeProject, beatId: string): ParentRef | null {
  for (const section of Object.values(project.sections)) {
    if (section.childIds.includes(beatId)) return { type: "section", id: section.id };
  }
  for (const scene of Object.values(project.scenes)) {
    if (scene.beatIds.includes(beatId)) return { type: "scene", id: scene.id };
  }
  return null;
}

function cueBeat(project: NarrativeProject, cueId: string) {
  return Object.values(project.beats).find((beat) => beat.cueIds.includes(cueId)) ?? null;
}

function blockCue(project: NarrativeProject, blockId: string) {
  return Object.values(project.cues).find(
    (cue) => cue.visualBlockIds.includes(blockId) || cue.audioBlockIds.includes(blockId),
  ) ?? null;
}

function blockLabel(block: ContentBlock): string {
  if (block.type === "visual_description" || block.type === "on_screen_text") return block.text;
  if (block.type === "authored_speech") return block.text;
  if (block.type === "source_excerpt") return block.transcriptSnapshot ?? block.id;
  return block.description ?? block.id;
}

function blockKindLabel(block: ContentBlock): string {
  return block.type.replaceAll("_", " ");
}

function titleForSelection(project: NarrativeProject, selection: CanonicalSelection | null): string {
  if (!selection) return "Nothing selected";
  if (selection.type === "section") return project.sections[selection.id]?.title ?? selection.id;
  if (selection.type === "scene") return project.scenes[selection.id]?.title ?? selection.id;
  if (selection.type === "beat") return project.beats[selection.id]?.title ?? selection.id;
  if (selection.type === "cue") return `Cue ${selection.id}`;
  const block = project.blocks[selection.id];
  return block ? blockLabel(block) : selection.id;
}

function selectionFromItem(item: TimelineItem): CanonicalSelection | null {
  const ref = item.data?.salaiRef;
  if (!ref) return null;
  if (ref.type === "section" || ref.type === "beat" || ref.type === "cue" || ref.type === "block") {
    return { type: ref.type, id: ref.id };
  }
  return item.data?.cueId ? { type: "cue", id: item.data.cueId } : null;
}

function deleteOperation(selection: CanonicalSelection): NarrativeOperation | null {
  switch (selection.type) {
    case "section": return { op: "deleteSection", sectionId: selection.id };
    case "scene": return { op: "deleteScene", sceneId: selection.id };
    case "beat": return { op: "deleteBeat", beatId: selection.id };
    case "cue": return { op: "deleteCue", cueId: selection.id };
    case "block": return { op: "deleteBlock", blockId: selection.id };
  }
}

function parentLabel(project: NarrativeProject, parent: ParentRef): string {
  return parent.type === "section"
    ? `Section: ${project.sections[parent.id]?.title ?? parent.id}`
    : `Scene: ${project.scenes[parent.id]?.title ?? parent.id}`;
}

function orderedParentOptions(project: NarrativeProject): ParentRef[] {
  return [
    ...project.script.sectionIds.map((id) => ({ type: "section" as const, id })).filter((parent) => project.sections[parent.id]),
    ...Object.keys(project.scenes).map((id) => ({ type: "scene" as const, id })),
  ];
}

function createBlockForType(id: string, type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "visual_description": return { id, type, text: "Describe the visual." };
    case "on_screen_text": return { id, type, text: "Add on-screen text." };
    case "graphic": return { id, type, description: "Describe the graphic." };
    case "authored_speech": return { id, type, role: "vo", text: "Add authored speech." };
    case "source_excerpt": return { id, type, mediaSegmentId: "", sourceInMs: 0, sourceOutMs: 1_000 };
    case "music": return { id, type, description: "Add music." };
    case "sfx": return { id, type, description: "Add a sound effect." };
  }
}

function SemanticHierarchy({
  project,
  collapsedIds,
  onToggle,
  onSelect,
}: {
  project: NarrativeProject;
  collapsedIds: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onSelect: (selection: CanonicalSelection) => void;
}) {
  return (
    <div className="semantic-hierarchy" aria-label="Narrative hierarchy">
      <div className="semantic-hierarchy-heading"><strong>Hierarchy</strong><span>Expand detail without changing time</span></div>
      {project.script.sectionIds.map((sectionId) => {
        const section = project.sections[sectionId];
        if (!section) return null;
        const sectionKey = `section:${section.id}`;
        const sectionCollapsed = collapsedIds.has(sectionKey);
        return (
          <div className="semantic-tree-section" key={section.id}>
            <div className="semantic-tree-row section">
              <button type="button" aria-expanded={!sectionCollapsed} onClick={() => onToggle(sectionKey)}>{sectionCollapsed ? "+" : "−"}</button>
              <button type="button" onClick={() => onSelect({ type: "section", id: section.id })}>Section · {section.title ?? section.id}</button>
            </div>
            {!sectionCollapsed ? section.childIds.map((childId) => {
              const scene = project.scenes[childId];
              const beatIds = scene ? scene.beatIds : [childId];
              return (
                <div key={childId} className="semantic-tree-branch">
                  {scene ? <div className="semantic-tree-row scene"><span /><button type="button" onClick={() => onSelect({ type: "scene", id: scene.id })}>Scene · {scene.title ?? scene.id}</button></div> : null}
                  {beatIds.map((beatId) => {
                    const beat = project.beats[beatId];
                    if (!beat) return null;
                    const beatKey = `beat:${beat.id}`;
                    const beatCollapsed = collapsedIds.has(beatKey);
                    return (
                      <div key={beat.id}>
                        <div className="semantic-tree-row beat"><button type="button" aria-expanded={!beatCollapsed} onClick={() => onToggle(beatKey)}>{beatCollapsed ? "+" : "−"}</button><button type="button" onClick={() => onSelect({ type: "beat", id: beat.id })}>Beat · {beat.title ?? beat.id}</button></div>
                        {!beatCollapsed ? beat.cueIds.map((cueId) => {
                          const cue = project.cues[cueId];
                          if (!cue) return null;
                          const cueKey = `cue:${cue.id}`;
                          const cueCollapsed = collapsedIds.has(cueKey);
                          return <div className="semantic-tree-row cue" key={cue.id}><button type="button" aria-expanded={!cueCollapsed} onClick={() => onToggle(cueKey)}>{cueCollapsed ? "+" : "−"}</button><button type="button" onClick={() => onSelect({ type: "cue", id: cue.id })}>Cue · {cue.id} · {cue.visualBlockIds.length + cue.audioBlockIds.length} blocks</button></div>;
                        }) : null}
                      </div>
                    );
                  })}
                </div>
              );
            }) : null}
          </div>
        );
      })}
    </div>
  );
}

function SemanticInspector({
  project,
  projection,
  selection,
  selectedItems,
  currentTimeMs,
  onCommit,
  onCreateBlock,
  onCreateCue,
  onCreateBeat,
  onCreateSection,
  onDeleteSelected,
}: {
  project: NarrativeProject;
  projection: ReturnType<typeof projectNarrativeToTimeline>;
  selection: CanonicalSelection | null;
  selectedItems: TimelineItem[];
  currentTimeMs: number;
  onCommit: Commit;
  onCreateBlock: (type: ContentBlock["type"]) => void;
  onCreateCue: () => void;
  onCreateBeat: () => void;
  onCreateSection: () => void;
  onDeleteSelected: () => void;
}) {
  const context = resolveSemanticInsertionContext(projection, currentTimeMs, selection);
  const selectedCanonical = selectedItems.map(selectionFromItem).filter((item): item is CanonicalSelection => item !== null);
  const uniqueSelected = [...new Map(selectedCanonical.map((item) => [`${item.type}:${item.id}`, item])).values()];
  const primary = selection;
  const move = (direction: -1 | 1) => {
    if (!primary) return;
    if (primary.type === "section") {
      const index = project.script.sectionIds.indexOf(primary.id);
      const toIndex = index + direction;
      if (index < 0 || toIndex < 0 || toIndex >= project.script.sectionIds.length) return;
      onCommit([{ op: "moveSection", sectionId: primary.id, toIndex }], `Moved Section ${primary.id}`);
    } else if (primary.type === "beat") {
      const parent = beatParent(project, primary.id);
      const ids = parent?.type === "section" ? project.sections[parent.id]?.childIds : parent?.type === "scene" ? project.scenes[parent.id]?.beatIds : undefined;
      const index = ids?.indexOf(primary.id) ?? -1;
      const toIndex = index + direction;
      if (!parent || !ids || index < 0 || toIndex < 0 || toIndex >= ids.length) return;
      onCommit([{ op: "moveBeat", beatId: primary.id, toParent: parent, toIndex }], `Moved Beat ${primary.id}`);
    } else if (primary.type === "cue") {
      const beat = cueBeat(project, primary.id);
      const index = beat?.cueIds.indexOf(primary.id) ?? -1;
      const toIndex = index + direction;
      if (!beat || index < 0 || toIndex < 0 || toIndex >= beat.cueIds.length) return;
      onCommit([{ op: "moveCue", cueId: primary.id, toBeatId: beat.id, toIndex }], `Moved Cue ${primary.id}`);
    } else if (primary.type === "block") {
      const cue = blockCue(project, primary.id);
      const block = project.blocks[primary.id];
      if (!cue || !block) return;
      const ids = isVisualBlock(block) ? cue.visualBlockIds : cue.audioBlockIds;
      const index = ids.indexOf(primary.id);
      const toIndex = index + direction;
      if (index < 0 || toIndex < 0 || toIndex >= ids.length) return;
      onCommit([{ op: "moveBlock", blockId: primary.id, toCueId: cue.id, toIndex }], `Moved ContentBlock ${primary.id}`);
    }
  };

  return (
    <aside className="semantic-inspector" aria-label="Semantic inspector">
      <div className="semantic-inspector-heading"><div><span className="semantic-timeline-eyebrow">INSPECT</span><h3>{titleForSelection(project, primary)}</h3></div><span>{uniqueSelected.length > 1 ? `${uniqueSelected.length} selected` : primary?.type ?? "none"}</span></div>
      {uniqueSelected.length > 1 ? <div className="semantic-inspector-grouped"><p>Selection is temporary interaction state. Grouped actions publish one canonical batch.</p>{new Set(uniqueSelected.map((item) => item.type)).size === 1 ? <button type="button" className="danger-button" onClick={onDeleteSelected}>Delete selected</button> : <p>Choose one semantic type for grouped deletion.</p>}</div> : null}

      {primary?.type === "section" ? <><label>Title<input key={primary.id} defaultValue={project.sections[primary.id]?.title ?? ""} onBlur={(event) => onCommit([{ op: "updateSection", sectionId: primary.id, title: event.currentTarget.value }], "Updated Section")} /></label><p className="semantic-inspector-note">{project.sections[primary.id]?.childIds.length ?? 0} child items</p></> : null}
      {primary?.type === "scene" ? <><label>Title<input key={primary.id} defaultValue={project.scenes[primary.id]?.title ?? ""} onBlur={(event) => onCommit([{ op: "updateScene", sceneId: primary.id, title: event.currentTarget.value }], "Updated Scene")} /></label><p className="semantic-inspector-note">{project.scenes[primary.id]?.beatIds.length ?? 0} Beats</p></> : null}

      {primary?.type === "beat" && project.beats[primary.id] ? (() => {
        const beat = project.beats[primary.id]!;
        const parent = beatParent(project, beat.id);
        const ids = parent?.type === "section" ? project.sections[parent.id]?.childIds : parent?.type === "scene" ? project.scenes[parent.id]?.beatIds : undefined;
        const cueItem = projection.tracks.find((track) => track.id === "semantic-beats")?.items.find((item) => item.salaiRef.id === beat.id);
        return <>
          <label>Title<input key={`${beat.id}:title`} defaultValue={beat.title ?? ""} onBlur={(event) => onCommit([{ op: "updateBeat", beatId: beat.id, title: event.currentTarget.value, summary: beat.summary }], "Updated Beat")} /></label>
          <label>Summary<textarea key={`${beat.id}:summary`} defaultValue={beat.summary ?? ""} onBlur={(event) => onCommit([{ op: "updateBeat", beatId: beat.id, title: beat.title, summary: event.currentTarget.value }], "Updated Beat")} /></label>
          <p className="semantic-inspector-note">Derived duration · {formatSeconds(cueItem?.durationMs ?? 0)}</p>
          {parent ? <label>Parent<select value={`${parent.type}:${parent.id}`} onChange={(event) => { const [type, id] = event.currentTarget.value.split(":"); if (type === "section" || type === "scene") onCommit([{ op: "moveBeat", beatId: beat.id, toParent: { type, id }, toIndex: type === "section" ? (project.sections[id]?.childIds.length ?? 0) : (project.scenes[id]?.beatIds.length ?? 0) }], "Reparented Beat"); }}>{orderedParentOptions(project).map((option) => <option key={`${option.type}:${option.id}`} value={`${option.type}:${option.id}`}>{parentLabel(project, option)}</option>)}</select></label> : null}
          <div className="semantic-inspector-actions"><button type="button" disabled={!ids || ids.indexOf(beat.id) <= 0} onClick={() => move(-1)}>Move up</button><button type="button" disabled={!ids || ids.indexOf(beat.id) === ids.length - 1} onClick={() => move(1)}>Move down</button></div>
          {beat.cueIds.length > 1 ? <><label>Split after Cue<select defaultValue="1" id="split-boundary">{beat.cueIds.slice(1).map((cueId, index) => <option key={cueId} value={index + 1}>{cueId}</option>)}</select></label><button type="button" onClick={() => { const boundary = Number((document.getElementById("split-boundary") as HTMLSelectElement | null)?.value ?? 1); onCommit([{ op: "splitBeat", beatId: beat.id, newBeatId: makeId("beat"), leftCueIds: beat.cueIds.slice(0, boundary), rightCueIds: beat.cueIds.slice(boundary), rightTitle: "New Beat", relationshipPolicy: "left" }], "Split Beat"); }}>Split at Cue boundary</button></> : null}
          {parent && ids && ids.length > 1 ? <div className="semantic-inspector-actions">{ids.indexOf(beat.id) > 0 ? <button type="button" onClick={() => { const otherId = ids[ids.indexOf(beat.id) - 1]!; const other = project.beats[otherId]; if (other) onCommit([{ op: "mergeBeats", canonicalBeatId: beat.id, mergedBeatIds: [other.id], cueIds: [...other.cueIds, ...beat.cueIds] }], "Merged Beats"); }}>Merge with previous</button> : null}{ids.indexOf(beat.id) < ids.length - 1 ? <button type="button" onClick={() => { const otherId = ids[ids.indexOf(beat.id) + 1]!; const other = project.beats[otherId]; if (other) onCommit([{ op: "mergeBeats", canonicalBeatId: beat.id, mergedBeatIds: [other.id], cueIds: [...beat.cueIds, ...other.cueIds] }], "Merged Beats"); }}>Merge with next</button> : null}</div> : null}
        </>;
      })() : null}

      {primary?.type === "cue" && project.cues[primary.id] ? (() => {
        const cue = project.cues[primary.id]!;
        const beat = cueBeat(project, cue.id);
        const cueItem = projection.tracks.flatMap((track) => track.items).find((item) => item.kind === "cue" && item.salaiRef.id === cue.id);
        return <>
          <label>Explicit duration (ms)<input key={cue.id} type="number" min="1" defaultValue={cue.explicitDurationMs ?? ""} placeholder={String(cueItem?.durationMs ?? 0)} onBlur={(event) => { const value = event.currentTarget.value.trim(); onCommit([{ op: "updateCue", cueId: cue.id, explicitDurationMs: value === "" ? null : Number(value) }], "Updated Cue duration"); }} /></label>
          <p className="semantic-inspector-note">Derived duration · {formatSeconds(cueItem?.durationMs ?? 0)}</p>
          {beat ? <label>Beat<select value={beat.id} onChange={(event) => onCommit([{ op: "moveCue", cueId: cue.id, toBeatId: event.currentTarget.value, toIndex: project.beats[event.currentTarget.value]?.cueIds.length ?? 0 }], "Reparented Cue")}>{Object.values(project.beats).map((item) => <option key={item.id} value={item.id}>{item.title ?? item.id}</option>)}</select></label> : null}
          <p className="semantic-inspector-note">Visual blocks: {cue.visualBlockIds.length}. Audio blocks: {cue.audioBlockIds.length}.</p>
          <div className="semantic-inspector-actions"><button type="button" disabled={!beat || beat.cueIds.indexOf(cue.id) <= 0} onClick={() => move(-1)}>Move up</button><button type="button" disabled={!beat || beat.cueIds.indexOf(cue.id) === beat.cueIds.length - 1} onClick={() => move(1)}>Move down</button></div>
        </>;
      })() : null}

      {primary?.type === "block" && project.blocks[primary.id] ? (() => {
        const block = project.blocks[primary.id]!;
        const cue = blockCue(project, block.id);
        const media = block.type === "source_excerpt" ? project.mediaSegments[block.mediaSegmentId] : null;
        return <>
          <p className="semantic-inspector-note">{blockKindLabel(block)} · {cue ? `Cue ${cue.id}` : "No Cue"}</p>
          {(block.type === "visual_description" || block.type === "on_screen_text" || block.type === "authored_speech") ? <label>Text<textarea key={block.id} defaultValue={block.text} onBlur={(event) => onCommit([{ op: "updateBlock", block: { ...block, text: event.currentTarget.value } }], "Updated ContentBlock")} /></label> : null}
          {(block.type === "graphic" || block.type === "music" || block.type === "sfx") ? <label>Description<textarea key={block.id} defaultValue={block.description ?? ""} onBlur={(event) => onCommit([{ op: "updateBlock", block: { ...block, description: event.currentTarget.value } }], "Updated ContentBlock")} /></label> : null}
          {block.type === "authored_speech" ? <label>Role<select value={block.role ?? "vo"} onChange={(event) => onCommit([{ op: "updateBlock", block: { ...block, role: event.currentTarget.value as typeof block.role } }], "Updated speech role")}><option value="vo">Voice-over</option><option value="presenter">Presenter</option><option value="dialogue">Dialogue</option></select></label> : null}
          {block.type === "source_excerpt" ? <><p className="semantic-inspector-note">MediaSegment · {block.mediaSegmentId || "unassigned"}. {media ? `Allowed range: ${media.sourceInMs}–${media.sourceOutMs} ms.` : "Assign a source segment before playback."}</p><label>Source in (ms)<input type="number" min="0" defaultValue={block.sourceInMs} onBlur={(event) => onCommit([{ op: "trimSourceExcerpt", blockId: block.id, sourceInMs: Number(event.currentTarget.value), sourceOutMs: block.sourceOutMs }], "Updated SourceExcerpt in")} /></label><label>Source out (ms)<input type="number" min="1" defaultValue={block.sourceOutMs} onBlur={(event) => onCommit([{ op: "trimSourceExcerpt", blockId: block.id, sourceInMs: block.sourceInMs, sourceOutMs: Number(event.currentTarget.value) }], "Updated SourceExcerpt out")} /></label><p className="semantic-inspector-note">Source duration · {formatSeconds(block.sourceOutMs - block.sourceInMs)}. This does not change explicit Cue duration.</p></> : null}
          {cue ? <label>Cue<select value={cue.id} onChange={(event) => onCommit([{ op: "moveBlock", blockId: block.id, toCueId: event.currentTarget.value, toIndex: isVisualBlock(block) ? (project.cues[event.currentTarget.value]?.visualBlockIds.length ?? 0) : (project.cues[event.currentTarget.value]?.audioBlockIds.length ?? 0) }], "Reparented ContentBlock")}>{Object.values(project.cues).map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select></label> : null}
          {cue ? <div className="semantic-inspector-actions"><button type="button" disabled={(isVisualBlock(block) ? cue.visualBlockIds : cue.audioBlockIds).indexOf(block.id) <= 0} onClick={() => move(-1)}>Move up</button><button type="button" disabled={(isVisualBlock(block) ? cue.visualBlockIds : cue.audioBlockIds).indexOf(block.id) === (isVisualBlock(block) ? cue.visualBlockIds : cue.audioBlockIds).length - 1} onClick={() => move(1)}>Move down</button></div> : null}
        </>;
      })() : null}

      <div className="semantic-creation"><strong>Create in temporal context</strong><span>{context?.label ?? "No valid parent at the playhead"}</span><div className="semantic-inspector-actions"><button type="button" onClick={onCreateSection}>Section</button><button type="button" disabled={!context?.sectionId} onClick={onCreateBeat}>Beat</button><button type="button" disabled={!context?.beatId} onClick={onCreateCue}>Cue</button></div><div className="semantic-block-create">{(["visual_description", "on_screen_text", "graphic", "authored_speech", "source_excerpt", "music", "sfx"] as const).map((type) => <button key={type} type="button" disabled={!context?.cueId} onClick={() => onCreateBlock(type)}>{type.replaceAll("_", " ")}</button>)}</div></div>
      {primary ? <button type="button" className="danger-button" onClick={onDeleteSelected}>Delete {primary.type}</button> : null}
    </aside>
  );
}

export function SemanticTimeline() {
  const controller = useSalaiController();
  const state = useSalaiState();
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [viewport, setViewport] = useState<TimelineEditorViewport>({ pixelsPerSecond: 58, scrollLeftMs: 0 });
  const [timelineSelection, setTimelineSelection] = useState<TimelineEditorSelection>({ itemIds: [] });
  const [fixtureAudioUrl, setFixtureAudioUrl] = useState<string | null>(null);
  const [editFeedback, setEditFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (state.fixtureKey !== "semantic-editorial") {
      setFixtureAudioUrl(null);
      return;
    }
    const url = URL.createObjectURL(createInterviewFixtureWavBlob());
    setFixtureAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [state.fixtureKey]);

  const projection = useMemo(() => projectNarrativeToTimeline(state.project), [state.project]);
  const mediaSources = useMemo<Readonly<Record<string, FixtureMediaSource>>>(() => {
    if (state.fixtureKey === "filmmaking") return FILMMAKING_MEDIA;
    if (state.fixtureKey !== "semantic-editorial") return {};
    const base = createSemanticEditorialFixture().mediaSources;
    if (!fixtureAudioUrl) return base;
    return Object.fromEntries(Object.entries(base).map(([id, source]) => [id, source.kind === "audio" ? { ...source, src: fixtureAudioUrl } : source]));
  }, [fixtureAudioUrl, state.fixtureKey]);
  const elahProject = useMemo(() => toElahProject(projection, mediaSources, { fps: 30 }), [mediaSources, projection]);
  const playback = useSemanticPlayback(projection, elahProject);
  const completeDocument = useMemo(() => toTimelineEditorDocument(projection), [projection]);
  const document: SemanticTimelineDocument = useMemo(() => filterTimelineDocumentForExpansion(completeDocument, collapsedIds), [collapsedIds, completeDocument]);
  const summary = useMemo(() => semanticTimelineSummary(projection), [projection]);
  const visibleItemIds = useMemo(() => new Set(document.tracks.flatMap((track) => track.items.map((item) => item.id))), [document]);
  const controlledSelection = useMemo(() => {
    const local = timelineSelection.itemIds.filter((id) => visibleItemIds.has(id));
    return local.length > 0 ? { ...timelineSelection, itemIds: local } : timelineSelectionForCanonical(projection, document, state.selection);
  }, [document, projection, state.selection, timelineSelection, visibleItemIds]);
  const selectedItems = useMemo(() => document.tracks.flatMap((track) => track.items).filter((item) => controlledSelection.itemIds.includes(item.id)), [controlledSelection.itemIds, document]);
  const primarySelection = useMemo(() => canonicalSelectionFromTimelineSelection(document, controlledSelection) ?? state.selection, [controlledSelection, document, state.selection]);

  const commit = useCallback<Commit>((operations, summaryText, selection) => {
    playback.pause();
    const accepted = controller.dispatchNarrativeBatch(operations, { revertible: true });
    if (accepted) {
      if (selection) controller.select(selection);
      setEditFeedback(`${summaryText}. Reprojected from canonical Salai state.`);
    } else setEditFeedback("Not applied: canonical Salai validation rejected the edit.");
  }, [controller, playback.pause]);

  const selectedCanonical = useMemo(() => selectedItems.map(selectionFromItem).filter((item): item is CanonicalSelection => item !== null), [selectedItems]);
  const deleteSelected = useCallback(() => {
    const values = [...new Map(selectedCanonical.map((item) => [`${item.type}:${item.id}`, item])).values()];
    const type = values[0]?.type;
    if (!type || values.some((item) => item.type !== type)) {
      if (primarySelection) { const operation = deleteOperation(primarySelection); if (operation) commit([operation], `Deleted ${primarySelection.type}`); }
      return;
    }
    const operations = values.map(deleteOperation).filter((operation): operation is NarrativeOperation => operation !== null);
    if (operations.length > 0) commit(operations, `Deleted ${operations.length} ${type}${operations.length === 1 ? "" : "s"}`);
  }, [commit, primarySelection, selectedCanonical]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (target?.isContentEditable || ["input", "textarea", "select", "button"].includes(tagName ?? "")) return;
      if (selectedCanonical.length === 0 && !primarySelection) return;
      event.preventDefault();
      deleteSelected();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [deleteSelected, primarySelection, selectedCanonical.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!shouldToggleSemanticPlayback(event)) return;
      event.preventDefault();
      playback.toggle();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playback.toggle]);

  const insertion = resolveSemanticInsertionContext(projection, playback.currentTimeMs, primarySelection);
  const createSection = () => { const section = { id: makeId("section"), title: "New Section", childIds: [] }; commit([{ op: "createSection", section }], "Created Section", { type: "section", id: section.id }); };
  const createBeat = () => {
    const parent = primarySelection?.type === "scene" ? { type: "scene" as const, id: primarySelection.id } : primarySelection?.type === "section" ? { type: "section" as const, id: primarySelection.id } : insertion?.sectionId ? { type: "section" as const, id: insertion.sectionId } : null;
    if (!parent) return;
    const beat = { id: makeId("beat"), title: "New Beat", cueIds: [] };
    commit([{ op: "createBeat", beat, parent }], "Created Beat", { type: "beat", id: beat.id });
  };
  const createCue = () => {
    const beatId = primarySelection?.type === "beat" ? primarySelection.id : primarySelection?.type === "cue" ? cueBeat(state.project, primarySelection.id)?.id : primarySelection?.type === "block" ? blockCue(state.project, primarySelection.id)?.id : insertion?.beatId;
    if (!beatId) return;
    const cue = { id: makeId("cue"), visualBlockIds: [], audioBlockIds: [] };
    commit([{ op: "createCue", cue, beatId }], "Created Cue", { type: "cue", id: cue.id });
  };
  const createBlock = (type: ContentBlock["type"]) => {
    const cueId = primarySelection?.type === "cue" ? primarySelection.id : primarySelection?.type === "block" ? blockCue(state.project, primarySelection.id)?.id : insertion?.cueId;
    if (!cueId) return;
    const block = type === "source_excerpt"
      ? { ...createBlockForType(makeId("block"), type), mediaSegmentId: Object.values(state.project.mediaSegments)[0]?.id ?? "", sourceInMs: Object.values(state.project.mediaSegments)[0]?.sourceInMs ?? 0, sourceOutMs: Math.max(1, Object.values(state.project.mediaSegments)[0]?.sourceOutMs ?? 1) }
      : createBlockForType(makeId("block"), type);
    if (block.type === "source_excerpt" && !block.mediaSegmentId) return;
    commit([{ op: "createBlock", block, cueId }], `Created ${blockKindLabel(block)}`, { type: "block", id: block.id });
  };

  const handleSelectionChange = (next: TimelineEditorSelection) => { setTimelineSelection(next); controller.select(canonicalSelectionFromTimelineSelection(document, next)); };
  const handleDocumentChange = (nextDocument: SemanticTimelineDocument) => {
    const interpretation = interpretSemanticTimelineDocumentChange(state.project, document, nextDocument);
    if (interpretation.kind === "noop") return;
    if (interpretation.kind === "rejected") { setEditFeedback(`Not applied: ${interpretation.reason}`); return; }
    commit(interpretation.operations, interpretation.summary);
  };

  return (
    <section className="semantic-timeline-surface" aria-label="Semantic timeline">
      <header className="semantic-timeline-header"><div><span className="semantic-timeline-eyebrow">PLAY · SEMANTIC TIME</span><h2>Story in time</h2><p>Inspect the whole story and its audiovisual detail on one time axis. Accepted gestures publish canonical Salai operations.</p></div><div className="semantic-timeline-runtime"><small>Structural runtime</small><strong>{formatSeconds(projection.durationMs)}</strong></div></header>
      <SemanticViewer assembly={resolveSemanticAssemblyAtMs(projection, elahProject, playback.currentTimeMs)} audioSrc={fixtureAudioUrl} currentTimeMs={playback.currentTimeMs} durationMs={projection.durationMs} isPlaying={playback.snapshot.isPlaying} onTogglePlayback={playback.toggle} />
      <div className="semantic-timeline-controls"><label className="semantic-viewport-control">Timeline scale <input type="range" min="24" max="180" value={viewport.pixelsPerSecond} onChange={(event) => setViewport({ ...viewport, pixelsPerSecond: Number(event.currentTarget.value) })} /></label><div className="semantic-timeline-facts" aria-label="Timeline summary"><span>{summary.sections} sections</span><span>{summary.beats} beats</span><span>{summary.cues} cues</span><span>{summary.visualMedia} realizations</span><span>{summary.visualBlocks + summary.audioBlocks} blocks</span><span className={summary.missingVisuals > 0 ? "warning" : ""}>{summary.missingVisuals} missing</span></div></div>
      {editFeedback ? <p className="semantic-timeline-edit-feedback" role="status">{editFeedback}</p> : null}
      <SemanticHierarchy project={state.project} collapsedIds={collapsedIds} onToggle={(key) => setCollapsedIds((previous) => { const next = new Set(previous); if (next.has(key)) next.delete(key); else next.add(key); return next; })} onSelect={(next) => { controller.select(next); setTimelineSelection({ itemIds: [] }); }} />
      <div className="semantic-timeline-workbench"><div className="semantic-timeline-editor-frame"><TimelineEditor document={{ ...document, currentTimeMs: Math.min(playback.currentTimeMs, projection.durationMs) }} selection={controlledSelection} viewport={viewport} frameRate={30} editPolicy={{ overlap: "allow", ripple: false }} onDocumentChange={handleDocumentChange} onSelectionChange={handleSelectionChange} onViewportChange={setViewport} onCurrentTimeChange={playback.seekMs} renderTrackHeader={({ track }) => <div className="semantic-track-header"><strong>{track.label}</strong><span>{track.kind}</span></div>} renderItem={({ item, selected }) => { const data = item.data; const kind = data?.salaiKind ?? item.kind ?? "item"; return <div className={`semantic-timeline-item semantic-timeline-item-${kind}${selected ? " selected" : ""}`}><span className="semantic-item-kind">{kind === "missing-visual" ? "NEEDS COVERAGE" : kind.replaceAll("-", " ")}</span><span className="semantic-item-label">{item.label}</span></div>; }} aria-label="Hierarchical semantic timeline" /></div><SemanticInspector project={state.project} projection={projection} selection={primarySelection} selectedItems={selectedItems} currentTimeMs={playback.currentTimeMs} onCommit={commit} onCreateSection={createSection} onCreateBeat={createBeat} onCreateCue={createCue} onCreateBlock={createBlock} onDeleteSelected={deleteSelected} /></div>
      <footer className="semantic-timeline-legend"><span><i className="legend-dot beat" /> Narrative progression</span><span><i className="legend-dot cue" /> Audiovisual moment</span><span><i className="legend-dot media" /> Realization</span><span><i className="legend-dot source" /> Source evidence</span><span><i className="legend-dot missing" /> Missing realization</span></footer>
    </section>
  );
}
