"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { compareAll } from "@/lib/tax/compare";
import type { CompareEntry } from "@/lib/tax/compare";
import { EuroInput } from "@/components/ui/euro-input";
import { Label } from "@/components/ui/label";
import { WinnerCard } from "@/components/compare/winner-card";
import { RunnerCard } from "@/components/compare/runner-card";
import { NetBar } from "@/components/compare/net-bar";
import type { ModeKey, RankedEntry } from "@/types/compare";

export default function ComparePage() {
  const { t } = useTranslation();
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

  const ranked: RankedEntry[] = useMemo(() => {
    if (!result) return [];
    const labels: Record<ModeKey, string> = {
      employee: t("compare.employee"),
      selfEmployed: t("compare.selfEmployed"),
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
      barWidth: maxNet > 0 ? Math.round((e.data.annualNet / maxNet) * 100) : 0,
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

      {!hasInput && (
        <div className="rounded-2xl bg-secondary/20 py-12 text-center">
          <p className="text-sm text-muted-foreground/60">{t("compare.emptyState")}</p>
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

          <p className="text-[0.6875rem] text-muted-foreground/50 text-center px-2">
            {t("compare.defaults")}
          </p>
          <div className="text-center">
            <p className="text-[0.8125rem] text-muted-foreground">
              {t("compare.detailedCalc")}{" "}
              <Link href="/" className="text-primary font-medium hover:underline">
                {t("compare.goToCalculator")}
              </Link>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
