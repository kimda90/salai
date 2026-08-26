import { createEmptyNarrativeProject } from "./factory.js";
import { applyOperations, type NarrativeOperation } from "./operations.js";
import type { NarrativeProject } from "./types.js";

function build(
  project: NarrativeProject,
  operations: NarrativeOperation[],
): NarrativeProject {
  return applyOperations(project, operations).model;
}

export function createProductVideoFixture(): NarrativeProject {
  const project = createEmptyNarrativeProject({
    scriptId: "script_product",
    title: "30-second installation product video",
    targetDurationMs: 30_000,
  });

  project.shotIntents.shot_demo_wide = {
    id: "shot_demo_wide",
    description: "Wide shot: install device without tools",
  };
  project.shotIntents.shot_connector = {
    id: "shot_connector",
    description: "Connector insert close-up",
  };
  project.shotIntents.shot_ui = {
    id: "shot_ui",
    description: "UI confirmation turns green",
  };

  return build(project, [
    { op: "createSection", section: { id: "section_product", title: "Main", childIds: [] } },
    { op: "createBeat", parent: { type: "section", id: "section_product" }, beat: { id: "beat_hook", title: "Hook", summary: "Installation should feel surprisingly easy", cueIds: [] } },
    { op: "createCue", beatId: "beat_hook", cue: { id: "cue_hook", visualBlockIds: [], audioBlockIds: [] } },
    { op: "createBlock", cueId: "cue_hook", block: { id: "visual_hook", type: "visual_description", text: "Device and tangled tools on table; tools slide away." } },
    { op: "createBlock", cueId: "cue_hook", block: { id: "vo_hook", type: "authored_speech", role: "vo", text: "What if installing this took less time than finding your tools?" } },

    { op: "createBeat", parent: { type: "section", id: "section_product" }, beat: { id: "beat_problem", title: "Problem", summary: "Old installation is unnecessarily slow", cueIds: [] } },
    { op: "createCue", beatId: "beat_problem", cue: { id: "cue_problem", visualBlockIds: [], audioBlockIds: [] } },
    { op: "createBlock", cueId: "cue_problem", block: { id: "visual_problem", type: "visual_description", text: "Hands sorting adapters, screws, and instructions." } },
    { op: "createBlock", cueId: "cue_problem", block: { id: "vo_problem", type: "authored_speech", role: "vo", text: "Traditional setups turn a simple connection into a pile of parts and instructions." } },

    { op: "createBeat", parent: { type: "section", id: "section_product" }, beat: { id: "beat_demo", title: "Demo", summary: "Installation is three simple actions", cueIds: [] } },
    { op: "createCue", beatId: "beat_demo", cue: { id: "cue_demo_wide", visualBlockIds: [], audioBlockIds: [], explicitDurationMs: 4_000 } },
    { op: "createBlock", cueId: "cue_demo_wide", block: { id: "visual_demo_wide", type: "visual_description", text: "Wide: place device and begin installation." } },
    { op: "createBlock", cueId: "cue_demo_wide", block: { id: "vo_demo_wide", type: "authored_speech", role: "vo", text: "Place it." } },
    { op: "createCue", beatId: "beat_demo", cue: { id: "cue_demo_connector", visualBlockIds: [], audioBlockIds: [], explicitDurationMs: 4_000 } },
    { op: "createBlock", cueId: "cue_demo_connector", block: { id: "visual_demo_connector", type: "visual_description", text: "Insert connector until it clicks." } },
    { op: "createBlock", cueId: "cue_demo_connector", block: { id: "vo_demo_connector", type: "authored_speech", role: "vo", text: "Connect it." } },
    { op: "createCue", beatId: "beat_demo", cue: { id: "cue_demo_ui", visualBlockIds: [], audioBlockIds: [], explicitDurationMs: 4_000 } },
    { op: "createBlock", cueId: "cue_demo_ui", block: { id: "visual_demo_ui", type: "visual_description", text: "UI status turns green." } },
    { op: "createBlock", cueId: "cue_demo_ui", block: { id: "text_demo_ui", type: "on_screen_text", text: "READY" } },
    { op: "createBlock", cueId: "cue_demo_ui", block: { id: "sfx_demo_ui", type: "sfx", description: "Soft confirmation chime" } },

    { op: "createBeat", parent: { type: "section", id: "section_product" }, beat: { id: "beat_benefit", title: "Benefit", summary: "No tools and no setup anxiety", cueIds: [] } },
    { op: "createCue", beatId: "beat_benefit", cue: { id: "cue_benefit", visualBlockIds: [], audioBlockIds: [] } },
    { op: "createBlock", cueId: "cue_benefit", block: { id: "visual_benefit", type: "visual_description", text: "User starts working immediately." } },
    { op: "createBlock", cueId: "cue_benefit", block: { id: "vo_benefit", type: "authored_speech", role: "vo", text: "No tools, no configuration maze, just a working device." } },

    { op: "createBeat", parent: { type: "section", id: "section_product" }, beat: { id: "beat_cta", title: "CTA", summary: "Try the simpler installation", cueIds: [] } },
    { op: "createCue", beatId: "beat_cta", cue: { id: "cue_cta", visualBlockIds: [], audioBlockIds: [], explicitDurationMs: 3_000 } },
    { op: "createBlock", cueId: "cue_cta", block: { id: "graphic_cta", type: "graphic", description: "Product lockup and URL" } },
    { op: "createBlock", cueId: "cue_cta", block: { id: "vo_cta", type: "authored_speech", role: "vo", text: "Plug in. Move on." } },

    { op: "linkShotIntent", relationshipId: "rel_demo_wide", sourceId: "cue_demo_wide", shotIntentId: "shot_demo_wide" },
    { op: "linkShotIntent", relationshipId: "rel_demo_connector", sourceId: "cue_demo_connector", shotIntentId: "shot_connector" },
    { op: "linkShotIntent", relationshipId: "rel_demo_ui", sourceId: "cue_demo_ui", shotIntentId: "shot_ui" },
  ]);
}

export function createInterviewFixture(): NarrativeProject {
  const project = createEmptyNarrativeProject({
    scriptId: "script_interview",
    title: "Interview-driven process story",
    targetDurationMs: 120_000,
  });

  project.mediaSegments.interview_maria = {
    id: "interview_maria",
    assetId: "asset_maria",
    sourceInMs: 0,
    sourceOutMs: 180_000,
    transcript: "We were spending almost two days doing this manually. We knew it could not scale.",
  };
  project.mediaSegments.interview_juan = {
    id: "interview_juan",
    assetId: "asset_juan",
    sourceInMs: 0,
    sourceOutMs: 180_000,
    transcript: "Then something changed. We could finally see the work moving in real time.",
  };
  project.mediaSegments.broll_factory = {
    id: "broll_factory",
    assetId: "asset_broll_factory",
    sourceInMs: 0,
    sourceOutMs: 90_000,
  };

  return build(project, [
    { op: "createSection", section: { id: "section_interview", title: "Story", childIds: [] } },
    { op: "createBeat", parent: { type: "section", id: "section_interview" }, beat: { id: "beat_manual", title: "Manual process", cueIds: [] } },
    { op: "createCue", beatId: "beat_manual", cue: { id: "cue_maria", visualBlockIds: [], audioBlockIds: [] } },
    { op: "createBlock", cueId: "cue_maria", block: { id: "visual_factory", type: "visual_description", text: "Factory team processing paperwork while Maria speaks." } },
    { op: "createBlock", cueId: "cue_maria", block: { id: "quote_maria", type: "source_excerpt", mediaSegmentId: "interview_maria", sourceInMs: 10_000, sourceOutMs: 37_000, transcriptSnapshot: "We were spending almost two days doing this manually." } },
    { op: "linkMediaSegment", relationshipId: "rel_manual_broll", sourceId: "cue_maria", mediaSegmentId: "broll_factory" },

    { op: "createBeat", parent: { type: "section", id: "section_interview" }, beat: { id: "beat_turn", title: "Turning point", cueIds: [] } },
    { op: "createCue", beatId: "beat_turn", cue: { id: "cue_bridge", visualBlockIds: [], audioBlockIds: [] } },
    { op: "createBlock", cueId: "cue_bridge", block: { id: "visual_bridge", type: "visual_description", text: "Interface replaces paperwork; old process fades out." } },
    { op: "createBlock", cueId: "cue_bridge", block: { id: "vo_bridge", type: "authored_speech", role: "vo", text: "The breakthrough was not another form. It was making the process visible as it happened." } },
    { op: "createCue", beatId: "beat_turn", cue: { id: "cue_juan", visualBlockIds: [], audioBlockIds: [] } },
    { op: "createBlock", cueId: "cue_juan", block: { id: "visual_juan", type: "visual_description", text: "Juan watches the new workflow on screen." } },
    { op: "createBlock", cueId: "cue_juan", block: { id: "quote_juan", type: "source_excerpt", mediaSegmentId: "interview_juan", sourceInMs: 42_000, sourceOutMs: 75_000, transcriptSnapshot: "Then something changed. We could finally see the work moving." } },

    { op: "createBeat", parent: { type: "section", id: "section_interview" }, beat: { id: "beat_result", title: "Result", cueIds: [] } },
    { op: "createCue", beatId: "beat_result", cue: { id: "cue_result", visualBlockIds: [], audioBlockIds: [], explicitDurationMs: 28_000 } },
    { op: "createBlock", cueId: "cue_result", block: { id: "visual_result", type: "visual_description", text: "Team moves through the new process; dashboards update." } },
    { op: "createBlock", cueId: "cue_result", block: { id: "quote_result", type: "source_excerpt", mediaSegmentId: "interview_maria", sourceInMs: 80_000, sourceOutMs: 105_000, transcriptSnapshot: "Now a job that used to occupy us for days is visible immediately." } },
  ]);
}

export function createFootageFirstFixture(): NarrativeProject {
  const project = createEmptyNarrativeProject({
    scriptId: "script_documentary",
    title: "Footage-first workshop mini documentary",
  });

  project.mediaSegments.opening_shop = {
    id: "opening_shop",
    assetId: "asset_shop_open",
    sourceInMs: 0,
    sourceOutMs: 20_000,
  };
  project.mediaSegments.interview_owner = {
    id: "interview_owner",
    assetId: "asset_owner",
    sourceInMs: 0,
    sourceOutMs: 150_000,
    transcript: "We thought the old machine would last another year. Then it stopped in the middle of our busiest week.",
  };
  project.mediaSegments.new_machine = {
    id: "new_machine",
    assetId: "asset_new_machine",
    sourceInMs: 0,
    sourceOutMs: 45_000,
  };

  return build(project, [
    { op: "createSection", section: { id: "section_doc", title: "Workshop", childIds: [] } },
    { op: "createBeat", parent: { type: "section", id: "section_doc" }, beat: { id: "beat_arrival", title: "A normal morning", cueIds: [] } },
    { op: "createCue", beatId: "beat_arrival", cue: { id: "cue_arrival", visualBlockIds: [], audioBlockIds: [], explicitDurationMs: 8_000 } },
    { op: "createBlock", cueId: "cue_arrival", block: { id: "visual_arrival", type: "visual_description", text: "Workshop shutters rise; lights switch on." } },
    { op: "linkMediaSegment", relationshipId: "rel_arrival_source", sourceId: "cue_arrival", mediaSegmentId: "opening_shop" },

    { op: "createBeat", parent: { type: "section", id: "section_doc" }, beat: { id: "beat_failure", title: "The machine fails", cueIds: [] } },
    { op: "createCue", beatId: "beat_failure", cue: { id: "cue_owner_quote", visualBlockIds: [], audioBlockIds: [] } },
    { op: "createBlock", cueId: "cue_owner_quote", block: { id: "quote_owner_failure", type: "source_excerpt", mediaSegmentId: "interview_owner", sourceInMs: 18_000, sourceOutMs: 47_000, transcriptSnapshot: "We thought the old machine would last another year. Then it stopped." } },

    { op: "createBeat", parent: { type: "section", id: "section_doc" }, beat: { id: "beat_change", title: "A different rhythm", cueIds: [] } },
    { op: "createCue", beatId: "beat_change", cue: { id: "cue_new_machine", visualBlockIds: [], audioBlockIds: [], explicitDurationMs: 12_000 } },
    { op: "createBlock", cueId: "cue_new_machine", block: { id: "visual_new_machine", type: "visual_description", text: "New machine runs while the owner watches the first finished part." } },
    { op: "createBlock", cueId: "cue_new_machine", block: { id: "vo_change", type: "authored_speech", role: "vo", text: "The replacement changed more than throughput. It changed how the shop planned its day." } },
    { op: "linkMediaSegment", relationshipId: "rel_new_machine", sourceId: "cue_new_machine", mediaSegmentId: "new_machine" },
  ]);
}
