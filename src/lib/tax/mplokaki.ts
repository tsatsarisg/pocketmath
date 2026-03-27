import type { MplokakiInput, MplokakiResult } from "./types";
import { MPLOKAKI_WITHHOLDING_RATE, getEfkaCategory } from "./constants";
import { calculateTax } from "./calculate-tax";
import { taxCredit } from "./tax-credit";

/**
 * Calculate the full tax breakdown for a mplokaki (block invoice) worker.
 *
 * Qualifying mplokaki workers are taxed on the employee scale with family
 * reductions and get the tax credit. They pay EFKA like self-employed
 * (choose category) and their clients withhold 20% at source.
 *
 * Formula (2026):
 *   annualEFKA      = selectedCategory.monthly x 12
 *   taxableIncome   = annualGrossInvoiced - annualEFKA
 *   grossTax        = calculateTax(taxableIncome, children, age, isEmployee=true)
 *   credit          = taxCredit(taxableIncome, children)
 *   annualTax       = max(0, grossTax - credit)
 *   totalWithheld   = annualGrossInvoiced x 20%
 *   balanceDue      = annualTax - totalWithheld  (negative = refund)
 *   annualNet       = annualGrossInvoiced - annualEFKA - annualTax
 */
export function calculateMplokaki(input: MplokakiInput): MplokakiResult {
  const { annualGrossInvoiced, efkaCategory, children, age } = input;

  const category = getEfkaCategory(efkaCategory);
  const annualEFKA = Math.round(category.monthly * 12 * 100) / 100;

  const taxableIncome = Math.max(
    0,
    Math.round((annualGrossInvoiced - annualEFKA) * 100) / 100,
  );

  // Employee-style tax with family reductions
  const taxBreakdown = calculateTax(taxableIncome, children, age, true);
  const grossTax = taxBreakdown.grossTax;
  const credit = taxCredit(taxableIncome, children);
  const annualTax = Math.round(Math.max(0, grossTax - credit) * 100) / 100;

  // 20% withholding at source
  const totalWithheld =
    Math.round(annualGrossInvoiced * MPLOKAKI_WITHHOLDING_RATE * 100) / 100;

  // Balance due: positive = owes money, negative = refund
  const balanceDue = Math.round((annualTax - totalWithheld) * 100) / 100;

  const annualNet =
    Math.round((annualGrossInvoiced - annualEFKA - annualTax) * 100) / 100;
  const monthlyNet = Math.round((annualNet / 12) * 100) / 100;

  const effectiveTaxRate =
    annualGrossInvoiced > 0 ? (annualTax + annualEFKA) / annualGrossInvoiced : 0;

  return {
    annualGrossInvoiced,
    annualEFKA,
    taxableIncome,
    grossTax,
    taxCredit: credit,
    annualTax,
    totalWithheld,
    balanceDue,
    annualNet,
    monthlyNet,
    effectiveTaxRate,
    taxBreakdown,
  };
}
