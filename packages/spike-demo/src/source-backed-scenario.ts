export const SOURCE_BACKED_SCENARIO = {
  fixture: "interview" as const,
  manualProofBlockId: "quote_maria",
  manualProofMediaSegmentId: "interview_maria",
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
  unsupportedCueId: "cue_bridge",
} as const;
