import {
  applyOperations,
  createEmptyNarrativeProject,
  type NarrativeOperation,
  type NarrativeProject,
} from "@salai/script-model";
import type { FixtureMediaSource } from "./semantic-editorial-fixture";

export const FILMMAKING_STORY = "Before dawn, Mara returns to the station workshop with a sealed letter. Her brother Ivo assumes she is leaving on the first train. She hides the letter while they repair their father's signal lamp. On the platform, she gives Ivo the letter: instructions for keeping the workshop open. They light the lamp together and let the train pass.";

const scenes = [
  { id: "workshop", title: "Workshop · before dawn" },
  { id: "platform", title: "Platform · dawn" },
] as const;

const beats = [
  { id: "arrival", scene: "workshop", title: "An apparent departure", summary: "The audience and Ivo mistake Mara's return for a farewell." },
  { id: "concealment", scene: "workshop", title: "The withheld letter", summary: "Mara protects a decision she has already made. Ivo notices the letter but cannot read it." },
  { id: "reveal", scene: "platform", title: "A different future", summary: "The letter reveals Mara's plan to stay and keep the workshop open." },
  { id: "choice", scene: "platform", title: "Let the train pass", summary: "Lighting the lamp together turns a private decision into a shared commitment." },
] as const;

const shots = [
  { id: "arrival-wide", beat: "arrival", text: "Mara enters the dark workshop, carrying a sealed letter.", intent: "Establish Mara, the workshop, and the possibility of departure.", duration: 4000 },
  { id: "lamp", beat: "arrival", text: "Ivo looks up from their father's broken signal lamp.", intent: "Connect Ivo to the work and the lamp to their shared history.", duration: 4000 },
  { id: "letter", beat: "concealment", text: "Mara covers the letter with her hand beside the lamp.", intent: "Let the audience see what Mara withholds, without revealing the letter's contents.", duration: 4000 },
  { id: "reaction", beat: "concealment", text: "Ivo looks surprised when he notices the letter.", intent: "Make Ivo's interpretation of the letter visible in his reaction.", duration: 3000 },
  { id: "platform-wide", beat: "reveal", text: "On the platform, Mara hands the letter to Ivo.", intent: "Move from concealment to an invitation, with the departing train nearby.", duration: 4000 },
  { id: "open-letter", beat: "reveal", text: "Ivo unfolds a plan to keep the workshop open.", intent: "Reverse the audience's assumption: Mara plans to stay.", duration: 5000 },
  { id: "light", beat: "choice", text: "Mara and Ivo light the repaired signal lamp together.", intent: "Show that both characters accept the plan through a shared action.", duration: 4000 },
  { id: "train", beat: "choice", text: "The train passes. Mara and Ivo remain beside the lit lamp.", intent: "Resolve the departure question with a visible choice to stay.", duration: 5000 },
] as const;

export const FILMMAKING_MEDIA: Readonly<Record<string, FixtureMediaSource>> = Object.fromEntries(
  shots.map((shot, index) => [`media-f0-${shot.id}`, {
    mediaSegmentId: `media-f0-${shot.id}`,
    kind: "image" as const,
    src: `/salai/fixtures/f0-${index + 1}.svg`,
  }]),
);

export function createFilmmakingFixture(): NarrativeProject {
  const baseline = createEmptyNarrativeProject({ scriptId: "script-last-light", title: "The last light" });
  // Existing APIs link reference stubs but cannot create them. These are fixture inputs, not generated assets.
  for (const shot of shots) {
    baseline.shotIntents[`shot-f0-${shot.id}`] = {
      id: `shot-f0-${shot.id}`,
      description: `${shot.intent} References: Mara in a long coat; Ivo in work clothes; the station workshop and platform.`,
    };
    baseline.mediaSegments[`media-f0-${shot.id}`] = {
      id: `media-f0-${shot.id}`,
      assetId: `fixture-storyboard-${shot.id}`,
      sourceInMs: 0,
      sourceOutMs: shot.duration,
    };
  }
  baseline.mediaSegments["media-f0-room-tone"] = {
    id: "media-f0-room-tone", assetId: "fixture-room-tone-unavailable",
    sourceInMs: 1000, sourceOutMs: 12000,
    transcript: "[Fixture source evidence: station room tone. No recording is supplied.]",
  };
  const operations: NarrativeOperation[] = [
    { op: "createSection", section: { id: "section-last-light", title: "The last light", childIds: [] } },
    ...scenes.map((scene): NarrativeOperation => ({
      op: "createScene", scene: { id: `scene-${scene.id}`, title: scene.title, beatIds: [] }, sectionId: "section-last-light",
    })),
    ...beats.map((beat): NarrativeOperation => ({
      op: "createBeat", beat: { id: `beat-${beat.id}`, title: beat.title, summary: beat.summary, cueIds: [] },
      parent: { type: "scene", id: `scene-${beat.scene}` },
    })),
  ];
  for (const shot of shots) {
    const cueId = `cue-f0-${shot.id}`;
    operations.push(
      { op: "createCue", cue: { id: cueId, visualBlockIds: [], audioBlockIds: [], explicitDurationMs: shot.duration }, beatId: `beat-${shot.beat}` },
      { op: "createBlock", cueId, block: { id: `visual-f0-${shot.id}`, type: "visual_description", text: shot.text } },
      { op: "linkShotIntent", relationshipId: `rel-f0-shot-${shot.id}`, sourceId: cueId, shotIntentId: `shot-f0-${shot.id}` },
      { op: "linkMediaSegment", relationshipId: `rel-f0-media-${shot.id}`, sourceId: cueId, mediaSegmentId: `media-f0-${shot.id}` },
    );
  }
  operations.push(
    { op: "createBlock", cueId: "cue-f0-open-letter", block: { id: "text-f0-letter", type: "on_screen_text", text: "Keep the workshop open. I am staying." } },
    { op: "createBlock", cueId: "cue-f0-letter", block: { id: "sound-f0-letter", type: "sfx", description: "Paper moves against the wooden bench." } },
    { op: "createBlock", cueId: "cue-f0-letter", block: { id: "source-f0-room-tone", type: "source_excerpt", mediaSegmentId: "media-f0-room-tone", sourceInMs: 2000, sourceOutMs: 6000, transcriptSnapshot: "[Fixture station room tone. Recording unavailable.]" } },
  );
  return applyOperations(baseline, operations).model;
}
