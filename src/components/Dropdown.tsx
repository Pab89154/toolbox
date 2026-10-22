import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronIcon } from "./Icons";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  disabled?: boolean;
};

/**
 * iOS-menu-style dropdown that replaces the OS <select> popup,
 * so the control looks and feels like part of the app in both themes.
 */
export function Dropdown({ value, options, onChange, ariaLabel, disabled }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    // Close on any pointer down outside the control.
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[active] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(options.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        // Typeahead: jump to the first option starting with the typed letter.
        if (event.key.length === 1) {
          const letter = event.key.toLowerCase();
          const start = options.findIndex((option) => option.label.toLowerCase().startsWith(letter));
          if (start >= 0) setActive(start);
        }
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-line bg-card px-4 text-left text-base text-ink outline-none transition active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-40"
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
        <ChevronIcon className="h-4 w-4 shrink-0 text-muted" />
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className="dropdown-in absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-2xl border border-line bg-card/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => choose(index)}
                  onPointerEnter={() => setActive(index)}
                  className={`flex h-11 w-full items-center gap-2 rounded-xl px-2.5 text-left text-base text-ink transition ${
                    index === active ? "bg-elevated" : ""
                  }`}
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center" style={{ color: "inherit" }}>
                    {isSelected ? <CheckIcon className="h-4 w-4" /> : null}
                  </span>
                  <span className={`min-w-0 flex-1 truncate ${isSelected ? "font-semibold" : ""}`}>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
