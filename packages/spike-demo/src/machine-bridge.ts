import type { SalaiProjectService } from "./controller";
import { handleMachineCommand, type MachineCommand } from "./machine-interface";

const DEFAULT_BRIDGE_URL = "http://127.0.0.1:4317";

type BridgeRequest = MachineCommand & { id: string };

async function postResult(
  bridgeUrl: string,
  result: { id: string; ok: true; result: unknown } | { id: string; ok: false; error: string },
): Promise<void> {
  await fetch(`${bridgeUrl}/result`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(result),
  });
}

function isLoopbackBridgeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" &&
      (url.hostname === "127.0.0.1" || url.hostname === "localhost")
    );
  } catch {
    return false;
  }
}

export function bridgeUrlFromLocation(location: Location): string | null {
  const params = new URLSearchParams(location.search);
  if (!params.has("bridge")) return null;
  const value = params.get("bridge");
  const bridgeUrl = value && value !== "1" ? value : DEFAULT_BRIDGE_URL;
  return isLoopbackBridgeUrl(bridgeUrl) ? bridgeUrl : null;
}

export function startMachineBridge(
  service: SalaiProjectService,
  bridgeUrl: string,
): () => void {
  let stopped = false;

  async function poll(): Promise<void> {
    if (stopped) return;
    try {
      const response = await fetch(`${bridgeUrl}/request`);
      if (response.ok) {
        const request = (await response.json()) as BridgeRequest;
        try {
          const result = handleMachineCommand(service, request);
          await postResult(bridgeUrl, { id: request.id, ok: true, result });
        } catch (error) {
          await postResult(bridgeUrl, {
            id: request.id,
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    } catch {
      // The bridge is optional prototype glue; retry quietly when it is not running yet.
    }

    if (!stopped) window.setTimeout(() => void poll(), 150);
  }

  void poll();
  return () => {
    stopped = true;
  };
}
