import { cn } from "@/lib/utils";

export function BreakdownRow({
  label,
  value,
  sub,
  highlight,
  negative,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 py-2.5",
        "border-b border-border/40 last:border-0",
        highlight && "font-medium",
      )}
    >
      <dt
        className={cn(
          "text-sm leading-snug",
          highlight ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        {sub && (
          <span className="block text-xs font-normal text-muted-foreground/60 mt-0.5">
            {sub}
          </span>
        )}
      </dt>
      <dd
        className={cn(
          "text-sm tabular-nums text-right shrink-0 font-medium",
          highlight ? "text-foreground" : "text-muted-foreground",
          negative && "text-destructive",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
