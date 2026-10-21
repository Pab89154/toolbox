import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { InstallHint } from "../components/InstallHint";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { SearchIcon, CloseIcon, ToolIcon } from "../components/Icons";
import { Screen } from "../components/ui";
import { tools } from "../data/tools";
import { useTheme } from "../lib/theme";

export function Home() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Toolbox";
  }, []);

  const q = query.trim().toLowerCase();
  const visible = tools.filter(
    (tool) => tool.name.toLowerCase().includes(q) || tool.subtitle.toLowerCase().includes(q),
  );

  return (
    <Screen>
      <header className="flex items-center gap-3">
        <Logo />
        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] font-semibold leading-tight">Toolbox</h1>
          <p className="text-[13px] text-muted">Everyday tools. One place.</p>
        </div>
        <ThemeToggle />
        <button
          type="button"
          aria-label="Focus search"
          onClick={() => searchRef.current?.focus()}
          className="grid h-10 w-10 place-items-center rounded-xl text-muted transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </header>

      <label className="mt-5 flex h-12 items-center gap-2 rounded-2xl border border-line bg-card px-3">
        <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools..."
          aria-label="Search tools"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-full w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              searchRef.current?.focus();
            }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        ) : null}
      </label>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">No tools match</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {visible.map((tool) => (
            <li key={tool.id}>
              <Link
                to={tool.path}
                className="flex min-h-[112px] flex-col justify-between rounded-2xl border border-line bg-card p-4 transition active:scale-[0.98] hover:border-line-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span style={{ color: theme === "dark" ? tool.accent : tool.accentLight }}>
                  <ToolIcon id={tool.id} className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-[15px] font-medium leading-tight">{tool.name}</span>
                  <span className="mt-1 block text-[13px] text-muted">{tool.subtitle}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <InstallHint />

      <p className="mt-6 text-center text-[13px] text-muted">
        {visible.length} {visible.length === 1 ? "tool" : "tools"} · One simple workspace
      </p>
    </Screen>
  );
}
