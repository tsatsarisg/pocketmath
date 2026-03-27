import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card
      aria-label={`${label}: ${amount}`}
      className={cn(
        "flex-1 min-w-0 transition-shadow duration-200",
        hero
          ? "bg-net-accent-muted ring-2 ring-net-accent"
          : "hover:shadow-md",
        className,
      )}
    >
      <CardContent
        className={cn(
          "flex flex-col",
          hero ? "pt-5 pb-5 gap-1.5" : "pt-4 pb-4 gap-1",
        )}
      >
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-widest",
            hero ? "text-net-accent" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "font-bold tabular-nums leading-none tracking-tight",
            hero
              ? "text-[2.75rem] sm:text-[2.25rem] text-net-accent"
              : "text-2xl text-foreground",
          )}
        >
          {amount}
        </p>
        {sub && (
          <p
            className={cn(
              "text-xs tabular-nums",
              hero ? "text-net-accent/70" : "text-muted-foreground",
            )}
          >
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
