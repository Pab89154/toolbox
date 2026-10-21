import { useCallback, useEffect, useState } from "react";
import type { Tool } from "../data/tools";

export type Theme = "dark" | "light";

const STORAGE_KEY = "toolbox.theme";

const THEME_COLORS: Record<Theme, string> = {
  dark: "#030308",
  light: "#F4F4F5",
};

export function resolveTheme(): Theme {
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") return current;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Private mode: fall through to the system preference.
  }
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = THEME_COLORS[theme];
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode: theme applies for this visit only.
  }
  window.dispatchEvent(new CustomEvent<Theme>("toolbox-theme-change", { detail: theme }));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(resolveTheme);

  // Keep every useTheme() instance (toggle, logo, …) in sync.
  useEffect(() => {
    const onChange = () => setTheme(resolveTheme());
    window.addEventListener("toolbox-theme-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("toolbox-theme-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = resolveTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }, []);

  return { theme, toggleTheme };
}

/** The tool's accent, adjusted for the active theme. */
export function useToolAccent(tool: Tool) {
  const { theme } = useTheme();
  return theme === "dark" ? tool.accent : tool.accentLight;
}
