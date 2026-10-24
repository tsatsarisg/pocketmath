import { calculateEmployee } from "./employee";
import { calculateSelfEmployed } from "./self-employed";
import { calculateMplokaki } from "./mplokaki";
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
}

const DEFAULTS = {
  children: 0,
  age: 35,
  efkaCategory: "1st" as EfkaCategoryId,
  yearsInBusiness: 4,
  annualExpenses: 0,
};

/**
 * Compare net income across all three employment types for the same
 * gross monthly income, using sensible defaults for other parameters.
 */
export function compareAll(
  monthlyGross: number,
  minimumTaxableIncome: number,
): CompareResult {
  const emp = calculateEmployee({
    monthlyGross,
    children: DEFAULTS.children,
    age: DEFAULTS.age,
  });

  const se = calculateSelfEmployed({
    minimumTaxableIncome,
    annualRevenue: monthlyGross * 12,
    annualExpenses: DEFAULTS.annualExpenses,
    efkaCategory: DEFAULTS.efkaCategory,
    age: DEFAULTS.age,
    yearsInBusiness: DEFAULTS.yearsInBusiness,
  });

  const mp = calculateMplokaki({
    qualifiesForEmployeeTax: true,
    annualGrossInvoiced: monthlyGross * 12,
    efkaCategory: DEFAULTS.efkaCategory,
    children: DEFAULTS.children,
    age: DEFAULTS.age,
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
  };
}
