const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function detectPitch(buf: Float32Array, sampleRate: number): number {
  const size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  let start = 0;
  let end = size - 1;
  const threshold = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < threshold) {
      start = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < threshold) {
      end = size - i;
      break;
    }
  }

  const slice = buf.subarray(start, end);
  const n = slice.length;
  if (n < 32) return -1;

  const correlations = new Array<number>(n).fill(0);
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) sum += slice[i] * slice[i + lag];
    correlations[lag] = sum;
  }

  let offset = 0;
  while (offset < n - 1 && correlations[offset] > correlations[offset + 1]) offset++;

  let maxValue = -1;
  let maxPos = -1;
  for (let i = offset; i < n; i++) {
    if (correlations[i] > maxValue) {
      maxValue = correlations[i];
      maxPos = i;
    }
  }
  if (maxPos < 1 || maxValue < 0) return -1;

  const x1 = correlations[maxPos - 1] ?? maxValue;
  const x2 = correlations[maxPos];
  const x3 = correlations[maxPos + 1] ?? maxValue;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const period = a ? maxPos - b / (2 * a) : maxPos;
  if (!Number.isFinite(period) || period <= 0) return -1;

  const frequency = sampleRate / period;
  if (frequency < 25 || frequency > 4500) return -1;
  return frequency;
}

export function frequencyFromMidi(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function noteLabel(midi: number): string {
  const safe = Math.max(0, Math.min(127, Math.round(midi)));
  return `${NOTE_NAMES[safe % 12]}${Math.floor(safe / 12) - 1}`;
}

export function centsBetween(frequency: number, targetFrequency: number): number {
  return Math.round(1200 * Math.log2(frequency / targetFrequency));
}

export function describePitch(frequency: number) {
  const midi = Math.round(12 * Math.log2(frequency / 440) + 69);
  const exact = 12 * Math.log2(frequency / 440) + 69;
  const cents = Math.max(-50, Math.min(50, Math.round((exact - midi) * 100)));
  const safe = Math.max(0, Math.min(127, midi));
  return {
    name: NOTE_NAMES[safe % 12],
    octave: Math.floor(safe / 12) - 1,
    cents,
  };
}
