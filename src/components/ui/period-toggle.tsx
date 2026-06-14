import * as React from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Period } from "@/types/calculator";

export function PeriodToggle({
  value,
  onChange,
}: {
  value: Period;
  onChange: (v: Period) => void;
}) {
  const { t } = useTranslation();
  const periods = ["monthly", "annual"] as const;
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const currentIndex = periods.indexOf(value);
    let nextIndex: number;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % periods.length;
    } else {
      nextIndex = (currentIndex - 1 + periods.length) % periods.length;
    }
    onChange(periods[nextIndex]!);
    const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[nextIndex]?.focus();
  }

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Περίοδος"
      className="inline-flex rounded-xl bg-secondary/60 p-1 gap-0.5"
      onKeyDown={handleKeyDown}
    >
      {periods.map((p) => (
        <button
          key={p}
          role="radio"
          aria-checked={value === p}
          tabIndex={value === p ? 0 : -1}
          onClick={() => onChange(p)}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
            value === p
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(`period.${p}`)}
        </button>
      ))}
    </div>
  );
}
