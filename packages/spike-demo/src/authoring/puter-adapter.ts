import { puter } from "@heyputer/puter.js";
import type { AuthoringAdapter, AuthoringRequest } from "./contract";

const MODEL = "gpt-5.6-luna";
const TOOL_NAME = "propose_salai_change";

export type PuterClient = {
  auth: {
    isSignedIn(): boolean;
    signIn(): Promise<unknown>;
  };
  ai: {
    chat(
      messages: Array<{ role: string; content: string }>,
      testMode: boolean,
      options: Record<string, unknown>,
    ): Promise<unknown>;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compactProjectContext(request: AuthoringRequest) {
  const { project } = request.context;
  return {
    script: project.script,
    sections: project.sections,
    scenes: project.scenes,
    beats: project.beats,
    cues: project.cues,
    activeSurface: request.context.activeSurface,
  };
}

function toolDefinition() {
  return {
    type: "function",
    function: {
      name: TOOL_NAME,
      description:
        "Return the requested Salai narrative change as a short summary plus canonical NarrativeOperation objects. Use existing stable IDs for edits and moves. Do not invent source evidence.",
      parameters: {
        type: "object",
        properties: {
          summary: { type: "string" },
          answer: { type: "string" },
          operations: {
            type: "array",
            items: { type: "object", additionalProperties: true },
          },
        },
        required: ["summary"],
        additionalProperties: false,
      },
    },
  };
}

function extractToolArguments(response: unknown): unknown {
  if (!isRecord(response) || !isRecord(response.message)) {
    throw new Error("Model returned an unreadable response");
  }
  const toolCalls = response.message.tool_calls;
  if (!Array.isArray(toolCalls)) {
    throw new Error("Model did not return a structured Salai change");
  }

  const toolCall = toolCalls.find((candidate) => {
    if (!isRecord(candidate) || !isRecord(candidate.function)) return false;
    return candidate.function.name === TOOL_NAME;
  });
  if (!isRecord(toolCall) || !isRecord(toolCall.function)) {
    throw new Error("Model did not call the Salai change tool");
  }
  if (typeof toolCall.function.arguments !== "string") {
    throw new Error("Model returned invalid Salai tool arguments");
  }

  try {
    return JSON.parse(toolCall.function.arguments) as unknown;
  } catch {
    throw new Error("Model returned malformed JSON tool arguments");
  }
}

export function createPuterAuthoringAdapter(
  client: PuterClient = puter as unknown as PuterClient,
): AuthoringAdapter {
  return {
    async run(request) {
      if (!client.auth.isSignedIn()) await client.auth.signIn();

      const response = await client.ai.chat(
        [
          {
            role: "system",
            content: [
              "You are the narrative-authoring adapter for Salai.",
              "Use only the supplied project state as current truth.",
              "Preserve existing IDs when an object remains conceptually the same.",
              "Do not alter Workspace-only layout state.",
              "Do not rewrite recorded/source evidence as authored text.",
              `Always respond by calling ${TOOL_NAME}.`,
            ].join(" "),
          },
          {
            role: "user",
            content: JSON.stringify({
              instruction: request.instruction,
              project: compactProjectContext(request),
            }),
          },
        ],
        false,
        {
          model: MODEL,
          temperature: 0.2,
          tools: [toolDefinition()],
        },
      );

      return extractToolArguments(response);
    },
  };
}

export const puterAuthoringAdapter = createPuterAuthoringAdapter();
