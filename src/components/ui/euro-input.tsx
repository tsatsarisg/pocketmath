import * as React from "react";
import { Input } from "@/components/ui/input";

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function sanitize(raw: string): string {
  // Strip anything that's not a digit or decimal point
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return cleaned;
  // Clamp to a reasonable upper bound
  if (num > 10_000_000) return "10000000";
  return cleaned;
}

export function EuroInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center min-w-0">
      <span className="pointer-events-none absolute left-0 flex h-full w-10 items-center justify-center text-sm font-medium text-muted-foreground/70 select-none">
        €
      </span>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={10000000}
        value={value}
        onChange={(e) => onChange(sanitize(e.target.value))}
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
        }}
        placeholder={placeholder ?? "0"}
        className="pl-10"
      />
    </div>
  );
}
