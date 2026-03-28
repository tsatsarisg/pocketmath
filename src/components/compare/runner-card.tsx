import { useTranslation } from "react-i18next";
import { fmt, fmtPct } from "@/lib/format";
import { MetaPill } from "./meta-pill";
import type { RankedEntry } from "@/types/compare";

export function RunnerCard({ entry }: { entry: RankedEntry }) {
  const { t } = useTranslation();
  const isEmployee = entry.key === "employee";

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border/50 p-4 sm:p-5">
      <p className="text-[0.8125rem] font-semibold text-foreground mb-3">{entry.label}</p>

      <div className="mb-3">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {t("compare.annualNet")}
        </p>
        <p className="text-[1.5rem] font-bold tabular-nums leading-tight tracking-tight text-foreground mt-0.5">
          {fmt(entry.data.annualNet)}
        </p>
      </div>

      <div className="h-1.5 rounded-full bg-border/40 mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-muted-foreground/30 transition-all duration-500"
          style={{ width: `${entry.barWidth}%` }}
        />
      </div>

      <div className="space-y-1.5 border-t border-border/30 pt-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[0.75rem] text-muted-foreground">{t("compare.monthlyEquiv")}</p>
          <p className="text-[0.8125rem] font-medium tabular-nums text-foreground">
            {fmt(entry.data.annualNet / 12)}
          </p>
        </div>
        {isEmployee && (
          <div className="flex items-baseline justify-between">
            <span className="flex items-center gap-1.5">
              <p className="text-[0.75rem] text-muted-foreground">{t("compare.actualPaycheck")}</p>
              <MetaPill className="text-primary bg-primary/10">14×</MetaPill>
            </span>
            <p className="text-[0.8125rem] font-medium tabular-nums text-foreground">
              {fmt(entry.data.monthlyNet)}
            </p>
          </div>
        )}
        <div className="flex items-baseline justify-between">
          <p className="text-[0.75rem] text-muted-foreground">{t("compare.effectiveTaxRate")}</p>
          <p className="text-[0.8125rem] font-medium tabular-nums text-muted-foreground">
            {fmtPct(entry.data.effectiveTaxRate)}
          </p>
        </div>
      </div>
    </div>
  );
}
