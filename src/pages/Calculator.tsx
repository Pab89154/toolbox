import { useEffect, useState } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { getTool } from "../data/tools";
import {
  backspace,
  equals,
  initialCalc,
  inputDigit,
  inputDot,
  percent,
  setOperator,
  toggleSign,
  type CalcState,
} from "../lib/calculator";

const tool = getTool("calculator");

const KEYS = [
  ["AC", "+/−", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
] as const;

function reduce(state: CalcState, key: string): CalcState {
  if (key === "AC") return initialCalc;
  if (key === "+/−") return toggleSign(state);
  if (key === "%") return percent(state);
  if (key === "=") return equals(state);
  if (key === ".") return inputDot(state);
  if (key === "÷" || key === "×" || key === "−" || key === "+") return setOperator(state, key);
  return inputDigit(state, key);
}

export function Calculator() {
  const [state, setState] = useState<CalcState>(initialCalc);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const map: Record<string, string> = {
        Enter: "=",
        "=": "=",
        Escape: "AC",
        Backspace: "back",
        "%": "%",
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        ".": ".",
      };
      const key = map[event.key] ?? (/^[0-9]$/.test(event.key) ? event.key : "");
      if (!key) return;
      event.preventDefault();
      setState((current) => (key === "back" ? backspace(current) : reduce(current, key)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const size = state.display.length > 12 ? "text-3xl" : state.display.length > 8 ? "text-4xl" : "text-5xl";

  return (
    <ToolScreen tool={tool}>
      <div className="rounded-2xl border border-line bg-card px-4 py-5 text-right">
        <p className="h-5 text-sm text-muted">{state.op ?? ""}</p>
        <p className={`font-medium tabular-nums tracking-tight ${size}`}>{state.display}</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2.5">
        {KEYS.flat().map((key) => {
          const operator = key === "÷" || key === "×" || key === "−" || key === "+";
          const equalsKey = key === "=";
          return (
            <button
              key={key}
              type="button"
              onClick={() => setState((current) => reduce(current, key))}
              className={`h-16 rounded-2xl text-xl font-medium transition active:scale-[0.98] ${
                key === "0" ? "col-span-2" : ""
              } ${equalsKey ? "bg-ink text-bg" : "bg-elevated text-ink"}`}
              style={operator ? { color: tool.accent } : undefined}
            >
              {key}
            </button>
          );
        })}
      </div>
    </ToolScreen>
  );
}
