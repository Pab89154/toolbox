import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "../components/Icons";
import { ToolScreen } from "../components/ToolScreen";
import { PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";

const tool = getTool("spinner");
const STORAGE_KEY = "toolbox.spinner";

function loadOptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ["Yes", "No", "Maybe"];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string") && parsed.length > 0) {
      return parsed.map((item) => item.slice(0, 24)).slice(0, 12);
    }
  } catch {
    return ["Yes", "No", "Maybe"];
  }
  return ["Yes", "No", "Maybe"];
}

function segmentPath(index: number, count: number) {
  const start = (index / count) * Math.PI * 2 - Math.PI / 2;
  const end = ((index + 1) / count) * Math.PI * 2 - Math.PI / 2;
  const radius = 92;
  const x1 = 100 + Math.cos(start) * radius;
  const y1 = 100 + Math.sin(start) * radius;
  const x2 = 100 + Math.cos(end) * radius;
  const y2 = 100 + Math.sin(end) * radius;
  const large = end - start > Math.PI ? 1 : 0;
  return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
}

function landedIndex(rotationValue: number, count: number) {
  const slice = 360 / count;
  const pointerAngle = (((360 - (rotationValue % 360)) % 360) + 360) % 360;
  return Math.floor(pointerAngle / slice) % count;
}

export function Spinner() {
  const [options, setOptions] = useState<string[]>(loadOptions);
  const [draft, setDraft] = useState("");
  const [rotation, setRotation] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [durationMs, setDurationMs] = useState(3200);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const timer = useRef(0);
  const rotationRef = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    lastAngle: number;
    lastTime: number;
    velocity: number; // degrees per ms, smoothed
    moved: number; // total degrees dragged
    rotation: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  }, [options]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function resetSpin() {
    window.clearTimeout(timer.current);
    setAnimate(false);
    applyRotation(0);
    setResult(null);
  }

  function addOption() {
    const label = draft.trim().slice(0, 24);
    if (!label || options.length >= 12) return;
    resetSpin();
    setOptions((current) => [...current, label]);
    setDraft("");
  }

  function removeOption(index: number) {
    resetSpin();
    setOptions((current) => current.filter((_, item) => item !== index));
  }

  function applyRotation(value: number) {
    rotationRef.current = value;
    setRotation(value);
  }

  function finishSpin(finalRotation: number, ms: number) {
    const index = landedIndex(finalRotation, options.length);
    setResult(null);
    setDurationMs(ms);
    setAnimate(true);
    applyRotation(finalRotation);
    timer.current = window.setTimeout(() => {
      setAnimate(false);
      setResult(index);
    }, ms);
  }

  function spin() {
    if (animate || options.length < 2) return;
    const index = Math.floor(Math.random() * options.length);
    const slice = 360 / options.length;
    const desired = (360 - (index * slice + slice / 2) + 360) % 360;
    const prev = rotationRef.current;
    const current = ((prev % 360) + 360) % 360;
    let delta = desired - current;
    if (delta < 0) delta += 360;
    finishSpin(prev + delta + 360 * 5, 3200);
  }

  function angleFromCenter(event: React.PointerEvent) {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  function onWheelPointerDown(event: React.PointerEvent) {
    if (animate || options.length < 2) return;
    event.preventDefault();
    try {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is a nicety; dragging still works without it.
    }
    window.clearTimeout(timer.current);
    setAnimate(false);
    setResult(null);
    drag.current = {
      pointerId: event.pointerId,
      lastAngle: angleFromCenter(event),
      lastTime: performance.now(),
      velocity: 0,
      moved: 0,
      rotation: rotationRef.current,
    };
    setDragging(true);
  }

  function onWheelPointerMove(event: React.PointerEvent) {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const now = performance.now();
    const angle = angleFromCenter(event);
    let delta = angle - state.lastAngle;
    delta = ((delta + 540) % 360) - 180;
    const dt = Math.max(now - state.lastTime, 1);
    state.velocity = state.velocity * 0.7 + (delta / dt) * 0.3;
    state.lastAngle = angle;
    state.lastTime = now;
    state.moved += Math.abs(delta);
    state.rotation += delta;
    applyRotation(state.rotation);
  }

  function onWheelPointerUp(event: React.PointerEvent) {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    // Finger paused before lifting — no fling.
    const velocity = performance.now() - state.lastTime > 80 ? 0 : state.velocity;
    if (state.moved < 8) {
      // A tap on the wheel spins it, just like the button.
      spin();
      return;
    }
    if (Math.abs(velocity) < 0.12) {
      spin();
      return;
    }
    const clamped = Math.max(-2.4, Math.min(2.4, velocity));
    const extra = clamped * 1400 + Math.sign(clamped) * 360;
    const ms = Math.round(Math.max(1600, Math.min(4200, 1100 + Math.abs(extra) / 1.1)));
    finishSpin(state.rotation + extra, ms);
  }

  function onWheelPointerCancel() {
    drag.current = null;
    setDragging(false);
  }

  return (
    <ToolScreen tool={tool}>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addOption();
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add an option"
          aria-label="Add an option"
          maxLength={24}
          disabled={animate}
          className="h-12 w-full rounded-2xl border border-line bg-card px-4 text-base outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={animate || !draft.trim() || options.length >= 12}
          className="h-12 shrink-0 rounded-2xl bg-elevated px-4 text-sm font-medium text-ink disabled:opacity-40"
        >
          Add
        </button>
      </form>

      <div
        ref={wheelRef}
        className="relative mx-auto mt-8 h-72 w-72 max-w-full touch-none select-none"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        role="button"
        aria-label="Spin the wheel"
        title="Drag, flick, or tap to spin"
        onPointerDown={onWheelPointerDown}
        onPointerMove={onWheelPointerMove}
        onPointerUp={onWheelPointerUp}
        onPointerCancel={onWheelPointerCancel}
      >
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-0 left-1/2 z-10 h-7 w-7 -translate-x-1/2"
          aria-hidden="true"
          style={{ color: tool.accent }}
        >
          <path d="M12 22 L5 6 H19 Z" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none h-full w-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: animate ? `transform ${durationMs}ms cubic-bezier(0.12, 0.7, 0.08, 1)` : "none",
          }}
        >
          {options.length <= 1 ? (
            <>
              <circle cx="100" cy="100" r="92" fill="#16181B" stroke="#303036" />
              {options[0] ? (
                <text x="100" y="100" fill="#FAFAFA" fontSize="14" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif">
                  {options[0]}
                </text>
              ) : null}
            </>
          ) : options.map((label, index) => {
            const slice = 360 / options.length;
            const angle = (index + 0.5) * slice - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 100 + Math.cos(rad) * 58;
            const y = 100 + Math.sin(rad) * 58;
            const textAngle = angle > 0 && angle < 180 ? angle + 180 : angle;
            const landed = result === index && !animate;
            return (
              <g key={`${label}-${index}`}>
                <path
                  d={segmentPath(index, options.length)}
                  fill={index % 2 === 0 ? "#16181B" : "#27272A"}
                  stroke={landed ? tool.accent : "#303036"}
                  strokeWidth={landed ? 2 : 1}
                />
                <text
                  x={x}
                  y={y}
                  fill="#FAFAFA"
                  fontSize={options.length > 8 ? 8 : 11}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle} ${x} ${y})`}
                  fontFamily="Inter, sans-serif"
                >
                  {label.length > 12 ? `${label.slice(0, 11)}…` : label}
                </text>
              </g>
            );
          })}
          <circle cx="100" cy="100" r="8" fill="#030308" stroke={tool.accent} strokeWidth="2" />
        </svg>
      </div>

      <p className="mt-4 min-h-7 text-center text-lg font-medium" aria-live="polite" style={{ color: result === null ? "#A1A1AA" : tool.accent }}>
        {options.length < 2 ? "Add at least two options" : result === null ? (animate ? "Spinning" : "Drag, flick, or tap the wheel to spin") : options[result]}
      </p>

      <div className="mt-4">
        <PrimaryButton type="button" onClick={spin} disabled={animate || options.length < 2}>
          {animate ? "Spinning" : "Spin"}
        </PrimaryButton>
      </div>

      <ul className="mt-6 space-y-2">
        {options.map((label, index) => (
          <li
            key={`${label}-${index}`}
            className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3"
            style={{ borderColor: result === index && !animate ? tool.accent : "#303036" }}
          >
            <span className="pr-3 text-sm">{label}</span>
            <button
              type="button"
              aria-label={`Remove ${label}`}
              onClick={() => removeOption(index)}
              disabled={animate}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted disabled:opacity-40"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </ToolScreen>
  );
}
