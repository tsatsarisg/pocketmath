import {
  SelfEmployedInputSchema,
  type SelfEmployedInput,
  type SelfEmployedResult,
} from "./types";
import {
  FIRST_YEAR_BRACKET_DISCOUNT,
  FIRST_YEAR_BENEFIT_MAX_YEARS,
  getPrepaymentRate,
} from "./constants";
import { getAnnualEfka } from "./efka";
import { calculateTax } from "./calculate-tax";

/** Full-year business estimate with the applicable minimum supplied after all adjustments. */
export function calculateSelfEmployed(
  input: SelfEmployedInput,
): SelfEmployedResult {
  const {
    annualRevenue,
    annualExpenses,
    efkaCategory,
    age,
    yearsInBusiness,
    children = 0,
    additionalMonthlyInsurance = 0,
    firstIncomeDeclaration = false,
    minimumTaxableIncome: suppliedMinimum,
  } = SelfEmployedInputSchema.parse(input);
  const minimumTaxableIncome = yearsInBusiness <= 3 ? 0 : suppliedMinimum;
  if (minimumTaxableIncome === undefined) {
    throw new Error(
      "The applicable annual minimum taxable income is required after year three.",
    );
  }
  if (efkaCategory === "special" && yearsInBusiness > 5) {
    throw new Error(
      "The special EFKA category requires eligibility within the first five years.",
    );
  }
  const round = (amount: number) => Math.round(amount * 100) / 100;
  const annualEFKA = round(
    getAnnualEfka(efkaCategory) + additionalMonthlyInsurance * 12,
  );
  const actualProfit = round(annualRevenue - annualExpenses - annualEFKA);
  const taxableIncome = Math.max(0, actualProfit, minimumTaxableIncome);
  const taxBreakdown = calculateTax(taxableIncome, children, age);
  const grossTax = taxBreakdown.grossTax;
  // Relief halves the actual first-bracket tax, so youth/family exemptions cannot be deducted twice.
  const eligible =
    yearsInBusiness <= FIRST_YEAR_BENEFIT_MAX_YEARS && annualRevenue <= 10_000;
  const firstYearBenefit = eligible
    ? round((taxBreakdown.brackets[0]?.tax ?? 0) * FIRST_YEAR_BRACKET_DISCOUNT)
    : 0;
  const annualTax = round(Math.max(0, grossTax - firstYearBenefit));
  const prepaymentRate = getPrepaymentRate(firstIncomeDeclaration);
  const prepayment = round(annualTax * prepaymentRate);
  const totalTaxWithPrepayment = round(annualTax + prepayment);
  const annualNet = round(actualProfit - annualTax);
  const monthlyNet = round(annualNet / 12);
  const netAfterPrepayment = round(annualNet - prepayment);
  const effectiveTaxRate =
    annualRevenue > 0 ? (annualTax + annualEFKA) / annualRevenue : 0;
  return {
    annualRevenue,
    annualExpenses,
    annualEFKA,
    actualProfit,
    minimumTaxableIncome,
    taxableIncome,
    grossTax,
    firstYearBenefit,
    annualTax,
    prepaymentRate,
    prepayment,
    totalTaxWithPrepayment,
    annualNet,
    monthlyNet,
    netAfterPrepayment,
    effectiveTaxRate,
    taxBreakdown,
  };
}
