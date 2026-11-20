"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { compareAll } from "@/lib/tax/compare";
import type { CompareEntry } from "@/lib/tax/compare";
import { CheckField } from "@/components/calculator/check-field";
import { PeriodToggle } from "@/components/ui/period-toggle";
import { EfkaField } from "@/components/calculator/efka-field";
import { getAvailableCategories } from "@/lib/tax/efka";
import { fmt } from "@/lib/format";
import type { Period } from "@/types/calculator";
import type { EfkaCategoryId } from "@/lib/tax/types";
import { NumberField } from "@/components/calculator/number-field";
import { HeadOfficeLevyField } from "@/components/calculator/head-office-levy-field";
import { IkeNotes, IkeTransitionNote } from "@/components/calculator/ike-notes";
import { PartnershipFields } from "@/components/calculator/partnership-inputs";
import { PartnershipNotes } from "@/components/calculator/partnership-notes";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { IkeHeadOfficeLevy } from "@/lib/tax/ike";
import { usePartnershipFields } from "@/hooks/use-partnership-fields";
import { parseField } from "@/lib/parse";
import { WinnerCard } from "@/components/compare/winner-card";
import { RunnerCard } from "@/components/compare/runner-card";
import { NetBar } from "@/components/compare/net-bar";
import type { ModeKey, RankedEntry } from "@/types/compare";

export default function ComparePage() {
  const { t } = useTranslation();
  const [gross, setGross] = useState("");
  const [period, setPeriod] = useState<Period>("monthly");
  const [commonExpenses, setCommonExpenses] = useState("");
  const [efka, setEfka] = useState<EfkaCategoryId>("1st");
  const [reducedCorporatePrepayment, setReducedCorporatePrepayment] =
    useState(true);
  const [minimumIncome, setMinimumIncome] = useState("");
  const [selfEmployedExpenses, setSelfEmployedExpenses] = useState("0");
  const [ikeExpenses, setIkeExpenses] = useState("0");
  const [ikeLevy, setIkeLevy] = useState<IkeHeadOfficeLevy>(0);
  const [includeMplokaki, setIncludeMplokaki] = useState(false);
  const [includePartnership, setIncludePartnership] = useState(false);
  const partnership = usePartnershipFields();
  const partnershipInput = includePartnership ? partnership.input : undefined;
  const [age, setAge] = useState("35");
  const [children, setChildren] = useState("0");
  const [years, setYears] = useState("1");
  const [scope, setScope] = useState<"all" | "business">("business");
  const hasInput = gross.trim() !== "";
  const yearsInBusiness = parseField(years, "years");
  const categories = getAvailableCategories(yearsInBusiness ?? 6);
  const efkaCategory = categories.some(({ id }) => id === efka) ? efka : "1st";

  const result = useMemo(() => {
    const amount = parseField(gross, "monthly");
    const monthlyCommonExpenses = parseField(
      commonExpenses.trim() || "0",
      "expenses",
    );
    const monthlySelfEmployedExpenses = parseField(
      selfEmployedExpenses,
      "expenses",
    );
    const monthlyIkeExpenses = parseField(ikeExpenses, "expenses");
    const parsedAge = parseField(age, "age");
    const parsedChildren = parseField(children, "children");
    const minimumTaxableIncome =
      yearsInBusiness !== null && yearsInBusiness <= 3
        ? 0
        : parseField(minimumIncome, "amount");
    if (
      amount === null ||
      monthlyCommonExpenses === null ||
      minimumTaxableIncome === null ||
      monthlySelfEmployedExpenses === null ||
      monthlyIkeExpenses === null ||
      partnershipInput === null ||
      parsedAge === null ||
      parsedChildren === null ||
      yearsInBusiness === null
    ) {
      return null;
    }
    const monthlyGross =
      scope === "business" && period === "annual" ? amount / 12 : amount;
    return compareAll(monthlyGross, minimumTaxableIncome, {
      efkaCategory,
      firstIncomeDeclaration: yearsInBusiness === 1,
      reducedCorporatePrepayment,
      annualInvoiceExpenses: monthlyCommonExpenses * 12,
      ...(scope === "business" &&
        period === "annual" && { annualBusinessRevenue: amount }),
      age: parsedAge,
      children: parsedChildren,
      yearsInBusiness,
      annualSelfEmployedExpenses:
        (monthlySelfEmployedExpenses + monthlyCommonExpenses) * 12,
      annualIkeExpenses: (monthlyIkeExpenses + monthlyCommonExpenses) * 12,
      ikeHeadOfficeLevy: ikeLevy,
      ...(partnershipInput && {
        partnership: {
          ...partnershipInput,
          annualExpenses:
            partnershipInput.annualExpenses + monthlyCommonExpenses * 12,
        },
      }),
    });
  }, [
    gross,
    period,
    scope,
    commonExpenses,
    efkaCategory,
    reducedCorporatePrepayment,
    minimumIncome,
    selfEmployedExpenses,
    ikeExpenses,
    age,
    children,
    yearsInBusiness,
    ikeLevy,
    partnershipInput,
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
      partnership: t("modes.partnership"),
    };
    const entries = (Object.entries(result) as [ModeKey, CompareEntry][])
      .filter(([key]) => key !== "partnership" || includePartnership)
      .filter(([key]) =>
        scope === "all"
          ? key !== "mplokaki" || includeMplokaki
          : key !== "employee" && key !== "mplokaki",
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
  }, [result, scope, includeMplokaki, includePartnership, t]);

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
        {scope === "business" && (
          <PeriodToggle value={period} onChange={setPeriod} />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            field="monthly"
            label={t(
              scope === "all"
                ? "compare.grossMonthly"
                : period === "annual"
                  ? "compare.offerAnnual"
                  : "compare.offerMonthly",
            )}
            value={gross}
            onChange={setGross}
            placeholder="4000"
          />
          <NumberField
            field="expenses"
            label={t("compare.commonExpenses")}
            value={commonExpenses}
            onChange={setCommonExpenses}
            optional
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {t(
            yearsInBusiness === 1
              ? "compare.quickBasisFirst"
              : "compare.quickBasis",
          )}
        </p>
        {scope === "all" && (
          <CheckField checked={includeMplokaki} onChange={setIncludeMplokaki}>
            {t("compare.includeMplokaki")}
          </CheckField>
        )}
        <CheckField
          checked={includePartnership}
          onChange={setIncludePartnership}
        >
          {t("compare.includePartnership")}
        </CheckField>
        {includePartnership && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("partnership.liability")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <PartnershipFields fields={partnership} comparison />
            </div>
            <p className="text-sm text-muted-foreground">
              {t("partnership.efkaHelp")}
            </p>
          </div>
        )}
        <details className="space-y-3">
          <summary className="cursor-pointer text-sm font-medium">
            {t("compare.taxProfile")}
          </summary>
          <div className="grid gap-4 sm:grid-cols-2">
            <EfkaField
              value={efkaCategory}
              onChange={setEfka}
              categories={categories}
            />
            <HeadOfficeLevyField
              value={ikeLevy}
              onChange={setIkeLevy}
              label={t("compare.ikeLevy")}
            />
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
              onChange={(value) => {
                setYears(value);
                if (
                  (parseField(value, "years") ?? 0) > 5 &&
                  efka === "special"
                ) {
                  setEfka("1st");
                }
              }}
            />
          </div>
          <CheckField
            checked={reducedCorporatePrepayment}
            onChange={setReducedCorporatePrepayment}
          >
            {t("ike.reducedPrepayment")}
            <span className="block text-muted-foreground">
              {t("ike.reducedHelp")}
            </span>
          </CheckField>
          <p className="text-sm text-muted-foreground">
            {t("compare.expensesHelp")}
          </p>
        </details>
        {(yearsInBusiness ?? 1) > 3 && (
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

      <div role="status" className="sr-only" aria-atomic="true">
        {winner
          ? `${winner.label} · ${fmt(winner.data.annualNet)} ${t("results.perYear")}`
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
          <details className="rounded-xl bg-secondary/30 space-y-3 p-4">
            <summary className="cursor-pointer text-sm font-medium">
              {t("compare.cashHeading")}
            </summary>
            <dl className="space-y-2 text-sm">
              {ranked.map(({ key, label, data }) =>
                data.cashAfterAdvance === undefined ? null : (
                  <div
                    key={key}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt>
                      {label} ·{" "}
                      {t(
                        key === "self-employed"
                          ? "compare.personalCash"
                          : "compare.companyCash",
                      )}
                    </dt>
                    <dd className="tabular-nums">
                      {fmt(data.cashAfterAdvance)}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </details>

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
      <div className="space-y-2 text-sm text-muted-foreground">
        {scope === "all" && <p>{t("compare.basis")}</p>}
        <p>{t("compare.defaults")}</p>
        {includePartnership && <p>{t("compare.partnershipBasis")}</p>}
        {scope === "all" && includeMplokaki && (
          <p>{t("compare.mplokakiBasis")}</p>
        )}
        <IkeTransitionNote />
        <IkeNotes includeTransition={false} />
        {includePartnership && <PartnershipNotes />}
      </div>
    </div>
  );
}
