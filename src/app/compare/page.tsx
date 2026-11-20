"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { compareAll } from "@/lib/tax/compare";
import type { CompareEntry } from "@/lib/tax/compare";
import { NumberField } from "@/components/calculator/number-field";
import { IkeLevyField } from "@/components/calculator/ike-levy-field";
import { IkeNotes, IkeTransitionNote } from "@/components/calculator/ike-notes";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { IkeHeadOfficeLevy } from "@/lib/tax/ike";
import { parseField } from "@/lib/parse";
import { WinnerCard } from "@/components/compare/winner-card";
import { RunnerCard } from "@/components/compare/runner-card";
import { NetBar } from "@/components/compare/net-bar";
import type { ModeKey, RankedEntry } from "@/types/compare";

export default function ComparePage() {
  const { t } = useTranslation();
  const [gross, setGross] = useState("");
  const [minimumIncome, setMinimumIncome] = useState("");
  const [selfEmployedExpenses, setSelfEmployedExpenses] = useState("0");
  const [ikeExpenses, setIkeExpenses] = useState("0");
  const [ikeLevy, setIkeLevy] = useState<IkeHeadOfficeLevy>(0);
  const [age, setAge] = useState("35");
  const [children, setChildren] = useState("0");
  const [years, setYears] = useState("4");
  const [scope, setScope] = useState<"all" | "business">("all");
  const hasInput = gross !== "";

  const result = useMemo(() => {
    const monthlyGross = parseField(gross, "monthly");
    const monthlySelfEmployedExpenses = parseField(
      selfEmployedExpenses,
      "expenses",
    );
    const monthlyIkeExpenses = parseField(ikeExpenses, "expenses");
    const parsedAge = parseField(age, "age");
    const parsedChildren = parseField(children, "children");
    const yearsInBusiness = parseField(years, "years");
    const minimumTaxableIncome =
      yearsInBusiness !== null && yearsInBusiness <= 3
        ? 0
        : parseField(minimumIncome, "amount");
    if (
      monthlyGross === null ||
      minimumTaxableIncome === null ||
      monthlySelfEmployedExpenses === null ||
      monthlyIkeExpenses === null ||
      parsedAge === null ||
      parsedChildren === null ||
      yearsInBusiness === null
    ) {
      return null;
    }
    return compareAll(monthlyGross, minimumTaxableIncome, {
      age: parsedAge,
      children: parsedChildren,
      yearsInBusiness,
      annualSelfEmployedExpenses: monthlySelfEmployedExpenses * 12,
      annualIkeExpenses: monthlyIkeExpenses * 12,
      ikeHeadOfficeLevy: ikeLevy,
    });
  }, [
    gross,
    minimumIncome,
    selfEmployedExpenses,
    ikeExpenses,
    age,
    children,
    years,
    ikeLevy,
  ]);

  const ranked: RankedEntry[] = useMemo(() => {
    if (!result) {
      return [];
    }
    const labels: Record<ModeKey, string> = {
      employee: t("compare.employee"),
      "self-employed": t("compare.selfEmployed"),
      mplokaki: t("compare.mplokaki"),
      ike: t("modes.ike"),
    };
    const entries = (Object.entries(result) as [ModeKey, CompareEntry][])
      .filter(
        ([key]) => scope === "all" || key === "ike" || key === "self-employed",
      )
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
  }, [result, scope, t]);

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

      <div className="flex justify-center">
        <SegmentedControl
          label={t("compare.scope")}
          options={[
            { id: "all", label: t("compare.allModes") },
            { id: "business", label: t("compare.businessModes") },
          ]}
          value={scope}
          onChange={setScope}
        />
      </div>
      <div className="rounded-2xl bg-secondary/40 p-5 sm:p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            field="monthly"
            label={t(
              scope === "business" ? "inputs.revenue" : "compare.grossMonthly",
            )}
            value={gross}
            onChange={setGross}
            placeholder="2000"
          />
          <IkeLevyField value={ikeLevy} onChange={setIkeLevy} />
          <NumberField
            field="expenses"
            label={t("compare.selfEmployedExpenses")}
            value={selfEmployedExpenses}
            onChange={setSelfEmployedExpenses}
          />
          <NumberField
            field="expenses"
            label={t("compare.ikeExpenses")}
            value={ikeExpenses}
            onChange={setIkeExpenses}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("compare.expensesHelp")}
        </p>
        <details className="space-y-3">
          <summary className="cursor-pointer text-sm font-medium">
            {t("compare.taxProfile")}
          </summary>
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              field="age"
              label={t("inputs.age")}
              value={age}
              onChange={setAge}
            />
            <NumberField
              field="children"
              label={t("inputs.children")}
              value={children}
              onChange={setChildren}
            />
            <NumberField
              field="years"
              label={t("inputs.yearsInBusiness")}
              value={years}
              onChange={setYears}
            />
          </div>
        </details>
        {(parseField(years, "years") ?? 4) > 3 && (
          <>
            <NumberField
              field="amount"
              label={t("inputs.minimumIncome")}
              value={minimumIncome}
              onChange={setMinimumIncome}
            />
            <p className="text-sm text-muted-foreground">
              {t("inputs.minimumHelp")}
            </p>
          </>
        )}
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        {scope === "all" && <p>{t("compare.basis")}</p>}
        <p>{t("compare.defaults")}</p>
        {scope === "all" && <p>{t("compare.mplokakiBasis")}</p>}
        <IkeTransitionNote />
        <IkeNotes includeTransition={false} />
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

      {hasInput && !result && (
        <p className="text-sm text-destructive">{t("results.invalid")}</p>
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

          {scope === "all" && (
            <div className="rounded-xl bg-secondary/30 px-4 py-4 space-y-1">
              <p className="text-[0.8125rem] font-semibold text-foreground">
                {t("compare.whyDifferent")}
              </p>
              <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
                {t("compare.whyDifferentBody")}
              </p>
            </div>
          )}

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
