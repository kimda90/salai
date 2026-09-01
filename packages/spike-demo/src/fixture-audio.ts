const SAMPLE_RATE = 8_000;
const DURATION_SECONDS = 30;

function toneFrequencyAt(second: number): number {
  if (second >= 10 && second < 16) return 330;
  if (second >= 21 && second < 26) return 440;
  return 180;
}

export function createInterviewToneWavBlob(): Blob {
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
    const frequency = toneFrequencyAt(seconds);
    const envelope = Math.min(1, (sample % SAMPLE_RATE) / 240);
    const wave = Math.sin(seconds * frequency * Math.PI * 2);
    view.setUint8(44 + sample, Math.round(128 + wave * 28 * envelope));
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export const INTERVIEW_FIXTURE_DURATION_MS = DURATION_SECONDS * 1_000;
export const INTERVIEW_FIXTURE_SAMPLE_RATE = SAMPLE_RATE;
