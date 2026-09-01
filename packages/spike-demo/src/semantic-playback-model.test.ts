import { describe, expect, it } from "vitest";
import { toElahProject } from "./elah-adapter";
import {
  createInterviewToneWavBlob,
  INTERVIEW_FIXTURE_DURATION_MS,
  INTERVIEW_FIXTURE_SAMPLE_RATE,
} from "./fixture-audio";
import { createSemanticEditorialFixture } from "./semantic-editorial-fixture";
import {
  resolveSemanticAssemblyAtMs,
  totalAssemblyFrames,
} from "./semantic-playback-model";
import { projectNarrativeToTimeline } from "./timeline-projection";

describe("semantic playback model", () => {
  it("resolves picture and source audio from the same derived assembly", () => {
    const fixture = createSemanticEditorialFixture();
    const projection = projectNarrativeToTimeline(fixture.project);
    const project = toElahProject(projection, fixture.mediaSources, { fps: 30 });

    const opening = resolveSemanticAssemblyAtMs(projection, project, 0);
    expect(opening.cue?.salaiRef.id).toBe("cue-hook");
    expect(opening.scene.images.at(-1)?.src).toBe("/fixtures/0d-hook.svg");
    expect(opening.scene.audios).toHaveLength(0);

    const juan = resolveSemanticAssemblyAtMs(projection, project, 4_000);
    expect(juan.cue?.salaiRef.id).toBe("cue-friction");
    expect(juan.scene.images.at(-1)?.src).toBe("/fixtures/0d-friction.svg");
    expect(juan.scene.audios.at(-1)).toMatchObject({
      id: "elah:timeline:source:source-juan",
      sourceFrame: 300,
    });

    const maya = resolveSemanticAssemblyAtMs(projection, project, 14_000);
    expect(maya.cue?.salaiRef.id).toBe("cue-demo-result");
    expect(maya.scene.images.at(-1)?.src).toBe("/fixtures/0d-result.svg");
    expect(maya.scene.audios.at(-1)).toMatchObject({
      id: "elah:timeline:source:source-maya",
      sourceFrame: 630,
    });
  });

  it("preserves missing visual time instead of inventing a clip", () => {
    const fixture = createSemanticEditorialFixture();
    const projection = projectNarrativeToTimeline(fixture.project);
    const project = toElahProject(projection, fixture.mediaSources, { fps: 30 });
    const payoff = resolveSemanticAssemblyAtMs(projection, project, 19_000);

    expect(payoff.cue?.salaiRef.id).toBe("cue-payoff");
    expect(payoff.missingVisual).toMatchObject({
      kind: "missing-visual",
      cueId: "cue-payoff",
      startMs: 19_000,
      durationMs: 5_000,
    });
    expect(payoff.scene.images).toHaveLength(0);
    expect(payoff.scene.videos).toHaveLength(0);
  });

  it("derives the playback frame count from Salai runtime", () => {
    const fixture = createSemanticEditorialFixture();
    const projection = projectNarrativeToTimeline(fixture.project);
    expect(totalAssemblyFrames(projection, 30)).toBe(720);
  });

  it("generates deterministic local audio long enough for canonical source ranges", async () => {
    const blob = createInterviewToneWavBlob();
    const bytes = new Uint8Array(await blob.arrayBuffer());

    expect(blob.type).toBe("audio/wav");
    expect(bytes.byteLength).toBe(44 + INTERVIEW_FIXTURE_SAMPLE_RATE * 30);
    expect(INTERVIEW_FIXTURE_DURATION_MS).toBe(30_000);
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("RIFF");
    expect(String.fromCharCode(...bytes.slice(8, 12))).toBe("WAVE");
  });
});
