import type { SelfEmployedInput, SelfEmployedResult } from "./types";
import {
  FIRST_YEAR_BRACKET_DISCOUNT,
  FIRST_YEAR_BENEFIT_MAX_YEARS,
  STANDARD_BRACKETS,
  getEfkaCategory,
  getPrepaymentRate,
} from "./constants";
import { calculateTax } from "./calculate-tax";

/**
 * Calculate the first-3-years benefit: 50% reduction on the first bracket
 * (9% becomes 4.5% on income up to 10,000).
 *
 * Returns the amount saved (not the total tax).
 */
function firstYearBenefitAmount(
  taxableIncome: number,
  yearsInBusiness: number,
): number {
  if (yearsInBusiness > FIRST_YEAR_BENEFIT_MAX_YEARS) return 0;

  // The benefit is 50% off the first bracket (0–10,000 at 9%)
  const firstBracketIncome = Math.min(
    Math.max(0, taxableIncome),
    STANDARD_BRACKETS[0]!.limit,
  );
  const normalTax = firstBracketIncome * STANDARD_BRACKETS[0]!.rate;
  const discountedTax = normalTax * FIRST_YEAR_BRACKET_DISCOUNT;

  return Math.round(discountedTax * 100) / 100;
}

/**
 * Calculate the full tax breakdown for a self-employed individual (Ατομική Επιχείρηση).
 *
 * Formula (2026):
 *   annualEFKA      = selectedCategory.monthly x 12
 *   taxableIncome   = max(0, annualRevenue - annualExpenses - annualEFKA)
 *   annualTax       = calculateTax(taxableIncome, 0, age, isEmployee=false)
 *                     // NO tax credit, NO family reductions
 *   First 3 years:    50% reduction on first bracket (9% -> 4.5% on first 10k)
 *   prepay           = annualTax x prepaymentRate
 *   annualNet        = annualRevenue - annualExpenses - annualEFKA - annualTax
 */
export function calculateSelfEmployed(
  input: SelfEmployedInput,
): SelfEmployedResult {
  const { annualRevenue, annualExpenses, efkaCategory, age, yearsInBusiness } =
    input;

  const category = getEfkaCategory(efkaCategory);
  const annualEFKA = Math.round(category.monthly * 12 * 100) / 100;

  const taxableIncome = Math.max(
    0,
    Math.round((annualRevenue - annualExpenses - annualEFKA) * 100) / 100,
  );

  // Self-employed: no family reductions (children=0, isEmployee=false)
  const taxBreakdown = calculateTax(taxableIncome, 0, age, false);
  const grossTax = taxBreakdown.grossTax;

  // First 3 years benefit: 50% off first bracket
  const firstYearBenefit = firstYearBenefitAmount(
    taxableIncome,
    yearsInBusiness,
  );
  const annualTax =
    Math.round(Math.max(0, grossTax - firstYearBenefit) * 100) / 100;

  // Prepayment
  const prepaymentRate = getPrepaymentRate(yearsInBusiness);
  const prepayment = Math.round(annualTax * prepaymentRate * 100) / 100;
  const totalTaxWithPrepayment =
    Math.round((annualTax + prepayment) * 100) / 100;

  const annualNet =
    Math.round(
      (annualRevenue - annualExpenses - annualEFKA - annualTax) * 100,
    ) / 100;
  const monthlyNet = Math.round((annualNet / 12) * 100) / 100;

  const effectiveTaxRate = annualRevenue > 0 ? annualTax / annualRevenue : 0;

  return {
    annualRevenue,
    annualExpenses,
    annualEFKA,
    taxableIncome,
    grossTax,
    firstYearBenefit,
    annualTax,
    prepaymentRate,
    prepayment,
    totalTaxWithPrepayment,
    annualNet,
    monthlyNet,
    effectiveTaxRate,
    taxBreakdown,
  };
}
