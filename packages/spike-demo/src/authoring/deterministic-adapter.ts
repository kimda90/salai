import type { AuthoringAdapter, AuthoringRequest, AuthoringResult } from "./contract";

function firstBeatId(request: AuthoringRequest): string | null {
  return Object.keys(request.context.project.beats)[0] ?? null;
}

export const deterministicAuthoringAdapter: AuthoringAdapter = {
  async run(request): Promise<AuthoringResult> {
    const beatId = firstBeatId(request);
    if (!beatId) {
      return {
        summary: "No narrative change applied.",
        answer: "The current project has no Beat to update yet.",
      };
    }

    const title = request.instruction.trim().slice(0, 80);
    return {
      summary: `Updated the first Beat from the free-form instruction.`,
      operations: [
        {
          op: "updateBeat",
          beatId,
          title,
        },
      ],
    };
  },
};
