import {
  PlaybackEngine,
  type PlaybackSnapshot,
  type Project,
} from "@elah/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { totalAssemblyFrames } from "./semantic-playback-model";
import type { SalaiTimelineProjection } from "./timeline-projection";

const INITIAL_SNAPSHOT: PlaybackSnapshot = {
  currentFrame: 0,
  isPlaying: false,
  playbackRate: 1,
  loop: false,
  epoch: 0,
};

export function shouldToggleSemanticPlayback(
  event: Pick<KeyboardEvent, "key" | "defaultPrevented" | "repeat" | "target">,
): boolean {
  if (event.key !== " " || event.defaultPrevented || event.repeat) return false;

  const target = event.target as HTMLElement | null;
  const tagName = target?.tagName?.toLowerCase();
  return !(
    target?.isContentEditable ||
    target?.getAttribute?.("contenteditable") === "true" ||
    ["input", "textarea", "select", "button"].includes(tagName ?? "") ||
    target?.getAttribute?.("role") === "button"
  );
}

export function useSemanticPlayback(
  projection: SalaiTimelineProjection,
  project: Project,
) {
  const engineRef = useRef<PlaybackEngine | null>(null);
  const positionRef = useRef<{ projectId: string; timeMs: number } | null>(null);
  const [snapshot, setSnapshot] = useState<PlaybackSnapshot>(INITIAL_SNAPSHOT);

  useEffect(() => {
    const engine = new PlaybackEngine({
      fps: project.fps,
      getTotalFrames: () => totalAssemblyFrames(projection, project.fps),
    });
    engineRef.current = engine;
    setSnapshot(INITIAL_SNAPSHOT);
    const unsubscribe = engine.subscribe(setSnapshot);
    const previous = positionRef.current;
    if (previous?.projectId === project.id) engine.seek(Math.floor(previous.timeMs * project.fps / 1000));

    return () => {
      positionRef.current = { projectId: project.id, timeMs: engine.currentFrame * 1000 / project.fps };
      unsubscribe();
      engine.destroy();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [project, projection]);

  const seekMs = useCallback(
    (timeMs: number) => {
      const frame = Math.floor((Math.max(0, timeMs) / 1_000) * project.fps);
      engineRef.current?.seek(frame);
    },
    [project.fps],
  );

  const play = useCallback(() => engineRef.current?.play(), []);
  const pause = useCallback(() => engineRef.current?.pause(), []);
  const toggle = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.isPlaying) engine.pause();
    else engine.play();
  }, []);

  return {
    snapshot,
    currentTimeMs: (snapshot.currentFrame / project.fps) * 1_000,
    seekMs,
    play,
    pause,
    toggle,
  };
}
