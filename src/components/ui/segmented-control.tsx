import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  compact?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  compact = false,
}: SegmentedControlProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = options.findIndex((option) => option.id === value);
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % options.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (index - 1 + options.length) % options.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = options.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const option = options[next];
    if (!option) return;
    onChange(option.id);
    ref.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn("flex rounded-xl bg-secondary/60 p-1 gap-0.5", !compact && "w-full sm:w-auto")}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          tabIndex={value === option.id ? 0 : -1}
          onClick={() => onChange(option.id)}
          className={cn(
            "min-w-0 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            compact ? "px-2.5 py-1.5 text-xs" : "flex-1 px-2 sm:px-5 py-2.5 text-sm",
            value === option.id
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
