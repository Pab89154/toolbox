import { useEffect, useRef, useState } from "react";
import { ToolScreen } from "../components/ToolScreen";
import { ChoiceChip, FieldLabel, PrimaryButton } from "../components/ui";
import { getTool } from "../data/tools";

const tool = getTool("metronome");
const BEATS = [2, 3, 4, 6];

function playClick(ctx: AudioContext, time: number, accent: boolean) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(accent ? 1400 : 900, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.22 : 0.12, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.06);
}

export function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const bpmRef = useRef(bpm);
  const beatsRef = useRef(beatsPerBar);
  const ctxRef = useRef<AudioContext | null>(null);
  bpmRef.current = bpm;
  beatsRef.current = beatsPerBar;

  useEffect(() => {
    if (!playing || !ctxRef.current) return;
    const ctx = ctxRef.current;
    let next = ctx.currentTime + 0.05;
    let index = 0;
    let timer = 0;
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return;
      while (next < ctx.currentTime + 0.15) {
        const shown = index % beatsRef.current;
        playClick(ctx, next, shown === 0);
        const delay = Math.max(0, (next - ctx.currentTime) * 1000);
        window.setTimeout(() => {
          if (!cancelled) setBeat(shown);
        }, delay);
        next += 60 / bpmRef.current;
        index += 1;
      }
      timer = window.setTimeout(schedule, 25);
    };

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [playing]);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  function toggle() {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (playing) {
      setPlaying(false);
      setBeat(0);
      return;
    }
    void ctxRef.current.resume();
    setBeat(0);
    setPlaying(true);
  }

  const pct = ((bpm - 40) / 200) * 100;

  return (
    <ToolScreen tool={tool}>
      <div className="flex flex-col items-center">
        <p className="text-7xl font-semibold tabular-nums tracking-tight">{bpm}</p>
        <p className="mt-1 text-sm text-muted">BPM</p>
        <div className="mt-8 flex h-16 items-end gap-3" aria-hidden="true">
          {Array.from({ length: beatsPerBar }, (_, index) => {
            const active = playing && beat === index;
            return (
              <span
                key={index}
                className="h-3.5 w-3.5 rounded-full transition duration-75"
                style={{
                  background: active ? tool.accent : "#27272A",
                  transform: active ? "scale(1.45)" : "scale(1)",
                  boxShadow: active ? `0 0 0 7px ${tool.accent}33` : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <FieldLabel>Tempo</FieldLabel>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease tempo"
            onClick={() => setBpm((value) => Math.max(40, value - 1))}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-elevated text-lg text-ink active:scale-[0.98]"
          >
            −
          </button>
          <input
            className="tempo"
            type="range"
            min={40}
            max={240}
            value={bpm}
            aria-label="Tempo"
            style={{ ["--pct" as string]: `${pct}%` }}
            onChange={(event) => setBpm(Number(event.target.value))}
          />
          <button
            type="button"
            aria-label="Increase tempo"
            onClick={() => setBpm((value) => Math.min(240, value + 1))}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-elevated text-lg text-ink active:scale-[0.98]"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6">
        <FieldLabel>Beats per bar</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {BEATS.map((value) => (
            <ChoiceChip
              key={value}
              type="button"
              selected={beatsPerBar === value}
              onClick={() => setBeatsPerBar(value)}
            >
              {value}
            </ChoiceChip>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton type="button" onClick={toggle}>
          {playing ? "Stop" : "Play"}
        </PrimaryButton>
      </div>
    </ToolScreen>
  );
}
