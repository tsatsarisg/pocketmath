import { cn } from "@/lib/utils";

export function StatCard({
  label,
  amount,
  sub,
  badge,
  hero,
  className,
}: {
  label: string;
  amount: string;
  sub?: string;
  badge?: string | undefined;
  hero?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-label={`${label}: ${amount}`}
      className={cn(
        "min-w-0 rounded-xl border",
        hero
          ? "bg-net-accent-muted border-net-accent/25 p-4 sm:p-5"
          : "bg-background border-border p-3 sm:p-4",
        className,
      )}
    >
      <p
        className={cn(
          "text-xs leading-snug font-medium",
          hero ? "text-net-accent" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "tabular-nums [overflow-wrap:anywhere] leading-tight tracking-tight mt-1",
          hero
            ? "text-[clamp(1.75rem,7vw,2.75rem)] font-bold text-net-accent"
            : "text-lg font-semibold text-foreground sm:text-xl",
        )}
      >
        {amount}
      </p>
      {badge && (
        <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full bg-net-accent/10 ring-1 ring-net-accent/20 text-[0.6875rem] font-medium text-net-accent tabular-nums">
          {badge}
        </span>
      )}
      {sub && (
        <p
          className={cn(
            "text-[0.75rem] mt-0.5",
            hero ? "text-net-accent mt-1" : "text-muted-foreground",
            badge && "mt-1.5",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
