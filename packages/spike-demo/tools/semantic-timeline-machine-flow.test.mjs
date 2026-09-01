import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { SalaiController } from "../src/controller.tsx";
import { toElahProject } from "../src/elah-adapter.ts";
import { handleMachineCommand } from "../src/machine-interface.ts";
import { createSemanticEditorialFixture } from "../src/semantic-editorial-fixture.ts";
import { resolveSemanticAssemblyAtMs } from "../src/semantic-playback-model.ts";
import { interpretSemanticTimelineDocumentChange } from "../src/semantic-timeline-edit.ts";
import { toTimelineEditorDocument } from "../src/timeline-editor-adapter.ts";
import { projectNarrativeToTimeline } from "../src/timeline-projection.ts";
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
  const [{ stdout }] = await Promise.all([cli, browser]);
  return JSON.parse(stdout);
}

function timelineItem(document, id) {
  const item = document.tracks.flatMap((track) => track.items).find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Missing timeline item ${id}`);
  return item;
}

describe("external harness and semantic timeline round trip", () => {
  it("keeps agent and direct temporal edits coherent over the same live project", async () => {
    const controller = new SalaiController("semantic-editorial");
    const baseUrl = await startServer();
    const mediaSources = createSemanticEditorialFixture().mediaSources;

    const initial = await runCli(controller, baseUrl, ["context"]);
    expect(initial.semanticTime.durationMs).toBe(24_000);
    expect(initial.semanticTime.beats.map((beat) => beat.id)).toEqual([
      "beat-hook",
      "beat-friction",
      "beat-demo",
      "beat-payoff",
    ]);

    // Representative external-harness request: put the concrete friction evidence
    // before the authored hook. This uses the existing generic apply command.
    await runCli(controller, baseUrl, [
      "apply",
      JSON.stringify([
        {
          op: "moveBeat",
          beatId: "beat-hook",
          toParent: { type: "section", id: "section-problem" },
          toIndex: 1,
        },
      ]),
    ]);

    const afterAgent = await runCli(controller, baseUrl, ["context"]);
    expect(afterAgent.project.sections["section-problem"].childIds).toEqual([
      "beat-friction",
      "beat-hook",
    ]);
    expect(afterAgent.semanticTime.beats.slice(0, 2).map((beat) => [beat.id, beat.startMs])).toEqual([
      ["beat-friction", 0],
      ["beat-hook", 6_000],
    ]);

    const afterAgentProjection = projectNarrativeToTimeline(controller.getSnapshot().project);
    const afterAgentPlayback = toElahProject(afterAgentProjection, mediaSources, { fps: 30 });
    const opening = resolveSemanticAssemblyAtMs(afterAgentProjection, afterAgentPlayback, 0);
    expect(opening.cue?.salaiRef.id).toBe("cue-friction");
    expect(opening.scene.images.at(-1)?.src).toBe("/fixtures/0d-friction.svg");
    expect(opening.scene.audios.at(-1)).toMatchObject({
      id: "elah:timeline:source:source-juan",
      sourceFrame: 300,
    });

    // Representative direct semantic-timeline gesture: shorten Juan by two seconds.
    // The interpreter emits the exact canonical batch used by the UI.
    const currentDocument = toTimelineEditorDocument(afterAgentProjection);
    const proposedDocument = structuredClone(currentDocument);
    timelineItem(proposedDocument, "timeline:source:source-juan").durationMs = 4_000;
    const interpretation = interpretSemanticTimelineDocumentChange(
      controller.getSnapshot().project,
      currentDocument,
      proposedDocument,
    );
    expect(interpretation.kind).toBe("canonical");
    if (interpretation.kind !== "canonical") throw new Error("Expected canonical direct edit");
    expect(
      controller.dispatchNarrativeBatch(interpretation.operations, { revertible: true }),
    ).toBe(true);

    const afterDirect = await runCli(controller, baseUrl, ["context"]);
    const frictionCue = afterDirect.semanticTime.cues.find((cue) => cue.id === "cue-friction");
    expect(afterDirect.semanticTime.durationMs).toBe(22_000);
    expect(frictionCue).toMatchObject({
      startMs: 0,
      durationMs: 4_000,
      sourceExcerpts: [
        {
          blockId: "source-juan",
          mediaSegmentId: "media-juan-interview",
          sourceInMs: 10_000,
          sourceOutMs: 14_000,
        },
      ],
    });

    const finalProjection = projectNarrativeToTimeline(controller.getSnapshot().project);
    const finalPlayback = toElahProject(finalProjection, mediaSources, { fps: 30 });
    expect(finalProjection.durationMs).toBe(afterDirect.semanticTime.durationMs);
    expect(
      finalPlayback.clips["salai-audio"]?.find(
        (clip) => clip.id === "elah:timeline:source:source-juan",
      ),
    ).toMatchObject({ durationFrames: 120, sourceStartFrame: 300, sourceDurationFrames: 120 });
  });
});
