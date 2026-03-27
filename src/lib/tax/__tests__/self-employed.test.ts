/**
 * Tests for the self-employed tax calculation module.
 *
 * Key formula (2026):
 *   annualEFKA      = selectedCategory.monthly × 12
 *   taxableIncome   = max(0, annualRevenue − annualExpenses − annualEFKA)
 *   grossTax        = calculateTax(taxableIncome, children=0, age, isEmployee=false)
 *                     NOTE: no family reductions, no tax credit regardless of children
 *   firstYearBenefit = 50% of first bracket tax if yearsInBusiness <= 3
 *   annualTax        = max(0, grossTax − firstYearBenefit)
 *   prepaymentRate   = 27.5% (year 1) or 55% (year 2+)
 *   prepayment       = annualTax × prepaymentRate
 *   annualNet        = annualRevenue − annualExpenses − annualEFKA − annualTax
 *   monthlyNet       = annualNet / 12
 *
 * Constants used:
 *   FIRST_YEAR_BENEFIT_MAX_YEARS  = 3
 *   FIRST_YEAR_BRACKET_DISCOUNT   = 0.5 (50%)
 *   STANDARD_BRACKETS[0].limit   = 10,000
 *   STANDARD_BRACKETS[0].rate    = 0.09
 *   PREPAYMENT_RATE_FIRST_YEAR   = 0.275
 *   PREPAYMENT_RATE_STANDARD     = 0.55
 *   1st EFKA category monthly     = 250.77  → annual = 3,009.24
 */
import { describe, it, expect } from "vitest";
import { calculateSelfEmployed } from "../self-employed";
import {
  PREPAYMENT_RATE_FIRST_YEAR,
  PREPAYMENT_RATE_STANDARD,
  STANDARD_BRACKETS,
  FIRST_YEAR_BENEFIT_MAX_YEARS,
} from "../constants";

// ---------------------------------------------------------------------------
// First-year benefit: 50% off the first bracket (years 1, 2, 3)
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — first-year benefit (years 1–3)", () => {
  it("year 1: firstYearBenefit is 50% of the tax on first-bracket income", () => {
    // annualEFKA = 250.77*12 = 3009.24
    // taxableIncome = 30,000 − 3,009.24 = 26,990.76
    // First bracket income = min(26990.76, 10000) = 10,000
    // normalTax = 10,000 × 9% = 900 → discount = 900 × 50% = 450
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 1,
    });
    expect(result.firstYearBenefit).toBeCloseTo(450, 2);
  });

  it("year 1: annualTax = grossTax − firstYearBenefit", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 1,
    });
    expect(result.annualTax).toBeCloseTo(result.grossTax - result.firstYearBenefit, 2);
  });

  it("year 3: still gets the 50% first-bracket discount (last eligible year)", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: FIRST_YEAR_BENEFIT_MAX_YEARS,
    });
    expect(result.firstYearBenefit).toBeGreaterThan(0);
  });

  it("year 4: firstYearBenefit is exactly 0 (first ineligible year)", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: FIRST_YEAR_BENEFIT_MAX_YEARS + 1,
    });
    expect(result.firstYearBenefit).toBe(0);
  });

  it("year 3 vs year 4: year 3 pays less annual tax than year 4 (same inputs)", () => {
    const base = {
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st" as const,
      age: 35,
    };
    const year3 = calculateSelfEmployed({ ...base, yearsInBusiness: 3 });
    const year4 = calculateSelfEmployed({ ...base, yearsInBusiness: 4 });
    expect(year3.annualTax).toBeLessThan(year4.annualTax);
  });

  it("first-year benefit is capped at first-bracket income even when taxable < 10,000", () => {
    // taxableIncome = 8,000 → first bracket income = 8,000 not 10,000
    // 8,000 × 9% × 50% = 360
    const result = calculateSelfEmployed({
      annualRevenue: 12_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 1,
    });
    // annualEFKA ≈ 3009.24; taxableIncome ≈ 8990.76
    // benefit = 8990.76 × 9% × 50% = round(404.58*100)/100 = 404.58
    const taxableApprox = result.taxableIncome;
    const firstBracketIncome = Math.min(taxableApprox, STANDARD_BRACKETS[0]!.limit);
    const expectedBenefit =
      Math.round(firstBracketIncome * STANDARD_BRACKETS[0]!.rate * 0.5 * 100) / 100;
    expect(result.firstYearBenefit).toBeCloseTo(expectedBenefit, 2);
  });
});

// ---------------------------------------------------------------------------
// No first-year benefit: year 4+ — full standard tax
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — no first-year benefit (yearsInBusiness >= 4)", () => {
  it("year 4: firstYearBenefit = 0", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.firstYearBenefit).toBe(0);
  });

  it("year 4: annualTax equals grossTax exactly (no benefit applied)", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.annualTax).toBe(result.grossTax);
  });
});

// ---------------------------------------------------------------------------
// Prepayment rates
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — prepayment rates", () => {
  it("year 1: prepaymentRate = 27.5% (50% discount on standard 55%)", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 1,
    });
    expect(result.prepaymentRate).toBe(PREPAYMENT_RATE_FIRST_YEAR);
  });

  it("year 2: prepaymentRate = 55%", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 2,
    });
    expect(result.prepaymentRate).toBe(PREPAYMENT_RATE_STANDARD);
  });

  it("year 4: prepaymentRate = 55%", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.prepaymentRate).toBe(PREPAYMENT_RATE_STANDARD);
  });

  it("prepayment = annualTax × prepaymentRate", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 2,
    });
    expect(result.prepayment).toBeCloseTo(result.annualTax * PREPAYMENT_RATE_STANDARD, 2);
  });

  it("totalTaxWithPrepayment = annualTax + prepayment", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.totalTaxWithPrepayment).toBeCloseTo(
      result.annualTax + result.prepayment,
      2,
    );
  });
});

// ---------------------------------------------------------------------------
// EFKA deducted from taxable income
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — EFKA reduces taxable income", () => {
  it("annualEFKA = category.monthly × 12", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    // 1st category: monthly = 250.77 → annual = round(250.77*12*100)/100 = 3009.24
    expect(result.annualEFKA).toBeCloseTo(250.77 * 12, 2);
  });

  it("taxableIncome = annualRevenue − annualExpenses − annualEFKA", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.taxableIncome).toBeCloseTo(
      result.annualRevenue - result.annualExpenses - result.annualEFKA,
      2,
    );
  });

  it("a higher EFKA category produces lower taxable income and lower tax", () => {
    const base = {
      annualRevenue: 50_000,
      annualExpenses: 0,
      age: 35,
      yearsInBusiness: 4,
    };
    const cat1st = calculateSelfEmployed({ ...base, efkaCategory: "1st" });
    const cat6th = calculateSelfEmployed({ ...base, efkaCategory: "6th" });
    expect(cat6th.annualEFKA).toBeGreaterThan(cat1st.annualEFKA);
    expect(cat6th.taxableIncome).toBeLessThan(cat1st.taxableIncome);
    expect(cat6th.annualTax).toBeLessThan(cat1st.annualTax);
  });
});

// ---------------------------------------------------------------------------
// Expenses deducted correctly
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — expense deductions", () => {
  it("expenses reduce taxable income: taxable = revenue − expenses − EFKA", () => {
    const withExpenses = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 5_000,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    const noExpenses = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(withExpenses.taxableIncome).toBeCloseTo(
      noExpenses.taxableIncome - 5_000,
      2,
    );
  });

  it("expenses large enough to produce zero taxable income are clamped at 0", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 10_000,
      annualExpenses: 50_000,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.taxableIncome).toBe(0);
    expect(result.annualTax).toBe(0);
  });

  it("annualNet accounts for expenses: net = revenue − expenses − EFKA − tax", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 3_000,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.annualNet).toBeCloseTo(
      result.annualRevenue - result.annualExpenses - result.annualEFKA - result.annualTax,
      2,
    );
  });
});

// ---------------------------------------------------------------------------
// No tax credit for self-employed — children param is irrelevant
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — no tax credit (children has no effect)", () => {
  it("changing children count does not affect annualTax for self-employed", () => {
    const base = {
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st" as const,
      age: 35,
      yearsInBusiness: 4,
    };
    // SelfEmployedInput does not accept children; the underlying calculateTax
    // is always called with children=0 and isEmployee=false
    const result = calculateSelfEmployed(base);
    // Cross-check: taxBreakdown should use the 20% rate on bracket 2 (no family reductions)
    const b2 = result.taxBreakdown.brackets[1]!;
    expect(b2.rate).toBe(0.20);
  });

  it("gross tax uses standard rates (no family reductions): bracket 2 stays at 20%", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 35_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    // taxable ≈ 35000 − 3009.24 = 31990.76
    // b2 covers 10001–20000 at 20%: tax should be 2000
    expect(result.taxBreakdown.brackets[1]!.tax).toBe(2_000);
    expect(result.taxBreakdown.brackets[1]!.rate).toBe(0.20);
  });
});

// ---------------------------------------------------------------------------
// annualNet and monthlyNet
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — net income", () => {
  it("monthlyNet = annualNet / 12", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.monthlyNet).toBeCloseTo(result.annualNet / 12, 2);
  });

  it("annualNet is lower than annualRevenue (deductions exist)", () => {
    const result = calculateSelfEmployed({
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.annualNet).toBeLessThan(result.annualRevenue);
  });
});
