import {
  TAX_CREDIT_BASE,
  TAX_CREDIT_EXTRA_PER_CHILD,
  TAX_CREDIT_PHASE_OUT_THRESHOLD,
  TAX_CREDIT_PHASE_OUT_PER_1000,
} from "./constants";

/**
 * Get the base credit amount before phase-out.
 *
 * 0 children: 777, 1: 900, 2: 1,120, 3: 1,340, 4: 1,580, 5: 1,780, 6+: +220 per additional.
 */
function getBaseCredit(children: number): number {
  if (children <= 5) {
    return TAX_CREDIT_BASE[children] ?? 777;
  }
  // 5 children = 1780, each additional child adds 220
  const base5 = TAX_CREDIT_BASE[5] ?? 1_780;
  return base5 + (children - 5) * TAX_CREDIT_EXTRA_PER_CHILD;
}

/**
 * Calculate the tax credit for employees and mplokaki workers.
 *
 * For income > 12,000 EUR the credit reduces by 20 EUR per 1,000 EUR
 * above the threshold (i.e. 2% of the excess).
 *
 * The credit cannot go below zero.
 *
 * @param taxableIncome - Taxable income after deductions
 * @param children      - Number of dependent children
 * @returns The applicable tax credit in EUR
 */
export function taxCredit(taxableIncome: number, children = 0): number {
  const base = getBaseCredit(children);

  // Phase-out does NOT apply for 5+ children
  if (children >= 5 || taxableIncome <= TAX_CREDIT_PHASE_OUT_THRESHOLD) {
    return base;
  }

  const excess = taxableIncome - TAX_CREDIT_PHASE_OUT_THRESHOLD;
  const reduction = Math.floor(excess / 1_000) * TAX_CREDIT_PHASE_OUT_PER_1000;

  return Math.max(0, Math.round((base - reduction) * 100) / 100);
}
