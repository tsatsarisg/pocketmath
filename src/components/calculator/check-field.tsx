import type { ReactNode } from "react";

export function CheckField({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-snug text-foreground transition-colors hover:border-primary/50 focus-within:border-primary has-checked:border-primary/45 has-checked:bg-accent/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        className="mt-px size-5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <span>{children}</span>
    </label>
  );
}
