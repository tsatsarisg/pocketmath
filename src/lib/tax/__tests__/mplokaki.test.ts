/**
 * Tests for the mplokaki (block invoice) tax calculation module.
 *
 * Mplokaki workers occupy a hybrid category: they are taxed on the employee
 * scale (family reductions, tax credit) but pay EFKA like self-employed
 * (choose category). Their clients withhold 20% at source from gross invoiced.
 *
 * Key formula (2026):
 *   annualEFKA    = selectedCategory.monthly × 12
 *   taxableIncome = max(0, annualGrossInvoiced − annualEFKA)
 *   grossTax      = calculateTax(taxableIncome, children, age, isEmployee=true)
 *   taxCredit     = taxCredit(taxableIncome, children)
 *   annualTax     = max(0, grossTax − taxCredit)
 *   totalWithheld = annualGrossInvoiced × 20%
 *   balanceDue    = annualTax − totalWithheld  (positive = owes, negative = refund)
 *   annualNet     = annualGrossInvoiced − annualEFKA − annualTax
 *   monthlyNet    = annualNet / 12
 *
 * Constants used:
 *   MPLOKAKI_WITHHOLDING_RATE = 0.20
 *   1st EFKA monthly          = 250.77 → annual ≈ 3,009.24
 */
import { describe, it, expect } from "vitest";
import { calculateMplokaki } from "../mplokaki";
import { MPLOKAKI_WITHHOLDING_RATE } from "../constants";

// ---------------------------------------------------------------------------
// 20% withholding on gross invoiced amount
// ---------------------------------------------------------------------------

describe("calculateMplokaki — 20% withholding on gross invoiced", () => {
  it("totalWithheld = annualGrossInvoiced × 20%", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 40_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.totalWithheld).toBeCloseTo(40_000 * MPLOKAKI_WITHHOLDING_RATE, 2);
  });

  it("totalWithheld is applied on gross (before EFKA or tax deductions)", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 50_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.totalWithheld).toBeCloseTo(50_000 * 0.20, 2);
  });

  it("withholding scales linearly with gross invoiced", () => {
    const r1 = calculateMplokaki({ annualGrossInvoiced: 30_000, efkaCategory: "1st", children: 0, age: 35 });
    const r2 = calculateMplokaki({ annualGrossInvoiced: 60_000, efkaCategory: "1st", children: 0, age: 35 });
    expect(r2.totalWithheld).toBeCloseTo(r1.totalWithheld * 2, 2);
  });
});

// ---------------------------------------------------------------------------
// Tax is calculated on (invoiced − EFKA), using employee brackets and tax credit
// ---------------------------------------------------------------------------

describe("calculateMplokaki — tax base is invoiced minus EFKA", () => {
  it("taxableIncome = annualGrossInvoiced − annualEFKA", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 40_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.taxableIncome).toBeCloseTo(
      result.annualGrossInvoiced - result.annualEFKA,
      2,
    );
  });

  it("annualEFKA = 1st category monthly × 12 ≈ 3,009.24", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 40_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.annualEFKA).toBeCloseTo(250.77 * 12, 2);
  });

  it("tax credit is applied: annualTax < grossTax when credit > 0", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 25_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.taxCredit).toBeGreaterThan(0);
    expect(result.annualTax).toBeLessThan(result.grossTax);
  });

  it("taxBreakdown uses employee-style brackets (isEmployee=true)", () => {
    // With 3 children, bracket 2 should be reduced (9% instead of 20%)
    const result = calculateMplokaki({
      annualGrossInvoiced: 40_000,
      efkaCategory: "1st",
      children: 3,
      age: 35,
    });
    // taxableIncome ≈ 36,990.76 — bracket 2 (10k–20k) should be at 9% for 3 children
    expect(result.taxBreakdown.brackets[1]!.rate).toBe(0.09);
  });
});

// ---------------------------------------------------------------------------
// balanceDue: positive (owes) at high income, negative (refund) at low income
// ---------------------------------------------------------------------------

describe("calculateMplokaki — balanceDue direction", () => {
  it("balanceDue = annualTax − totalWithheld", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 60_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.balanceDue).toBeCloseTo(result.annualTax - result.totalWithheld, 2);
  });

  it("high income: balanceDue is positive (actual tax exceeds 20% withholding)", () => {
    // At 80,000 invoiced the effective tax rate exceeds 20% withholding
    // taxable ≈ 76,990.76; grossTax is substantial; credit phases out
    const result = calculateMplokaki({
      annualGrossInvoiced: 80_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.balanceDue).toBeGreaterThan(0);
  });

  it("low income: balanceDue is negative (20% withholding exceeds actual tax — refund)", () => {
    // At 15,000 invoiced the effective income tax rate is very low relative to 20% withholding
    // taxable ≈ 11,990.76; grossTax ≈ 10,000×9%=900; credit=777 (income≈12k, no phase-out)
    // annualTax ≈ 123; totalWithheld = 15,000×20% = 3,000 → balanceDue ≈ -2,877
    const result = calculateMplokaki({
      annualGrossInvoiced: 15_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.balanceDue).toBeLessThan(0);
  });

  it("moderate income: withholding and tax converge — crossover is between low and high", () => {
    const low = calculateMplokaki({ annualGrossInvoiced: 15_000, efkaCategory: "1st", children: 0, age: 35 });
    const high = calculateMplokaki({ annualGrossInvoiced: 80_000, efkaCategory: "1st", children: 0, age: 35 });
    expect(low.balanceDue).toBeLessThan(0);
    expect(high.balanceDue).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// annualNet and monthlyNet
// ---------------------------------------------------------------------------

describe("calculateMplokaki — net income", () => {
  it("annualNet = annualGrossInvoiced − annualEFKA − annualTax", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 40_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.annualNet).toBeCloseTo(
      result.annualGrossInvoiced - result.annualEFKA - result.annualTax,
      2,
    );
  });

  it("monthlyNet = annualNet / 12", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 40_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.monthlyNet).toBeCloseTo(result.annualNet / 12, 2);
  });
});

// ---------------------------------------------------------------------------
// Youth benefit: age <= 25 produces lower tax than age 35
// ---------------------------------------------------------------------------

describe("calculateMplokaki — youth benefit (age effect)", () => {
  it("age <= 25: grossTax is lower than age 35 at the same invoiced amount", () => {
    const young = calculateMplokaki({
      annualGrossInvoiced: 30_000,
      efkaCategory: "1st",
      children: 0,
      age: 25,
    });
    const adult = calculateMplokaki({
      annualGrossInvoiced: 30_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(young.grossTax).toBeLessThan(adult.grossTax);
  });

  it("age <= 25: annualTax is lower, so annualNet is higher", () => {
    const young = calculateMplokaki({
      annualGrossInvoiced: 30_000,
      efkaCategory: "1st",
      children: 0,
      age: 25,
    });
    const adult = calculateMplokaki({
      annualGrossInvoiced: 30_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(young.annualTax).toBeLessThan(adult.annualTax);
    expect(young.annualNet).toBeGreaterThan(adult.annualNet);
  });

  it("age 26–30: grossTax is lower than age 35 (bracket 2 at 9% not 20%)", () => {
    const young = calculateMplokaki({
      annualGrossInvoiced: 30_000,
      efkaCategory: "1st",
      children: 0,
      age: 28,
    });
    const adult = calculateMplokaki({
      annualGrossInvoiced: 30_000,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(young.grossTax).toBeLessThan(adult.grossTax);
  });
});

// ---------------------------------------------------------------------------
// Children / family reductions on mplokaki
// ---------------------------------------------------------------------------

describe("calculateMplokaki — children reduce tax via family brackets and higher credit", () => {
  it("3 children: annualTax is lower than 0 children at the same income", () => {
    const base = { annualGrossInvoiced: 40_000, efkaCategory: "1st" as const, age: 35 };
    const c0 = calculateMplokaki({ ...base, children: 0 });
    const c3 = calculateMplokaki({ ...base, children: 3 });
    expect(c3.annualTax).toBeLessThan(c0.annualTax);
  });

  it("taxCredit increases with children count", () => {
    const base = { annualGrossInvoiced: 20_000, efkaCategory: "1st" as const, age: 35 };
    const c0 = calculateMplokaki({ ...base, children: 0 });
    const c2 = calculateMplokaki({ ...base, children: 2 });
    expect(c2.taxCredit).toBeGreaterThan(c0.taxCredit);
  });
});

// ---------------------------------------------------------------------------
// Zero income edge case
// ---------------------------------------------------------------------------

describe("calculateMplokaki — zero invoiced amount", () => {
  it("zero gross invoiced produces zero totalWithheld", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 0,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.totalWithheld).toBe(0);
  });

  it("zero gross invoiced: taxableIncome is clamped to 0 (EFKA cannot push it negative)", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 0,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.taxableIncome).toBe(0);
  });

  it("zero gross invoiced: annualTax = 0", () => {
    const result = calculateMplokaki({
      annualGrossInvoiced: 0,
      efkaCategory: "1st",
      children: 0,
      age: 35,
    });
    expect(result.annualTax).toBe(0);
  });
});
