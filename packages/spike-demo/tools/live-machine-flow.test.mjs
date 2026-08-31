import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { SalaiController } from "../src/controller.tsx";
import { handleMachineCommand } from "../src/machine-interface.ts";
import { createBridgeServer } from "./bridge.mjs";

const execFileAsync = promisify(execFile);
const servers = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) => new Promise((resolve) => server.close(resolve)),
    ),
  );
});

async function startServer() {
  const server = createBridgeServer({ requestTimeoutMs: 2000 });
  servers.push(server);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test bridge address");
  return `http://127.0.0.1:${address.port}`;
}

async function serveNextBrowserRequest(controller, baseUrl) {
  const deadline = Date.now() + 1000;
  while (Date.now() < deadline) {
    const response = await fetch(`${baseUrl}/request`);
    if (response.status === 204) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      continue;
    }
    if (!response.ok) throw new Error(`Bridge request failed with ${response.status}`);

    const request = await response.json();
    try {
      const result = handleMachineCommand(controller, request);
      await fetch(`${baseUrl}/result`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: request.id, ok: true, result }),
      });
    } catch (error) {
      await fetch(`${baseUrl}/result`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: request.id,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        }),
      });
    }
    return;
  }
  throw new Error("CLI did not enqueue a bridge request in time");
}

async function runCli(controller, baseUrl, args) {
  const browser = serveNextBrowserRequest(controller, baseUrl);
  const cli = execFileAsync(process.execPath, [new URL("./salai.mjs", import.meta.url).pathname, ...args], {
    env: { ...process.env, SALAI_BRIDGE_URL: baseUrl },
  });
  const [{ stdout }, _] = await Promise.all([cli, browser]);
  return JSON.parse(stdout);
}

describe("external harness machine flow", () => {
  it("keeps CLI and direct project-service edits on one live project", async () => {
    const controller = new SalaiController("product");
    const baseUrl = await startServer();

    const initial = await runCli(controller, baseUrl, ["context"]);
    expect(initial.project).toEqual(controller.getSnapshot().project);

    const beatId = Object.keys(controller.getSnapshot().project.beats)[0];
    if (!beatId) throw new Error("Fixture has no Beat");

    await runCli(controller, baseUrl, [
      "apply",
      JSON.stringify([{ op: "updateBeat", beatId, title: "Changed through CLI" }]),
    ]);
    expect(controller.getSnapshot().project.beats[beatId]?.title).toBe("Changed through CLI");

    expect(
      controller.dispatchNarrative({
        op: "updateBeat",
        beatId,
        summary: "Changed directly after the CLI process exited",
      }),
    ).toBe(true);

    const afterDirectEdit = await runCli(controller, baseUrl, ["context"]);
    expect(afterDirectEdit.project.beats[beatId]).toMatchObject({
      title: "Changed through CLI",
      summary: "Changed directly after the CLI process exited",
    });
  });
});
