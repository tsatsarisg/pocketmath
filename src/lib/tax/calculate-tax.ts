import type { CalculateTaxResult, TaxBracket } from "./types";
import {
  STANDARD_BRACKETS,
  getBracket2Rate,
  getBracket3Rate,
} from "./constants";

/**
 * Build the effective bracket array based on age, children, and employee status.
 *
 * Mutations from the standard 2026 scale:
 * - Age <= 25: first two brackets at 0%
 * - Age 26-30: second bracket at 9% (instead of 20%)
 * - Employee/mplokaki with age > 30: family reductions on brackets 2 and 3
 */
function buildBrackets(
  children: number,
  age: number,
  isEmployee: boolean,
): TaxBracket[] {
  // Deep copy so we never mutate the constant array
  const brackets: TaxBracket[] = STANDARD_BRACKETS.map((b) => ({
    limit: b.limit,
    rate: b.rate,
  }));

  const b1 = brackets[0];
  const b2 = brackets[1];
  const b3 = brackets[2];

  if (!b1 || !b2 || !b3) {
    throw new Error("Expected at least 3 brackets in the standard scale");
  }

  // Youth overrides take priority over family reductions
  if (age <= 25) {
    b1.rate = 0;
    b2.rate = 0;
    // Family reductions still apply to bracket 3 for employees
    if (isEmployee) {
      b3.rate = getBracket3Rate(children);
    }
  } else if (age <= 30) {
    // Age 26-30: second bracket at 9% (or lower if family rate is lower)
    if (isEmployee) {
      b2.rate = Math.min(0.09, getBracket2Rate(children));
      b3.rate = getBracket3Rate(children);
    } else {
      b2.rate = 0.09;
    }
  } else if (isEmployee) {
    // Age > 30, employee/mplokaki: apply family reductions
    b2.rate = getBracket2Rate(children);
    b3.rate = getBracket3Rate(children);
  }

  return brackets;
}

/**
 * Core tax calculation implementing the 2026 6-bracket progressive system.
 *
 * @param income    - Taxable income (after deductions)
 * @param children  - Number of dependent children (default 0)
 * @param age       - Taxpayer age (default 35)
 * @param isEmployee - Whether to apply family-based reductions (employees & mplokaki)
 * @returns Tax result with gross tax, effective rate, and per-bracket breakdown
 */
export function calculateTax(
  income: number,
  children = 0,
  age = 35,
  isEmployee = true,
): CalculateTaxResult {
  if (income <= 0) {
    return { grossTax: 0, effectiveRate: 0, brackets: [] };
  }

  const effectiveBrackets = buildBrackets(children, age, isEmployee);

  let totalTax = 0;
  let prev = 0;
  const breakdown: CalculateTaxResult["brackets"] = [];

  for (const bracket of effectiveBrackets) {
    const taxable = Math.min(income, bracket.limit) - prev;
    if (taxable <= 0) break;

    const tax = Math.round(taxable * bracket.rate * 100) / 100;
    totalTax += tax;

    breakdown.push({
      from: prev,
      to: Math.min(income, bracket.limit),
      rate: bracket.rate,
      taxable,
      tax,
    });

    prev = bracket.limit;
    if (income <= bracket.limit) break;
  }

  const grossTax = Math.round(totalTax * 100) / 100;

  return {
    grossTax,
    effectiveRate: income > 0 ? grossTax / income : 0,
    brackets: breakdown,
  };
}
