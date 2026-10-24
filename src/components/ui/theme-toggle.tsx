"use client";

import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    observer.disconnect();
  };
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => true;

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  function toggle() {
    const next = !getSnapshot();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* Theme still works when storage is unavailable. */
    }
  }
  return (
    <button
      type="button"
      aria-label={t("a11y.theme")}
      aria-pressed={isDark}
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Sun size={16} aria-hidden="true" className="hidden dark:block" />
      <Moon size={16} aria-hidden="true" className="block dark:hidden" />
    </button>
  );
}
