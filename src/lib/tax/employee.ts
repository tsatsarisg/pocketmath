import type { EmployeeInput, EmployeeResult } from "./types";
import {
  EMPLOYEE_SS_RATE,
  EMPLOYER_SS_RATE,
  SALARY_MONTHS,
  EMPLOYEE_SS_CEILING_MONTHLY,
} from "./constants";
import { calculateTax } from "./calculate-tax";
import { taxCredit } from "./tax-credit";

/**
 * Calculate the full tax breakdown for a private-sector employee.
 *
 * Formula (2026):
 *   annualGross      = monthlyGross x 14
 *   annualEmployeeSS = annualGross x 13.87% (capped at ceiling x 14)
 *   taxableIncome    = annualGross - annualEmployeeSS
 *   grossTax         = calculateTax(taxableIncome, children, age, isEmployee=true)
 *   credit           = taxCredit(taxableIncome, children)
 *   annualTax        = max(0, grossTax - credit)
 *   annualNet        = annualGross - annualEmployeeSS - annualTax
 *   monthlyNet       = annualNet / 14
 *   employerCost     = annualGross x (1 + 21.79%)
 */
export function calculateEmployee(input: EmployeeInput): EmployeeResult {
  const { monthlyGross, children, age } = input;

  const annualGross = Math.round(monthlyGross * SALARY_MONTHS * 100) / 100;

  // Employee SS contributions — capped at ceiling per month, then multiplied by 14
  const effectiveMonthly = Math.min(monthlyGross, EMPLOYEE_SS_CEILING_MONTHLY);
  const annualEmployeeSS =
    Math.round(effectiveMonthly * SALARY_MONTHS * EMPLOYEE_SS_RATE * 100) / 100;

  const taxableIncome =
    Math.round((annualGross - annualEmployeeSS) * 100) / 100;

  const taxBreakdown = calculateTax(taxableIncome, children, age, true);
  const grossTax = taxBreakdown.grossTax;
  const credit = taxCredit(taxableIncome, children);
  const annualTax = Math.round(Math.max(0, grossTax - credit) * 100) / 100;

  const annualNet =
    Math.round((annualGross - annualEmployeeSS - annualTax) * 100) / 100;
  const monthlyNet = Math.round((annualNet / SALARY_MONTHS) * 100) / 100;

  // Employer cost: employer SS applied the same way (ceiling-capped)
  const employerAnnualSS =
    Math.round(effectiveMonthly * SALARY_MONTHS * EMPLOYER_SS_RATE * 100) / 100;
  const employerTotalCost =
    Math.round((annualGross + employerAnnualSS) * 100) / 100;

  const effectiveTaxRate = annualGross > 0 ? (annualTax + annualEmployeeSS) / annualGross : 0;

  return {
    monthlyGross,
    annualGross,
    annualEmployeeSS,
    taxableIncome,
    grossTax,
    taxCredit: credit,
    annualTax,
    annualNet,
    monthlyNet,
    employerAnnualSS,
    employerTotalCost,
    effectiveTaxRate,
    taxBreakdown,
  };
}
