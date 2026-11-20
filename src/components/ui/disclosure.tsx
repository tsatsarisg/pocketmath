import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Disclosure({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-xl border border-border bg-background/60">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="space-y-4 border-t border-border px-3.5 py-4">
        {children}
      </div>
    </details>
  );
}
