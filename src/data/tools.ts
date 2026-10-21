export type ToolId =
  | "metronome"
  | "color-picker"
  | "meditate"
  | "roll-a-die"
  | "spinner"
  | "tuner"
  | "calculator"
  | "flip-a-coin";

export type Tool = {
  id: ToolId;
  name: string;
  subtitle: string;
  path: string;
  /** Accent on the dark theme. */
  accent: string;
  /** Darker variant of the accent, readable on the light theme. */
  accentLight: string;
};

export const tools: Tool[] = [
  {
    id: "metronome",
    name: "Metronome",
    subtitle: "Keep the beat",
    path: "/metronome",
    accent: "#A3A3A3",
    accentLight: "#525252",
  },
  {
    id: "color-picker",
    name: "Color Picker",
    subtitle: "Find your color",
    path: "/color-picker",
    accent: "#C4B5FD",
    accentLight: "#7C5CFC",
  },
  {
    id: "meditate",
    name: "Meditate",
    subtitle: "1 minute to reset",
    path: "/meditate",
    accent: "#7AF3B8",
    accentLight: "#059669",
  },
  {
    id: "roll-a-die",
    name: "Roll a Die",
    subtitle: "Leave it to chance",
    path: "/roll-a-die",
    accent: "#FC6A5B",
    accentLight: "#E23D2E",
  },
  {
    id: "spinner",
    name: "Spinner",
    subtitle: "Pick at random",
    path: "/spinner",
    accent: "#F5B33B",
    accentLight: "#D97706",
  },
  {
    id: "tuner",
    name: "Tuner",
    subtitle: "Tune your instrument",
    path: "/tuner",
    accent: "#63C3FD",
    accentLight: "#0284C7",
  },
  {
    id: "calculator",
    name: "Calculator",
    subtitle: "Quick calculations",
    path: "/calculator",
    accent: "#B4B4BE",
    accentLight: "#52525B",
  },
  {
    id: "flip-a-coin",
    name: "Flip a Coin",
    subtitle: "Heads or tails",
    path: "/flip-a-coin",
    accent: "#E5E7EB",
    accentLight: "#3F3F46",
  },
];

export function getTool(id: ToolId): Tool {
  const tool = tools.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
