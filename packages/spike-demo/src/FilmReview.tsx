import type { NarrativeOperation } from "@salai/script-model";
import { useEffect, useMemo, useRef, useState } from "react";
import { blockDisplayText, sourceRangeLabel, updateBlockDisplayText } from "./content-utils";
import { useSalaiController, useSalaiState } from "./controller";
import { toElahProject } from "./elah-adapter";
import { directionTargetExists, filmMoments, groupDirectionChanges, narrativeLabel, type DirectionTarget } from "./film-direction";
import { FILMMAKING_MEDIA, FILMMAKING_STORY } from "./filmmaking-fixture";
import { formatDuration } from "./model-utils";
import { resolveSemanticAssemblyAtMs } from "./semantic-playback-model";
import type { FixtureMediaSource } from "./semantic-editorial-fixture";
import { SemanticViewer } from "./SemanticViewer";
import { projectNarrativeToTimeline } from "./timeline-projection";
import { shouldToggleSemanticPlayback, useSemanticPlayback } from "./use-semantic-playback";
import "./film-review.css";

const BLOCK_LABELS = { visual_description: "Action", authored_speech: "Dialogue", on_screen_text: "On-screen text", graphic: "Graphic", sfx: "Sound", music: "Music" };
const EMPTY_MEDIA: Readonly<Record<string, FixtureMediaSource>> = {};

export function FilmReview() {
  const controller = useSalaiController();
  const state = useSalaiState();
  const { project, direction } = state;
  const { text: noteText, scope } = state.directionDraft;
  const panelTitle = useRef<HTMLHeadingElement>(null);
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

  useEffect(() => {
    if (direction && direction.status !== "proposed") panelTitle.current?.focus({ preventScroll: true });
  }, [direction?.note.id, direction?.status]);

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
      panelTitle.current?.focus({ preventScroll: true });
    }
  }

  return (
    <section className="surface film-review" aria-label="Film review">
      <div className="film-workspace">
        <div className="film-screen">
          <header className="film-heading">
            <span className="eyebrow">{selected ? `${project.scenes[selected.sceneId ?? ""]?.title ?? project.sections[selected.sectionId]?.title ?? "Story"} / Moment ${String(moments.indexOf(selected) + 1).padStart(2, "0")}` : "Film review"}</span>
            <h2>{selected?.label ?? "Your story starts here"}</h2>
          </header>
          {state.fixtureKey === "filmmaking" ? <details className="film-story"><summary>Read the original story</summary><p>{FILMMAKING_STORY}</p><p>Review question: does Ivo already suspect what the letter means, or does he discover it here?</p></details> : null}
          {beat ? <div className="film-purpose"><strong>Purpose</strong><p>{beat.summary ?? "What should the audience understand here?"}</p></div> : null}
          <SemanticViewer assembly={assembly} audioSrc={null} currentTimeMs={playback.currentTimeMs} durationMs={projection.durationMs} isPlaying={playback.snapshot.isPlaying} onTogglePlayback={playback.toggle} mediaLabel={state.fixtureKey === "filmmaking" ? "Fixture artwork · silent storyboard" : undefined}>
            <label className="film-scrub"><span className="visually-hidden">Film playhead</span>
              <input aria-label="Film playhead" type="range" min="0" max={Math.max(0, projection.durationMs - 1)} step="1" value={Math.min(playback.currentTimeMs, Math.max(0, projection.durationMs - 1))} onChange={(event) => playback.seekMs(Number(event.target.value))} />
            </label>
          </SemanticViewer>
          {assembly.cue && assembly.cue.cueId !== selected?.cueId ? <button className="ghost-button" type="button" onClick={() => selectMoment(assembly.cue!.cueId!)}>Direct the moment at the playhead</button> : null}
          <div className="film-strip-heading"><span>Story moments</span><span>{moments.length} moments · {formatDuration(projection.durationMs)}</span></div>
          <div className="film-strip" aria-label="Ordered story moments">
            {moments.map((moment, index) => {
              const image = projection.tracks.flatMap((track) => track.items).find((item) => item.kind === "visual-media" && item.cueId === moment.cueId);
              const source = image?.mediaSegmentId ? media[image.mediaSegmentId] : undefined;
              return <button key={moment.cueId} type="button" className="film-shot" aria-pressed={selected?.cueId === moment.cueId} aria-label={`Moment ${index + 1}: ${moment.label}`} onClick={() => selectMoment(moment.cueId)}>
                {source ? <img src={source.src} alt="" /> : <span className="film-shot-missing">No review image</span>}
                <span className="film-shot-meta">{String(index + 1).padStart(2, "0")} · {formatDuration(cueItems.find((item) => item.cueId === moment.cueId)?.durationMs)}</span>
                <strong>{moment.label}</strong>
              </button>;
            })}
          </div>
          {!moments.length ? <p className="film-empty">This story has no reviewable moments. Add story content in the existing editor.</p> : null}
          {selected?.shotIntents.length ? <details className="film-shot-direction"><summary>Shot direction and references</summary>{selected.shotIntents.map((shot) => <p key={shot.id}>{shot.description}</p>)}</details> : null}
          <p className="film-notice" role="status">{notice.revision === state.projectRevision ? notice.text : ""}</p>
        </div>
        <aside className="film-direction" aria-label="Direction and proposed changes">
          <h3 ref={panelTitle} tabIndex={-1}>{pending ? direction?.status === "proposed" ? "Review changes" : "Direction ready" : "Direct this moment"}</h3>
          {!pending ? <>
          <p className="film-target"><span>Target</span>{target.type === "cue" && selected ? `Moment ${String(moments.indexOf(selected) + 1).padStart(2, "0")} · ` : ""}{narrativeLabel(project, target.id)}</p>
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
              {selected?.sceneId ? <option value="scene">Scene · {project.scenes[selected.sceneId]?.title}</option> : null}
              <option value="script">Whole story</option>
              <optgroup label="More precise scopes">
              {selected ? <option value="beat">Beat · {beat?.title}</option> : null}
              {selected ? <option value="section">Sequence · {project.sections[selected.sectionId]?.title}</option> : null}
              {selected?.shotIntents.map((shot, index) => <option key={shot.id} value={`shot-intent:${shot.id}`}>Linked shot direction {index + 1}</option>)}
              </optgroup>
            </select></label>
            <label>What should change?<textarea value={noteText} onFocus={playback.pause} onChange={(event) => controller.updateDirectionDraft({ text: event.target.value })} placeholder="What should the audience understand or feel here?" required /></label>
            {selected?.cueId === "cue-f0-reaction" ? <button className="ghost-button" type="button" onClick={() => controller.updateDirectionDraft({ scope: "cue", text: "Ivo already suspects she is leaving. Make his reaction guarded rather than surprised, and hold it for five seconds." })}>Use the example direction</button> : null}
            <button type="submit" className="primary-button" disabled={!noteText.trim()}>Submit direction</button>
          </form>
          <p className="film-harness-note">Your external agent prepares a proposal. You review it before applying changes.</p>
          </> : null}
          {direction ? <details className="film-proposal" open={pending} aria-label="Submitted direction">
            <summary>{direction.status === "waiting" ? "Ready for your external agent" : direction.status === "proposed" ? "Proposed changes" : `${direction.status[0]!.toUpperCase()}${direction.status.slice(1)} direction`}</summary>
            <p className="film-target"><span>Submitted target</span>{direction.note.targetLabel}</p>
            {state.selection?.id !== direction.note.target.id && directionTargetExists(project, direction.note.target) && direction.note.target.type !== "script" && direction.note.target.type !== "shot-intent" ? <button className="ghost-button" type="button" onClick={() => { playback.pause(); const target = direction.note.target; if (target.type !== "script" && target.type !== "shot-intent") controller.select({ type: target.type, id: target.id }); panelTitle.current?.focus({ preventScroll: true }); }}>Return to note target</button> : null}
            <blockquote>{direction.note.text}</blockquote>
            {direction.status === "waiting" ? <p>This note is ready. Ask your external agent to read Salai context. No agent starts automatically.</p> : null}
            <details className="film-submission"><summary>Submission context</summary><p>Captured at {formatDuration(direction.note.playheadMs)}. The note stays on this target when selection changes.</p></details>
            {pending && stale ? <div className="film-stale" role="status"><strong>The project changed after this note.</strong><p>Submit it again with current context before accepting a proposal.</p><button className="ghost-button" type="button" disabled={!directionTargetExists(project, direction.note.target)} onClick={() => controller.submitDirection(direction.note.text, direction.note.target, direction.note.playheadMs)}>Resubmit note with current context</button>{!directionTargetExists(project, direction.note.target) ? <p>The target was deleted. Dismiss this note and select a new target.</p> : null}</div> : null}
            {direction.proposal ? <>
              <p><strong>Proposed interpretation</strong><br />{direction.proposal.summary}</p>
              <p>Review every change, including changes outside the note target.</p>
              <ul className="film-changes">{groupDirectionChanges(direction.note.submittedProject, direction.proposal.changes).map((group) => <li key={group.id}>
                <strong>{group.label}</strong>
                {group.changes.map((change) => <div className="film-changed-item" key={change.id}>
                  {change.kind !== "changed" ? <p><strong>{change.kind === "added" ? "Added" : "Removed"} item</strong></p> : null}
                  {change.fields.map((field, index) => field.label === "Duration" ? <div className="film-duration-change" key={index}><strong>Duration</strong><span><span className="visually-hidden">Before: </span>{field.before} <span aria-hidden="true">→</span><span className="visually-hidden"> After: </span> <b>{field.after}</b></span></div> : <div className="film-changed-field" key={index}><span>{field.label}</span><dl><div><dt>Before</dt><dd>{field.before}</dd></div><div><dt>After</dt><dd>{field.after}</dd></div></dl></div>)}
                  <details className="film-change-details"><summary>Item details</summary><p>{change.kind} · {change.label}</p><code>{change.id}</code></details>
                </div>)}
              </li>)}</ul>
              {direction.proposal.warnings.map((warning, index) => <p key={index} className="film-stale">{warning}</p>)}
              {direction.status === "proposed" ? <button type="button" className="primary-button" disabled={stale} onClick={() => { playback.pause(); if (controller.acceptDirection(direction.proposal!.id)) showNotice("Proposed changes applied. The previous project is available through Revert last edit."); }}>Apply changes</button> : null}
            </> : null}
            {pending ? <button type="button" className="ghost-button" onClick={() => controller.dismissDirection()}>Dismiss direction</button> : null}
            {direction.status === "applied" ? <p>Applied to the project. Fixture artwork is unchanged.</p> : null}
          </details> : null}
          {selected && cue && beat ? <details className="film-edit"><summary>Edit this moment <span>Text, duration, and order</span></summary>
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
                <label>Purpose · shared by this beat<textarea name="intent" defaultValue={beat.summary ?? ""} /></label>
                {[...cue.visualBlockIds, ...cue.audioBlockIds].map((id) => {
                  const block = project.blocks[id]!;
                  return block.type === "source_excerpt" ? <p key={id} className="film-source"><strong>Source evidence · {sourceRangeLabel(block)}</strong><br />{blockDisplayText(block)}<br />Source wording and ranges stay separate from authored text.</p>
                    : <label key={id}>{BLOCK_LABELS[block.type]}<textarea name={id} defaultValue={blockDisplayText(block)} /></label>;
                })}
                <button type="submit" className="primary-button">Apply edits</button>
              </form>
              <div className="film-actions">
                {([-1, 1] as const).map((offset) => <button className="ghost-button" type="button" key={offset} disabled={beat.cueIds.indexOf(cue.id) + offset < 0 || beat.cueIds.indexOf(cue.id) + offset >= beat.cueIds.length} onClick={() => commit([{ op: "moveCue", cueId: cue.id, toBeatId: beat.id, toIndex: beat.cueIds.indexOf(cue.id) + offset }])}>{offset < 0 ? "Earlier in this beat" : "Later in this beat"}</button>)}
                <button className="ghost-button" type="button" onClick={() => { playback.pause(); controller.select({ type: "cue", id: cue.id }); controller.setSurface("timeline"); }}>Open timeline for more edits</button>
              </div>
            </details> : null}
          <p className="film-fixture-note">Fixture artwork stays fixed. Work is lost after a reload.</p>
          <details className="film-harness-help"><summary>Connect the development harness</summary><p>Open this page with <code>?bridge=1&amp;fixture=filmmaking</code>. Ask your agent to read Salai context and propose changes for the submitted note.</p><p>The agent uses <code>pnpm salai tools</code>, <code>context</code>, and <code>propose-direction</code>. F0 does not start an agent automatically.</p></details>
        </aside>
      </div>
    </section>
  );
}
