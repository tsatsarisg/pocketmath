"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
    <div className="mx-auto max-w-[640px] space-y-8">
      <section className="space-y-2 text-center pt-2">
        <h1 className="text-[1.875rem] sm:text-[2rem] font-bold tracking-tight text-foreground">
          {t("compare.headline")}
        </h1>
        <p className="text-muted-foreground text-[0.875rem] max-w-sm mx-auto">
          {t("compare.subtitle")}
        </p>
      </section>

      <div className="rounded-2xl bg-secondary/40 p-5 sm:p-6 space-y-4">
        <PeriodToggle
          value={period}
          onChange={(nextPeriod) => {
            if (monthlyGross === null) {
              setOffer({ value: offer.value, period: nextPeriod });
            }
            setPeriod(nextPeriod);
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
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
        <details className="space-y-3">
          <summary className="cursor-pointer text-sm font-medium">
            {t("compare.addScenarios")}
          </summary>
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
        </details>
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
        </details>
      </div>

      <div role="status" className="sr-only" aria-atomic="true">
        {winner
          ? `${winner.label} · ${fmt(winner.data.annualNet)} ${t("results.perYear")}`
          : hasInput
            ? t("results.invalid")
            : ""}
      </div>

      {hasInput && !result && (
        <p className="text-sm text-destructive">{t("results.invalid")}</p>
      )}

      {hasInput && winner && (
        <section className="space-y-4" aria-label={t("results.headline")}>
          <h2 className="text-sm font-semibold">
            {t("compare.annualNetLabel")}
          </h2>
          <ol className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/30">
            {ranked.map(({ key, label, data }) => (
              <li
                key={key}
                className={
                  key === winner.key ? "bg-net-accent-muted" : undefined
                }
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
                  <span className="font-medium">{label}</span>
                  <strong className="tabular-nums">
                    {fmt(data.annualNet)}
                  </strong>
                </div>
              </li>
            ))}
          </ol>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{t("disclaimer")}</p>
            <p>{t("compare.defaults")}</p>
            <p>{t("ike.transition")}</p>
          </div>
          <details className="rounded-xl bg-secondary/30 space-y-3 p-4">
            <summary className="cursor-pointer text-sm font-medium">
              {t("compare.resultDetails")}
            </summary>
            {ranked.map(({ key, label, data }) => (
              <div
                key={key}
                className="space-y-2 border-t border-border pt-3 text-sm"
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
          </details>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("compare.goToCalculator")}
            </Link>
          </div>
        </section>
      )}
      {(includePartnership || includeMplokaki) && (
        <div className="space-y-2 text-sm text-muted-foreground">
          {includePartnership && <p>{t("compare.partnershipBasis")}</p>}
          {includeMplokaki && <p>{t("compare.mplokakiBasis")}</p>}
        </div>
      )}
    </div>
  );
}
