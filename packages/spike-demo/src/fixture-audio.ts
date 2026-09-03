const SAMPLE_RATE = 8_000;
const DURATION_SECONDS = 30;
const PHRASES = [
  { start: 10, end: 16, frequencies: [220, 277, 247, 330] },
  { start: 21, end: 26, frequencies: [262, 330, 294, 392] },
] as const;

function sampleAt(second: number): number {
  const phrase = PHRASES.find(({ start, end }) => second >= start && second < end);
  if (!phrase) return 0;

  const syllableDuration = (phrase.end - phrase.start) / phrase.frequencies.length;
  const phraseTime = second - phrase.start;
  const syllable = Math.min(
    phrase.frequencies.length - 1,
    Math.floor(phraseTime / syllableDuration),
  );
  const progress = (phraseTime % syllableDuration) / syllableDuration;
  const envelope = Math.sin(Math.PI * progress) ** 0.7;
  const frequency = phrase.frequencies[syllable]!;
  const phase = second * frequency * Math.PI * 2;
  const voiceLikeWave =
    Math.sin(phase) + 0.35 * Math.sin(phase * 2) + 0.15 * Math.sin(phase * 3);
  return voiceLikeWave * envelope * 18;
}

export function createInterviewFixtureWavBlob(): Blob {
  const sampleCount = SAMPLE_RATE * DURATION_SECONDS;
  const buffer = new ArrayBuffer(44 + sampleCount);
  const view = new DataView(buffer);

  const writeAscii = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  };

  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + sampleCount, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeAscii(36, "data");
  view.setUint32(40, sampleCount, true);

  for (let sample = 0; sample < sampleCount; sample += 1) {
    const seconds = sample / SAMPLE_RATE;
    view.setUint8(44 + sample, Math.round(128 + sampleAt(seconds)));
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export const INTERVIEW_FIXTURE_DURATION_MS = DURATION_SECONDS * 1_000;
export const INTERVIEW_FIXTURE_SAMPLE_RATE = SAMPLE_RATE;
