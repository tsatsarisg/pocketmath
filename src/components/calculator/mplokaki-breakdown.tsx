import { useTranslation } from "react-i18next";
import { BreakdownRow } from "@/components/ui/breakdown-row";
import { calculateMplokaki } from "@/lib/tax/mplokaki";
import { fmt, fmtPct } from "@/lib/format";
import type { Period } from "@/types/calculator";

export function MplokakiBreakdown({
  result,
  period,
}: {
  result: ReturnType<typeof calculateMplokaki>;
  period: Period;
}) {
  const { t } = useTranslation();
  const m = period === "monthly";
  const div = m ? 12 : 1;

  return (
    <dl className="space-y-0">
      <BreakdownRow
        label={t("breakdown.mplokaki.grossInvoiced")}
        value={fmt(result.annualGrossInvoiced / div)}
      />
      <BreakdownRow
        label={t("breakdown.mplokaki.annualEfka")}
        value={`-${fmt(result.annualEFKA / div)}`}
        negative
      />
      <BreakdownRow
        label={t("breakdown.mplokaki.taxableIncome")}
        value={fmt(result.taxableIncome / div)}
        highlight
      />
      <BreakdownRow
        label={t("breakdown.mplokaki.grossTax")}
        value={`-${fmt(result.grossTax / div)}`}
        negative
      />
      {result.taxCredit > 0 && (
        <BreakdownRow
          label={t("breakdown.mplokaki.taxCredit")}
          value={`+${fmt(result.taxCredit / div)}`}
        />
      )}
      <BreakdownRow
        label={t("breakdown.mplokaki.annualTax")}
        value={`-${fmt(result.annualTax / div)}`}
        negative
        highlight
      />
      <BreakdownRow
        label={t("breakdown.mplokaki.totalWithheld")}
        value={`-${fmt(result.totalWithheld / div)}`}
        negative
      />
      <BreakdownRow
        label={result.balanceDue >= 0 ? t("breakdown.mplokaki.balanceDue") : t("breakdown.mplokaki.refund")}
        value={fmt(Math.abs(result.balanceDue) / div)}
        highlight
        negative={result.balanceDue > 0}
      />
      <BreakdownRow
        label={t("breakdown.mplokaki.netIncome")}
        value={fmt(result.annualNet / div)}
        highlight
      />
      <BreakdownRow
        label={t("breakdown.mplokaki.effectiveTaxRate")}
        value={fmtPct(result.effectiveTaxRate)}
      />
    </dl>
  );
}
