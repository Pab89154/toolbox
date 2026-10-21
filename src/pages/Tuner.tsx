import { useEffect, useRef, useState } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { ChoiceChip, FieldLabel, PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";
import { getInstrument, instruments, type TuningTarget } from "../data/instruments";
import { centsBetween, describePitch, detectPitch } from "../lib/pitch";

const tool = getTool("tuner");

type Status = "idle" | "listening" | "denied" | "missing";

export function Tuner() {
  const [status, setStatus] = useState<Status>("idle");
  const [instrumentId, setInstrumentId] = useState("violin");
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [note, setNote] = useState("—");
  const [cents, setCents] = useState(0);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [heard, setHeard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const frameRef = useRef(0);
  const smoothRef = useRef<number | null>(null);
  const targetRef = useRef<TuningTarget | null>(null);
  const toneRef = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);

  const instrument = getInstrument(instrumentId);
  const selectedTarget = targetIndex === null ? null : (instrument.targets[targetIndex] ?? null);
  targetRef.current = selectedTarget;

  function stopTone() {
    if (!toneRef.current) return;
    const { ctx, osc, gain } = toneRef.current;
    toneRef.current = null;
    setPlaying(false);
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Already stopped.
    }
    window.setTimeout(() => void ctx.close(), 150);
  }

  function stop() {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    smoothRef.current = null;
    setHeard(false);
    setCents(0);
    setFrequency(null);
    setNote("—");
    setStatus("idle");
  }

  useEffect(() => {
    return () => {
      stop();
      stopTone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playReference() {
    if (!selectedTarget) return;
    if (playing) {
      stopTone();
      return;
    }
    stop();
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = selectedTarget.frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + 2.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.55);
    toneRef.current = { ctx, osc, gain };
    setPlaying(true);
    osc.onended = () => {
      if (toneRef.current?.osc === osc) {
        toneRef.current = null;
        setPlaying(false);
        void ctx.close();
      }
    };
  }

  async function listen() {
    if (status === "listening") {
      stop();
      return;
    }
    stopTone();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
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
          const detected = detectPitch(data, ctx.sampleRate);
          if (detected > 0) {
            smoothRef.current =
              smoothRef.current == null ? detected : smoothRef.current * 0.65 + detected * 0.35;
            const described = describePitch(smoothRef.current);
            const target = targetRef.current;
            setNote(`${described.name}${described.octave}`);
            setCents(target ? centsBetween(smoothRef.current, target.frequency) : described.cents);
            setFrequency(smoothRef.current);
            setHeard(true);
          } else {
            smoothRef.current = null;
            setHeard(false);
            setNote("—");
            setCents(0);
            setFrequency(null);
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
  const guidance = !heard
    ? status === "listening"
      ? "Listening"
      : selectedTarget
        ? `Target ${selectedTarget.label} · ${selectedTarget.frequency.toFixed(1)} Hz`
        : "Any note · A440"
    : inTune
      ? "In tune"
      : cents < 0
        ? "Tune up"
        : "Tune down";
  const needle = Math.max(-50, Math.min(50, cents));

  return (
    <ToolScreen tool={tool}>
      <div>
        <FieldLabel>Instrument</FieldLabel>
        <select
          value={instrumentId}
          onChange={(event) => {
            stopTone();
            setInstrumentId(event.target.value);
            setTargetIndex(null);
          }}
          aria-label="Instrument"
          className="h-12 w-full appearance-none rounded-2xl border border-line bg-card px-4 text-base text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {instruments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[13px] text-muted">{instrument.summary}</p>
      </div>

      <div className="mt-6">
        <FieldLabel>{instrument.targets[0]?.detail.startsWith("String") ? "String to tune" : "Note to tune"}</FieldLabel>
        {instrument.targets.length <= 8 ? (
          <div className="flex flex-wrap gap-2">
            <ChoiceChip type="button" selected={targetIndex === null} onClick={() => setTargetIndex(null)}>
              Auto
            </ChoiceChip>
            {instrument.targets.map((target, index) => (
              <ChoiceChip
                key={`${target.label}-${target.detail}`}
                type="button"
                selected={targetIndex === index}
                onClick={() => setTargetIndex(index)}
                title={target.detail}
              >
                {target.detail.startsWith("String ")
                  ? `${target.detail.replace("String ", "S")} · ${target.label}`
                  : target.label}
              </ChoiceChip>
            ))}
          </div>
        ) : (
          <select
            value={targetIndex === null ? "auto" : String(targetIndex)}
            onChange={(event) => setTargetIndex(event.target.value === "auto" ? null : Number(event.target.value))}
            aria-label="Note to tune"
            className="h-12 w-full appearance-none rounded-2xl border border-line bg-card px-4 text-base text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <option value="auto">Auto — nearest note</option>
            {instrument.targets.map((target, index) => (
              <option key={`${target.label}-${target.detail}-${index}`} value={index}>
                {target.label} · {target.frequency.toFixed(1)} Hz
              </option>
            ))}
          </select>
        )}
        {selectedTarget ? (
          <p className="mt-2 text-[13px] text-muted">
            {selectedTarget.detail} · {selectedTarget.frequency.toFixed(1)} Hz
          </p>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-card px-4 py-8">
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
            transform={`rotate(${needle * 0.8} 100 100)`}
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
          {heard && frequency
            ? `${frequency.toFixed(1)} Hz · ${cents > 0 ? "+" : ""}${cents} cents`
            : guidance}
        </p>
        {heard ? (
          <p className="mt-1 text-center text-sm font-medium" style={{ color: inTune ? tool.accent : "#FAFAFA" }}>
            {guidance}
          </p>
        ) : null}
      </div>

      {status === "denied" ? (
        <p className="mt-4 text-center text-sm text-muted">Microphone access is off. Allow it in the browser to tune.</p>
      ) : null}
      {status === "missing" ? (
        <p className="mt-4 text-center text-sm text-muted">No microphone was found on this device.</p>
      ) : null}

      <div className="mt-6 space-y-2">
        <PrimaryButton type="button" onClick={() => void listen()}>
          {status === "listening" ? "Stop" : "Listen"}
        </PrimaryButton>
        {selectedTarget ? (
          <button
            type="button"
            onClick={playReference}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-elevated text-[15px] font-medium text-ink transition active:scale-[0.98]"
          >
            {playing ? "Stop reference" : `Play ${selectedTarget.label} reference`}
          </button>
        ) : null}
      </div>
    </ToolScreen>
  );
}
