import type { EfkaCategory, EfkaCategoryId, TaxBracket } from "./types";

// ---------------------------------------------------------------------------
// Tax year
// ---------------------------------------------------------------------------

export const TAX_YEAR = 2026;

// ---------------------------------------------------------------------------
// Standard 6-bracket scale (2026 — Law 5246/2025)
// ---------------------------------------------------------------------------

export const STANDARD_BRACKETS: readonly TaxBracket[] = [
  { limit: 10_000, rate: 0.09 },
  { limit: 20_000, rate: 0.20 },
  { limit: 30_000, rate: 0.26 },
  { limit: 40_000, rate: 0.34 },
  { limit: 60_000, rate: 0.39 },
  { limit: Infinity, rate: 0.44 },
] as const;

// ---------------------------------------------------------------------------
// Family-based reductions — 2nd bracket (10,001–20,000)
// Key = number of children, value = rate that replaces 20%
// ---------------------------------------------------------------------------

export const FAMILY_RATES_BRACKET_2: Readonly<Record<number, number>> = {
  0: 0.20,
  1: 0.18,
  2: 0.16,
  3: 0.09,
  // 4+ → 0%
};

/** Get the 2nd-bracket rate based on number of children. 4+ children = 0%. */
export function getBracket2Rate(children: number): number {
  if (children >= 4) return 0;
  return FAMILY_RATES_BRACKET_2[children] ?? 0.20;
}

// ---------------------------------------------------------------------------
// Family-based reductions — 3rd bracket (20,001–30,000)
// ---------------------------------------------------------------------------

export const FAMILY_RATES_BRACKET_3: Readonly<Record<number, number>> = {
  0: 0.26,
  1: 0.24,
  2: 0.22,
  3: 0.20,
  4: 0.18,
  // 5+ → 16%
};

/** Get the 3rd-bracket rate based on number of children. 5+ children = 16%. */
export function getBracket3Rate(children: number): number {
  if (children >= 5) return 0.16;
  return FAMILY_RATES_BRACKET_3[children] ?? 0.26;
}

// ---------------------------------------------------------------------------
// Tax credit amounts (employees & mplokaki only)
// ---------------------------------------------------------------------------

export const TAX_CREDIT_BASE: Readonly<Record<number, number>> = {
  0: 777,
  1: 810,
  2: 900,
  3: 1_120,
  4: 1_340,
};

/** Additional credit per child beyond 4. */
export const TAX_CREDIT_EXTRA_PER_CHILD = 220;

/** Income threshold above which the credit phases out. */
export const TAX_CREDIT_PHASE_OUT_THRESHOLD = 12_000;

/** Reduction per EUR 1,000 above the threshold. */
export const TAX_CREDIT_PHASE_OUT_PER_1000 = 20;

// ---------------------------------------------------------------------------
// Employee EFKA rates
// ---------------------------------------------------------------------------

export const EMPLOYEE_SS_RATE = 0.1387;
export const EMPLOYER_SS_RATE = 0.2179;

/** Monthly contribution ceiling (EUR). */
export const EMPLOYEE_SS_CEILING_MONTHLY = 7_761.94;

/** Number of salary months per year (12 + Christmas + Easter + Summer leave). */
export const SALARY_MONTHS = 14;

// ---------------------------------------------------------------------------
// Self-employed EFKA categories (2026, +2.5% from 2025)
// ---------------------------------------------------------------------------

export const EFKA_CATEGORIES: readonly EfkaCategory[] = [
  {
    id: "special",
    label: "Ειδική",
    pension: 111.06,
    health: 39.40,
    monthly: 150.46,
    note: "First 5 years only",
  },
  {
    id: "1st",
    label: "1η",
    pension: 185.09,
    health: 65.68,
    monthly: 250.77,
    note: "Default",
  },
  {
    id: "2nd",
    label: "2η",
    pension: 222.12,
    health: 78.81,
    monthly: 300.93,
    note: "",
  },
  {
    id: "3rd",
    label: "3η",
    pension: 281.82,
    health: 78.81,
    monthly: 360.63,
    note: "",
  },
  {
    id: "4th",
    label: "4η",
    pension: 354.66,
    health: 78.81,
    monthly: 433.47,
    note: "",
  },
  {
    id: "5th",
    label: "5η",
    pension: 440.64,
    health: 78.81,
    monthly: 519.45,
    note: "",
  },
  {
    id: "6th",
    label: "6η",
    pension: 597.06,
    health: 78.81,
    monthly: 675.87,
    note: "",
  },
] as const;

// ---------------------------------------------------------------------------
// Prepayment rates for self-employed
// ---------------------------------------------------------------------------

export const PREPAYMENT_RATE_FIRST_YEAR = 0.275; // 55% × 50% discount
export const PREPAYMENT_RATE_STANDARD = 0.55;

/** Get prepayment rate based on years in business. */
export function getPrepaymentRate(yearsInBusiness: number): number {
  if (yearsInBusiness <= 1) return PREPAYMENT_RATE_FIRST_YEAR;
  return PREPAYMENT_RATE_STANDARD;
}

// ---------------------------------------------------------------------------
// Mplokaki withholding rate
// ---------------------------------------------------------------------------

export const MPLOKAKI_WITHHOLDING_RATE = 0.20;

// ---------------------------------------------------------------------------
// First-year entrepreneur benefit
// ---------------------------------------------------------------------------

/** Discount on first bracket for first 3 years: 50% (9% → 4.5%). */
export const FIRST_YEAR_BRACKET_DISCOUNT = 0.5;
export const FIRST_YEAR_BENEFIT_MAX_YEARS = 3;

// ---------------------------------------------------------------------------
// Lookup helper for EFKA categories
// ---------------------------------------------------------------------------

const efkaCategoryMap = new Map<EfkaCategoryId, EfkaCategory>(
  EFKA_CATEGORIES.map((c) => [c.id, c]),
);

export function getEfkaCategory(id: EfkaCategoryId): EfkaCategory {
  const category = efkaCategoryMap.get(id);
  if (!category) {
    throw new Error(`Unknown EFKA category: ${id}`);
  }
  return category;
}
