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
    <label className="flex items-start gap-3 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        className="mt-1 h-4 w-4 shrink-0 accent-primary"
      />
      <span>{children}</span>
    </label>
  );
}
