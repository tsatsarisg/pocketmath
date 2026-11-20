import { calculateEmployee } from "./employee";
import { calculateSelfEmployed } from "./self-employed";
import { calculateMplokaki } from "./mplokaki";
import { calculateIke, type IkeHeadOfficeLevy } from "./ike";
import { calculatePartnership, type PartnershipInput } from "./partnership";
import type { EfkaCategoryId } from "./types";

export interface CompareEntry {
  monthlyNet: number;
  annualNet: number;
  effectiveTaxRate: number;
  totalTaxesAnnual: number;
  cashAfterAdvance?: number;
}

export interface CompareResult {
  employee: CompareEntry;
  "self-employed": CompareEntry;
  mplokaki: CompareEntry;
  ike: CompareEntry;
  partnership: CompareEntry;
}

interface CompareOptions {
  age?: number;
  children?: number;
  yearsInBusiness?: number;
  annualSelfEmployedExpenses?: number;
  annualIkeExpenses?: number;
  annualBusinessRevenue?: number;
  annualInvoiceExpenses?: number;
  efkaCategory?: EfkaCategoryId;
  firstIncomeDeclaration?: boolean;
  reducedCorporatePrepayment?: boolean;
  ikeHeadOfficeLevy?: IkeHeadOfficeLevy;
  partnership?: Omit<
    PartnershipInput,
    "annualRevenue" | "distributionPercent" | "reducedPrepayment"
  >;
}

/** Compare annual net income for a shared monthly gross amount. */
export function compareAll(
  monthlyGross: number,
  minimumTaxableIncome: number,
  {
    age = 35,
    children = 0,
    yearsInBusiness = 4,
    annualSelfEmployedExpenses = 0,
    annualIkeExpenses = 0,
    annualBusinessRevenue = monthlyGross * 12,
    annualInvoiceExpenses = 0,
    efkaCategory = "1st",
    firstIncomeDeclaration = false,
    reducedCorporatePrepayment = false,
    ikeHeadOfficeLevy = 0,
    partnership,
  }: CompareOptions = {},
): CompareResult {
  const annualRevenue = annualBusinessRevenue;
  const emp = calculateEmployee({ monthlyGross, children, age });
  const se = calculateSelfEmployed({
    minimumTaxableIncome,
    annualRevenue,
    annualExpenses: annualSelfEmployedExpenses,
    efkaCategory,
    age,
    children,
    yearsInBusiness,
    firstIncomeDeclaration,
  });
  const mp = calculateMplokaki({
    qualifiesForEmployeeTax: true,
    annualGrossInvoiced: annualRevenue,
    efkaCategory,
    children,
    age,
  });
  const ike = calculateIke({
    annualRevenue,
    annualExpenses: annualIkeExpenses,
    efkaCategory,
    headOfficeLevy: ikeHeadOfficeLevy,
    reducedPrepayment: reducedCorporatePrepayment,
  });
  const partnershipResult = calculatePartnership({
    ...partnership,
    annualRevenue,
    reducedPrepayment: reducedCorporatePrepayment,
  });

  const invoiceNet = mp.annualNet - annualInvoiceExpenses;

  return {
    employee: {
      monthlyNet: emp.monthlyNet,
      annualNet: emp.annualNet,
      effectiveTaxRate: emp.effectiveTaxRate,
      totalTaxesAnnual: emp.annualTax + emp.annualEmployeeSS,
    },
    "self-employed": {
      monthlyNet: se.monthlyNet,
      annualNet: se.annualNet,
      effectiveTaxRate: se.effectiveTaxRate,
      totalTaxesAnnual: se.annualTax + se.annualEFKA,
      cashAfterAdvance: se.netAfterPrepayment,
    },
    mplokaki: {
      monthlyNet: Math.round((invoiceNet / 12) * 100) / 100,
      annualNet: invoiceNet,
      effectiveTaxRate: mp.effectiveTaxRate,
      totalTaxesAnnual: mp.annualTax + mp.annualEFKA,
    },
    ike: {
      monthlyNet: ike.monthlyNet,
      annualNet: ike.annualNet,
      effectiveTaxRate: ike.effectiveTaxRate,
      totalTaxesAnnual: ike.totalTaxesAnnual,
      cashAfterAdvance: ike.companyBalanceAfterPrepayment,
    },
    partnership: {
      monthlyNet: partnershipResult.monthlyNet,
      annualNet: partnershipResult.annualNet,
      effectiveTaxRate: partnershipResult.effectiveTaxRate,
      totalTaxesAnnual: partnershipResult.totalTaxesAnnual,
      cashAfterAdvance: partnershipResult.companyBalanceAfterPrepayment,
    },
  };
}
