import { useTranslation } from "react-i18next";
import { BreakdownRow } from "@/components/ui/breakdown-row";
import { fmt, fmtPct } from "@/lib/format";
import type { PartnershipResult } from "@/lib/tax/partnership";
import type { Period } from "@/types/calculator";

export function PartnershipBreakdown({
  result,
  period,
}: {
  result: PartnershipResult;
  period: Period;
}) {
  const { t } = useTranslation();
  const divisor = period === "monthly" ? 12 : 1;
  const amount = (value: number) => fmt(value === 0 ? 0 : value / divisor);

  return (
    <dl>
      <BreakdownRow
        label={t("results.revenue")}
        value={amount(result.annualRevenue)}
      />
      <BreakdownRow
        label={t("breakdown.selfEmployed.annualExpenses")}
        value={amount(-result.annualExpenses)}
        negative
      />
      <BreakdownRow
        label={t("ike.gemi")}
        value={amount(-result.annualGemiFee)}
        negative
      />
      <BreakdownRow
        label={t("partnership.partnerEfkaCost")}
        value={amount(-result.annualPartnerEfka)}
        negative
      />
      <BreakdownRow
        label={t("partnership.otherPartnerEfkaCost")}
        value={amount(-result.annualOtherPartnerEfka)}
        negative
      />
      <BreakdownRow
        label={t("ike.taxableProfit")}
        value={amount(result.taxableProfit)}
      />
      <BreakdownRow
        label={t("ike.corporateTax")}
        value={amount(-result.corporateTax)}
        negative
      />
      <BreakdownRow
        label={t("ike.levy")}
        value={amount(-result.headOfficeLevy)}
        negative
      />
      <BreakdownRow
        label={t("ike.profitAfterTax")}
        value={amount(result.profitAfterTax)}
      />
      <BreakdownRow
        label={t("partnership.retainedProfit")}
        value={amount(result.retainedProfit)}
      />
      <BreakdownRow
        label={t("partnership.distributedProfit")}
        value={amount(result.distribution)}
      />
      <BreakdownRow
        label={t("partnership.grossShare")}
        value={amount(result.grossPartnerDistribution)}
      />
      <BreakdownRow
        label={t("partnership.dividendTax", {
          rate: fmtPct(result.dividendTaxRate),
        })}
        value={amount(-result.partnerDividendTax)}
        negative
      />
      <BreakdownRow
        label={t("partnership.otherPartnerNet")}
        value={amount(result.otherPartnerNet)}
      />
      {result.partnerShortfall > 0 && (
        <BreakdownRow
          label={t("partnership.shortfall")}
          sub={t("partnership.shortfallHelp")}
          value={amount(-result.partnerShortfall)}
          negative
        />
      )}
      <BreakdownRow
        label={t("ike.net")}
        value={amount(result.annualNet)}
        highlight
      />
      <BreakdownRow
        label={t("ike.prepayment", { rate: fmtPct(result.prepaymentRate) })}
        value={amount(-result.prepayment)}
        negative
      />
      <BreakdownRow
        label={t("partnership.companyBalance")}
        sub={t("ike.companyBalanceHelp")}
        value={amount(result.companyBalanceAfterPrepayment)}
      />
    </dl>
  );
}
