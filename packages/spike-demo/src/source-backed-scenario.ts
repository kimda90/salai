export const SOURCE_BACKED_SCENARIO = {
  fixture: "interview" as const,
  manualProofBlockId: "quote_maria",
  manualProofMediaSegmentId: "interview_maria",
  arrangementOperations: [
    {
      op: "moveCue",
      cueId: "cue_juan",
      toBeatId: "beat_turn",
      toIndex: 0,
    },
  ],
  unsupportedCueId: "cue_bridge",
} as const;
