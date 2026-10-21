import { useEffect, useState, type PointerEvent } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { FieldLabel } from "../components/ui";
import { getTool } from "../data/tools";
import { hsvToRgb, rgbToHex, rgbToHsl } from "../lib/color";

const tool = getTool("color-picker");

function hueFromEvent(event: { clientX: number; clientY: number }, el: Element) {
  const rect = el.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 200 - 100;
  const y = ((event.clientY - rect.top) / rect.height) * 200 - 100;
  return (Math.atan2(y, x) * 180) / Math.PI + 90;
}

function ringPath(index: number) {
  const inner = 68;
  const outer = 96;
  const a0 = ((index * 5 - 90) * Math.PI) / 180;
  const a1 = (((index + 1) * 5 - 90) * Math.PI) / 180;
  const at = (radius: number, angle: number) =>
    `${100 + Math.cos(angle) * radius} ${100 + Math.sin(angle) * radius}`;
  return `M ${at(outer, a0)} A ${outer} ${outer} 0 0 1 ${at(outer, a1)} L ${at(inner, a1)} A ${inner} ${inner} 0 0 0 ${at(inner, a0)} Z`;
}

export function ColorPicker() {
  const [hue, setHue] = useState(262);
  const [saturation, setSaturation] = useState(72);
  const [value, setValue] = useState(99);
  const [copied, setCopied] = useState(false);

  const rgb = hsvToRgb(((hue % 360) + 360) % 360, saturation, value);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const marker = ((hue - 90) * Math.PI) / 180;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function pickHue(event: PointerEvent<SVGSVGElement>) {
    const next = hueFromEvent(event, event.currentTarget);
    setHue((next + 360) % 360);
  }

  function pickSquare(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const s = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const v = Math.min(100, Math.max(0, (1 - (event.clientY - rect.top) / rect.height) * 100));
    setSaturation(s);
    setValue(v);
  }

  async function copyHex() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      return;
    } catch {
      const area = document.createElement("textarea");
      area.value = hex;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.append(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (ok) setCopied(true);
    }
  }

  return (
    <ToolScreen tool={tool}>
      <div className="overflow-hidden rounded-2xl border border-line" style={{ background: hex }}>
        <div className="h-28" />
      </div>

      <div className="mt-6">
        <FieldLabel>Hue</FieldLabel>
        <svg
          viewBox="0 0 200 200"
          className="mx-auto h-64 w-64 touch-none"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            pickHue(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) pickHue(event);
          }}
          role="slider"
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(hue)}
        >
          {Array.from({ length: 72 }, (_, index) => (
            <path key={index} d={ringPath(index)} fill={`hsl(${index * 5} 100% 50%)`} />
          ))}
          <circle cx="100" cy="100" r="58" style={{ fill: "var(--bg)" }} />
          <circle
            cx={100 + Math.cos(marker) * 82}
            cy={100 + Math.sin(marker) * 82}
            r="7"
            fill="none"
            stroke="#FAFAFA"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="mt-4">
        <FieldLabel>Saturation and brightness</FieldLabel>
        <div
          className="relative h-40 touch-none overflow-hidden rounded-2xl"
          style={{ background: `hsl(${hue} 100% 50%)` }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            pickSquare(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) pickSquare(event);
          }}
          role="slider"
          aria-label="Saturation and brightness"
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000, transparent)" }} />
          <span
            className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.45)]"
            style={{ left: `${saturation}%`, top: `${100 - value}%` }}
          />
        </div>
      </div>

      <dl className="mt-6 space-y-2">
        <div>
          <button
            type="button"
            onClick={() => void copyHex()}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-card px-4 py-3 text-left active:scale-[0.99]"
          >
            <dt className="text-sm text-muted">Hex</dt>
            <dd className="font-medium tabular-nums">{copied ? "Copied" : hex}</dd>
          </button>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3">
          <dt className="text-sm text-muted">RGB</dt>
          <dd className="font-medium tabular-nums">
            {rgb.r} {rgb.g} {rgb.b}
          </dd>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3">
          <dt className="text-sm text-muted">HSL</dt>
          <dd className="font-medium tabular-nums">
            {hsl.h} {hsl.s} {hsl.l}
          </dd>
        </div>
      </dl>
    </ToolScreen>
  );
}
