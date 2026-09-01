import type { NarrativeProject } from "@salai/script-model";

export type FixtureMediaSource = {
  mediaSegmentId: string;
  kind: "video" | "audio" | "image";
  src: string;
};

export type SemanticEditorialFixture = {
  project: NarrativeProject;
  mediaSources: Record<string, FixtureMediaSource>;
};

export function createSemanticEditorialFixture(): SemanticEditorialFixture {
  const project: NarrativeProject = {
    schemaVersion: 1,
    script: {
      id: "script-semantic-editorial",
      title: "Reporting workflow",
      targetDurationMs: 24_000,
      sectionIds: ["section-problem", "section-change"],
    },
    sections: {
      "section-problem": {
        id: "section-problem",
        title: "Problem",
        childIds: ["beat-hook", "beat-friction"],
      },
      "section-change": {
        id: "section-change",
        title: "Change",
        childIds: ["beat-demo", "beat-payoff"],
      },
    },
    scenes: {},
    beats: {
      "beat-hook": {
        id: "beat-hook",
        title: "The reporting ritual is draining",
        cueIds: ["cue-hook"],
      },
      "beat-friction": {
        id: "beat-friction",
        title: "The work steals attention from the decision",
        cueIds: ["cue-friction"],
      },
      "beat-demo": {
        id: "beat-demo",
        title: "The same data becomes a clean result",
        cueIds: ["cue-demo-import", "cue-demo-result"],
      },
      "beat-payoff": {
        id: "beat-payoff",
        title: "The saved time changes the work",
        cueIds: ["cue-payoff"],
      },
    },
    cues: {
      "cue-hook": {
        id: "cue-hook",
        visualBlockIds: ["visual-hook"],
        audioBlockIds: ["speech-hook"],
        explicitDurationMs: 4_000,
      },
      "cue-friction": {
        id: "cue-friction",
        visualBlockIds: ["visual-friction"],
        audioBlockIds: ["source-juan"],
        explicitDurationMs: 6_000,
      },
      "cue-demo-import": {
        id: "cue-demo-import",
        visualBlockIds: ["visual-demo-import"],
        audioBlockIds: ["speech-demo"],
        explicitDurationMs: 4_000,
      },
      "cue-demo-result": {
        id: "cue-demo-result",
        visualBlockIds: ["visual-demo-result"],
        audioBlockIds: ["source-maya"],
        explicitDurationMs: 5_000,
      },
      "cue-payoff": {
        id: "cue-payoff",
        visualBlockIds: ["visual-payoff"],
        audioBlockIds: ["speech-payoff"],
        explicitDurationMs: 5_000,
      },
    },
    blocks: {
      "visual-hook": {
        id: "visual-hook",
        type: "visual_description",
        text: "A dense weekly report sprawls across the desk.",
      },
      "speech-hook": {
        id: "speech-hook",
        type: "authored_speech",
        role: "vo",
        text: "Every Monday starts with the same reporting ritual.",
      },
      "visual-friction": {
        id: "visual-friction",
        type: "visual_description",
        text: "Juan waits while the spreadsheet is rebuilt.",
      },
      "source-juan": {
        id: "source-juan",
        type: "source_excerpt",
        mediaSegmentId: "media-juan-interview",
        sourceInMs: 10_000,
        sourceOutMs: 16_000,
        transcriptSnapshot: "We were spending more time formatting the report than deciding what to do.",
      },
      "visual-demo-import": {
        id: "visual-demo-import",
        type: "visual_description",
        text: "The same source file is dropped into the new workflow.",
      },
      "speech-demo": {
        id: "speech-demo",
        type: "authored_speech",
        role: "vo",
        text: "The source data stays the same.",
      },
      "visual-demo-result": {
        id: "visual-demo-result",
        type: "visual_description",
        text: "A clean result appears immediately.",
      },
      "source-maya": {
        id: "source-maya",
        type: "source_excerpt",
        mediaSegmentId: "media-maya-interview",
        sourceInMs: 21_000,
        sourceOutMs: 26_000,
        transcriptSnapshot: "Now I can spend that hour on the decision instead.",
      },
      "visual-payoff": {
        id: "visual-payoff",
        type: "visual_description",
        text: "Maya closes the report and turns to the team. This visual is intentionally missing coverage.",
      },
      "speech-payoff": {
        id: "speech-payoff",
        type: "authored_speech",
        role: "vo",
        text: "The time comes back to the work that matters.",
      },
    },
    relationships: {
      "rel-hook-media": {
        id: "rel-hook-media",
        sourceId: "cue-hook",
        targetId: "media-hook-visual",
        type: "supported_by_media",
      },
      "rel-friction-media": {
        id: "rel-friction-media",
        sourceId: "cue-friction",
        targetId: "media-friction-visual",
        type: "supported_by_media",
      },
      "rel-demo-import-media": {
        id: "rel-demo-import-media",
        sourceId: "cue-demo-import",
        targetId: "media-demo-import",
        type: "supported_by_media",
      },
      "rel-demo-result-media": {
        id: "rel-demo-result-media",
        sourceId: "cue-demo-result",
        targetId: "media-demo-result",
        type: "supported_by_media",
      },
    },
    mediaSegments: {
      "media-hook-visual": {
        id: "media-hook-visual",
        assetId: "asset-hook",
        sourceInMs: 0,
        sourceOutMs: 4_000,
      },
      "media-friction-visual": {
        id: "media-friction-visual",
        assetId: "asset-friction",
        sourceInMs: 0,
        sourceOutMs: 6_000,
      },
      "media-demo-import": {
        id: "media-demo-import",
        assetId: "asset-demo-import",
        sourceInMs: 0,
        sourceOutMs: 4_000,
      },
      "media-demo-result": {
        id: "media-demo-result",
        assetId: "asset-demo-result",
        sourceInMs: 0,
        sourceOutMs: 5_000,
      },
      "media-juan-interview": {
        id: "media-juan-interview",
        assetId: "asset-interview",
        sourceInMs: 0,
        sourceOutMs: 30_000,
        transcript: "We were spending more time formatting the report than deciding what to do.",
      },
      "media-maya-interview": {
        id: "media-maya-interview",
        assetId: "asset-interview",
        sourceInMs: 0,
        sourceOutMs: 30_000,
        transcript: "Now I can spend that hour on the decision instead.",
      },
    },
    shotIntents: {},
  };

  return {
    project,
    mediaSources: {
      "media-hook-visual": {
        mediaSegmentId: "media-hook-visual",
        kind: "image",
        src: "/fixtures/0d-hook.svg",
      },
      "media-friction-visual": {
        mediaSegmentId: "media-friction-visual",
        kind: "image",
        src: "/fixtures/0d-friction.svg",
      },
      "media-demo-import": {
        mediaSegmentId: "media-demo-import",
        kind: "image",
        src: "/fixtures/0d-import.svg",
      },
      "media-demo-result": {
        mediaSegmentId: "media-demo-result",
        kind: "image",
        src: "/fixtures/0d-result.svg",
      },
      "media-juan-interview": {
        mediaSegmentId: "media-juan-interview",
        kind: "audio",
        src: "/fixtures/0d-interview.wav",
      },
      "media-maya-interview": {
        mediaSegmentId: "media-maya-interview",
        kind: "audio",
        src: "/fixtures/0d-interview.wav",
      },
    },
  };
}
