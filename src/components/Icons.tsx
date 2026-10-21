import type { JSX, SVGProps } from "react";
import type { ToolId } from "../data/tools";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="11" cy="11" r="6.25" />
      <path d="M16 16.5 L20 20.5" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3.5 V14" />
      <path d="M7.5 6.5 L12 2.5 L16.5 6.5" />
      <path d="M5.5 11.5 V19 a1.5 1.5 0 0 0 1.5 1.5 H17 A1.5 1.5 0 0 0 18.5 19 V11.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M7 7 L17 17" />
      <path d="M17 7 L7 17" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5 V4.5" />
      <path d="M12 19.5 V21.5" />
      <path d="M2.5 12 H4.5" />
      <path d="M19.5 12 H21.5" />
      <path d="M5 5 L6.4 6.4" />
      <path d="M17.6 17.6 L19 19" />
      <path d="M19 5 L17.6 6.4" />
      <path d="M6.4 17.6 L5 19" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M20 14.5 A8.5 8.5 0 1 1 9.5 4 a7 7 0 0 0 10.5 10.5 Z" />
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M14.5 6.5 L8.5 12 L14.5 17.5" />
    </svg>
  );
}

function MetronomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3.5 L7.2 20.5 H16.8 Z" />
      <path d="M6 20.5 H18" />
      <path d="M12 6.5 L15.6 15.2" />
      <circle cx="15.6" cy="15.2" r="1.45" />
    </svg>
  );
}

function ColorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="7.25" />
      <circle cx="16.15" cy="8.15" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MeditateIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 20.2c0-3.2 1.7-5.6 1.7-8.1 0-2.1-1.1-3.2-1.7-1.6-.6-1.6-1.7-.5-1.7 1.6 0 2.5 1.7 4.9 1.7 8.1Z" />
      <path d="M12 18.4C9.6 16.4 6.6 15 5.6 12.2c1.5-.7 3.4.4 4.8 2.6" />
      <path d="M12 18.4c2.4-2 5.4-3.4 6.4-6.2-1.5-.7-3.4.4-4.8 2.6" />
    </svg>
  );
}

function DieIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="3.5" />
      <circle cx="8.4" cy="8.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="15.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="8.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="8.4" cy="15.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SpinnerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="13.2" r="6.6" />
      <path d="M12 13.2 V7.4" />
      <path d="M12 3.4 L14.15 6.3 H9.85 Z" />
    </svg>
  );
}

function TunerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M9 4.5 v6.1a3 3 0 0 0 6 0 V4.5" />
      <path d="M8 4.5 H10" />
      <path d="M14 4.5 H16" />
      <path d="M12 13.6 V20" />
    </svg>
  );
}

function CalculatorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M8 6.5 H16" />
      <circle cx="8.5" cy="11.2" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11.2" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11.2" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="14.6" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.6" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.6" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="18" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="18" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CoinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5.25" />
    </svg>
  );
}

const icons = {
  metronome: MetronomeIcon,
  "color-picker": ColorIcon,
  meditate: MeditateIcon,
  "roll-a-die": DieIcon,
  spinner: SpinnerIcon,
  tuner: TunerIcon,
  calculator: CalculatorIcon,
  "flip-a-coin": CoinIcon,
} satisfies Record<ToolId, (props: IconProps) => JSX.Element>;

export function ToolIcon({ id, ...props }: IconProps & { id: ToolId }) {
  const Icon = icons[id];
  return <Icon {...props} />;
}
