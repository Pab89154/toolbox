import { useEffect, useRef, useState } from "react";
import { useToolAccent } from "../lib/theme";
import { ToolScreen } from "../components/ToolScreen";
import { ChoiceChip, FieldLabel, PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";

const tool = getTool("roll-a-die");
const SIDES = [4, 6, 8, 10, 12, 20];

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[32, 32], [68, 68]],
  3: [[32, 32], [50, 50], [68, 68]],
  4: [[32, 32], [68, 32], [32, 68], [68, 68]],
  5: [[32, 32], [68, 32], [50, 50], [32, 68], [68, 68]],
  6: [[32, 28], [68, 28], [32, 50], [68, 50], [32, 72], [68, 72]],
};

function DieFace({ sides, value }: { sides: number; value: number }) {
  const accent = useToolAccent(tool);
  return (
    <svg viewBox="0 0 100 100" className="h-52 w-52">
      <rect x="8" y="8" width="84" height="84" rx="18" style={{ fill: "var(--card)", stroke: "var(--line)" }} strokeWidth="2" />
      {sides === 6 ? (
        PIPS[value]?.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6.5" fill={accent} />)
      ) : (
        <text
          x="50"
          y="54"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={accent}
          fontSize="34"
          fontWeight="600"
          fontFamily="inherit"
        >
          {value}
        </text>
      )}
    </svg>
  );
}

export function RollDie() {
  const [sides, setSides] = useState(6);
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const timer = useRef(0);

  useEffect(() => () => window.clearInterval(timer.current), []);

  function roll() {
    if (rolling) return;
    const finalValue = 1 + Math.floor(Math.random() * sides);
    setRolling(true);
    setSpinKey((key) => key + 1);
    let ticks = 0;
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      ticks += 1;
      if (ticks >= 12) {
        window.clearInterval(timer.current);
        setValue(finalValue);
        setHasRolled(true);
        setRolling(false);
        return;
      }
      setValue(1 + Math.floor(Math.random() * sides));
    }, 65);
  }

  return (
    <ToolScreen tool={tool}>
      <FieldLabel>Sides</FieldLabel>
      <div className="grid grid-cols-6 gap-2">
        {SIDES.map((count) => (
          <ChoiceChip
            key={count}
            type="button"
            selected={sides === count}
            onClick={() => {
              if (rolling) return;
              setSides(count);
              setValue(1);
            }}
            className="px-0"
          >
            {count}
          </ChoiceChip>
        ))}
      </div>

      <div className="mt-10 grid place-items-center" aria-live="polite">
        <div key={spinKey} className={rolling ? "tumble" : undefined}>
          <DieFace sides={sides} value={value} />
        </div>
        <p className="mt-4 text-sm text-muted">{rolling ? "Rolling" : hasRolled ? `Rolled ${value}` : "Ready"}</p>
      </div>

      <div className="mt-8">
        <PrimaryButton type="button" onClick={roll} disabled={rolling}>
          Roll
        </PrimaryButton>
      </div>
    </ToolScreen>
  );
}
