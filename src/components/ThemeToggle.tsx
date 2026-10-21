import { useTheme } from "../lib/theme";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={theme === "light"}
      title={`Switch to ${next} mode`}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
