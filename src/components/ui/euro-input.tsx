import * as React from "react";
import { Input } from "@/components/ui/input";

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
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
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-0 flex h-full w-9 items-center justify-center text-sm text-muted-foreground select-none border-r border-input">
        €
      </span>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
        }}
        placeholder={placeholder ?? "0"}
        className="pl-11"
      />
    </div>
  );
}
