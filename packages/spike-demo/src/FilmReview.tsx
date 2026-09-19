import type { NarrativeOperation } from "@salai/script-model";
import { useEffect, useMemo, useState } from "react";
import { blockDisplayText, sourceRangeLabel, updateBlockDisplayText } from "./content-utils";
import { useSalaiController, useSalaiState } from "./controller";
import { toElahProject } from "./elah-adapter";
import { directionTargetExists, filmMoments, type DirectionTarget } from "./film-direction";
import { FILMMAKING_MEDIA, FILMMAKING_STORY } from "./filmmaking-fixture";
import { formatDuration } from "./model-utils";
import { resolveSemanticAssemblyAtMs } from "./semantic-playback-model";
import type { FixtureMediaSource } from "./semantic-editorial-fixture";
import { SemanticViewer } from "./SemanticViewer";
import { projectNarrativeToTimeline } from "./timeline-projection";
import { shouldToggleSemanticPlayback, useSemanticPlayback } from "./use-semantic-playback";
import "./film-review.css";

const EMPTY_MEDIA: Readonly<Record<string, FixtureMediaSource>> = {};

export function FilmReview() {
  const controller = useSalaiController();
  const state = useSalaiState();
  const { project, direction } = state;
  const { text: noteText, scope } = state.directionDraft;
  const [notice, setNotice] = useState({ text: "", revision: state.projectRevision });
  const projection = useMemo(() => projectNarrativeToTimeline(project), [project]);
  const moments = useMemo(() => filmMoments(project), [project]);
  const media = state.fixtureKey === "filmmaking" ? FILMMAKING_MEDIA : EMPTY_MEDIA;
  const elahProject = useMemo(() => toElahProject(projection, media), [projection, media]);
  const playback = useSemanticPlayback(projection, elahProject);
  const cueItems = projection.tracks.flatMap((track) => track.items).filter((item) => item.kind === "cue");
  const selected = moments.find((moment) => {
    const selection = state.selection;
    if (!selection) return false;
    if (selection.type === "cue") return moment.cueId === selection.id;
    if (selection.type === "block") return [...project.cues[moment.cueId]!.visualBlockIds, ...project.cues[moment.cueId]!.audioBlockIds].includes(selection.id);
    return moment.beatId === selection.id || moment.sceneId === selection.id || moment.sectionId === selection.id;
  }) ?? moments[0];
  const selectedItem = cueItems.find((item) => item.cueId === selected?.cueId);
  const cue = selected ? project.cues[selected.cueId] : undefined;
  const beat = selected ? project.beats[selected.beatId] : undefined;

  useEffect(() => {
    if (selectedItem) playback.seekMs(selectedItem.startMs);
  }, [selected?.cueId, selectedItem?.startMs, playback.seekMs]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!shouldToggleSemanticPlayback(event)) return;
      event.preventDefault();
      playback.toggle();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playback.toggle]);

  const target: DirectionTarget = scope === "script" ? { type: "script", id: project.script.id }
    : scope === "section" && selected ? { type: "section", id: selected.sectionId }
    : scope === "scene" && selected?.sceneId ? { type: "scene", id: selected.sceneId }
    : scope === "beat" && selected ? { type: "beat", id: selected.beatId }
    : scope.startsWith("shot-intent:") && selected?.shotIntents.some((shot) => shot.id === scope.slice(12)) ? { type: "shot-intent", id: scope.slice(12) }
    : selected ? { type: "cue", id: selected.cueId } : { type: "script", id: project.script.id };
  const stale = direction !== null && direction.note.projectRevision !== state.projectRevision;
  const pending = direction?.status === "waiting" || direction?.status === "proposed";
  const assembly = resolveSemanticAssemblyAtMs(projection, elahProject, playback.currentTimeMs);

  function showNotice(text: string) {
    setNotice({ text, revision: controller.getSnapshot().projectRevision });
  }

  function selectMoment(cueId: string) {
    playback.pause();
    controller.select({ type: "cue", id: cueId });
    const item = cueItems.find((candidate) => candidate.cueId === cueId);
    if (item) playback.seekMs(item.startMs);
  }

  function commit(operations: NarrativeOperation[]) {
    playback.pause();
    if (controller.dispatchNarrativeBatch(operations, { revertible: true })) {
      showNotice("Edit applied. You can revert it until the next project or workspace edit.");
    }
  }

  return (
    <section className="surface film-review" aria-label="Film review">
      <header className="surface-heading">
        <div>
          <span className="eyebrow">F0 · Tell → See → Direct → Update</span>
          <h2>{project.script.title ?? "Untitled story"}</h2>
          <p>Review the story, direct a moment, and inspect the proposed edit.</p>
        </div>
        <span className="runtime-pill">{formatDuration(projection.durationMs)}</span>
      </header>
      <div className="film-fixture-note">
        <strong>Fixture artwork · silent storyboard</strong>
        <span>Artwork stays fixed when direction changes. Generation and spoken intake are unavailable in F0.</span>
        <span>This prototype does not save notes or project edits after a reload.</span>
      </div>
      {state.fixtureKey === "filmmaking" ? <details className="film-story"><summary>Original story and review question</summary><p>{FILMMAKING_STORY}</p><p>Review question: does Ivo already suspect what the letter means, or does he discover it here?</p></details> : null}
      <div className="film-workspace">
        <div className="film-screen">
          <SemanticViewer assembly={assembly} audioSrc={null} currentTimeMs={playback.currentTimeMs} durationMs={projection.durationMs} isPlaying={playback.snapshot.isPlaying} onTogglePlayback={playback.toggle} />
          <label className="film-scrub">Playhead
            <input aria-label="Film playhead" type="range" min="0" max={Math.max(0, projection.durationMs - 1)} step="1" value={Math.min(playback.currentTimeMs, Math.max(0, projection.durationMs - 1))} onChange={(event) => playback.seekMs(Number(event.target.value))} />
          </label>
          {assembly.cue && assembly.cue.cueId !== selected?.cueId ? <button className="ghost-button" type="button" onClick={() => selectMoment(assembly.cue!.cueId!)}>Direct the moment at the playhead</button> : null}
          <div className="film-strip" aria-label="Ordered story moments">
            {moments.map((moment, index) => {
              const image = projection.tracks.flatMap((track) => track.items).find((item) => item.kind === "visual-media" && item.cueId === moment.cueId);
              const source = image?.mediaSegmentId ? media[image.mediaSegmentId] : undefined;
              return <button key={moment.cueId} type="button" className="film-shot" aria-pressed={selected?.cueId === moment.cueId} aria-label={`Moment ${index + 1}: ${moment.label}`} onClick={() => selectMoment(moment.cueId)}>
                {source ? <img src={source.src} alt="" /> : <span className="film-shot-missing">No review image</span>}
                <span className="film-shot-meta">{String(index + 1).padStart(2, "0")} · {formatDuration(cueItems.find((item) => item.cueId === moment.cueId)?.durationMs)}</span>
                <strong>{moment.label}</strong>
                <span>{project.scenes[moment.sceneId ?? ""]?.title ?? project.sections[moment.sectionId]?.title}</span>
              </button>;
            })}
          </div>
          {!moments.length ? <p className="film-empty">This story has no reviewable moments. Add story content in the existing editor.</p> : null}
          {selected && cue && beat ? <section className="film-context" aria-label="Selected moment context">
            <span className="eyebrow">Selected moment {moments.indexOf(selected) + 1} · {project.scenes[selected.sceneId ?? ""]?.title ?? "Sequence"}</span>
            <h3>{selected.label}</h3>
            <p><strong>Narrative intent</strong> {beat.summary ?? "No intent description yet."}</p>
            {selected.shotIntents.map((shot) => <p key={shot.id}><strong>Shot direction</strong> {shot.description}</p>)}
            <details><summary>Edit this moment</summary>
              <form key={`${cue.id}:${state.projectRevision}`} onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const operations: NarrativeOperation[] = [];
                const rawDuration = String(data.get("duration") ?? "").trim();
                const duration = rawDuration ? Number(rawDuration) * 1000 : null;
                if (duration !== (cue.explicitDurationMs ?? null)) operations.push({ op: "updateCue", cueId: cue.id, explicitDurationMs: duration });
                const summary = String(data.get("intent") ?? "");
                if (summary !== (beat.summary ?? "")) operations.push({ op: "updateBeat", beatId: beat.id, summary });
                for (const id of [...cue.visualBlockIds, ...cue.audioBlockIds]) {
                  const block = project.blocks[id]!;
                  if (block.type === "source_excerpt") continue;
                  const text = String(data.get(id) ?? "");
                  if (text !== blockDisplayText(block)) operations.push({ op: "updateBlock", block: updateBlockDisplayText(block, text) });
                }
                if (operations.length) commit(operations);
              }}>
                <label>Duration in seconds<input name="duration" type="number" min="0" step="0.001" defaultValue={cue.explicitDurationMs === undefined ? "" : cue.explicitDurationMs / 1000} placeholder="Use content duration" /></label>
                <label>Narrative intent for this beat<textarea name="intent" defaultValue={beat.summary ?? ""} /></label>
                {[...cue.visualBlockIds, ...cue.audioBlockIds].map((id) => {
                  const block = project.blocks[id]!;
                  return block.type === "source_excerpt" ? <p key={id} className="film-source"><strong>Source evidence · {sourceRangeLabel(block)}</strong><br />{blockDisplayText(block)}<br />Source wording and ranges stay separate from authored text.</p>
                    : <label key={id}>{block.type.replaceAll("_", " ")}<textarea name={id} defaultValue={blockDisplayText(block)} /></label>;
                })}
                <button type="submit" className="primary-button">Apply text and duration edits</button>
              </form>
              <div className="film-actions">
                {([-1, 1] as const).map((offset) => <button className="ghost-button" type="button" key={offset} disabled={beat.cueIds.indexOf(cue.id) + offset < 0 || beat.cueIds.indexOf(cue.id) + offset >= beat.cueIds.length} onClick={() => commit([{ op: "moveCue", cueId: cue.id, toBeatId: beat.id, toIndex: beat.cueIds.indexOf(cue.id) + offset }])}>{offset < 0 ? "Earlier in this beat" : "Later in this beat"}</button>)}
                <button className="ghost-button" type="button" onClick={() => { playback.pause(); controller.select({ type: "cue", id: cue.id }); controller.setSurface("timeline"); }}>Open timeline for more edits</button>
              </div>
            </details>
          </section> : null}
          <p className="film-notice" role="status">{notice.revision === state.projectRevision ? notice.text : ""}</p>
        </div>
        <aside className="film-direction" aria-label="Direction and proposed changes">
          <h3>Direct the story</h3>
          <form onSubmit={(event) => {
            event.preventDefault();
            playback.pause();
            if (controller.submitDirection(noteText, target, playback.currentTimeMs)) {
              controller.updateDirectionDraft({ text: "" });
              showNotice("Direction captured. Your external agent can now prepare a proposal.");
            }
          }}>
            <label>Note target<select value={target.type === "shot-intent" ? `shot-intent:${target.id}` : target.type} onChange={(event) => controller.updateDirectionDraft({ scope: event.target.value })}>
              {selected ? <option value="cue">Selected moment {moments.indexOf(selected) + 1}</option> : null}
              {selected ? <option value="beat">Beat · {beat?.title}</option> : null}
              {selected?.sceneId ? <option value="scene">Scene · {project.scenes[selected.sceneId]?.title}</option> : null}
              {selected ? <option value="section">Sequence · {project.sections[selected.sectionId]?.title}</option> : null}
              <option value="script">Whole story</option>
              {selected?.shotIntents.map((shot, index) => <option key={shot.id} value={`shot-intent:${shot.id}`}>Linked shot direction {index + 1}</option>)}
            </select></label>
            <label>What should change?<textarea value={noteText} onFocus={playback.pause} onChange={(event) => controller.updateDirectionDraft({ text: event.target.value })} placeholder="What should the audience understand or feel here?" required /></label>
            {selected?.cueId === "cue-f0-reaction" && !pending ? <button className="ghost-button" type="button" onClick={() => controller.updateDirectionDraft({ scope: "cue", text: "Ivo already suspects she is leaving. Make his reaction guarded rather than surprised, and hold it for five seconds." })}>Use the example direction</button> : null}
            <button type="submit" className="primary-button" disabled={!noteText.trim() || pending}>Submit direction</button>
            {pending ? <p>Resolve or dismiss the current note before submitting another.</p> : null}
          </form>
          <p className="film-harness-note">Your external agent interprets the note. Salai shows its proposal here before you apply it.</p>
          <details><summary>Connect the development harness</summary><p>Open this page with <code>?bridge=1&amp;fixture=filmmaking</code>. Ask your agent to read Salai context and propose changes for the submitted note.</p><p>The agent uses <code>pnpm salai tools</code>, <code>context</code>, and <code>propose-direction</code>. F0 does not start an agent automatically.</p></details>
          {direction ? <section className="film-proposal" aria-label="Submitted direction">
            <span className="eyebrow">{direction.status === "waiting" ? "Waiting for your agent" : direction.status === "proposed" ? "Review proposed changes" : direction.status}</span>
            <h4>{direction.note.targetLabel}</h4>
            <blockquote>{direction.note.text}</blockquote>
            <p>Captured at {formatDuration(direction.note.playheadMs)}. The note stays on this target when selection changes.</p>
            {pending && stale ? <div className="film-stale" role="status"><strong>The project changed after this note.</strong><p>Submit it again with current context before accepting a proposal.</p><button className="ghost-button" type="button" disabled={!directionTargetExists(project, direction.note.target)} onClick={() => controller.submitDirection(direction.note.text, direction.note.target, direction.note.playheadMs)}>Resubmit note with current context</button>{!directionTargetExists(project, direction.note.target) ? <p>The target was deleted. Dismiss this note and select a new target.</p> : null}</div> : null}
            {direction.proposal ? <>
              <p><strong>Proposed interpretation</strong><br />{direction.proposal.summary}</p>
              <p>Review all {direction.proposal.changes.length} affected items below. The proposal can include changes outside the note target.</p>
              <ul className="film-changes">{direction.proposal.changes.map((change) => <li key={change.id}><strong>{change.kind} · {change.label}</strong>{change.fields.map((field, index) => <div key={index}><span>{field.label}</span><p><b>Before:</b> {field.before}</p><p><b>After:</b> {field.after}</p></div>)}</li>)}</ul>
              {direction.proposal.warnings.map((warning, index) => <p key={index} className="film-stale">{warning}</p>)}
              {direction.status === "proposed" ? <button type="button" className="primary-button" disabled={stale} onClick={() => { playback.pause(); if (controller.acceptDirection(direction.proposal!.id)) showNotice("Proposed changes applied. The previous project is available through Revert last edit."); }}>Apply proposed changes</button> : null}
            </> : null}
            {pending ? <button type="button" className="ghost-button" onClick={() => controller.dismissDirection()}>Dismiss note and proposal</button> : null}
            {direction.status === "applied" ? <p>Applied to the project. Fixture artwork is unchanged.</p> : null}
          </section> : null}
        </aside>
      </div>
    </section>
  );
}
