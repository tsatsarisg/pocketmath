import {
  MplokakiInputSchema,
  type MplokakiInput,
  type MplokakiResult,
} from "./types";
import { MPLOKAKI_WITHHOLDING_RATE } from "./constants";
import { calculateTax } from "./calculate-tax";
import { getAnnualEfka } from "./efka";
import { taxCredit } from "./tax-credit";

/** Confirmed Article 12(2)(f) tax treatment; insurance eligibility is independent. */
export function calculateMplokaki(input: MplokakiInput): MplokakiResult {
  const {
    annualGrossInvoiced,
    efkaCategory,
    children,
    age,
    insurance,
    annualWithheld,
  } = MplokakiInputSchema.parse(input);
  const annualEFKA =
    insurance?.kind === "article39"
      ? Math.round(insurance.annualWorkerContributions * 100) / 100
      : Math.round(
          (getAnnualEfka(efkaCategory) +
            (insurance?.additionalMonthly ?? 0) * 12) *
            100,
        ) / 100;

  const taxableIncome = Math.max(
    0,
    Math.round((annualGrossInvoiced - annualEFKA) * 100) / 100,
  );

  // Employee-style tax with family reductions
  const taxBreakdown = calculateTax(taxableIncome, children, age);
  const grossTax = taxBreakdown.grossTax;
  const credit = Math.min(grossTax, taxCredit(taxableIncome, children));
  const annualTax = Math.round(Math.max(0, grossTax - credit) * 100) / 100;

  // Actual withholding, or the explicitly disclosed 20% scenario assumption.
  const totalWithheld =
    Math.round(
      (annualWithheld ?? annualGrossInvoiced * MPLOKAKI_WITHHOLDING_RATE) * 100,
    ) / 100;

  // Balance due: positive = owes money, negative = refund
  const balanceDue = Math.round((annualTax - totalWithheld) * 100) / 100;

  const annualNet =
    Math.round((annualGrossInvoiced - annualEFKA - annualTax) * 100) / 100;
  const monthlyNet = Math.round((annualNet / 12) * 100) / 100;

  const effectiveTaxRate =
    annualGrossInvoiced > 0
      ? (annualTax + annualEFKA) / annualGrossInvoiced
      : 0;

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
