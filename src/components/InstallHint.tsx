import { useState } from "react";
import { CloseIcon, ShareIcon } from "./Icons";

const DISMISS_KEY = "toolbox.install-dismissed";

function shouldShow() {
  try {
    const ua = navigator.userAgent;
    const isIos =
      /iphone|ipad|ipod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!isIos) return false;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return false;
    return localStorage.getItem(DISMISS_KEY) !== "1";
  } catch {
    return false;
  }
}

export function InstallHint() {
  const [visible, setVisible] = useState(shouldShow);

  if (!visible) return null;

  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
      <ShareIcon className="h-6 w-6 shrink-0 text-muted" />
      <p className="min-w-0 flex-1 text-sm leading-snug">
        <span className="block font-medium text-ink">Add Toolbox to your Home Screen</span>
        <span className="mt-0.5 block text-muted">Tap Share, then “Add to Home Screen”.</span>
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          try {
            localStorage.setItem(DISMISS_KEY, "1");
          } catch {
            // Private mode: dismiss for this visit only.
          }
          setVisible(false);
        }}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
