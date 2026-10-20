import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Tool } from "../data/tools";
import { BackIcon, ToolIcon } from "./Icons";
import { Screen } from "./ui";

export function ToolScreen({ tool, children }: { tool: Tool; children: ReactNode }) {
  useEffect(() => {
    document.title = `${tool.name} · Toolbox`;
  }, [tool.name]);

  return (
    <Screen>
      <Link
        to="/"
        className="inline-flex items-center gap-1 rounded-lg text-sm text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <BackIcon className="h-5 w-5" />
        Toolbox
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <span style={{ color: tool.accent }}>
          <ToolIcon id={tool.id} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-[22px] font-semibold leading-tight">{tool.name}</h1>
          <p className="text-sm text-muted">{tool.subtitle}</p>
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </Screen>
  );
}
