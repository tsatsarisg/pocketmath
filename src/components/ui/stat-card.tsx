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
  badge?: string;
  hero?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-label={`${label}: ${amount}`}
      className={cn(
        "flex-1 min-w-0 rounded-2xl transition-all duration-300",
        hero
          ? "bg-net-accent-muted ring-2 ring-net-accent/30 p-5 sm:p-6"
          : "bg-card ring-1 ring-border/50 p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5",
        className,
      )}
    >
      <p
        className={cn(
          "text-[0.6875rem] font-semibold uppercase tracking-[0.1em]",
          hero ? "text-net-accent" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "tabular-nums leading-none tracking-tight mt-1",
          hero
            ? "text-[3rem] sm:text-[2.5rem] font-extrabold text-net-accent"
            : "text-[1.75rem] font-bold text-foreground",
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
            hero ? "text-net-accent/60 mt-1" : "text-muted-foreground",
            badge && "mt-1.5",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
