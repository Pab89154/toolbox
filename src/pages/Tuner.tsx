import { useEffect, useRef, useState } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";
import { describePitch, detectPitch } from "../lib/pitch";

const tool = getTool("tuner");

type Status = "idle" | "listening" | "denied" | "missing";

export function Tuner() {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("—");
  const [cents, setCents] = useState(0);
  const [heard, setHeard] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const frameRef = useRef(0);
  const smoothRef = useRef<number | null>(null);

  function stop() {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    smoothRef.current = null;
    setHeard(false);
    setCents(0);
    setNote("—");
    setStatus("idle");
  }

  useEffect(() => stop, []);

  async function listen() {
    if (status === "listening") {
      stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      streamRef.current = stream;
      ctxRef.current = ctx;
      setStatus("listening");
      const data = new Float32Array(analyser.fftSize);
      let tick = 0;

      const loop = () => {
        tick += 1;
        if (tick % 3 === 0) {
          analyser.getFloatTimeDomainData(data);
          const frequency = detectPitch(data, ctx.sampleRate);
          if (frequency > 0) {
            smoothRef.current = smoothRef.current == null ? frequency : smoothRef.current * 0.65 + frequency * 0.35;
            const described = describePitch(smoothRef.current);
            setNote(`${described.name}${described.octave}`);
            setCents(described.cents);
            setHeard(true);
          } else {
            smoothRef.current = null;
            setHeard(false);
            setNote("—");
            setCents(0);
          }
        }
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setStatus(name === "NotFoundError" ? "missing" : "denied");
    }
  }

  const inTune = heard && Math.abs(cents) <= 5;

  return (
    <ToolScreen tool={tool}>
      <div className="rounded-2xl border border-line bg-card px-4 py-8">
        <svg viewBox="0 0 200 120" className="mx-auto h-36 w-full max-w-sm" aria-hidden="true">
          <path d="M 24 100 A 76 76 0 0 1 176 100" fill="none" stroke="#303036" strokeWidth="8" strokeLinecap="round" />
          <path d="M 96 100 A 4 4 0 0 1 104 100" fill="none" stroke="#3f3f46" strokeWidth="8" strokeLinecap="round" />
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="38"
            stroke={tool.accent}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${cents * 0.8} 100 100)`}
          />
          <circle cx="100" cy="100" r="5" fill={tool.accent} />
        </svg>
        <p
          className="mt-2 text-center text-6xl font-semibold tabular-nums tracking-tight"
          style={{ color: inTune ? tool.accent : "#FAFAFA" }}
          aria-live="polite"
        >
          {note}
        </p>
        <p className="mt-2 text-center text-sm tabular-nums text-muted">
          {heard ? `${cents > 0 ? "+" : ""}${cents} cents` : status === "listening" ? "Listening" : "A440"}
        </p>
      </div>

      {status === "denied" ? (
        <p className="mt-4 text-center text-sm text-muted">Microphone access is off. Allow it in the browser to tune.</p>
      ) : null}
      {status === "missing" ? (
        <p className="mt-4 text-center text-sm text-muted">No microphone was found on this device.</p>
      ) : null}

      <div className="mt-6">
        <PrimaryButton type="button" onClick={() => void listen()}>
          {status === "listening" ? "Stop" : "Listen"}
        </PrimaryButton>
      </div>
    </ToolScreen>
  );
}
