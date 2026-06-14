import { useTranslation } from "react-i18next";
import { BreakdownRow } from "@/components/ui/breakdown-row";
import { calculateSelfEmployed } from "@/lib/tax/self-employed";
import { fmt, fmtPct } from "@/lib/format";
import type { Period } from "@/types/calculator";

export function SelfEmployedBreakdown({
  result,
  period,
}: {
  result: ReturnType<typeof calculateSelfEmployed>;
  period: Period;
}) {
  const { t } = useTranslation();
  const m = period === "monthly";
  const div = m ? 12 : 1;

  return (
    <dl className="space-y-0">
      <BreakdownRow
        label={t("breakdown.selfEmployed.annualRevenue")}
        value={fmt(result.annualRevenue / div)}
      />
      {result.annualExpenses > 0 && (
        <BreakdownRow
          label={t("breakdown.selfEmployed.annualExpenses")}
          value={`-${fmt(result.annualExpenses / div)}`}
          negative
        />
      )}
      <BreakdownRow
        label={t("breakdown.selfEmployed.annualEfka")}
        value={`-${fmt(result.annualEFKA / div)}`}
        negative
      />
      <BreakdownRow
        label={t("breakdown.selfEmployed.taxableIncome")}
        value={fmt(result.taxableIncome / div)}
        highlight
      />
      <BreakdownRow
        label={t("breakdown.selfEmployed.grossTax")}
        value={`-${fmt(result.grossTax / div)}`}
        negative
      />
      {result.firstYearBenefit > 0 && (
        <BreakdownRow
          label={t("breakdown.selfEmployed.firstYearBenefit")}
          sub={t("breakdown.selfEmployed.firstYearBenefitSub")}
          value={`+${fmt(result.firstYearBenefit / div)}`}
        />
      )}
      <BreakdownRow
        label={t("breakdown.selfEmployed.annualTax")}
        value={`-${fmt(result.annualTax / div)}`}
        negative
        highlight
      />
      <BreakdownRow
        label={t("breakdown.selfEmployed.prepayment")}
        sub={`${fmtPct(result.prepaymentRate)} ${t("breakdown.selfEmployed.prepaymentSub")}`}
        value={`-${fmt(result.prepayment / div)}`}
        negative
      />
      <BreakdownRow
        label={t("breakdown.selfEmployed.totalTaxWithPrepayment")}
        value={`-${fmt(result.totalTaxWithPrepayment / div)}`}
        negative
        highlight
      />
      <BreakdownRow
        label={t("breakdown.selfEmployed.netIncome")}
        value={fmt(result.annualNet / div)}
        highlight
      />
      <BreakdownRow
        label={t("breakdown.selfEmployed.effectiveTaxRate")}
        value={fmtPct(result.effectiveTaxRate)}
      />
    </dl>
  );
}
