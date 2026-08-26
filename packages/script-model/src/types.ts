export type Id = string;

export type Script = {
  id: Id;
  title?: string;
  targetDurationMs?: number;
  sectionIds: Id[];
};

export type Section = {
  id: Id;
  title?: string;
  childIds: Id[];
};

export type Scene = {
  id: Id;
  title?: string;
  beatIds: Id[];
};

export type Beat = {
  id: Id;
  title?: string;
  summary?: string;
  cueIds: Id[];
};

export type Cue = {
  id: Id;
  visualBlockIds: Id[];
  audioBlockIds: Id[];
  explicitDurationMs?: number;
};

export type VisualDescription = {
  id: Id;
  type: "visual_description";
  text: string;
};

export type OnScreenText = {
  id: Id;
  type: "on_screen_text";
  text: string;
};

export type Graphic = {
  id: Id;
  type: "graphic";
  description: string;
};

export type AuthoredSpeech = {
  id: Id;
  type: "authored_speech";
  text: string;
  role?: "vo" | "presenter" | "dialogue";
};

export type SourceExcerpt = {
  id: Id;
  type: "source_excerpt";
  mediaSegmentId: Id;
  sourceInMs: number;
  sourceOutMs: number;
  transcriptSnapshot?: string;
};

export type Music = {
  id: Id;
  type: "music";
  description?: string;
};

export type SFX = {
  id: Id;
  type: "sfx";
  description: string;
};

export type VisualBlock = VisualDescription | OnScreenText | Graphic;
export type AudioBlock = AuthoredSpeech | SourceExcerpt | Music | SFX;
export type ContentBlock = VisualBlock | AudioBlock;

export type MediaSegment = {
  id: Id;
  assetId?: Id;
  sourceInMs: number;
  sourceOutMs: number;
  transcript?: string;
};

export type ShotIntent = {
  id: Id;
  description: string;
};

export type RelationshipType =
  | "requires_shot_intent"
  | "supported_by_media"
  | "source_excerpt_of";

export type Relationship = {
  id: Id;
  sourceId: Id;
  targetId: Id;
  type: RelationshipType;
};

export type NarrativeProject = {
  schemaVersion: number;
  script: Script;
  sections: Record<Id, Section>;
  scenes: Record<Id, Scene>;
  beats: Record<Id, Beat>;
  cues: Record<Id, Cue>;
  blocks: Record<Id, ContentBlock>;
  relationships: Record<Id, Relationship>;
  mediaSegments: Record<Id, MediaSegment>;
  shotIntents: Record<Id, ShotIntent>;
};

export const VISUAL_BLOCK_TYPES = new Set<ContentBlock["type"]>([
  "visual_description",
  "on_screen_text",
  "graphic",
]);

export const AUDIO_BLOCK_TYPES = new Set<ContentBlock["type"]>([
  "authored_speech",
  "source_excerpt",
  "music",
  "sfx",
]);

export function isVisualBlock(block: ContentBlock): block is VisualBlock {
  return VISUAL_BLOCK_TYPES.has(block.type);
}

export function isAudioBlock(block: ContentBlock): block is AudioBlock {
  return AUDIO_BLOCK_TYPES.has(block.type);
}
