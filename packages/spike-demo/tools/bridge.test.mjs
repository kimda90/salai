import { afterEach, describe, expect, it } from "vitest";
import { createBridgeServer } from "./bridge.mjs";

const servers = [];
afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) => new Promise((resolve) => server.close(resolve)),
    ),
  );
});

async function startServer() {
  const server = createBridgeServer({ requestTimeoutMs: 1000 });
  servers.push(server);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test bridge address");
  return `http://127.0.0.1:${address.port}`;
}

describe("local machine bridge", () => {
  it("relays a CLI-style invocation to the browser client and returns its result", async () => {
    const baseUrl = await startServer();
    const invocation = fetch(`${baseUrl}/invoke`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ command: "context" }),
    });

    const request = await fetch(`${baseUrl}/request`);
    expect(request.status).toBe(200);
    const body = await request.json();
    expect(body).toMatchObject({ id: "1", command: "context" });

    const resultResponse = await fetch(`${baseUrl}/result`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: body.id, ok: true, result: { project: "same-live-project" } }),
    });
    expect(resultResponse.status).toBe(204);

    const response = await invocation;
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      result: { project: "same-live-project" },
    });
  });

  it("returns an explicit error for unsupported machine commands", async () => {
    const baseUrl = await startServer();
    const response = await fetch(`${baseUrl}/invoke`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ command: "run-model" }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });
});
