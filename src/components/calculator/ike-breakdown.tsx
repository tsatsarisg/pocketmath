import { useTranslation } from "react-i18next";
import { BreakdownRow } from "@/components/ui/breakdown-row";
import { fmt, fmtPct } from "@/lib/format";
import type { IkeResult } from "@/lib/tax/ike";
import type { Period } from "@/types/calculator";

export function IkeBreakdown({
  result,
  period,
}: {
  result: IkeResult;
  period: Period;
}) {
  const { t } = useTranslation();
  const divisor = period === "monthly" ? 12 : 1;
  const amount = (value: number) => fmt(value / divisor);

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
        label={t("ike.retainedProfit")}
        sub={t("ike.reserve", { amount: amount(result.legalReserve) })}
        value={amount(result.retainedProfit)}
      />
      <BreakdownRow
        label={t("ike.grossDividend")}
        value={amount(result.grossDividend)}
      />
      <BreakdownRow
        label={t("ike.dividendTax")}
        value={amount(-result.dividendTax)}
        negative
      />
      <BreakdownRow
        label={t("ike.personalEfka")}
        value={amount(-result.annualEFKA)}
        negative
      />
      {result.operatingShortfall > 0 && (
        <BreakdownRow
          label={t("ike.shortfall")}
          value={amount(-result.operatingShortfall)}
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
        label={t("ike.companyBalance")}
        sub={t("ike.companyBalanceHelp")}
        value={amount(result.companyBalanceAfterPrepayment)}
      />
    </dl>
  );
}
