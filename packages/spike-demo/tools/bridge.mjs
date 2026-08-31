import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4317;

function sendJson(response, status, value) {
  response.writeHead(status, {
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

export function createBridgeServer({ requestTimeoutMs = 15_000 } = {}) {
  let nextId = 1;
  const queued = [];
  const pending = new Map();

  return createServer(async (request, response) => {
    response.setHeader("access-control-allow-origin", "*");
    response.setHeader("access-control-allow-headers", "content-type");
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    try {
      const url = new URL(request.url ?? "/", "http://localhost");

      if (request.method === "GET" && url.pathname === "/request") {
        const item = queued.shift();
        if (!item) {
          response.writeHead(204);
          response.end();
          return;
        }
        sendJson(response, 200, item);
        return;
      }

      if (request.method === "POST" && url.pathname === "/invoke") {
        const body = await readJson(request);
        if (body.command !== "context" && body.command !== "apply") {
          sendJson(response, 400, { ok: false, error: "Unknown Salai machine command" });
          return;
        }

        const id = String(nextId++);
        const machineRequest = {
          id,
          command: body.command,
          ...(body.command === "apply" ? { payload: body.payload } : {}),
        };
        const timer = setTimeout(() => {
          pending.delete(id);
          const queueIndex = queued.findIndex((candidate) => candidate.id === id);
          if (queueIndex >= 0) queued.splice(queueIndex, 1);
          sendJson(response, 504, {
            ok: false,
            error: "No Salai browser client responded",
          });
        }, requestTimeoutMs);

        pending.set(id, { response, timer });
        queued.push(machineRequest);
        return;
      }

      if (request.method === "POST" && url.pathname === "/result") {
        const body = await readJson(request);
        const item = pending.get(String(body.id));
        if (!item) {
          sendJson(response, 404, { ok: false, error: "Unknown bridge request" });
          return;
        }

        clearTimeout(item.timer);
        pending.delete(String(body.id));
        sendJson(
          item.response,
          body.ok ? 200 : 400,
          body.ok
            ? { ok: true, result: body.result }
            : { ok: false, error: String(body.error ?? "Salai command failed") },
        );
        response.writeHead(204);
        response.end();
        return;
      }

      sendJson(response, 404, { ok: false, error: "Not found" });
    } catch (error) {
      sendJson(response, 400, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.SALAI_BRIDGE_HOST ?? DEFAULT_HOST;
  const port = Number(process.env.SALAI_BRIDGE_PORT ?? DEFAULT_PORT);
  const server = createBridgeServer();
  server.listen(port, host, () => {
    console.log(`Salai bridge listening on http://${host}:${port}`);
  });
}
