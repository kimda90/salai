import { describe, expect, it, vi } from "vitest";
import { SalaiController } from "../controller";
import { createPuterAuthoringAdapter, type PuterClient } from "./puter-adapter";
import { parseAuthoringResult, runAuthoringTurn } from "./result";

function structuredResponse(argumentsValue: unknown) {
  return {
    message: {
      tool_calls: [
        {
          function: {
            name: "propose_salai_change",
            arguments: JSON.stringify(argumentsValue),
          },
        },
      ],
    },
  };
}

describe("Puter authoring adapter", () => {
  it("signs in on demand and returns structured tool arguments", async () => {
    let signedIn = false;
    const signIn = vi.fn(async () => {
      signedIn = true;
    });
    const chat = vi.fn(async () =>
      structuredResponse({ summary: "No change needed", answer: "Looks good." }),
    );
    const client: PuterClient = {
      auth: { isSignedIn: () => signedIn, signIn },
      ai: { chat },
    };
    const controller = new SalaiController("product");
    const adapter = createPuterAuthoringAdapter(client);

    const raw = await adapter.run({
      instruction: "Review this opening",
      context: controller.getProjectContext({ includeActiveSurface: true }),
    });
    const result = parseAuthoringResult(raw);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(result.answer).toBe("Looks good.");
    expect(chat).toHaveBeenCalledTimes(1);
    const [, testMode, options] = chat.mock.calls[0] ?? [];
    expect(testMode).toBe(false);
    expect(options).toMatchObject({ model: "gpt-5.6-luna" });
  });

  it("sends a compact narrative context rather than provider/session or source state", async () => {
    const chat = vi.fn(async () => structuredResponse({ summary: "No change" }));
    const client: PuterClient = {
      auth: { isSignedIn: () => true, signIn: vi.fn(async () => undefined) },
      ai: { chat },
    };
    const controller = new SalaiController("product");
    const adapter = createPuterAuthoringAdapter(client);

    await adapter.run({
      instruction: "Make the first beat more direct",
      context: controller.getProjectContext({
        includeWorkspace: true,
        includeActiveSurface: true,
      }),
    });

    const [messages] = chat.mock.calls[0] ?? [];
    const userMessage = messages?.find((message) => message.role === "user");
    const payload = JSON.parse(userMessage?.content ?? "{}") as Record<string, unknown>;
    const project = payload.project as Record<string, unknown>;

    expect(project).toHaveProperty("script");
    expect(project).toHaveProperty("beats");
    expect(project).not.toHaveProperty("workspace");
    expect(project).not.toHaveProperty("relationships");
    expect(project).not.toHaveProperty("mediaSegments");
    expect(project).not.toHaveProperty("shotIntents");
  });

  it("keeps canonical state untouched when authentication fails", async () => {
    const client: PuterClient = {
      auth: {
        isSignedIn: () => false,
        signIn: vi.fn(async () => {
          throw new Error("Sign in cancelled");
        }),
      },
      ai: { chat: vi.fn() },
    };
    const controller = new SalaiController("product");
    const beforeProject = controller.getSnapshot().project;

    await expect(
      runAuthoringTurn(
        controller,
        createPuterAuthoringAdapter(client),
        "Change the opening",
      ),
    ).rejects.toThrow(/Sign in cancelled/);
    expect(controller.getSnapshot().project).toBe(beforeProject);
  });

  it("rejects unstructured model replies without mutating canonical state", async () => {
    const client: PuterClient = {
      auth: { isSignedIn: () => true, signIn: vi.fn(async () => undefined) },
      ai: {
        chat: vi.fn(async () => ({ message: { content: "I would change the opening." } })),
      },
    };
    const controller = new SalaiController("product");
    const beforeProject = controller.getSnapshot().project;

    await expect(
      runAuthoringTurn(
        controller,
        createPuterAuthoringAdapter(client),
        "Change the opening",
      ),
    ).rejects.toThrow(/structured Salai change/);
    expect(controller.getSnapshot().project).toBe(beforeProject);
  });
});
