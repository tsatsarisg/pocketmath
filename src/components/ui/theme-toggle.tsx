"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  // Sync state with the actual DOM class on mount — the inline script in
  // <head> has already applied the correct class before React hydrates.
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  });

  function toggle() {
    const html = document.documentElement;
    const next = !isDark;

    if (next) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(next);
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={toggle}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-xl",
        "text-muted-foreground hover:text-foreground hover:bg-secondary/70",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {isDark ? (
        <Sun size={16} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}
