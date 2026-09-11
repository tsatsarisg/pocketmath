import { describe, it, expect } from "vitest";
import { calculateSelfEmployed } from "../self-employed";
import {
  PREPAYMENT_RATE_FIRST_YEAR,
  PREPAYMENT_RATE_STANDARD,
} from "../constants";

// ---------------------------------------------------------------------------
// First-year benefit: 50% off the first bracket (years 1, 2, 3)
// ---------------------------------------------------------------------------

describe("new business relief revenue boundary", () => {
  const base = { annualRevenue: 10000, annualExpenses: 0, efkaCategory: "1st" as const, age: 35, yearsInBusiness: 1 };
  it("halves the actual first-bracket tax at revenue 10000", () => {
    const result = calculateSelfEmployed(base);
    expect(result.firstYearBenefit).toBe(309.19);
    expect(result.annualTax).toBe(309.18);
  });
  it("excludes revenue above 10000 even when expenses reduce profit", () => {
    expect(calculateSelfEmployed({...base, annualRevenue: 10000.01, annualExpenses: 5000}).firstYearBenefit).toBe(0);
  });
  it("applies through year three only", () => {
    expect(calculateSelfEmployed({...base, yearsInBusiness: 3}).firstYearBenefit).toBe(309.19);
    expect(calculateSelfEmployed({...base, yearsInBusiness: 4, minimumTaxableIncome: 0}).firstYearBenefit).toBe(0);
  });
  it("does not double-count youth or large-family exemptions", () => {
    expect(calculateSelfEmployed({...base, age: 25}).firstYearBenefit).toBe(0);
    expect(calculateSelfEmployed({...base, children: 4}).annualTax).toBe(0);
  });
});

// // No first-year benefit: year 4+ — full standard tax
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — no first-year benefit (yearsInBusiness >= 4)", () => {
  it("year 4: firstYearBenefit = 0", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.firstYearBenefit).toBe(0);
  });

  it("year 4: annualTax equals grossTax exactly (no benefit applied)", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
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
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 1,
      firstIncomeDeclaration: true,
    });
    expect(result.prepaymentRate).toBe(PREPAYMENT_RATE_FIRST_YEAR);
  });

  it("year 2: prepaymentRate = 55%", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 2,
    });
    expect(result.prepaymentRate).toBe(PREPAYMENT_RATE_STANDARD);
  });

  it("year 4: prepaymentRate = 55%", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.prepaymentRate).toBe(PREPAYMENT_RATE_STANDARD);
  });

  it("prepayment = annualTax × prepaymentRate", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 2,
    });
    expect(result.prepayment).toBeCloseTo(result.annualTax * PREPAYMENT_RATE_STANDARD, 2);
  });

  it("totalTaxWithPrepayment = annualTax + prepayment", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
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
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    // 1st category: monthly = 260.77 → annual = round(260.77*12*100)/100 = 3129.24
    expect(result.annualEFKA).toBeCloseTo(260.77 * 12, 2);
  });

  it("taxableIncome = annualRevenue − annualExpenses − annualEFKA", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
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
    const cat1st = calculateSelfEmployed({ minimumTaxableIncome: 0, ...base, efkaCategory: "1st" });
    const cat6th = calculateSelfEmployed({ minimumTaxableIncome: 0, ...base, efkaCategory: "6th" });
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
    const withExpenses = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 5_000,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    const noExpenses = calculateSelfEmployed({ minimumTaxableIncome: 0,
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
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
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
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
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
// Family brackets apply without the employee tax credit.
describe("business family brackets", () => {
  it("applies children reductions but no Article 16 credit", () => {
    const base = { annualRevenue: 33129.24, annualExpenses: 0, efkaCategory: "1st" as const, age: 35, yearsInBusiness: 4, minimumTaxableIncome: 0 };
    expect(calculateSelfEmployed({...base, children: 0}).annualTax).toBe(5500);
    expect(calculateSelfEmployed({...base, children: 4}).annualTax).toBe(1800);
    expect(calculateSelfEmployed({...base, children: 6}).annualTax).toBe(1400);
  });
});

// // annualNet and monthlyNet
// ---------------------------------------------------------------------------

describe("calculateSelfEmployed — net income", () => {
  it("monthlyNet = annualNet / 12", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.monthlyNet).toBeCloseTo(result.annualNet / 12, 2);
  });

  it("annualNet is lower than annualRevenue (deductions exist)", () => {
    const result = calculateSelfEmployed({ minimumTaxableIncome: 0,
      annualRevenue: 30_000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    expect(result.annualNet).toBeLessThan(result.annualRevenue);
  });
});
