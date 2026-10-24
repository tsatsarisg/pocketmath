"use client";

import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mode, Period } from "@/types/calculator";
import { useCalculator } from "@/hooks/use-calculator";
import { MODE_REGISTRY } from "@/components/calculator/mode-registry";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PeriodToggle } from "@/components/ui/period-toggle";
import { StatCard } from "@/components/ui/stat-card";

export default function HomePage() {
  const { t } = useTranslation();
  const breakdownId = useId();

  const [mode, setMode] = useState<Mode>("employee");
  const [period, setPeriod] = useState<Period>("monthly");
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const calc = useCalculator(mode, period);
  const { stats, hasUserInput, hasResult } = calc;
  const errorMessage =
    mode === "mplokaki" && !calc.mp.qualified
      ? t("inputs.article12Required")
      : t("results.invalid");
  const modeConfig = MODE_REGISTRY[mode];

  const modes = (Object.keys(MODE_REGISTRY) as Mode[]).map((id) => ({
    id,
    label: t(MODE_REGISTRY[id].labelKey),
  }));

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        {t("a11y.skipToContent")}
      </a>

      <div id="main-content" className="mx-auto max-w-[640px] space-y-8">
        {/* Hero */}
        <section className="space-y-2 text-center pt-2">
          <h1 className="text-[1.875rem] sm:text-[2rem] font-bold tracking-tight text-foreground">
            {t("hero.headline")}
          </h1>
          <p className="text-muted-foreground text-[0.875rem] max-w-sm mx-auto">
            {t("hero.subtitle")}
          </p>
        </section>

        {/* Mode selector */}
        <div className="flex justify-center">
          <SegmentedControl
            label={t("a11y.employment")}
            options={modes}
            value={mode}
            onChange={(v) => {
              setMode(v);
              setBreakdownOpen(false);
            }}
          />
        </div>
        <div aria-live="polite" className="sr-only" aria-atomic="true">
          {t(modeConfig.a11yKey)}
        </div>

        {/* Inputs */}
        <div className="rounded-2xl bg-secondary/40 p-5 sm:p-6">
          {modeConfig.renderInputs(calc)}
        </div>

        {/* Empty state */}
        {!hasUserInput && (
          <div className="rounded-2xl bg-secondary/20 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {t("results.emptyState")}
            </p>
          </div>
        )}

        {/* Results */}
        <div role="status" className="sr-only" aria-atomic="true">
          {hasResult && stats
            ? `${stats.netLabel}: ${stats.netValue} ${stats.netSub}`
            : hasUserInput
              ? errorMessage
              : ""}
        </div>
        {hasUserInput && !hasResult && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
        <div>
          {hasResult && stats && (
            <section className="space-y-4" aria-label={t("results.headline")}>
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  {t("results.headline")}
                </p>
                <PeriodToggle value={period} onChange={setPeriod} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatCard
                  label={stats.netLabel}
                  amount={stats.netValue}
                  sub={stats.netSub}
                  badge={
                    mode === "employee" && period === "monthly"
                      ? t("results.paycheckBadge")
                      : undefined
                  }
                  hero
                  className="sm:col-span-2"
                />
                <StatCard
                  label={stats.grossLabel}
                  amount={stats.grossValue}
                  sub={stats.grossSub}
                />
                <StatCard
                  label={stats.taxLabel}
                  amount={stats.taxValue}
                  sub={stats.taxSub}
                />
              </div>

              {/* Expandable breakdown */}
              <div className="rounded-2xl bg-secondary/30 overflow-hidden transition-colors duration-200">
                <button
                  onClick={() => {
                    setBreakdownOpen((o) => !o);
                  }}
                  aria-expanded={breakdownOpen}
                  aria-controls={breakdownId}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors duration-200"
                >
                  <span>
                    {breakdownOpen
                      ? t("results.hideBreakdown")
                      : t("results.showBreakdown")}
                  </span>
                  <ChevronDown
                    width={16}
                    height={16}
                    strokeWidth={2.5}
                    className={cn(
                      "text-muted-foreground transition-transform duration-300 ease-out",
                      breakdownOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>

                <div id={breakdownId} hidden={!breakdownOpen}>
                  <div className="px-5 pb-5 pt-1">
                    {modeConfig.renderBreakdown(calc, period)}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center px-2">
                {t("disclaimer")}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
