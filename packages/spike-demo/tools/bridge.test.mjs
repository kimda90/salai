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

async function nextQueuedRequest(baseUrl) {
  const deadline = Date.now() + 500;
  while (Date.now() < deadline) {
    const response = await fetch(`${baseUrl}/request`);
    if (response.status === 200) return response;
    expect(response.status).toBe(204);
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error("Bridge request was not queued in time");
}

describe("local machine bridge", () => {
  it("relays a CLI-style invocation to the browser client and returns its result", async () => {
    const baseUrl = await startServer();
    const invocation = fetch(`${baseUrl}/invoke`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ command: "context" }),
    });

    const request = await nextQueuedRequest(baseUrl);
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

  it("rejects browser requests from non-loopback origins", async () => {
    const baseUrl = await startServer();
    const response = await fetch(`${baseUrl}/request`, {
      headers: { origin: "https://example.com" },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });
});
