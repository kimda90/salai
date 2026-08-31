export const SCRIPT_FIRST_SCENARIO = {
  roughParagraph:
    "Maya is buried in a weekly reporting ritual. She imports the same source data into the new workflow and sees a clean result immediately. The saved time lets her focus on the decision instead of formatting the report.",
  createStory: {
    sectionTitle: "From reporting friction to decision time",
    beats: [
      {
        title: "The reporting ritual",
        summary: "Maya loses time rebuilding the same weekly report.",
      },
      {
        title: "The workflow changes",
        summary: "The same source data becomes a clean result immediately.",
      },
      {
        title: "Time returns to the decision",
        summary: "The payoff is time spent deciding rather than formatting.",
      },
    ],
  },
  revisionInstruction: "Move the payoff before the workflow explanation and tighten the payoff wording.",
  revisedPayoff: {
    title: "Decision time comes back",
    summary: "Maya gets time back for the decision itself.",
  },
} as const;
