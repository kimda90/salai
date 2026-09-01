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

export function useSemanticPlayback(
  projection: SalaiTimelineProjection,
  project: Project,
) {
  const engineRef = useRef<PlaybackEngine | null>(null);
  const [snapshot, setSnapshot] = useState<PlaybackSnapshot>(INITIAL_SNAPSHOT);

  useEffect(() => {
    const engine = new PlaybackEngine({
      fps: project.fps,
      getTotalFrames: () => totalAssemblyFrames(projection, project.fps),
    });
    engineRef.current = engine;
    setSnapshot(INITIAL_SNAPSHOT);
    const unsubscribe = engine.subscribe(setSnapshot);

    return () => {
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
