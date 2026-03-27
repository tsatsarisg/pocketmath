import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const TaxBracketSchema = z.object({
  limit: z.number(),
  rate: z.number(),
});

export type TaxBracket = z.infer<typeof TaxBracketSchema>;

// ---------------------------------------------------------------------------
// EFKA
// ---------------------------------------------------------------------------

export const EFKA_CATEGORY_IDS = [
  "special",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
] as const;

export const EfkaCategoryIdSchema = z.enum(EFKA_CATEGORY_IDS);

export type EfkaCategoryId = z.infer<typeof EfkaCategoryIdSchema>;

export interface EfkaCategory {
  id: EfkaCategoryId;
  label: string;
  pension: number;
  health: number;
  monthly: number;
  note: string;
}

// ---------------------------------------------------------------------------
// Tax calculation core
// ---------------------------------------------------------------------------

export const CalculateTaxInputSchema = z.object({
  income: z.number().min(0),
  children: z.number().int().min(0).default(0),
  age: z.number().int().min(16).max(120).default(35),
  isEmployee: z.boolean().default(true),
});

export type CalculateTaxInput = z.infer<typeof CalculateTaxInputSchema>;

export interface CalculateTaxResult {
  grossTax: number;
  effectiveRate: number;
  brackets: Array<{
    from: number;
    to: number;
    rate: number;
    taxable: number;
    tax: number;
  }>;
}

// ---------------------------------------------------------------------------
// Tax credit
// ---------------------------------------------------------------------------

export const TaxCreditInputSchema = z.object({
  taxableIncome: z.number().min(0),
  children: z.number().int().min(0).default(0),
});

export type TaxCreditInput = z.infer<typeof TaxCreditInputSchema>;

// ---------------------------------------------------------------------------
// Employee mode
// ---------------------------------------------------------------------------

export const EmployeeInputSchema = z.object({
  monthlyGross: z.number().min(0),
  children: z.number().int().min(0).default(0),
  age: z.number().int().min(16).max(120).default(35),
});

export type EmployeeInput = z.infer<typeof EmployeeInputSchema>;

export interface EmployeeResult {
  monthlyGross: number;
  annualGross: number;
  annualEmployeeSS: number;
  taxableIncome: number;
  grossTax: number;
  taxCredit: number;
  annualTax: number;
  annualNet: number;
  monthlyNet: number;
  employerAnnualSS: number;
  employerTotalCost: number;
  effectiveTaxRate: number;
  taxBreakdown: CalculateTaxResult;
}

// ---------------------------------------------------------------------------
// Self-employed mode
// ---------------------------------------------------------------------------

export const SelfEmployedInputSchema = z.object({
  annualRevenue: z.number().min(0),
  annualExpenses: z.number().min(0).default(0),
  efkaCategory: EfkaCategoryIdSchema.default("1st"),
  age: z.number().int().min(16).max(120).default(35),
  yearsInBusiness: z.number().int().min(1).default(4),
});

export type SelfEmployedInput = z.infer<typeof SelfEmployedInputSchema>;

export interface SelfEmployedResult {
  annualRevenue: number;
  annualExpenses: number;
  annualEFKA: number;
  taxableIncome: number;
  grossTax: number;
  firstYearBenefit: number;
  annualTax: number;
  prepaymentRate: number;
  prepayment: number;
  totalTaxWithPrepayment: number;
  annualNet: number;
  monthlyNet: number;
  effectiveTaxRate: number;
  taxBreakdown: CalculateTaxResult;
}

// ---------------------------------------------------------------------------
// Mplokaki mode
// ---------------------------------------------------------------------------

export const MplokakiInputSchema = z.object({
  annualGrossInvoiced: z.number().min(0),
  efkaCategory: EfkaCategoryIdSchema.default("1st"),
  children: z.number().int().min(0).default(0),
  age: z.number().int().min(16).max(120).default(35),
});

export type MplokakiInput = z.infer<typeof MplokakiInputSchema>;

export interface MplokakiResult {
  annualGrossInvoiced: number;
  annualEFKA: number;
  taxableIncome: number;
  grossTax: number;
  taxCredit: number;
  annualTax: number;
  totalWithheld: number;
  balanceDue: number;
  annualNet: number;
  monthlyNet: number;
  effectiveTaxRate: number;
  taxBreakdown: CalculateTaxResult;
}
