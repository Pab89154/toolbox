import { frequencyFromMidi, noteLabel } from "../lib/pitch";

export type TuningTarget = {
  label: string;
  detail: string;
  frequency: number;
};

export type Instrument = {
  id: string;
  name: string;
  summary: string;
  targets: TuningTarget[];
};

function target(midi: number, detail: string): TuningTarget {
  return { label: noteLabel(midi), detail, frequency: frequencyFromMidi(midi) };
}

function stringTargets(midis: number[], firstString: number): TuningTarget[] {
  return midis.map((midi, index) => target(midi, `String ${firstString + index}`));
}

/** 34-string lever harp, C major, C2 up to A6. */
function harpTargets(): TuningTarget[] {
  const steps = [2, 2, 1, 2, 2, 2, 1];
  const targets: TuningTarget[] = [];
  let midi = 36;
  for (let i = 0; i < 34; i++) {
    targets.push(target(midi, `Note ${i + 1}`));
    midi += steps[i % steps.length];
  }
  return targets;
}

/** 88 piano keys, A0 to C8. */
function pianoTargets(): TuningTarget[] {
  return Array.from({ length: 88 }, (_, index) => target(21 + index, `Key ${index + 1}`));
}

/** Each drum covers a perfect fifth; the player picks the exact note. */
function timpaniTargets(): TuningTarget[] {
  const drums = [
    { size: "32", low: 38 },
    { size: "29", low: 41 },
    { size: "26", low: 45 },
    { size: "23", low: 48 },
    { size: "20", low: 52 },
  ];
  return drums.flatMap((drum) =>
    Array.from({ length: 8 }, (_, step) => {
      const t = target(drum.low + step, `${drum.size}-inch drum`);
      return { ...t, label: `${drum.size}" · ${t.label}` };
    }),
  );
}

const guitarTargets = () =>
  [40, 45, 50, 55, 59, 64].map((midi, index) => target(midi, `String ${6 - index}`));

export const instruments: Instrument[] = [
  {
    id: "violin",
    name: "Violin",
    summary: "Standard tuning · G D A E",
    // Displayed high to low by string number: 1 is the E string.
    targets: stringTargets([76, 69, 62, 55], 1),
  },
  {
    id: "viola",
    name: "Viola",
    summary: "Standard tuning · C G D A",
    targets: stringTargets([69, 62, 55, 48], 1),
  },
  {
    id: "cello",
    name: "Cello",
    summary: "Standard tuning · C G D A",
    targets: stringTargets([57, 50, 43, 36], 1),
  },
  {
    id: "double-bass",
    name: "Double Bass",
    summary: "Standard tuning · E A D G",
    targets: stringTargets([43, 38, 33, 28], 1),
  },
  {
    id: "acoustic-guitar",
    name: "Acoustic / Classical Guitar",
    summary: "Standard tuning · E A D G B E",
    targets: guitarTargets(),
  },
  {
    id: "electric-guitar",
    name: "Electric Guitar",
    summary: "Standard tuning · E A D G B E",
    targets: guitarTargets(),
  },
  {
    id: "harp",
    name: "Harp",
    summary: "34-string lever harp in C · C2 to A6",
    targets: harpTargets(),
  },
  {
    id: "banjo",
    name: "Banjo",
    summary: "5-string, open G · g D G B D",
    targets: stringTargets([62, 59, 55, 50, 67], 1),
  },
  {
    id: "ukulele",
    name: "Ukulele",
    summary: "Standard tuning · g C E A",
    targets: stringTargets([69, 64, 60, 67], 1),
  },
  {
    id: "timpani",
    name: "Timpani",
    summary: "Pick a drum, then the note to tune it to",
    targets: timpaniTargets(),
  },
  {
    id: "piano",
    name: "Piano",
    summary: "All 88 keys · A0 to C8",
    targets: pianoTargets(),
  },
];

export function getInstrument(id: string): Instrument {
  return instruments.find((instrument) => instrument.id === id) ?? instruments[0];
}
