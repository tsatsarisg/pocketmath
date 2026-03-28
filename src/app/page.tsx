"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Mode } from "@/types/calculator";
import { useCalculator } from "@/hooks/use-calculator";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PeriodToggle } from "@/components/ui/period-toggle";
import { StatCard } from "@/components/ui/stat-card";
import { EmployeeInputs } from "@/components/calculator/employee-inputs";
import { SelfEmployedInputs } from "@/components/calculator/self-employed-inputs";
import { MplokakiInputs } from "@/components/calculator/mplokaki-inputs";
import { EmployeeBreakdown } from "@/components/calculator/employee-breakdown";
import { SelfEmployedBreakdown } from "@/components/calculator/self-employed-breakdown";
import { MplokakiBreakdown } from "@/components/calculator/mplokaki-breakdown";

type Period = "monthly" | "annual";

export default function HomePage() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<Mode>("employee");
  const [period, setPeriod] = useState<Period>("monthly");
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const { emp, se, mp, empResult, seResult, mpResult, stats, hasUserInput, hasResult } =
    useCalculator(mode, period);

  const MODES: { id: Mode; label: string }[] = [
    { id: "employee", label: t("modes.employee") },
    { id: "self-employed", label: t("modes.selfEmployed") },
    { id: "mplokaki", label: t("modes.mplokaki") },
  ];

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
            options={MODES}
            value={mode}
            onChange={(v) => {
              setMode(v);
              setBreakdownOpen(false);
            }}
          />
        </div>
        <div aria-live="polite" className="sr-only" aria-atomic="true">
          {mode === "employee" ? t("a11y.modeEmployee")
           : mode === "self-employed" ? t("a11y.modeSelfEmployed")
           : t("a11y.modeMplokaki")}
        </div>

        {/* Inputs */}
        <div className="rounded-2xl bg-secondary/40 p-5 sm:p-6">
          {mode === "employee" && (
            <EmployeeInputs
              monthly={emp.monthly}
              setMonthly={emp.setMonthly}
              children={emp.children}
              setChildren={emp.setChildren}
              age={emp.age}
              setAge={emp.setAge}
            />
          )}
          {mode === "self-employed" && (
            <SelfEmployedInputs
              monthly={se.monthly}
              setMonthly={se.setMonthly}
              expenses={se.expenses}
              setExpenses={se.setExpenses}
              efka={se.efka}
              setEfka={se.setEfka}
              years={se.years}
              setYears={se.setYears}
              age={se.age}
              setAge={se.setAge}
            />
          )}
          {mode === "mplokaki" && (
            <MplokakiInputs
              monthly={mp.monthly}
              setMonthly={mp.setMonthly}
              efka={mp.efka}
              setEfka={mp.setEfka}
              children={mp.children}
              setChildren={mp.setChildren}
              age={mp.age}
              setAge={mp.setAge}
            />
          )}
        </div>

        {/* Empty state */}
        {!hasUserInput && (
          <div className="rounded-2xl bg-secondary/20 py-12 text-center">
            <p className="text-sm text-muted-foreground/60">
              {t("results.emptyState")}
            </p>
          </div>
        )}

        {/* Results */}
        <div aria-live="polite" aria-atomic="true">
          {hasResult && stats && (
            <section className="space-y-4" aria-label={t("results.headline")}>
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  {t("results.headline")}
                </p>
                <PeriodToggle value={period} onChange={setPeriod} />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <StatCard
                  label={stats.netLabel}
                  amount={stats.netValue}
                  sub={stats.netSub}
                  badge={mode === "employee" && period === "monthly" ? t("results.paycheckBadge") : undefined}
                  hero
                  className="order-first sm:order-last"
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
                  onClick={() => setBreakdownOpen((o) => !o)}
                  aria-expanded={breakdownOpen}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors duration-200"
                >
                  <span>{breakdownOpen ? t("results.hideBreakdown") : t("results.showBreakdown")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                      "text-muted-foreground/60 transition-transform duration-300 ease-out",
                      breakdownOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    breakdownOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  <div className="px-5 pb-5 pt-1">
                    {mode === "employee" && empResult && (
                      <EmployeeBreakdown result={empResult} period={period} />
                    )}
                    {mode === "self-employed" && seResult && (
                      <SelfEmployedBreakdown result={seResult} period={period} />
                    )}
                    {mode === "mplokaki" && mpResult && (
                      <MplokakiBreakdown result={mpResult} period={period} />
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[0.6875rem] text-muted-foreground/50 text-center px-2">
                {t("disclaimer")}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
