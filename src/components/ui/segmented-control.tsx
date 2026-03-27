import * as React from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Mode } from "@/types/calculator";

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { id: Mode; label: string }[];
  value: Mode;
  onChange: (v: Mode) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const currentIndex = options.findIndex((opt) => opt.id === value);
    let nextIndex: number;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % options.length;
    } else {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    }
    onChange(options[nextIndex]!.id);
    const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[nextIndex]?.focus();
  }

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Τρόπος απασχόλησης"
      className="flex w-full max-w-xs sm:w-auto rounded-xl bg-muted p-1 gap-0.5"
      onKeyDown={handleKeyDown}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          role="radio"
          aria-checked={value === opt.id}
          tabIndex={value === opt.id ? 0 : -1}
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex-1 rounded-lg px-3 sm:px-5 py-2 text-sm font-medium transition-all duration-150",
            value === opt.id
              ? "bg-background text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
