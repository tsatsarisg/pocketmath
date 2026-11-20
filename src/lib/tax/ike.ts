import { z } from "zod";
import { getAnnualEfka } from "./efka";
import { EfkaCategoryIdSchema } from "./types";
import {
  CORPORATE_TAX_RATE,
  DIVIDEND_TAX_RATE,
  getCorporatePrepaymentRate,
  HEAD_OFFICE_LEVIES,
  roundMoney as round,
  type HeadOfficeLevy,
} from "./corporate";

const LEGAL_RESERVE_RATE = 0.05;
const ANNUAL_GEMI_FEE = 100;

export const IKE_HEAD_OFFICE_LEVIES = HEAD_OFFICE_LEVIES;
export type IkeHeadOfficeLevy = HeadOfficeLevy;

export const IkeInputSchema = z.object({
  annualRevenue: z.number().min(0),
  annualExpenses: z.number().min(0).default(0),
  efkaCategory: EfkaCategoryIdSchema.default("1st"),
  additionalMonthlyInsurance: z.number().min(0).default(0),
  headOfficeLevy: z.literal(IKE_HEAD_OFFICE_LEVIES).default(0),
  reducedPrepayment: z.boolean().default(false),
  distributionPercent: z.number().min(0).max(100).default(100),
});

export type IkeInput = z.input<typeof IkeInputSchema>;

/** Full-year estimate for a sole owner-manager who takes dividends only. */
export function calculateIke(input: IkeInput) {
  const {
    annualRevenue,
    annualExpenses,
    efkaCategory,
    additionalMonthlyInsurance,
    headOfficeLevy,
    reducedPrepayment,
    distributionPercent,
  } = IkeInputSchema.parse(input);

  const annualGemiFee = ANNUAL_GEMI_FEE;
  const annualEFKA = round(
    getAnnualEfka(efkaCategory) + additionalMonthlyInsurance * 12,
  );

  const profitBeforeTax = round(annualRevenue - annualExpenses - annualGemiFee);
  const taxableProfit = Math.max(0, profitBeforeTax);
  const corporateTax = round(taxableProfit * CORPORATE_TAX_RATE);
  // The business levy is not deductible for corporate income tax.
  const profitAfterTax = round(profitBeforeTax - corporateTax - headOfficeLevy);
  const legalReserve = round(Math.max(0, profitAfterTax) * LEGAL_RESERVE_RATE);
  const grossDividend = round(
    (Math.max(0, profitAfterTax) - legalReserve) * (distributionPercent / 100),
  );
  const dividendTax = round(grossDividend * DIVIDEND_TAX_RATE);
  const netDividend = round(grossDividend - dividendTax);
  const retainedProfit = round(Math.max(0, profitAfterTax) - grossDividend);
  const operatingShortfall = Math.max(0, -profitAfterTax);
  const annualNet = round(netDividend - annualEFKA - operatingShortfall);
  const totalTaxesAnnual = round(
    corporateTax + dividendTax + headOfficeLevy + annualEFKA,
  );

  const prepaymentRate = getCorporatePrepaymentRate(reducedPrepayment);
  const prepayment = round(corporateTax * prepaymentRate);
  const companyBalanceAfterPrepayment = round(
    profitAfterTax - grossDividend - prepayment,
  );

  return {
    annualRevenue,
    annualExpenses,
    annualGemiFee,
    headOfficeLevy,
    annualEFKA,
    taxableProfit,
    corporateTax,
    profitAfterTax,
    legalReserve,
    grossDividend,
    dividendTax,
    netDividend,
    retainedProfit,
    operatingShortfall,
    totalTaxesAnnual,
    annualNet,
    monthlyNet: round(annualNet / 12),
    effectiveTaxRate: annualRevenue > 0 ? totalTaxesAnnual / annualRevenue : 0,
    prepaymentRate,
    prepayment,
    companyBalanceAfterPrepayment,
  };
}

export type IkeResult = ReturnType<typeof calculateIke>;
