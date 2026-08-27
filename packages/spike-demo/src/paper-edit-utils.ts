import type { ContentBlock, Id, NarrativeProject } from "@salai/script-model";
import { orderedBeatRefs } from "./model-utils";

export type PaperAudioItem = {
  blockId: Id;
  cueId: Id;
  beatId: Id;
  blockIndex: number;
  block: ContentBlock;
};

export function orderedPaperAudioItems(project: NarrativeProject): PaperAudioItem[] {
  const items: PaperAudioItem[] = [];
  for (const beatRef of orderedBeatRefs(project)) {
    const beat = project.beats[beatRef.beatId];
    if (!beat) continue;

    for (const cueId of beat.cueIds) {
      const cue = project.cues[cueId];
      if (!cue) continue;

      cue.audioBlockIds.forEach((blockId, blockIndex) => {
        const block = project.blocks[blockId];
        if (block) {
          items.push({
            blockId,
            cueId,
            beatId: beat.id,
            blockIndex,
            block,
          });
        }
      });
    }
  }
  return items;
}
