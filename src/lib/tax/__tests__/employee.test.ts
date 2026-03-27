/**
 * Tests for the employee tax calculation module.
 *
 * Key formula (2026):
 *   annualGross      = monthlyGross × 14  (12 salaries + Christmas + Easter + Summer)
 *   annualEmployeeSS = min(monthlyGross, 7,761.94) × 14 × 13.87%
 *   taxableIncome    = annualGross − annualEmployeeSS
 *   grossTax         = progressive brackets (isEmployee=true, age, children)
 *   taxCredit        = phase-out formula per children / taxableIncome
 *   annualTax        = max(0, grossTax − taxCredit)
 *   annualNet        = annualGross − annualEmployeeSS − annualTax
 *   monthlyNet       = annualNet / 14
 *   employerCost     = annualGross + annualGross×21.79% (ceiling-capped the same way)
 *
 * All monetary amounts are rounded to 2 dp at each step.
 *
 * Constants used:
 *   EMPLOYEE_SS_RATE          = 0.1387
 *   EMPLOYER_SS_RATE          = 0.2179
 *   EMPLOYEE_SS_CEILING_MONTHLY = 7,761.94
 *   SALARY_MONTHS             = 14
 */
import { describe, it, expect } from "vitest";
import { calculateEmployee } from "../employee";
import {
  EMPLOYEE_SS_RATE,
  EMPLOYER_SS_RATE,
  SALARY_MONTHS,
  EMPLOYEE_SS_CEILING_MONTHLY,
} from "../constants";

// ---------------------------------------------------------------------------
// Helper — derive expected values from constants for resilience to future changes
// ---------------------------------------------------------------------------

function expectedSS(monthlyGross: number) {
  const effective = Math.min(monthlyGross, EMPLOYEE_SS_CEILING_MONTHLY);
  return Math.round(effective * SALARY_MONTHS * EMPLOYEE_SS_RATE * 100) / 100;
}

function expectedEmployerSS(monthlyGross: number) {
  const effective = Math.min(monthlyGross, EMPLOYEE_SS_CEILING_MONTHLY);
  return Math.round(effective * SALARY_MONTHS * EMPLOYER_SS_RATE * 100) / 100;
}

// ---------------------------------------------------------------------------
// Basic case: monthlyGross=2,000, 0 children, age=35
// ---------------------------------------------------------------------------

describe("calculateEmployee — basic case (monthlyGross=2000, children=0, age=35)", () => {
  const result = calculateEmployee({ monthlyGross: 2_000, children: 0, age: 35 });

  it("annualGross = monthlyGross × 14", () => {
    expect(result.annualGross).toBe(2_000 * SALARY_MONTHS);
  });

  it("annualEmployeeSS is 13.87% of 14 monthly salaries below ceiling", () => {
    // round(2000 * 14 * 0.1387 * 100) / 100 = round(388360) / 100 = 3883.60
    expect(result.annualEmployeeSS).toBeCloseTo(expectedSS(2_000), 2);
  });

  it("taxableIncome = annualGross − annualEmployeeSS", () => {
    expect(result.taxableIncome).toBeCloseTo(
      result.annualGross - result.annualEmployeeSS,
      2,
    );
  });

  it("grossTax and annualTax are positive", () => {
    expect(result.grossTax).toBeGreaterThan(0);
    expect(result.annualTax).toBeGreaterThan(0);
  });

  it("taxCredit is applied: annualTax < grossTax", () => {
    expect(result.annualTax).toBeLessThan(result.grossTax);
    expect(result.taxCredit).toBeGreaterThan(0);
  });

  it("annualNet = annualGross − annualEmployeeSS − annualTax", () => {
    expect(result.annualNet).toBeCloseTo(
      result.annualGross - result.annualEmployeeSS - result.annualTax,
      2,
    );
  });

  it("monthlyNet = annualNet / 14", () => {
    expect(result.monthlyNet).toBeCloseTo(result.annualNet / SALARY_MONTHS, 2);
  });

  it("monthlyNet is lower than monthlyGross (deductions exist)", () => {
    expect(result.monthlyNet).toBeLessThan(result.monthlyGross);
  });

  it("employerTotalCost = annualGross + employerAnnualSS", () => {
    expect(result.employerTotalCost).toBeCloseTo(
      result.annualGross + result.employerAnnualSS,
      2,
    );
  });

  it("employerAnnualSS is 21.79% of 14 salaries (below ceiling)", () => {
    expect(result.employerAnnualSS).toBeCloseTo(expectedEmployerSS(2_000), 2);
  });

  it("taxBreakdown.grossTax matches grossTax on the result", () => {
    expect(result.taxBreakdown.grossTax).toBe(result.grossTax);
  });
});

// ---------------------------------------------------------------------------
// SS ceiling: monthlyGross above the monthly ceiling (7,761.94)
// ---------------------------------------------------------------------------

describe("calculateEmployee — SS ceiling (monthlyGross > EMPLOYEE_SS_CEILING_MONTHLY)", () => {
  const aboveCeiling = EMPLOYEE_SS_CEILING_MONTHLY + 1_000; // e.g. 8,761.94
  const result = calculateEmployee({ monthlyGross: aboveCeiling, children: 0, age: 35 });
  const resultAtCeiling = calculateEmployee({
    monthlyGross: EMPLOYEE_SS_CEILING_MONTHLY,
    children: 0,
    age: 35,
  });

  it("SS is capped: the result equals what the ceiling monthly produces, not the actual salary", () => {
    expect(result.annualEmployeeSS).toBeCloseTo(expectedSS(aboveCeiling), 2);
    // The ceiling-capped amount must equal the at-ceiling amount
    expect(result.annualEmployeeSS).toBeCloseTo(resultAtCeiling.annualEmployeeSS, 2);
  });

  it("SS is NOT linear beyond the ceiling — doubling salary does not double SS", () => {
    const doubledResult = calculateEmployee({
      monthlyGross: aboveCeiling * 2,
      children: 0,
      age: 35,
    });
    expect(doubledResult.annualEmployeeSS).toBe(result.annualEmployeeSS);
  });

  it("employerAnnualSS is also capped at the ceiling", () => {
    const expected = expectedEmployerSS(aboveCeiling);
    expect(result.employerAnnualSS).toBeCloseTo(expected, 2);
    expect(result.employerAnnualSS).toBeCloseTo(resultAtCeiling.employerAnnualSS, 2);
  });

  it("annualGross is still monthlyGross × 14 even above the ceiling", () => {
    // annualGross is not capped — only SS is
    expect(result.annualGross).toBeCloseTo(aboveCeiling * SALARY_MONTHS, 2);
  });
});

// ---------------------------------------------------------------------------
// 14-month salary basis
// ---------------------------------------------------------------------------

describe("calculateEmployee — 14-month salary basis", () => {
  it("annualGross for any monthly salary equals monthlyGross × 14", () => {
    const cases = [500, 1_000, 3_000, 10_000];
    for (const monthly of cases) {
      const result = calculateEmployee({ monthlyGross: monthly, children: 0, age: 35 });
      expect(result.annualGross).toBeCloseTo(monthly * SALARY_MONTHS, 2);
    }
  });
});

// ---------------------------------------------------------------------------
// Tax credit is applied (children and family reductions)
// ---------------------------------------------------------------------------

describe("calculateEmployee — tax credit and family reductions", () => {
  it("employee with 3 children pays less tax than employee with 0 children at same salary", () => {
    const zero = calculateEmployee({ monthlyGross: 3_000, children: 0, age: 35 });
    const three = calculateEmployee({ monthlyGross: 3_000, children: 3, age: 35 });
    expect(three.annualTax).toBeLessThan(zero.annualTax);
  });

  it("taxCredit increases with number of children", () => {
    const c0 = calculateEmployee({ monthlyGross: 800, children: 0, age: 35 });
    const c1 = calculateEmployee({ monthlyGross: 800, children: 1, age: 35 });
    const c2 = calculateEmployee({ monthlyGross: 800, children: 2, age: 35 });
    expect(c1.taxCredit).toBeGreaterThan(c0.taxCredit);
    expect(c2.taxCredit).toBeGreaterThan(c1.taxCredit);
  });

  it("tax credit phases out at high income (credit smaller at 80k vs 10k)", () => {
    // Use monthly values that produce annual gross well above the threshold
    const lowIncome = calculateEmployee({ monthlyGross: 715, children: 0, age: 35 });
    const highIncome = calculateEmployee({ monthlyGross: 5_715, children: 0, age: 35 });
    expect(highIncome.taxCredit).toBeLessThan(lowIncome.taxCredit);
  });

  it("annualTax cannot go below 0 even if credit exceeds grossTax", () => {
    // Very low income: gross tax may be less than the 777 credit
    const result = calculateEmployee({ monthlyGross: 200, children: 0, age: 35 });
    expect(result.annualTax).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// Youth benefit
// ---------------------------------------------------------------------------

describe("calculateEmployee — age-based youth reductions", () => {
  it("age <=25 produces lower annualTax than age 35 at the same salary", () => {
    const young = calculateEmployee({ monthlyGross: 2_000, children: 0, age: 22 });
    const adult = calculateEmployee({ monthlyGross: 2_000, children: 0, age: 35 });
    expect(young.grossTax).toBeLessThan(adult.grossTax);
  });

  it("age 26–30 produces lower tax than age 35 (bracket 2 at 9% not 20%)", () => {
    const young = calculateEmployee({ monthlyGross: 2_000, children: 0, age: 29 });
    const adult = calculateEmployee({ monthlyGross: 2_000, children: 0, age: 35 });
    expect(young.grossTax).toBeLessThan(adult.grossTax);
  });
});

// ---------------------------------------------------------------------------
// Zero income edge case
// ---------------------------------------------------------------------------

describe("calculateEmployee — zero income", () => {
  it("zero monthly gross produces zero annual gross", () => {
    const result = calculateEmployee({ monthlyGross: 0, children: 0, age: 35 });
    expect(result.annualGross).toBe(0);
  });

  it("zero monthly gross produces zero SS", () => {
    const result = calculateEmployee({ monthlyGross: 0, children: 0, age: 35 });
    expect(result.annualEmployeeSS).toBe(0);
  });

  it("zero monthly gross produces zero annual tax", () => {
    const result = calculateEmployee({ monthlyGross: 0, children: 0, age: 35 });
    expect(result.annualTax).toBe(0);
  });

  it("zero monthly gross produces zero net income", () => {
    const result = calculateEmployee({ monthlyGross: 0, children: 0, age: 35 });
    expect(result.annualNet).toBe(0);
    expect(result.monthlyNet).toBe(0);
  });

  it("zero income: employer cost is also zero", () => {
    const result = calculateEmployee({ monthlyGross: 0, children: 0, age: 35 });
    expect(result.employerTotalCost).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Employer cost
// ---------------------------------------------------------------------------

describe("calculateEmployee — employer cost", () => {
  it("employer cost is always greater than annualGross", () => {
    const result = calculateEmployee({ monthlyGross: 2_000, children: 0, age: 35 });
    expect(result.employerTotalCost).toBeGreaterThan(result.annualGross);
  });

  it("employerAnnualSS is ~21.79% of annualGross below the ceiling", () => {
    // Use a salary well below the ceiling so the rate applies cleanly
    const result = calculateEmployee({ monthlyGross: 1_000, children: 0, age: 35 });
    expect(result.employerAnnualSS).toBeCloseTo(
      1_000 * SALARY_MONTHS * EMPLOYER_SS_RATE,
      2,
    );
  });
});
