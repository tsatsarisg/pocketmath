import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { fmt } from "@/lib/format";
import type { RankedEntry } from "@/types/compare";

export function NetBar({ ranked }: { ranked: RankedEntry[] }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-secondary/30 p-4 sm:p-5 space-y-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {t("compare.annualComparison")}
      </p>
      {ranked.map((entry) => (
        <div key={entry.key} className="space-y-1">
          <div className="flex items-baseline justify-between">
            <p className="text-[0.8125rem] font-medium text-foreground">{entry.label}</p>
            <p className="text-[0.8125rem] font-semibold tabular-nums text-foreground">
              {fmt(entry.data.annualNet)}
            </p>
          </div>
          <div className="h-2 rounded-full bg-border/30 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                entry.rank === 0 ? "bg-net-accent" : "bg-muted-foreground/30",
              )}
              style={{ width: `${entry.barWidth}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
