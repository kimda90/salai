import type { Cue, Id } from "@salai/script-model";
import {
  blockDisplayText,
  sourceExcerptDurationMs,
  sourceRangeLabel,
  updateBlockDisplayText,
} from "./content-utils";
import { useSalaiController, useSalaiState } from "./controller";
import {
  formatDuration,
  getDurationEstimate,
  makeId,
  orderedBeatRefs,
} from "./model-utils";
import { orderedPaperAudioItems } from "./paper-edit-utils";

type CueOption = {
  cueId: Id;
  beatTitle: string;
};

function VisualCompanion({ cue }: { cue: Cue }) {
  const controller = useSalaiController();
  const { project } = useSalaiState();

  return (
    <div className="paper-visual-companion">
      <div className="paper-visual-heading">
        <span>Visual intent in this Cue</span>
        <button
          type="button"
          className="wall-small-button"
          onClick={() =>
            controller.dispatchNarrative({
              op: "createBlock",
              cueId: cue.id,
              block: {
                id: makeId("visual"),
                type: "visual_description",
                text: "Add visual intent",
              },
            })
          }
        >
          + Visual
        </button>
      </div>
      {cue.visualBlockIds.length === 0 ? <p>No visual intent yet.</p> : null}
      {cue.visualBlockIds.map((blockId) => {
        const block = project.blocks[blockId];
        return block ? <p key={blockId}>{blockDisplayText(block)}</p> : null;
      })}
    </div>
  );
}

function AudioCard({
  blockId,
  cueId,
  beatId,
  blockIndex,
  cueOptions,
}: {
  blockId: Id;
  cueId: Id;
  beatId: Id;
  blockIndex: number;
  cueOptions: CueOption[];
}) {
  const controller = useSalaiController();
  const { project, selection } = useSalaiState();
  const block = project.blocks[blockId];
  const cue = project.cues[cueId];
  const beat = project.beats[beatId];
  if (!block || !cue || !beat) return null;

  const sourceEvidence = block.type === "source_excerpt";
  const sourceDuration = sourceExcerptDurationMs(block);

  return (
    <article
      className={`paper-audio-card ${sourceEvidence ? "source-card" : "authored-card"} ${selection?.type === "cue" && selection.id === cue.id ? "selected" : ""}`}
      onClick={() => controller.select({ type: "cue", id: cue.id })}
    >
      <header className="paper-card-header">
        <div>
          <span className="paper-card-kind">
            {sourceEvidence ? "Recorded source" : block.type.replaceAll("_", " ")}
          </span>
          <strong>{beat.title ?? beat.id}</strong>
        </div>
        <div className="paper-card-time">
          {sourceEvidence ? sourceRangeLabel(block) : null}
          {sourceDuration !== null ? (
            <small>{formatDuration(sourceDuration)}</small>
          ) : null}
        </div>
      </header>

      {block.type === "source_excerpt" ? (
        <div className="paper-source-copy">
          <blockquote>{blockDisplayText(block)}</blockquote>
          <div>
            <span>MediaSegment: {block.mediaSegmentId}</span>
            <span>Range preserved · not authored prose</span>
          </div>
        </div>
      ) : (
        <textarea
          className="paper-authored-editor"
          rows={3}
          value={blockDisplayText(block)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) =>
            controller.dispatchNarrative({
              op: "updateBlock",
              block: updateBlockDisplayText(block, event.target.value),
            })
          }
        />
      )}

      <div
        className="paper-card-actions"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="paper-order-buttons">
          <button
            type="button"
            disabled={blockIndex === 0}
            onClick={() =>
              controller.dispatchNarrative({
                op: "moveBlock",
                blockId: block.id,
                toCueId: cue.id,
                toIndex: blockIndex - 1,
              })
            }
          >
            ↑
          </button>
          <button
            type="button"
            disabled={blockIndex === cue.audioBlockIds.length - 1}
            onClick={() =>
              controller.dispatchNarrative({
                op: "moveBlock",
                blockId: block.id,
                toCueId: cue.id,
                toIndex: blockIndex + 1,
              })
            }
          >
            ↓
          </button>
        </div>
        <label>
          Attach to
          <select
            value={cue.id}
            onChange={(event) => {
              const targetCue = project.cues[event.target.value];
              if (!targetCue || targetCue.id === cue.id) return;
              controller.dispatchNarrative({
                op: "moveBlock",
                blockId: block.id,
                toCueId: targetCue.id,
                toIndex: targetCue.audioBlockIds.length,
              });
            }}
          >
            {cueOptions.map((target) => (
              <option key={target.cueId} value={target.cueId}>
                {target.beatTitle} · {target.cueId}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="wall-small-button danger"
          onClick={() =>
            controller.dispatchNarrative({ op: "deleteBlock", blockId: block.id })
          }
        >
          Remove
        </button>
      </div>

      <VisualCompanion cue={cue} />
    </article>
  );
}

export function PaperEdit() {
  const controller = useSalaiController();
  const { project } = useSalaiState();
  const items = orderedPaperAudioItems(project);
  const duration = getDurationEstimate(project);
  const beatRefs = orderedBeatRefs(project);
  const cueOptions: CueOption[] = beatRefs.flatMap(({ beatId }) => {
    const beat = project.beats[beatId];
    if (!beat) return [];
    return beat.cueIds.map((cueId) => ({
      cueId,
      beatTitle: beat.title ?? beat.id,
    }));
  });
  const firstCueId = cueOptions[0]?.cueId;
  const sourceCount = items.filter(
    (item) => item.block.type === "source_excerpt",
  ).length;
  const authoredCount = items.filter(
    (item) => item.block.type === "authored_speech",
  ).length;

  return (
    <div className="surface paper-edit-surface">
      <div className="surface-heading">
        <div>
          <div className="eyebrow">Workspace / audio-first projection</div>
          <h2>Paper / Radio Edit</h2>
          <p>
            Recorded excerpts stay tied to source ranges while authored bridges
            remain editable. Move material between Cues without flattening it
            into transcript prose.
          </p>
        </div>
        <div className="paper-summary">
          <span>{sourceCount} sourced</span>
          <span>{authoredCount} authored</span>
          <strong>{formatDuration(duration.scriptMs)}</strong>
        </div>
      </div>

      <div className="paper-toolbar">
        <span>Audio-first story sequence</span>
        {firstCueId ? (
          <button
            type="button"
            className="wall-small-button"
            onClick={() =>
              controller.dispatchNarrative({
                op: "createBlock",
                cueId: firstCueId,
                block: {
                  id: makeId("bridge"),
                  type: "authored_speech",
                  role: "vo",
                  text: "New authored bridge",
                },
              })
            }
          >
            + Authored bridge
          </button>
        ) : null}
      </div>

      <div className="paper-sequence">
        {items.length === 0 ? (
          <div className="paper-empty">
            No audio-backed material yet. Add VO in AV Script or use a
            source-backed fixture.
          </div>
        ) : null}
        {items.map((item) => (
          <AudioCard
            key={item.blockId}
            blockId={item.blockId}
            cueId={item.cueId}
            beatId={item.beatId}
            blockIndex={item.blockIndex}
            cueOptions={cueOptions}
          />
        ))}
      </div>
    </div>
  );
}
