export const SOURCE_BACKED_SCENARIO = {
  fixture: "interview" as const,
  transientReferences: {
    manualProof: {
      referenceId: "source-ref:manual-proof",
      blockId: "quote_maria",
      mediaSegmentId: "interview_maria",
    },
    turningProof: {
      referenceId: "source-ref:turning-proof",
      blockId: "quote_juan",
      mediaSegmentId: "interview_juan",
    },
  },
  arrangementInstruction:
    "Lead the turning point with Juan's recorded line, then use the authored bridge.",
  arrangementOperations: [
    {
      op: "moveCue",
      cueId: "cue_juan",
      toBeatId: "beat_turn",
      toIndex: 0,
    },
  ],
  unsupportedMaterialQuestion:
    "Does the authored bridge cue have any mocked supported-by-media relationship?",
  unsupportedCueId: "cue_bridge",
} as const;
