import type { CalculateTaxResult, TaxBracket } from "./types";
import {
  STANDARD_BRACKETS,
  getBracket2Rate,
  getBracket3Rate,
} from "./constants";

/** Article 15 scale, including family and youth rates, also applies to business profits. */
function buildBrackets(children: number, age: number): TaxBracket[] {
  return STANDARD_BRACKETS.map((bracket, index) => {
    let rate = bracket.rate;
    if (index === 0 && (age <= 25 || children >= 4)) {
      rate = 0;
    }
    if (index === 1) {
      rate = getBracket2Rate(children);
      if (age <= 25) {
        rate = 0;
      } else if (age <= 30) {
        rate = Math.min(rate, 0.09);
      }
    }
    if (index === 2) {
      rate = getBracket3Rate(children);
    }
    return { limit: bracket.limit, rate };
  });
}

/** Progressive income tax before Article 16 credits and new-business relief. */
export function calculateTax(
  income: number,
  children = 0,
  age = 35,
): CalculateTaxResult {
  if (income <= 0) {
    return { grossTax: 0, effectiveRate: 0, brackets: [] };
  }

  const effectiveBrackets = buildBrackets(children, age);

  let totalTax = 0;
  let prev = 0;
  const breakdown: CalculateTaxResult["brackets"] = [];

  for (const bracket of effectiveBrackets) {
    const taxable = Math.min(income, bracket.limit) - prev;
    if (taxable <= 0) {
      break;
    }

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
    if (income <= bracket.limit) {
      break;
    }
  }

  const grossTax = Math.round(totalTax * 100) / 100;

  return {
    grossTax,
    effectiveRate: income > 0 ? grossTax / income : 0,
    brackets: breakdown,
  };
}
