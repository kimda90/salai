import type { ContentBlock, Cue, Id } from "@salai/script-model";
import { useMemo } from "react";
import { useSalaiController, useSalaiState } from "./controller";
import { blockDisplayText, isSourceEvidence, orderedBeatRefs, sourceRangeLabel } from "./av-script-utils";
import { formatDuration, getDurationEstimate, makeId } from "./model-utils";

function editableBlockUpdate(block: ContentBlock, value: string): ContentBlock {
  switch (block.type) {
    case "visual_description":
      return { ...block, text: value };
    case "on_screen_text":
      return { ...block, text: value };
    case "graphic":
      return { ...block, description: value };
    case "authored_speech":
      return { ...block, text: value };
    case "music":
      return { ...block, description: value };
    case "sfx":
      return { ...block, description: value };
    case "source_excerpt":
      return block;
  }
}

function BlockEditor({ blockId }: { blockId: Id }) {
  const controller = useSalaiController();
  const { project } = useSalaiState();
  const block = project.blocks[blockId];
  if (!block) return null;

  const sourceEvidence = isSourceEvidence(block);
  return (
    <div className={`av-block av-block-${block.type} ${sourceEvidence ? "source-evidence" : ""}`}>
      <div className="av-block-meta">
        <span>{block.type.replaceAll("_", " ")}</span>
        {block.type === "authored_speech" && block.role ? <small>{block.role}</small> : null}
        {sourceEvidence ? <small>{sourceRangeLabel(block)}</small> : null}
      </div>
      {block.type === "source_excerpt" ? (
        <div className="source-evidence-copy">
          <p>{blockDisplayText(block)}</p>
          <span>Source: {block.mediaSegmentId}</span>
        </div>
      ) : (
        <textarea
          rows={2}
          value={blockDisplayText(block)}
          onChange={(event) => controller.dispatchNarrative({
            op: "updateBlock",
            block: editableBlockUpdate(block, event.target.value),
          })}
        />
      )}
      <button
        type="button"
        className="av-delete-block"
        onClick={() => controller.dispatchNarrative({ op: "deleteBlock", blockId: block.id })}
      >×</button>
    </div>
  );
}

function CueRow({ cue, beatId, cueIndex }: { cue: Cue; beatId: Id; cueIndex: number }) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const beat = project.beats[beatId];
  if (!beat) return null;
  const durations = getDurationEstimate(project);
  const allBeatRefs = orderedBeatRefs(project);
  const allBeatIds = allBeatRefs.map((item) => item.beatId);

  return (
    <div className={`av-cue-row ${selection?.type === "cue" && selection.id === cue.id ? "selected" : ""}`} onClick={() => controller.select({ type: "cue", id: cue.id })}>
      <div className="av-cue-gutter">
        <span className="cue-index">{cueIndex + 1}</span>
        <span>{formatDuration(durations.cueMs[cue.id])}</span>
        <input
          aria-label="Explicit cue duration seconds"
          className="duration-input"
          type="number"
          min="0"
          step="0.1"
          value={cue.explicitDurationMs === undefined ? "" : cue.explicitDurationMs / 1000}
          placeholder="auto"
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            const raw = event.target.value.trim();
            controller.dispatchNarrative({
              op: "updateCue",
              cueId: cue.id,
              explicitDurationMs: raw === "" ? null : Math.max(0, Number(raw) * 1000),
            });
          }}
        />
        <div className="cue-order-actions" onClick={(event) => event.stopPropagation()}>
          <button type="button" disabled={cueIndex === 0} onClick={() => controller.dispatchNarrative({ op: "moveCue", cueId: cue.id, toBeatId: beat.id, toIndex: cueIndex - 1 })}>↑</button>
          <button type="button" disabled={cueIndex === beat.cueIds.length - 1} onClick={() => controller.dispatchNarrative({ op: "moveCue", cueId: cue.id, toBeatId: beat.id, toIndex: cueIndex + 1 })}>↓</button>
        </div>
        <select
          className="cue-beat-select"
          aria-label="Move cue to beat"
          value={beat.id}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            const targetBeatId = event.target.value;
            if (targetBeatId === beat.id) return;
            const targetBeat = project.beats[targetBeatId];
            if (!targetBeat) return;
            controller.dispatchNarrative({ op: "moveCue", cueId: cue.id, toBeatId: targetBeat.id, toIndex: targetBeat.cueIds.length });
          }}
        >
          {allBeatIds.map((id) => <option key={id} value={id}>{project.beats[id]?.title ?? id}</option>)}
        </select>
        <button type="button" className="wall-small-button danger" onClick={(event) => { event.stopPropagation(); controller.dispatchNarrative({ op: "deleteCue", cueId: cue.id }); }}>Delete cue</button>
      </div>

      <div className="av-lane visual-lane">
        <div className="av-lane-title">Visual</div>
        {cue.visualBlockIds.map((blockId) => <BlockEditor key={blockId} blockId={blockId} />)}
        <button
          type="button"
          className="av-add-block"
          onClick={(event) => {
            event.stopPropagation();
            const id = makeId("visual");
            controller.dispatchNarrative({
              op: "createBlock",
              cueId: cue.id,
              block: { id, type: "visual_description", text: "New visual" },
            });
          }}
        >+ Visual</button>
      </div>

      <div className="av-lane audio-lane">
        <div className="av-lane-title">Audio</div>
        {cue.audioBlockIds.map((blockId) => <BlockEditor key={blockId} blockId={blockId} />)}
        <button
          type="button"
          className="av-add-block"
          onClick={(event) => {
            event.stopPropagation();
            const id = makeId("speech");
            controller.dispatchNarrative({
              op: "createBlock",
              cueId: cue.id,
              block: { id, type: "authored_speech", role: "vo", text: "New VO" },
            });
          }}
        >+ VO</button>
      </div>
    </div>
  );
}

function BeatAVGroup({ beatId, context }: { beatId: Id; context: string }) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const beat = project.beats[beatId];
  const duration = useMemo(() => getDurationEstimate(project), [project]);
  if (!beat) return null;

  return (
    <section className={`av-beat-group ${selection?.type === "beat" && selection.id === beat.id ? "selected" : ""}`}>
      <header className="av-beat-heading" onClick={() => controller.select({ type: "beat", id: beat.id })}>
        <div>
          <div className="eyebrow">{context}</div>
          <input
            className="av-beat-title"
            value={beat.title ?? ""}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => controller.dispatchNarrative({ op: "updateBeat", beatId: beat.id, title: event.target.value, summary: beat.summary ?? null })}
          />
          {beat.summary ? <p>{beat.summary}</p> : null}
        </div>
        <div className="av-beat-summary">
          <span>{beat.cueIds.length} cue{beat.cueIds.length === 1 ? "" : "s"}</span>
          <strong>{formatDuration(duration.beatMs[beat.id])}</strong>
          <button
            type="button"
            className="wall-small-button"
            onClick={(event) => {
              event.stopPropagation();
              const id = makeId("cue");
              controller.dispatchNarrative({
                op: "createCue",
                beatId: beat.id,
                cue: { id, visualBlockIds: [], audioBlockIds: [] },
              });
              controller.select({ type: "cue", id });
            }}
          >+ Cue</button>
        </div>
      </header>
      <div className="av-cues">
        {beat.cueIds.length === 0 ? <div className="empty-cues">No Cues yet. Add one to describe how this Beat is expressed.</div> : null}
        {beat.cueIds.map((cueId, cueIndex) => {
          const cue = project.cues[cueId];
          return cue ? <CueRow key={cue.id} cue={cue} beatId={beat.id} cueIndex={cueIndex} /> : null;
        })}
      </div>
    </section>
  );
}

export function AVScript() {
  const { project } = useSalaiState();
  const beatRefs = orderedBeatRefs(project);
  const duration = useMemo(() => getDurationEstimate(project), [project]);

  return (
    <div className="surface av-script-surface">
      <div className="surface-heading">
        <div>
          <div className="eyebrow">Projection</div>
          <h2>AV Script</h2>
          <p>Visual and audio realization stay side by side while Beat and Cue identity remain canonical.</p>
        </div>
        <div className="runtime-pill">{formatDuration(duration.scriptMs)}</div>
      </div>
      <div className="av-script-body">
        {beatRefs.map((ref) => {
          const section = project.sections[ref.sectionId];
          const scene = ref.sceneId ? project.scenes[ref.sceneId] : undefined;
          const context = scene
            ? `${section?.title ?? ref.sectionId} / ${scene.title ?? scene.id}`
            : section?.title ?? ref.sectionId;
          return <BeatAVGroup key={ref.beatId} beatId={ref.beatId} context={context} />;
        })}
      </div>
    </div>
  );
}
