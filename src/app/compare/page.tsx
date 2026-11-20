"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { compareAll } from "@/lib/tax/compare";
import { CheckField } from "@/components/calculator/check-field";
import { PeriodToggle } from "@/components/ui/period-toggle";
import { EfkaField } from "@/components/calculator/efka-field";
import { getAvailableCategories } from "@/lib/tax/efka";
import { fmt, fmtPct } from "@/lib/format";
import type { Mode, Period } from "@/types/calculator";
import type { EfkaCategoryId } from "@/lib/tax/types";
import { NumberField } from "@/components/calculator/number-field";
import { HeadOfficeLevyField } from "@/components/calculator/head-office-levy-field";
import { PartnershipFields } from "@/components/calculator/partnership-inputs";
import type { IkeHeadOfficeLevy } from "@/lib/tax/ike";
import { usePartnershipFields } from "@/hooks/use-partnership-fields";
import { parseField } from "@/lib/parse";
import { getOfferAmounts } from "@/lib/offer-amount";
import { CalculatorHeading } from "@/components/ui/calculator-heading";
import { Disclosure } from "@/components/ui/disclosure";
import { ResultsPlaceholder } from "@/components/ui/results-placeholder";

export default function ComparePage() {
  const { t } = useTranslation();
  const [offer, setOffer] = useState<{ value: string; period: Period }>({
    value: "",
    period: "monthly",
  });
  const [period, setPeriod] = useState<Period>("monthly");
  const [commonExpenses, setCommonExpenses] = useState("");
  const [efka, setEfka] = useState<EfkaCategoryId>("1st");
  const [reducedCorporatePrepayment, setReducedCorporatePrepayment] =
    useState(true);
  const [minimumIncome, setMinimumIncome] = useState("");
  const [selfEmployedExpenses, setSelfEmployedExpenses] = useState("0");
  const [ikeExpenses, setIkeExpenses] = useState("0");
  const [ikeLevy, setIkeLevy] = useState<IkeHeadOfficeLevy>(0);
  const [includeEmployee, setIncludeEmployee] = useState(false);
  const [includeMplokaki, setIncludeMplokaki] = useState(false);
  const [includePartnership, setIncludePartnership] = useState(false);
  const partnership = usePartnershipFields();
  const partnershipInput = includePartnership ? partnership.input : undefined;
  const [age, setAge] = useState("35");
  const [children, setChildren] = useState("0");
  const [years, setYears] = useState("1");
  const { displayedAmount, monthlyGross, annualBusinessRevenue } =
    getOfferAmounts(offer.value, offer.period, period);
  const hasInput = offer.value.trim() !== "";
  const yearsInBusiness = parseField(years, "years");
  const categories = getAvailableCategories(yearsInBusiness ?? 6);
  const efkaCategory = categories.some(({ id }) => id === efka) ? efka : "1st";

  const result = useMemo(() => {
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
      monthlyGross === null ||
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
    return compareAll(monthlyGross, minimumTaxableIncome, {
      efkaCategory,
      firstIncomeDeclaration: yearsInBusiness === 1,
      reducedCorporatePrepayment,
      annualInvoiceExpenses: monthlyCommonExpenses * 12,
      annualBusinessRevenue,
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
    monthlyGross,
    annualBusinessRevenue,
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

  const scenarios: [Mode, string, boolean][] = [
    ["employee", t("compare.employee"), includeEmployee],
    ["self-employed", t("compare.selfEmployed"), true],
    ["mplokaki", t("compare.mplokaki"), includeMplokaki],
    ["ike", t("modes.ike"), true],
    ["partnership", t("modes.partnership"), includePartnership],
  ];
  const ranked = result
    ? scenarios
        .filter(([, , included]) => included)
        .map(([key, label]) => ({ key, label, data: result[key] }))
        .sort((a, b) => b.data.annualNet - a.data.annualNet)
    : [];
  const winner = ranked[0];

  return (
    <>
      <CalculatorHeading
        title={t("compare.headline")}
        description={t("compare.subtitle")}
        action={
          <Link href="/" className="calculator-action">
            {t("compare.goToCalculator")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <div className="calculator-layout">
        <section
          className="calculator-panel space-y-4"
          aria-labelledby="offer-inputs"
        >
          <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
            <h2 id="offer-inputs" className="calculator-panel-title">
              <ClipboardList aria-hidden="true" />
              {t("compare.offerDetails")}
            </h2>
            <PeriodToggle
              value={period}
              onChange={(nextPeriod) => {
                if (monthlyGross === null) {
                  setOffer({ value: offer.value, period: nextPeriod });
                }
                setPeriod(nextPeriod);
              }}
            />
          </div>
          <div className="grid gap-4">
            <NumberField
              field={period === "annual" ? "annual-offer" : "monthly"}
              label={t(
                period === "annual"
                  ? "compare.offerAnnual"
                  : "compare.offerMonthly",
              )}
              value={displayedAmount}
              onChange={(value) => {
                setOffer({ value, period });
              }}
              placeholder={period === "annual" ? "48000" : "4000"}
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
          <Disclosure label={t("compare.addScenarios")}>
            <CheckField checked={includeEmployee} onChange={setIncludeEmployee}>
              {t("compare.includeEmployee")}
            </CheckField>
            {includeEmployee && (
              <p className="text-sm text-muted-foreground">
                {t("compare.basis")}
              </p>
            )}
            <CheckField checked={includeMplokaki} onChange={setIncludeMplokaki}>
              {t("compare.includeMplokaki")}
            </CheckField>
            {includeMplokaki && (
              <p className="text-sm text-muted-foreground">
                {t("compare.mplokakiBasis")}
              </p>
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
                  {t("compare.partnershipBasis")}
                </p>
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
          </Disclosure>
          <Disclosure label={t("compare.taxProfile")}>
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
              {(yearsInBusiness ?? 1) > 3 && (
                <div className="space-y-2">
                  <NumberField
                    field="amount"
                    label={t("inputs.minimumIncome")}
                    value={minimumIncome}
                    onChange={setMinimumIncome}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("inputs.minimumHelp")}
                  </p>
                </div>
              )}
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
          </Disclosure>
        </section>
        <section
          className="calculator-panel space-y-4"
          aria-labelledby="offer-results"
        >
          <div className="flex min-h-10 items-center">
            <h2 id="offer-results" className="calculator-panel-title">
              <ChartNoAxesColumnIncreasing aria-hidden="true" />
              {t("compare.annualNetLabel")}
            </h2>
          </div>

          <div role="status" className="sr-only" aria-atomic="true">
            {hasInput && winner
              ? `${winner.label} · ${fmt(winner.data.annualNet)} ${t("results.perYear")}`
              : hasInput
                ? t("results.invalid")
                : ""}
          </div>

          {hasInput && winner ? (
            <>
              <ol className="overflow-hidden rounded-xl border border-border bg-background divide-y divide-border">
                {ranked.map(({ key, label, data }) => (
                  <li
                    key={key}
                    className={
                      key === winner.key ? "bg-net-accent-muted" : undefined
                    }
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
                      <span className="min-w-0 font-medium">{label}</span>
                      <strong
                        className={
                          key === winner.key
                            ? "min-w-0 text-lg tabular-nums text-net-accent [overflow-wrap:anywhere]"
                            : "min-w-0 text-base tabular-nums [overflow-wrap:anywhere]"
                        }
                      >
                        {fmt(data.annualNet)}
                      </strong>
                    </div>
                  </li>
                ))}
              </ol>
              <Disclosure label={t("compare.resultDetails")}>
                {ranked.map(({ key, label, data }) => (
                  <div
                    key={key}
                    className="space-y-2 border-b border-border pb-4 text-sm last:border-0 last:pb-0"
                  >
                    <h3 className="font-semibold">{label}</h3>
                    <dl className="space-y-1 [&>div]:flex [&>div]:flex-wrap [&>div]:justify-between [&>div]:gap-x-4 [&_dd]:tabular-nums">
                      <div>
                        <dt>{t("compare.monthlyEquiv")}</dt>
                        <dd>{fmt(data.annualNet / 12)}</dd>
                      </div>
                      {key === "employee" && (
                        <div>
                          <dt>{t("compare.actualPaycheck")} (14×)</dt>
                          <dd>{fmt(data.monthlyNet)}</dd>
                        </div>
                      )}
                      <div>
                        <dt>{t("compare.totalTaxes")}</dt>
                        <dd>{fmt(data.totalTaxesAnnual)}</dd>
                      </div>
                      <div>
                        <dt>{t("compare.effectiveTaxRate")}</dt>
                        <dd>{fmtPct(data.effectiveTaxRate)}</dd>
                      </div>
                      {data.cashAfterAdvance !== undefined && (
                        <div>
                          <dt>
                            {t("compare.cashHeading")} ·{" "}
                            {t(
                              key === "self-employed"
                                ? "compare.personalCash"
                                : "compare.companyCash",
                            )}
                          </dt>
                          <dd>{fmt(data.cashAfterAdvance)}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ))}
              </Disclosure>
              <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                <p>{t("disclaimer")}</p>
                <p>{t("compare.defaults")}</p>
                <p>{t("ike.transition")}</p>
              </div>
            </>
          ) : (
            <ResultsPlaceholder
              invalid={hasInput}
              message={t(hasInput ? "results.invalid" : "compare.emptyState")}
            />
          )}
        </section>
      </div>
    </>
  );
}
