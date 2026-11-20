import { calculateEmployee } from "./employee";
import { calculateSelfEmployed } from "./self-employed";
import { calculateMplokaki } from "./mplokaki";
import { calculateIke, type IkeHeadOfficeLevy } from "./ike";
import type { EfkaCategoryId } from "./types";

export interface CompareEntry {
  monthlyNet: number;
  annualNet: number;
  effectiveTaxRate: number;
  totalTaxesAnnual: number;
}

export interface CompareResult {
  employee: CompareEntry;
  "self-employed": CompareEntry;
  mplokaki: CompareEntry;
  ike: CompareEntry;
}

interface CompareOptions {
  age?: number;
  children?: number;
  yearsInBusiness?: number;
  annualSelfEmployedExpenses?: number;
  annualIkeExpenses?: number;
  ikeHeadOfficeLevy?: IkeHeadOfficeLevy;
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
    ikeHeadOfficeLevy = 0,
  }: CompareOptions = {},
): CompareResult {
  const efkaCategory: EfkaCategoryId = "1st";
  const annualRevenue = monthlyGross * 12;
  const emp = calculateEmployee({ monthlyGross, children, age });
  const se = calculateSelfEmployed({
    minimumTaxableIncome,
    annualRevenue,
    annualExpenses: annualSelfEmployedExpenses,
    efkaCategory,
    age,
    children,
    yearsInBusiness,
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
  });

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
    },
    mplokaki: {
      monthlyNet: mp.monthlyNet,
      annualNet: mp.annualNet,
      effectiveTaxRate: mp.effectiveTaxRate,
      totalTaxesAnnual: mp.annualTax + mp.annualEFKA,
    },
    ike: {
      monthlyNet: ike.monthlyNet,
      annualNet: ike.annualNet,
      effectiveTaxRate: ike.effectiveTaxRate,
      totalTaxesAnnual: ike.totalTaxesAnnual,
    },
  };
}
