import { useTranslation } from "react-i18next";
import { BreakdownRow } from "@/components/ui/breakdown-row";
import { calculateEmployee } from "@/lib/tax/employee";
import { fmt, fmtPct } from "@/lib/format";

type Period = "monthly" | "annual";

export function EmployeeBreakdown({
  result,
  period,
}: {
  result: ReturnType<typeof calculateEmployee>;
  period: Period;
}) {
  const { t } = useTranslation();
  const m = period === "monthly";
  const div = m ? 14 : 1;

  return (
    <dl className="space-y-0">
      <BreakdownRow
        label={t("breakdown.employee.grossSalary")}
        sub={m ? t("breakdown.employee.salaries") : undefined}
        value={fmt(result.annualGross / div)}
      />
      <BreakdownRow
        label={t("breakdown.employee.employeeSs")}
        sub={t("breakdown.employee.ssRate")}
        value={`-${fmt(result.annualEmployeeSS / div)}`}
        negative
      />
      <BreakdownRow
        label={t("breakdown.employee.taxableIncome")}
        value={fmt(result.taxableIncome / div)}
        highlight
      />
      <BreakdownRow
        label={t("breakdown.employee.grossTax")}
        value={`-${fmt(result.grossTax / div)}`}
        negative
      />
      {result.taxCredit > 0 && (
        <BreakdownRow
          label={t("breakdown.employee.taxCredit")}
          value={`+${fmt(result.taxCredit / div)}`}
        />
      )}
      <BreakdownRow
        label={t("breakdown.employee.netTax")}
        value={`-${fmt(result.annualTax / div)}`}
        negative
        highlight
      />
      <BreakdownRow
        label={t("breakdown.employee.netIncome")}
        value={fmt(result.annualNet / div)}
        highlight
      />
      <BreakdownRow
        label={t("breakdown.employee.effectiveTaxRate")}
        value={fmtPct(result.effectiveTaxRate)}
      />
      <BreakdownRow
        label={t("breakdown.employee.employerCost")}
        value={fmt(result.employerTotalCost / div)}
      />
    </dl>
  );
}
