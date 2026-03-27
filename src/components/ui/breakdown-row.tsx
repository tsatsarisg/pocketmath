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
        "flex items-baseline justify-between gap-4 py-3",
        "border-b border-border/30 last:border-0",
        highlight && "font-medium",
      )}
    >
      <dt
        className={cn(
          "text-[0.8125rem] leading-snug",
          highlight ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        {sub && (
          <span className="block text-[0.6875rem] font-normal text-muted-foreground/50 mt-0.5">
            {sub}
          </span>
        )}
      </dt>
      <dd
        className={cn(
          "text-[0.8125rem] tabular-nums text-right shrink-0 font-medium",
          highlight ? "text-foreground font-semibold" : "text-muted-foreground",
          negative && "text-destructive",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
