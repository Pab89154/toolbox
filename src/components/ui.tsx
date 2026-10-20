import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[720px] px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

export function PrimaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`flex h-14 w-full items-center justify-center rounded-2xl bg-ink text-[17px] font-semibold text-bg transition active:scale-[0.98] disabled:opacity-40 ${className}`}
    />
  );
}

export function ChoiceChip({
  selected,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }) {
  return (
    <button
      {...props}
      className={`h-11 min-w-11 rounded-xl px-3 text-sm font-medium transition active:scale-[0.98] ${
        selected ? "bg-ink text-bg" : "border border-line bg-elevated text-muted"
      } ${className}`}
    />
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[13px] text-muted">{children}</p>;
}
