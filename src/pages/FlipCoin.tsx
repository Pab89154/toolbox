import { useEffect, useRef, useState } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";

const tool = getTool("flip-a-coin");

function CoinFace({ side }: { side: "heads" | "tails" }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="94" fill="#27272A" />
      <circle cx="100" cy="100" r="86" fill="#16181B" stroke={tool.accent} strokeWidth="3" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#303036" strokeWidth="1.5" />
      {side === "heads" ? (
        <>
          <circle cx="100" cy="100" r="16" fill="none" stroke={tool.accent} strokeWidth="2" />
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            const x1 = 100 + Math.cos(angle) * 26;
            const y1 = 100 + Math.sin(angle) * 26;
            const x2 = 100 + Math.cos(angle) * 40;
            const y2 = 100 + Math.sin(angle) * 40;
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={tool.accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </>
      ) : (
        <>
          <path d="M72 132 H128" fill="none" stroke={tool.accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M80 132 V84" fill="none" stroke={tool.accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M100 132 V76" fill="none" stroke={tool.accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M120 132 V84" fill="none" stroke={tool.accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M72 84 H128" fill="none" stroke={tool.accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M84 84 L100 66 L116 84" fill="none" stroke={tool.accent} strokeWidth="2" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

export function FlipCoin() {
  const [rotation, setRotation] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [side, setSide] = useState<"heads" | "tails">("heads");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function flip() {
    if (flipping) return;
    const next = Math.random() < 0.5 ? "heads" : "tails";
    const desired = next === "heads" ? 0 : 180;
    setFlipping(true);
    setRotation((current) => {
      const normalized = ((current % 360) + 360) % 360;
      let delta = desired - normalized;
      if (delta <= 0) delta += 360;
      return current + delta + 360 * 4;
    });
    timer.current = window.setTimeout(() => {
      setSide(next);
      setFlipping(false);
    }, 1500);
  }

  const label = side === "heads" ? "Heads" : "Tails";

  return (
    <ToolScreen tool={tool}>
      <div className="grid place-items-center py-4" style={{ perspective: 900 }}>
        <div
          className="relative h-56 w-56"
          style={{
            transformStyle: "preserve-3d",
            transition: flipping ? "transform 1.5s cubic-bezier(0.16, 0.84, 0.2, 1)" : "none",
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <CoinFace side="heads" />
          </div>
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <CoinFace side="tails" />
          </div>
        </div>
      </div>
      <p className="mt-4 min-h-7 text-center text-lg font-medium" aria-live="polite">
        {flipping ? "Flipping" : label}
      </p>
      <div className="mt-6">
        <PrimaryButton type="button" onClick={flip} disabled={flipping}>
          Flip
        </PrimaryButton>
      </div>
    </ToolScreen>
  );
}
