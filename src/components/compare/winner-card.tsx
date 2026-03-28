import { useTranslation } from "react-i18next";
import { fmt, fmtPct } from "@/lib/format";
import { MetaPill } from "./meta-pill";
import type { RankedEntry } from "@/types/compare";

export function WinnerCard({ entry }: { entry: RankedEntry }) {
  const { t } = useTranslation();
  const isEmployee = entry.key === "employee";

  return (
    <div className="rounded-2xl bg-net-accent-muted ring-2 ring-net-accent/30 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[0.9375rem] font-semibold text-foreground">{entry.label}</p>
        <MetaPill className="text-net-accent bg-net-accent/10">
          {t("compare.bestNet")}
        </MetaPill>
      </div>

      <div className="mb-4">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-net-accent/70">
          {t("compare.annualNetLabel")}
        </p>
        <p className="text-[2.5rem] sm:text-[2.75rem] font-extrabold tabular-nums leading-none tracking-tight text-net-accent mt-1">
          {fmt(entry.data.annualNet)}
        </p>
      </div>

      <div className="space-y-2 border-t border-net-accent/20 pt-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[0.8125rem] text-net-accent/70">{t("compare.monthlyEquiv")}</p>
          <p className="text-[0.9375rem] font-semibold tabular-nums text-net-accent">
            {fmt(entry.data.annualNet / 12)}
          </p>
        </div>
        {isEmployee && (
          <div className="flex items-baseline justify-between">
            <span className="flex items-center gap-1.5">
              <p className="text-[0.8125rem] text-net-accent/70">{t("compare.actualPaycheck")}</p>
              <MetaPill className="text-primary bg-primary/10">14×</MetaPill>
            </span>
            <p className="text-[0.9375rem] font-semibold tabular-nums text-net-accent">
              {fmt(entry.data.monthlyNet)}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-net-accent/20">
        <div>
          <p className="text-[0.6875rem] text-net-accent/60">{t("compare.totalTaxes")}</p>
          <p className="text-[0.8125rem] font-medium tabular-nums text-net-accent/80">
            {fmt(entry.data.totalTaxesAnnual)}
          </p>
        </div>
        <div>
          <p className="text-[0.6875rem] text-net-accent/60">{t("compare.effectiveTaxRate")}</p>
          <p className="text-[0.8125rem] font-medium tabular-nums text-net-accent/80">
            {fmtPct(entry.data.effectiveTaxRate)}
          </p>
        </div>
      </div>
    </div>
  );
}
