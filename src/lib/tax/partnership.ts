import { z } from "zod";
import {
  CORPORATE_TAX_RATE,
  DIVIDEND_TAX_RATE,
  getCorporatePrepaymentRate,
  HEAD_OFFICE_LEVIES,
  roundMoney,
} from "./corporate";
import { getMonthlyEfka } from "./efka";

export const PARTNERSHIP_BOOKKEEPING = ["singleEntry", "doubleEntry"] as const;
export type PartnershipBookkeeping = (typeof PARTNERSHIP_BOOKKEEPING)[number];

const ANNUAL_GEMI_FEE = 80;
export const DEFAULT_PARTNER_MONTHLY_EFKA = getMonthlyEfka("1st");
export const DEFAULT_PARTNER_PROFIT_SHARE = 99;

export const PartnershipInputSchema = z.object({
  annualRevenue: z.number().min(0),
  annualExpenses: z.number().min(0).default(0),
  bookkeeping: z.enum(PARTNERSHIP_BOOKKEEPING).default("singleEntry"),
  partnerShare: z.number().gt(0).lt(100).default(DEFAULT_PARTNER_PROFIT_SHARE),
  monthlyPartnerEfka: z.number().min(0).default(DEFAULT_PARTNER_MONTHLY_EFKA),
  monthlyOtherPartnerEfka: z
    .number()
    .min(0)
    .default(DEFAULT_PARTNER_MONTHLY_EFKA),
  headOfficeLevy: z.literal(HEAD_OFFICE_LEVIES).default(0),
  reducedPrepayment: z.boolean().default(false),
  distributionPercent: z.number().min(0).max(100).default(100),
});

export type PartnershipInput = z.input<typeof PartnershipInputSchema>;

/** Full-year O.E./E.E. with two individual partners and deductible EFKA costs. */
export function calculatePartnership(input: PartnershipInput) {
  const {
    annualRevenue,
    annualExpenses,
    bookkeeping,
    partnerShare,
    monthlyPartnerEfka,
    monthlyOtherPartnerEfka,
    headOfficeLevy,
    reducedPrepayment,
    distributionPercent,
  } = PartnershipInputSchema.parse(input);

  const annualGemiFee = ANNUAL_GEMI_FEE;
  const annualPartnerEfka = roundMoney(monthlyPartnerEfka * 12);
  const annualOtherPartnerEfka = roundMoney(monthlyOtherPartnerEfka * 12);
  const annualEfka = roundMoney(annualPartnerEfka + annualOtherPartnerEfka);
  const profitBeforeTax = roundMoney(
    annualRevenue - annualExpenses - annualGemiFee - annualEfka,
  );
  const taxableProfit = Math.max(0, profitBeforeTax);
  const corporateTax = roundMoney(taxableProfit * CORPORATE_TAX_RATE);
  const profitAfterTax = roundMoney(
    profitBeforeTax - corporateTax - headOfficeLevy,
  );
  const distributableProfit = Math.max(0, profitAfterTax);
  const distribution = roundMoney(
    distributableProfit * (distributionPercent / 100),
  );
  const retainedProfit = roundMoney(distributableProfit - distribution);
  const grossPartnerDistribution = roundMoney(
    distribution * (partnerShare / 100),
  );
  const grossOtherPartnerDistribution = roundMoney(
    distribution - grossPartnerDistribution,
  );
  const dividendTaxRate = bookkeeping === "doubleEntry" ? DIVIDEND_TAX_RATE : 0;
  const partnerDividendTax = roundMoney(
    grossPartnerDistribution * dividendTaxRate,
  );
  const otherPartnerDividendTax = roundMoney(
    grossOtherPartnerDistribution * dividendTaxRate,
  );
  const otherPartnerNet = roundMoney(
    grossOtherPartnerDistribution - otherPartnerDividendTax,
  );
  const partnerShortfall = roundMoney(
    Math.max(0, -profitAfterTax) * (partnerShare / 100),
  );
  const annualNet = roundMoney(
    grossPartnerDistribution - partnerDividendTax - partnerShortfall,
  );
  const totalTaxesAnnual = roundMoney(
    corporateTax +
      partnerDividendTax +
      otherPartnerDividendTax +
      headOfficeLevy +
      annualEfka,
  );
  const prepaymentRate = getCorporatePrepaymentRate(reducedPrepayment);
  const prepayment = roundMoney(corporateTax * prepaymentRate);

  return {
    annualRevenue,
    annualExpenses,
    annualGemiFee,
    annualPartnerEfka,
    annualOtherPartnerEfka,
    headOfficeLevy,
    taxableProfit,
    corporateTax,
    profitAfterTax,
    distribution,
    retainedProfit,
    grossPartnerDistribution,
    dividendTaxRate,
    partnerDividendTax,
    otherPartnerNet,
    partnerShortfall,
    totalTaxesAnnual,
    annualNet,
    monthlyNet: roundMoney(annualNet / 12),
    effectiveTaxRate: annualRevenue > 0 ? totalTaxesAnnual / annualRevenue : 0,
    prepaymentRate,
    prepayment,
    companyBalanceAfterPrepayment: roundMoney(
      profitAfterTax - distribution - prepayment,
    ),
  };
}

export type PartnershipResult = ReturnType<typeof calculatePartnership>;
