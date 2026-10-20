export type Operator = "+" | "−" | "×" | "÷";

export type CalcState = {
  display: string;
  acc: number | null;
  op: Operator | null;
  overwrite: boolean;
  error: boolean;
};

export const initialCalc: CalcState = {
  display: "0",
  acc: null,
  op: null,
  overwrite: true,
  error: false,
};

function format(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  const rounded = Math.round(n * 1e10) / 1e10;
  let text = String(rounded);
  if (text.length > 12) text = rounded.toExponential(6).replace("+", "");
  return text;
}

function apply(a: number, op: Operator, b: number): number | "err" {
  if (op === "+") return a + b;
  if (op === "−") return a - b;
  if (op === "×") return a * b;
  return b === 0 ? "err" : a / b;
}

export function inputDigit(state: CalcState, digit: string): CalcState {
  if (state.error) return { ...initialCalc, display: digit, overwrite: false };
  if (state.overwrite) return { ...state, display: digit, overwrite: false };
  if (state.display.replace("-", "").replace(".", "").length >= 12) return state;
  if (state.display === "0") return { ...state, display: digit };
  return { ...state, display: state.display + digit };
}

export function inputDot(state: CalcState): CalcState {
  if (state.error) return { ...initialCalc, display: "0.", overwrite: false };
  if (state.overwrite) return { ...state, display: "0.", overwrite: false };
  if (state.display.includes(".")) return state;
  return { ...state, display: `${state.display}.` };
}

export function setOperator(state: CalcState, op: Operator): CalcState {
  if (state.error) return state;
  const current = Number(state.display);
  if (state.op && state.acc !== null && !state.overwrite) {
    const result = apply(state.acc, state.op, current);
    if (result === "err") return { ...initialCalc, display: "Error", error: true };
    return { display: format(result), acc: result, op, overwrite: true, error: false };
  }
  return { ...state, acc: current, op, overwrite: true };
}

export function equals(state: CalcState): CalcState {
  if (state.error || !state.op || state.acc === null) return state;
  const result = apply(state.acc, state.op, Number(state.display));
  if (result === "err") return { ...initialCalc, display: "Error", error: true };
  return { display: format(result), acc: null, op: null, overwrite: true, error: false };
}

export function toggleSign(state: CalcState): CalcState {
  if (state.error || state.display === "0") return state;
  const display = state.display.startsWith("-") ? state.display.slice(1) : `-${state.display}`;
  return { ...state, display };
}

export function percent(state: CalcState): CalcState {
  if (state.error) return state;
  return { ...state, display: format(Number(state.display) / 100), overwrite: true };
}

export function backspace(state: CalcState): CalcState {
  if (state.error || state.overwrite) return { ...initialCalc };
  const next =
    state.display.length <= 1 || (state.display.startsWith("-") && state.display.length === 2)
      ? "0"
      : state.display.slice(0, -1);
  return { ...state, display: next };
}
