import type { TFunction } from "i18next";
import type { Mode, Period } from "@/types/calculator";
import type {
  EmployeeResult,
  SelfEmployedResult,
  MplokakiResult,
} from "@/lib/tax/types";
import type { IkeResult } from "@/lib/tax/ike";
import type { PartnershipResult } from "@/lib/tax/partnership";
import { fmt } from "@/lib/format";

export interface Stats {
  grossLabel: string;
  grossValue: string;
  grossSub: string;
  taxLabel: string;
  taxValue: string;
  taxSub: string;
  netLabel: string;
  netValue: string;
  netSub: string;
}

export function getCalculatorStats(
  mode: Mode,
  period: Period,
  employee: EmployeeResult | null,
  selfEmployed: SelfEmployedResult | null,
  mplokaki: MplokakiResult | null,
  t: TFunction,
  ike: IkeResult | null = null,
  partnership: PartnershipResult | null = null,
): Stats | null {
  let gross: number;
  let tax: number;
  let net: number;
  let grossLabel: string;
  let taxLabel: string;
  const divisor = period === "annual" ? 1 : mode === "employee" ? 14 : 12;

  switch (mode) {
    case "partnership":
      if (!partnership) {
        return null;
      }
      gross = partnership.annualRevenue;
      tax = partnership.totalTaxesAnnual;
      net = partnership.annualNet;
      grossLabel = t("results.revenue");
      taxLabel = t("partnership.taxes");
      break;
    case "ike":
      if (!ike) {
        return null;
      }
      gross = ike.annualRevenue;
      tax = ike.totalTaxesAnnual;
      net = ike.annualNet;
      grossLabel = t("results.revenue");
      taxLabel = t("ike.taxes");
      break;
    case "employee":
      if (!employee) {
        return null;
      }
      gross = employee.annualGross;
      tax = employee.annualTax + employee.annualEmployeeSS;
      net = employee.annualNet;
      grossLabel = t("results.gross");
      taxLabel = t("results.taxAndContributions");
      break;
    case "self-employed":
      if (!selfEmployed) {
        return null;
      }
      gross = selfEmployed.annualRevenue;
      tax = selfEmployed.annualTax + selfEmployed.annualEFKA;
      net = selfEmployed.annualNet;
      grossLabel = t("results.revenue");
      taxLabel = t("results.taxAndEfka");
      break;
    case "mplokaki":
      if (!mplokaki) {
        return null;
      }
      gross = mplokaki.annualGrossInvoiced;
      tax = mplokaki.annualTax + mplokaki.annualEFKA;
      net = mplokaki.annualNet;
      grossLabel = t("results.invoiced");
      taxLabel = t("results.taxAndEfka");
      break;
  }

  const periodLabel = t(
    period === "monthly" ? "results.perMonth" : "results.perYear",
  );
  return {
    grossLabel,
    grossValue: fmt(gross / divisor),
    grossSub: periodLabel,
    taxLabel,
    taxValue: fmt(tax / divisor),
    taxSub: periodLabel,
    netLabel: t(
      mode === "ike" || mode === "partnership" ? "ike.net" : "results.net",
    ),
    netValue: fmt(net / divisor),
    netSub: periodLabel,
  };
}
