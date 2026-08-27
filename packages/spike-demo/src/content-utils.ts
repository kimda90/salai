import type { ContentBlock } from "@salai/script-model";

export function blockDisplayText(block: ContentBlock): string {
  switch (block.type) {
    case "visual_description":
    case "on_screen_text":
    case "authored_speech":
      return block.text;
    case "graphic":
    case "sfx":
      return block.description;
    case "music":
      return block.description ?? "Music";
    case "source_excerpt":
      return block.transcriptSnapshot ?? "Source excerpt";
  }
}

export function updateBlockDisplayText(
  block: ContentBlock,
  value: string,
): ContentBlock {
  switch (block.type) {
    case "visual_description":
    case "on_screen_text":
    case "authored_speech":
      return { ...block, text: value };
    case "graphic":
    case "sfx":
    case "music":
      return { ...block, description: value };
    case "source_excerpt":
      return block;
  }
}

export function isSourceEvidence(block: ContentBlock): boolean {
  return block.type === "source_excerpt";
}

export function sourceRangeLabel(block: ContentBlock): string | null {
  if (block.type !== "source_excerpt") return null;
  const format = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  return `${format(block.sourceInMs)}–${format(block.sourceOutMs)}`;
}

export function sourceExcerptDurationMs(block: ContentBlock): number | null {
  if (block.type !== "source_excerpt") return null;
  return Math.max(0, block.sourceOutMs - block.sourceInMs);
}
