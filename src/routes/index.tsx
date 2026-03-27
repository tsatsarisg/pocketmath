import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { calculateEmployee } from "@/lib/tax/employee";
import { calculateSelfEmployed } from "@/lib/tax/self-employed";
import { calculateMplokaki } from "@/lib/tax/mplokaki";
import type { EfkaCategoryId } from "@/lib/tax/types";
import type { Mode } from "@/types/calculator";
import { fmt } from "@/lib/format";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PeriodToggle } from "@/components/ui/period-toggle";
import { StatCard } from "@/components/ui/stat-card";
import { EmployeeInputs } from "@/components/calculator/employee-inputs";
import { SelfEmployedInputs } from "@/components/calculator/self-employed-inputs";
import { MplokakiInputs } from "@/components/calculator/mplokaki-inputs";
import { EmployeeBreakdown } from "@/components/calculator/employee-breakdown";
import { SelfEmployedBreakdown } from "@/components/calculator/self-employed-breakdown";
import { MplokakiBreakdown } from "@/components/calculator/mplokaki-breakdown";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type Period = "monthly" | "annual";

// ---------------------------------------------------------------------------
// Main calculator
// ---------------------------------------------------------------------------

function HomePage() {
  const { t } = useTranslation();

  const MODES: { id: Mode; label: string }[] = [
    { id: "employee", label: t("modes.employee") },
    { id: "self-employed", label: t("modes.selfEmployed") },
    { id: "mplokaki", label: t("modes.mplokaki") },
  ];
  // Mode
  const [mode, setMode] = useState<Mode>("employee");
  const [period, setPeriod] = useState<Period>("monthly");
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  // Employee state
  const [empMonthly, setEmpMonthly] = useState("");
  const [empChildren, setEmpChildren] = useState("0");
  const [empAge, setEmpAge] = useState("35");

  // Self-employed state
  const [seMonthly, setSeMonthly] = useState("");
  const [seExpenses, setSeExpenses] = useState("0");
  const [seEfka, setSeEfka] = useState<EfkaCategoryId>("1st");
  const [seYears, setSeYears] = useState("4");
  const [seAge, setSeAge] = useState("35");

  // Mplokaki state
  const [mpMonthly, setMpMonthly] = useState("");
  const [mpEfka, setMpEfka] = useState<EfkaCategoryId>("1st");
  const [mpChildren, setMpChildren] = useState("0");
  const [mpAge, setMpAge] = useState("35");

  // B1: Reset seEfka to "1st" when seYears changes to >5 and current value is "special"
  useEffect(() => {
    if (Number(seYears) > 5 && seEfka === "special") {
      setSeEfka("1st");
    }
  }, [seYears, seEfka]);

  // Calculations
  const empResult = useMemo(() => {
    try {
      const monthlyGross = Math.max(0, parseFloat(empMonthly) || 0);
      const children = Math.max(0, parseInt(empChildren, 10) || 0);
      const age = Math.min(120, Math.max(16, parseInt(empAge, 10) || 35));
      return calculateEmployee({ monthlyGross, children, age });
    } catch {
      return null;
    }
  }, [empMonthly, empChildren, empAge]);

  const seResult = useMemo(() => {
    try {
      const annualRevenue = Math.max(0, (parseFloat(seMonthly) || 0) * 12);
      // B2: expenses are entered per month, multiply by 12 for annual
      const annualExpenses = Math.max(0, (parseFloat(seExpenses) || 0) * 12);
      const yearsInBusiness = Math.max(1, parseInt(seYears, 10) || 4);
      const age = Math.min(120, Math.max(16, parseInt(seAge, 10) || 35));
      return calculateSelfEmployed({
        annualRevenue,
        annualExpenses,
        efkaCategory: seEfka,
        age,
        yearsInBusiness,
      });
    } catch {
      return null;
    }
  }, [seMonthly, seExpenses, seEfka, seYears, seAge]);

  const mpResult = useMemo(() => {
    try {
      const annualGrossInvoiced = Math.max(
        0,
        (parseFloat(mpMonthly) || 0) * 12,
      );
      const children = Math.max(0, parseInt(mpChildren, 10) || 0);
      const age = Math.min(120, Math.max(16, parseInt(mpAge, 10) || 35));
      return calculateMplokaki({
        annualGrossInvoiced,
        efkaCategory: mpEfka,
        children,
        age,
      });
    } catch {
      return null;
    }
  }, [mpMonthly, mpEfka, mpChildren, mpAge]);

  // Derived display values
  const stats = useMemo(() => {
    if (mode === "employee" && empResult) {
      const m = period === "monthly";
      const gross = m ? empResult.monthlyGross : empResult.annualGross;
      const tax = m
        ? empResult.annualTax / 14 + empResult.annualEmployeeSS / 14
        : empResult.annualTax + empResult.annualEmployeeSS;
      const net = m ? empResult.monthlyNet : empResult.annualNet;
      const periodLabel = m ? t("results.perMonth") : t("results.perYear");
      return {
        grossLabel: t("results.gross"),
        grossValue: fmt(gross),
        grossSub: periodLabel,
        taxLabel: t("results.taxAndContributions"),
        taxValue: fmt(tax),
        taxSub: periodLabel,
        netLabel: t("results.net"),
        netValue: fmt(net),
        netSub: periodLabel,
      };
    }
    if (mode === "self-employed" && seResult) {
      const m = period === "monthly";
      const div = m ? 12 : 1;
      const gross = seResult.annualRevenue / div;
      const tax =
        (seResult.annualTax + seResult.annualEFKA + seResult.prepayment) / div;
      const net = seResult.annualNet / div;
      const periodLabel = m ? t("results.perMonth") : t("results.perYear");
      return {
        grossLabel: t("results.revenue"),
        grossValue: fmt(gross),
        grossSub: periodLabel,
        taxLabel: t("results.taxAndEfka"),
        taxValue: fmt(tax),
        taxSub: periodLabel,
        netLabel: t("results.net"),
        netValue: fmt(net),
        netSub: periodLabel,
      };
    }
    if (mode === "mplokaki" && mpResult) {
      const m = period === "monthly";
      const div = m ? 12 : 1;
      const gross = mpResult.annualGrossInvoiced / div;
      const tax = (mpResult.annualTax + mpResult.annualEFKA) / div;
      const net = mpResult.annualNet / div;
      const periodLabel = m ? t("results.perMonth") : t("results.perYear");
      return {
        grossLabel: t("results.invoiced"),
        grossValue: fmt(gross),
        grossSub: periodLabel,
        taxLabel: t("results.taxAndEfka"),
        taxValue: fmt(tax),
        taxSub: periodLabel,
        netLabel: t("results.net"),
        netValue: fmt(net),
        netSub: periodLabel,
      };
    }
    return null;
  }, [mode, period, empResult, seResult, mpResult, t]);

  // B9: Gate results on actual user input
  const hasUserInput =
    mode === "employee"
      ? empMonthly !== "" && empMonthly !== "2000"
      : mode === "self-employed"
        ? seMonthly !== "" && seMonthly !== "0"
        : mpMonthly !== "" && mpMonthly !== "0";

  const hasResult = stats !== null && hasUserInput;

  return (
    <>
      {/* B8: Skip navigation link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        {t("a11y.skipToContent")}
      </a>

      {/* B8: Replace root div with main landmark */}
      <main id="main-content" className="mx-auto max-w-[640px] space-y-8">
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
              // B10: Reset breakdown on mode switch
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
              monthly={empMonthly}
              setMonthly={setEmpMonthly}
              children={empChildren}
              setChildren={setEmpChildren}
              age={empAge}
              setAge={setEmpAge}
            />
          )}
          {mode === "self-employed" && (
            <SelfEmployedInputs
              monthly={seMonthly}
              setMonthly={setSeMonthly}
              expenses={seExpenses}
              setExpenses={setSeExpenses}
              efka={seEfka}
              setEfka={setSeEfka}
              years={seYears}
              setYears={setSeYears}
              age={seAge}
              setAge={setSeAge}
            />
          )}
          {mode === "mplokaki" && (
            <MplokakiInputs
              monthly={mpMonthly}
              setMonthly={setMpMonthly}
              efka={mpEfka}
              setEfka={setMpEfka}
              children={mpChildren}
              setChildren={setMpChildren}
              age={mpAge}
              setAge={setMpAge}
            />
          )}
        </div>

        {/* B9: Empty state when no user input yet */}
        {!hasUserInput && (
          <div className="rounded-2xl bg-secondary/20 py-12 text-center">
            <p className="text-sm text-muted-foreground/60">
              {t("results.emptyState")}
            </p>
          </div>
        )}

        {/* B5: Wrap results section in aria-live region */}
        <div aria-live="polite" aria-atomic="true">
          {/* Results */}
          {hasResult && stats && (
            <section className="space-y-4" aria-label={t("results.headline")}>
              {/* Period toggle — right-aligned, sits above the cards */}
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  {t("results.headline")}
                </p>
                <PeriodToggle value={period} onChange={setPeriod} />
              </div>

              {/* B3: Net card renders first on mobile (order-first), last on desktop (sm:order-last) */}
              <div className="flex flex-col sm:flex-row gap-3">
                <StatCard
                  label={stats.netLabel}
                  amount={stats.netValue}
                  sub={stats.netSub}
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

              {/* B4: Legal disclaimer */}
              <p className="text-[0.6875rem] text-muted-foreground/50 text-center px-2">
                {t("disclaimer")}
              </p>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
