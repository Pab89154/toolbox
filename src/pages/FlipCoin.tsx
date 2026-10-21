import { useEffect, useRef, useState } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";
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
      <circle cx="100" cy="100" r="74" fill="none" style={{ stroke: "var(--line)" }} strokeWidth="1.5" />
      {side === "heads" ? (
        <g transform="translate(-5 -5)">
          <defs>
            <path id="headsArc" d="M 38 100 A 67 67 0 0 1 172 100" fill="none" />
          </defs>
          <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="13" letterSpacing="3" fill={ink}>
            <textPath href="#headsArc" startOffset="50%" textAnchor="middle">
              LIBERTY
            </textPath>
          </text>
          {/* George Washington profile, facing left, quarter-style bust */}
          <path
            fill={ink}
            d="M 66 158 L 148 158 C 140 148, 128 142, 120 136 C 114 131, 111 124, 112 116 L 118 128 C 119 133, 126 134, 129 129 C 131 125, 129 118, 127 110 C 125 101, 126 94, 128 87 C 131 72, 122 58, 106 53 C 90 48, 74 55, 68 68 C 65 73, 63 78, 62 83 L 52 91 C 49 94, 50 98, 55 99 L 59 100 C 57 103, 57 106, 60 108 C 58 111, 59 114, 62 116 C 60 122, 61 129, 64 134 C 67 142, 66 150, 66 158 Z"
          />
          <path d="M 88 64 C 97 60, 107 62, 113 68" fill="none" style={{ stroke: "var(--detail)" }} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 108 78 C 112 82, 113 87, 111 92" fill="none" style={{ stroke: "var(--detail)" }} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 92 108 C 96 105, 101 105, 105 108" fill="none" style={{ stroke: "var(--detail)" }} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 116 112 L 128 106 L 124 118 L 130 124 L 117 124 Z" fill={ink} />
        </g>
      ) : (
        <g transform="translate(-5 -5)">
          <defs>
            <path id="tailsArc" d="M 34 108 A 71 71 0 0 1 176 108" fill="none" />
            <path id="tailsArcB" d="M 40 96 A 69 69 0 0 0 170 96" fill="none" />
          </defs>
          <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="10.5" letterSpacing="2" fill={ink}>
            <textPath href="#tailsArc" startOffset="50%" textAnchor="middle">
              UNITED STATES OF AMERICA
            </textPath>
          </text>
          {/* Heraldic eagle: raised wings, shield, tail feathers */}
          <g transform="translate(10.5 4.1) scale(0.9)">
            <path
              fill={ink}
              d="M 101 90 C 86 68, 64 52, 38 48 C 44 58, 47 66, 46 73 C 51 76, 57 76, 60 79 C 55 85, 54 91, 57 97 C 62 98, 67 97, 70 100 C 68 108, 71 115, 78 119 C 88 110, 97 100, 101 90 Z"
            />
            <path
              fill={ink}
              d="M 109 90 C 124 68, 146 52, 172 48 C 166 58, 163 66, 164 73 C 159 76, 153 76, 150 79 C 155 85, 156 91, 153 97 C 148 98, 143 97, 140 100 C 142 108, 139 115, 132 119 C 122 110, 113 100, 109 90 Z"
            />
            <path d="M 90 88 C 78 74, 64 64, 50 61 M 90 99 C 80 89, 68 82, 57 80" fill="none" style={{ stroke: "var(--detail)" }} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 120 88 C 132 74, 146 64, 160 61 M 120 99 C 130 89, 142 82, 153 80" fill="none" style={{ stroke: "var(--detail)" }} strokeWidth="2.2" strokeLinecap="round" />
            <path
              fill={ink}
              style={{ stroke: "var(--detail)" }}
              strokeWidth="2"
              d="M 110 50 C 102 46, 94 50, 91 57 L 80 64 C 78 66, 79 69, 82 69 L 90 70 C 89 74, 90 78, 93 80 L 90 85 L 97 85 L 96 91 L 103 87 C 108 84, 112 77, 112 67 C 112 60, 111 54, 110 50 Z"
            />
            <circle cx="98" cy="59" r="2.1" style={{ fill: "var(--detail)" }} />
            <path fill={ink} d="M 88 90 L 122 90 L 122 112 C 122 125, 115 135, 105 141 C 95 135, 88 125, 88 112 Z" />
            <path d="M 88 100 L 122 100" style={{ stroke: "var(--detail)" }} strokeWidth="3" />
            <path d="M 97 102 L 97 128 M 105 102 L 105 134 M 113 102 L 113 128" style={{ stroke: "var(--detail)" }} strokeWidth="2.5" />
            <path d="M 98 141 L 97 146 M 105 142 L 105 147 M 112 141 L 113 146" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
          </g>
          <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="9.5" letterSpacing="2" fill={ink}>
            <textPath href="#tailsArcB" startOffset="50%" textAnchor="middle">
              QUARTER DOLLAR
            </textPath>
          </text>
        </g>
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
