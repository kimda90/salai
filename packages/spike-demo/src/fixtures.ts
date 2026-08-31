import {
  createEmptyNarrativeProject,
  createFootageFirstFixture,
  createInterviewFixture,
  createProductVideoFixture,
  estimateNarrativeDuration,
  type NarrativeProject,
} from "@salai/script-model";

export type FixtureKey = "scratch" | "product" | "interview" | "documentary";

export type FixtureDefinition = {
  key: FixtureKey;
  label: string;
  description: string;
  create: () => NarrativeProject;
};

export const FIXTURES: readonly FixtureDefinition[] = [
  {
    key: "scratch",
    label: "Blank story",
    description: "Empty canonical story used for the script-first external-harness scenario.",
    create: () => createEmptyNarrativeProject({ scriptId: "script-scratch", title: "Untitled story" }),
  },
  {
    key: "product",
    label: "30s product video",
    description: "Script-first product story with authored AV intent and ShotIntent coverage.",
    create: createProductVideoFixture,
  },
  {
    key: "interview",
    label: "Interview / corporate",
    description: "Source-backed interview excerpts, authored VO bridge, and B-roll evidence.",
    create: createInterviewFixture,
  },
  {
    key: "documentary",
    label: "Footage-first mini-doc",
    description: "Narrative constructed from mocked MediaSegments and source-backed excerpts.",
    create: createFootageFirstFixture,
  },
];

export function getFixtureDefinition(key: FixtureKey): FixtureDefinition {
  const fixture = FIXTURES.find((item) => item.key === key);
  if (!fixture) throw new Error(`Unknown fixture: ${key}`);
  return fixture;
}

export function createFixture(key: FixtureKey): NarrativeProject {
  return getFixtureDefinition(key).create();
}

export function getFixtureRuntimeMs(project: NarrativeProject): number {
  return estimateNarrativeDuration(project, { visualHoldMs: 2000 }).scriptMs;
}
