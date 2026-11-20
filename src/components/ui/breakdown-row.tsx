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
  sub?: string | undefined;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-2.5 py-2.5",
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
          <span className="block text-[0.6875rem] font-normal text-muted-foreground mt-0.5">
            {sub}
          </span>
        )}
      </dt>
      <dd
        className={cn(
          "text-[0.8125rem] tabular-nums min-w-0 max-w-[55%] text-right [overflow-wrap:anywhere] font-medium",
          highlight ? "text-foreground font-semibold" : "text-muted-foreground",
          negative && "text-destructive",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
