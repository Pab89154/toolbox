import { useEffect, useRef, useState } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";
import { QuarterHeads } from "../components/QuarterHeads";
import { useTheme } from "../lib/theme";

const tool = getTool("flip-a-coin");

function CoinFace({ side }: { side: "heads" | "tails" }) {
  const { theme } = useTheme();
  // Silver on dark, dark metal on light — keeps the coin readable in both.
  const ink = theme === "dark" ? tool.accent : tool.accentLight;
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="94" style={{ fill: "var(--elevated)" }} />
      <circle cx="100" cy="100" r="86" style={{ fill: "var(--card)" }} stroke={ink} strokeWidth="3" />
      {side === "heads" ? (
        <QuarterHeads ink={ink} detail="var(--detail)" />
      ) : (
        <>
          <clipPath id="tailsClip">
            <circle cx="100" cy="100" r="83" />
          </clipPath>
          <g clipPath="url(#tailsClip)">
            <image
              href={`${import.meta.env.BASE_URL}coin-tails-${theme}.svg`}
              x="13"
              y="6.8"
              width="176.3"
              height="188.8"
            />
          </g>
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
