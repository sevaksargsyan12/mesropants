"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "mesropants-theme";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  // Matches the blocking boot script's default (dark unless the visitor
  // explicitly chose light), so there's nothing to reconcile post-hydration
  // in the common case.
  return true;
}

function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  listeners.forEach((listener) => listener());
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Locale switches re-render the whole [lang] tree (new params server-side),
  // which can knock the imperatively-applied "dark" class off <html>. Re-assert
  // the stored preference after every render so it survives that -- cheap and
  // idempotent, no dependency array on purpose.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const dark = stored !== "light";
      if (document.documentElement.classList.contains("dark") !== dark) {
        document.documentElement.classList.toggle("dark", dark);
        listeners.forEach((listener) => listener());
      }
    } catch {
      // localStorage may be unavailable (privacy mode); leave the class as-is.
    }
  });

  return (
    <button
      type="button"
      onClick={() => setTheme(!isDark)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-current/30 transition-colors duration-200 hover:border-current hover:bg-current/10 ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
