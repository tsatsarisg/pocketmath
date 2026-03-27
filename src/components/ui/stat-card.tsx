import { cn } from "@/lib/utils";

export function StatCard({
  label,
  amount,
  sub,
  hero,
  className,
}: {
  label: string;
  amount: string;
  sub?: string;
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
      {sub && (
        <p
          className={cn(
            "text-[0.75rem] mt-0.5",
            hero ? "text-net-accent/60 mt-1" : "text-muted-foreground",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
