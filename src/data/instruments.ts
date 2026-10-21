import { frequencyFromMidi, noteLabel } from "../lib/pitch";

export type TuningTarget = {
  /** Concert (sounding) note name, as the tuner hears it. */
  label: string;
  /** Written note name for transposing instruments, if different. */
  writtenLabel?: string;
  detail: string;
  frequency: number;
};

export type Instrument = {
  id: string;
  name: string;
  summary: string;
  /** Semitones from concert pitch to the player's written pitch. */
  transpose?: number;
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

/**
 * Wind and brass tuning note. The tuner hears concert (sounding) pitch,
 * while the player reads a written note that may be transposed.
 */
function heardTarget(concertMidi: number, written: string): TuningTarget {
  const base = target(concertMidi, `Written ${written} · sounds ${noteLabel(concertMidi)}`);
  return { ...base, writtenLabel: written };
}

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
  {
    id: "clarinet-bb",
    name: "Clarinet in B♭",
    summary: "Sounds a major 2nd below written · Soprano clarinet",
    transpose: 2,
    targets: [heardTarget(65, "G4"), heardTarget(69, "B4")],
  },
  {
    id: "clarinet-eb",
    name: "Clarinet in E♭",
    summary: "Sounds a minor 3rd above written · Sopranino clarinet",
    transpose: -3,
    targets: [heardTarget(69, "F#4"), heardTarget(75, "C5")],
  },
  {
    id: "clarinet-a",
    name: "Clarinet in A",
    summary: "Sounds a minor 3rd below written · Orchestral clarinet",
    transpose: 3,
    targets: [heardTarget(64, "G4"), heardTarget(69, "C#5")],
  },
  {
    id: "bass-clarinet",
    name: "Bass Clarinet in B♭",
    summary: "Sounds a major 9th below written",
    transpose: 14,
    targets: [heardTarget(45, "B3"), heardTarget(46, "C4")],
  },
  {
    id: "alto-clarinet",
    name: "Alto Clarinet in E♭",
    summary: "Sounds a major 6th below written",
    transpose: 9,
    targets: [heardTarget(51, "C4"), heardTarget(57, "F4")],
  },
  {
    id: "flute",
    name: "Flute",
    summary: "In C · Sounds as written",
    targets: [heardTarget(69, "A4"), heardTarget(81, "A5")],
  },
  {
    id: "piccolo",
    name: "Piccolo",
    summary: "In C · Sounds an octave above written",
    transpose: -12,
    targets: [heardTarget(81, "A4")],
  },
  {
    id: "saxophone-soprano",
    name: "Soprano Saxophone in B♭",
    summary: "Sounds a major 2nd below written",
    transpose: 2,
    targets: [heardTarget(65, "G4"), heardTarget(69, "B4")],
  },
  {
    id: "saxophone-alto",
    name: "Alto Saxophone in E♭",
    summary: "Sounds a major 6th below written",
    transpose: 9,
    targets: [heardTarget(57, "F#4"), heardTarget(58, "G4")],
  },
  {
    id: "saxophone-tenor",
    name: "Tenor Saxophone in B♭",
    summary: "Sounds a major 9th below written",
    transpose: 14,
    targets: [heardTarget(45, "B3"), heardTarget(46, "C4")],
  },
  {
    id: "saxophone-baritone",
    name: "Baritone Saxophone in E♭",
    summary: "Sounds an octave plus a major 6th below written",
    transpose: 21,
    targets: [heardTarget(45, "F#4"), heardTarget(51, "C5")],
  },
  {
    id: "oboe",
    name: "Oboe",
    summary: "In C · Sounds as written · Gives the orchestral A",
    targets: [heardTarget(69, "A4")],
  },
  {
    id: "bassoon",
    name: "Bassoon",
    summary: "In C · Sounds as written",
    targets: [heardTarget(57, "A3"), heardTarget(58, "B♭3")],
  },
  {
    id: "trumpet",
    name: "Trumpet in B♭",
    summary: "Sounds a major 2nd below written",
    transpose: 2,
    targets: [heardTarget(69, "B4"), heardTarget(70, "C5")],
  },
  {
    id: "trombone",
    name: "Trombone",
    summary: "In B♭ · Reads concert pitch, sounds as written",
    targets: [heardTarget(46, "B♭2"), heardTarget(53, "F3"), heardTarget(58, "B♭3")],
  },
  {
    id: "french-horn",
    name: "French Horn in F",
    summary: "Sounds a perfect 5th below written",
    transpose: 7,
    targets: [heardTarget(53, "C4"), heardTarget(57, "E4"), heardTarget(65, "C5")],
  },
  {
    id: "tuba",
    name: "Tuba",
    summary: "Reads concert pitch, sounds as written",
    targets: [heardTarget(34, "B♭1"), heardTarget(41, "F2"), heardTarget(46, "B♭2")],
  },
];

export function getInstrument(id: string): Instrument {
  return instruments.find((instrument) => instrument.id === id) ?? instruments[0];
}
