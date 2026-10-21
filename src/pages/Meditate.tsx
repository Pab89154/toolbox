import { useEffect, useRef, useState } from "react";
import { useToolAccent } from "../lib/theme";
import { ToolScreen } from "../components/ToolScreen";
import { PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";

const tool = getTool("meditate");

type Kind = "grow" | "big" | "shrink" | "small";
type Phase = { name: "Inhale" | "Hold" | "Exhale"; kind: Kind };

const PHASES: Phase[] = [
  ...Array.from({ length: 3 }, () => [
    { name: "Inhale" as const, kind: "grow" as const },
    { name: "Hold" as const, kind: "big" as const },
    { name: "Exhale" as const, kind: "shrink" as const },
    { name: "Hold" as const, kind: "small" as const },
  ]).flat(),
  { name: "Inhale", kind: "grow" },
  { name: "Hold", kind: "big" },
  { name: "Exhale", kind: "shrink" },
];

function scaleFor(kind: Kind, t: number) {
  if (kind === "grow") return 0.62 + 0.38 * t;
  if (kind === "shrink") return 1 - 0.38 * t;
  if (kind === "big") return 1;
  return 0.62;
}

export function Meditate() {
  const accent = useToolAccent(tool);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(0);

  useEffect(() => {
    if (!running) return;
    started.current = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const seconds = (now - started.current) / 1000;
      if (seconds >= 60) {
        setElapsed(60);
        setRunning(false);
        setDone(true);
        return;
      }
      setElapsed(seconds);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const index = Math.min(PHASES.length - 1, Math.floor(elapsed / 4));
  const phase = running || done ? PHASES[index] : null;
  const local = (elapsed - index * 4) / 4;
  const scale = phase ? scaleFor(phase.kind, Math.min(1, Math.max(0, local))) : 0.62;
  const remaining = done ? 0 : Math.max(0, Math.ceil(60 - elapsed - 1e-6));
  const label = done ? "Done" : phase ? phase.name : "Ready";

  function toggle() {
    if (running) {
      setRunning(false);
      setElapsed(0);
      setDone(false);
      return;
    }
    setDone(false);
    setElapsed(0);
    setRunning(true);
  }

  return (
    <ToolScreen tool={tool}>
      <div className="grid place-items-center py-6">
        <div className="relative grid h-64 w-64 place-items-center">
          <div
            className="absolute h-56 w-56 rounded-full border"
            style={{
              borderColor: accent,
              background: `${accent}14`,
              transform: `scale(${scale})`,
            }}
          />
          <div className="relative text-center">
            <p className="text-3xl font-medium">{label}</p>
            <p className="mt-1 text-sm tabular-nums text-muted">{remaining}s</p>
          </div>
        </div>
      </div>
      <PrimaryButton type="button" onClick={toggle}>
        {running ? "Stop" : done ? "Start again" : "Start"}
      </PrimaryButton>
    </ToolScreen>
  );
}
