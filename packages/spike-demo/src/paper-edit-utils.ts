import type { ContentBlock, Id, NarrativeProject } from "@salai/script-model";
import { orderedBeatRefs } from "./av-script-utils";

export type PaperAudioItem = {
  blockId: Id;
  cueId: Id;
  beatId: Id;
  beatTitle: string;
  cueIndex: number;
  blockIndex: number;
  block: ContentBlock;
  visualBlockIds: Id[];
};

export function orderedPaperAudioItems(project: NarrativeProject): PaperAudioItem[] {
  const items: PaperAudioItem[] = [];
  for (const beatRef of orderedBeatRefs(project)) {
    const beat = project.beats[beatRef.beatId];
    if (!beat) continue;
    beat.cueIds.forEach((cueId, cueIndex) => {
      const cue = project.cues[cueId];
      if (!cue) return;
      cue.audioBlockIds.forEach((blockId, blockIndex) => {
        const block = project.blocks[blockId];
        if (!block) return;
        items.push({
          blockId,
          cueId,
          beatId: beat.id,
          beatTitle: beat.title ?? beat.id,
          cueIndex,
          blockIndex,
          block,
          visualBlockIds: [...cue.visualBlockIds],
        });
      });
    });
  }
  return items;
}

export function sourceExcerptDurationMs(block: ContentBlock): number | null {
  if (block.type !== "source_excerpt") return null;
  return Math.max(0, block.sourceOutMs - block.sourceInMs);
}

export function isEditablePaperAudio(block: ContentBlock): boolean {
  return block.type === "authored_speech" || block.type === "music" || block.type === "sfx";
}
