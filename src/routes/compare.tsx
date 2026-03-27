import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/lib/use-page-meta";
import { cn } from "@/lib/utils";
import { compareAll } from "@/lib/tax/compare";
import type { CompareEntry } from "@/lib/tax/compare";
import { fmt, fmtPct } from "@/lib/format";
import { EuroInput } from "@/components/ui/euro-input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
});

type ModeKey = "employee" | "selfEmployed" | "mplokaki";

interface RankedEntry {
  key: ModeKey;
  label: string;
  data: CompareEntry;
  rank: number;
  barWidth: number;
}

function MetaPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[0.625rem] font-semibold uppercase tracking-wider",
      className,
    )}>
      {children}
    </span>
  );
}

function WinnerCard({ entry }: { entry: RankedEntry }) {
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

      {/* Annual net — primary */}
      <div className="mb-4">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-net-accent/70">
          {t("compare.annualNetLabel")}
        </p>
        <p className="text-[2.5rem] sm:text-[2.75rem] font-extrabold tabular-nums leading-none tracking-tight text-net-accent mt-1">
          {fmt(entry.data.annualNet)}
        </p>
      </div>

      {/* Monthly rows */}
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

      {/* Meta row */}
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

function RunnerCard({ entry }: { entry: RankedEntry }) {
  const { t } = useTranslation();
  const isEmployee = entry.key === "employee";

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border/50 p-4 sm:p-5">
      <p className="text-[0.8125rem] font-semibold text-foreground mb-3">{entry.label}</p>

      {/* Annual net */}
      <div className="mb-3">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {t("compare.annualNet")}
        </p>
        <p className="text-[1.5rem] font-bold tabular-nums leading-tight tracking-tight text-foreground mt-0.5">
          {fmt(entry.data.annualNet)}
        </p>
      </div>

      {/* Proportional bar vs winner */}
      <div className="h-1.5 rounded-full bg-border/40 mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-muted-foreground/30 transition-all duration-500"
          style={{ width: `${entry.barWidth}%` }}
        />
      </div>

      {/* Monthly rows */}
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

function NetBar({ ranked }: { ranked: RankedEntry[] }) {
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

function ComparePage() {
  const { t, i18n } = useTranslation();
  const isEl = i18n.language.startsWith("el");
  usePageMeta({
    title: isEl
      ? "PocketMath – Σύγκριση Μισθωτού, Ελεύθερου Επαγγελματία & Μπλοκάκι 2026"
      : "PocketMath – Compare Employee vs Self-Employed vs Block Invoice Greece 2026",
    description: isEl
      ? "Σύγκριση καθαρού ετήσιου εισοδήματος για μισθωτό, ελεύθερο επαγγελματία και μπλοκάκι με το ίδιο μεικτό εισόδημα. Ελλάδα 2026."
      : "Compare annual net income for employee, self-employed and block invoice (mplokaki) with the same gross income. Greece 2026.",
    canonical: "https://pocketmath.gr/compare",
  });
  const [gross, setGross] = useState("");

  const grossNum = Math.max(0, parseFloat(gross) || 0);
  const hasInput = gross !== "" && gross !== "0" && grossNum > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    try {
      return compareAll(grossNum);
    } catch {
      return null;
    }
  }, [grossNum, hasInput]);

  const modeLabels: Record<ModeKey, string> = {
    employee: t("compare.employee"),
    selfEmployed: t("compare.selfEmployed"),
    mplokaki: t("compare.mplokaki"),
  };

  const ranked: RankedEntry[] = useMemo(() => {
    if (!result) return [];
    const entries = (Object.entries(result) as [ModeKey, CompareEntry][])
      .map(([key, data]) => ({ key, data }))
      .sort((a, b) => b.data.annualNet - a.data.annualNet);

    const maxNet = entries[0]!.data.annualNet;
    return entries.map((e, i) => ({
      ...e,
      label: modeLabels[e.key],
      rank: i,
      barWidth: maxNet > 0 ? Math.round((e.data.annualNet / maxNet) * 100) : 0,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, t]);

  const winner = ranked[0];
  const runners = ranked.slice(1);

  return (
    <main className="mx-auto max-w-[640px] space-y-8">
      {/* Hero */}
      <section className="space-y-2 text-center pt-2">
        <h1 className="text-[1.875rem] sm:text-[2rem] font-bold tracking-tight text-foreground">
          {t("compare.headline")}
        </h1>
        <p className="text-muted-foreground text-[0.875rem] max-w-sm mx-auto">
          {t("compare.subtitle")}
        </p>
      </section>

      {/* Input */}
      <div className="rounded-2xl bg-secondary/40 p-5 sm:p-6">
        <div className="max-w-sm mx-auto space-y-2 text-center">
          <Label htmlFor="compare-gross" className="justify-center">
            {t("compare.grossMonthly")}
          </Label>
          <EuroInput
            id="compare-gross"
            value={gross}
            onChange={setGross}
            placeholder="2000"
          />
        </div>
      </div>

      {/* Empty state */}
      {!hasInput && (
        <div className="rounded-2xl bg-secondary/20 py-12 text-center">
          <p className="text-sm text-muted-foreground/60">{t("compare.emptyState")}</p>
        </div>
      )}

      {/* Results */}
      {hasInput && result && winner && (
        <section className="space-y-4" aria-label={t("results.headline")}>
          {/* Winner hero card */}
          <WinnerCard entry={winner} />

          {/* Runner cards */}
          {runners.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {runners.map((entry) => (
                <RunnerCard key={entry.key} entry={entry} />
              ))}
            </div>
          )}

          {/* Bar chart */}
          <NetBar ranked={ranked} />

          {/* 14-salary explanation */}
          <div className="rounded-xl bg-secondary/30 px-4 py-4 space-y-1">
            <p className="text-[0.8125rem] font-semibold text-foreground">
              {t("compare.whyDifferent")}
            </p>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
              {t("compare.whyDifferentBody")}
            </p>
          </div>

          {/* Defaults + link */}
          <p className="text-[0.6875rem] text-muted-foreground/50 text-center px-2">
            {t("compare.defaults")}
          </p>
          <div className="text-center">
            <p className="text-[0.8125rem] text-muted-foreground">
              {t("compare.detailedCalc")}{" "}
              <Link to="/" className="text-primary font-medium hover:underline">
                {t("compare.goToCalculator")}
              </Link>
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
