"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { compareAll } from "@/lib/tax/compare";
import type { CompareEntry } from "@/lib/tax/compare";
import { NumberField } from "@/components/calculator/number-field";
import { parseField } from "@/lib/parse";
import { WinnerCard } from "@/components/compare/winner-card";
import { RunnerCard } from "@/components/compare/runner-card";
import { NetBar } from "@/components/compare/net-bar";
import type { ModeKey, RankedEntry } from "@/types/compare";

export default function ComparePage() {
  const { t } = useTranslation();
  const [gross, setGross] = useState("");
  const [minimumIncome, setMinimumIncome] = useState("");
  const minimumTaxableIncome = parseField(minimumIncome, "amount");

  const grossNum = parseField(gross, "monthly");
  const hasInput = gross !== "";

  const result = useMemo(() => {
    if (grossNum === null || minimumTaxableIncome === null) {
      return null;
    }
    return compareAll(grossNum, minimumTaxableIncome);
  }, [grossNum, minimumTaxableIncome]);

  const ranked: RankedEntry[] = useMemo(() => {
    if (!result) {
      return [];
    }
    const labels: Record<ModeKey, string> = {
      employee: t("compare.employee"),
      "self-employed": t("compare.selfEmployed"),
      mplokaki: t("compare.mplokaki"),
    };
    const entries = (Object.entries(result) as [ModeKey, CompareEntry][])
      .map(([key, data]) => ({ key, data }))
      .sort((a, b) => b.data.annualNet - a.data.annualNet);

    const maxNet = entries[0]?.data.annualNet ?? 0;
    return entries.map((e, i) => ({
      ...e,
      label: labels[e.key],
      rank: i,
      barWidth:
        maxNet > 0
          ? Math.max(0, Math.round((e.data.annualNet / maxNet) * 100))
          : 0,
    }));
  }, [result, t]);

  const winner = ranked[0];
  const runners = ranked.slice(1);

  return (
    <div className="mx-auto max-w-[640px] space-y-8">
      <section className="space-y-2 text-center pt-2">
        <h1 className="text-[1.875rem] sm:text-[2rem] font-bold tracking-tight text-foreground">
          {t("compare.headline")}
        </h1>
        <p className="text-muted-foreground text-[0.875rem] max-w-sm mx-auto">
          {t("compare.subtitle")}
        </p>
      </section>

      <div className="rounded-2xl bg-secondary/40 p-5 sm:p-6">
        <div className="max-w-sm mx-auto space-y-2 text-center">
          <NumberField
            field="monthly"
            label={t("compare.grossMonthly")}
            value={gross}
            onChange={setGross}
            placeholder="2000"
          />
          <NumberField
            field="amount"
            label={t("inputs.minimumIncome")}
            value={minimumIncome}
            onChange={setMinimumIncome}
          />
          <p className="text-sm text-muted-foreground text-left">
            {t("inputs.minimumHelp")}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <p>{t("compare.basis")}</p>
        <p>{t("compare.defaults")}</p>
      </div>
      <div role="status" className="sr-only" aria-atomic="true">
        {winner
          ? `${winner.label}: ${t("compare.bestNet")}`
          : hasInput
            ? t("results.invalid")
            : ""}
      </div>

      {!hasInput && (
        <div className="rounded-2xl bg-secondary/20 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("compare.emptyState")}
          </p>
        </div>
      )}

      {hasInput && result && winner && (
        <section className="space-y-4" aria-label={t("results.headline")}>
          <WinnerCard entry={winner} />

          {runners.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {runners.map((entry) => (
                <RunnerCard key={entry.key} entry={entry} />
              ))}
            </div>
          )}

          <NetBar ranked={ranked} />

          <div className="rounded-xl bg-secondary/30 px-4 py-4 space-y-1">
            <p className="text-[0.8125rem] font-semibold text-foreground">
              {t("compare.whyDifferent")}
            </p>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
              {t("compare.whyDifferentBody")}
            </p>
          </div>

          <div className="text-center">
            <p className="text-[0.8125rem] text-muted-foreground">
              {t("compare.detailedCalc")}{" "}
              <Link
                href="/"
                className="text-primary font-medium hover:underline"
              >
                {t("compare.goToCalculator")}
              </Link>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
