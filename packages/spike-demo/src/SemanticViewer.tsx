import { useEffect, useRef } from "react";
import type { ResolvedSemanticAssembly } from "./semantic-playback-model";

export type SemanticViewerProps = {
  assembly: ResolvedSemanticAssembly;
  audioSrc: string | null;
  currentTimeMs: number;
  durationMs: number;
  isPlaying: boolean;
  onTogglePlayback: () => void;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, ms) / 1_000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `${minutes}:${seconds.toFixed(1).padStart(4, "0")}`;
}

export function SemanticViewer({
  assembly,
  audioSrc,
  currentTimeMs,
  durationMs,
  isPlaying,
  onTogglePlayback,
}: SemanticViewerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeImage = assembly.scene.images.at(-1) ?? null;
  const activeAudio = assembly.scene.audios.at(-1) ?? null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (!isPlaying) {
      audio.pause();
      if (activeAudio) {
        audio.currentTime = activeAudio.sourceFrame / assembly.scene.fps;
        audio.volume = Math.max(0, Math.min(1, activeAudio.volume));
      } else {
        audio.volume = 0;
      }
      return;
    }

    if (!activeAudio) {
      audio.volume = 0;
      return;
    }

    const targetTime = activeAudio.sourceFrame / assembly.scene.fps;
    audio.volume = Math.max(0, Math.min(1, activeAudio.volume));
    if (Math.abs(audio.currentTime - targetTime) > 0.2) {
      audio.currentTime = targetTime;
    }
  }, [activeAudio, assembly.scene.fps, audioSrc, isPlaying]);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!isPlaying && audio && audioSrc) {
      audio.volume = 0;
      void audio.play().catch(() => {
        // Playback remains useful without sound if browser policy rejects audio.
      });
    } else if (isPlaying) {
      audio?.pause();
    }
    onTogglePlayback();
  };

  return (
    <section className="semantic-viewer" aria-label="Rough assembly viewer">
      <div className="semantic-viewer-stage">
        {activeImage ? (
          <img src={activeImage.src} alt={activeImage.name} />
        ) : assembly.missingVisual ? (
          <div className="semantic-viewer-placeholder missing">
            <span>MISSING VISUAL</span>
            <strong>{assembly.cue?.label ?? "Unrealized moment"}</strong>
            <p>The story keeps its duration and intent instead of inventing coverage.</p>
          </div>
        ) : (
          <div className="semantic-viewer-placeholder">
            <span>NO VISUAL REALIZATION</span>
            <strong>{assembly.cue?.label ?? "No active Cue"}</strong>
          </div>
        )}

        <div className="semantic-viewer-overlay">
          <span>{assembly.cue?.label ?? "—"}</span>
          {activeAudio ? <strong>SOURCE AUDIO</strong> : null}
        </div>
      </div>

      <div className="semantic-viewer-transport">
        <button type="button" onClick={handleToggle} className="semantic-play-button">
          {isPlaying ? "Pause" : "Play"}
        </button>
        <span className="semantic-time-readout">
          {formatTime(currentTimeMs)} / {formatTime(durationMs)}
        </span>
        <span className="semantic-viewer-status">
          {activeAudio ? activeAudio.name : "No source audio at playhead"}
        </span>
      </div>

      {audioSrc ? <audio ref={audioRef} src={audioSrc} preload="auto" /> : null}
    </section>
  );
}
