/**
 * Tests for the core progressive tax calculation engine (2026 6-bracket scale).
 *
 * The standard brackets are:
 *   0–10,000     @ 9%
 *   10,001–20,000 @ 20%  (family/youth overrides possible)
 *   20,001–30,000 @ 26%  (family overrides possible)
 *   30,001–40,000 @ 34%
 *   40,001–60,000 @ 39%
 *   60,001+       @ 44%
 *
 * Per-bracket tax is rounded to 2 dp before accumulation, then grossTax
 * is rounded once more. All expected values below are derived from that
 * rounding contract.
 */
import { describe, it, expect } from "vitest";
import { calculateTax } from "../calculate-tax";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Assert grossTax within 1 cent. Floating-point rounding inside the function
 * makes toBeCloseTo unreliable at 2 dp across brackets; toBe on
 * Math.round(x*100)/100 is the correct contract here.
 */
function gross(result: ReturnType<typeof calculateTax>) {
  return result.grossTax;
}

// ---------------------------------------------------------------------------
// Standard 6-bracket scale — exact bracket boundary amounts
// ---------------------------------------------------------------------------

describe("calculateTax — standard scale (age=35, children=0, isEmployee=true)", () => {
  it("returns zero tax for zero income", () => {
    const result = calculateTax(0);
    expect(result.grossTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.brackets).toHaveLength(0);
  });

  it("returns zero tax for negative income (guard clause)", () => {
    const result = calculateTax(-1000);
    expect(result.grossTax).toBe(0);
  });

  it("taxes exactly 10,000 at 9% only — top of bracket 1", () => {
    // 10,000 × 9% = 900
    const result = calculateTax(10_000);
    expect(gross(result)).toBe(900);
    expect(result.brackets).toHaveLength(1);
    expect(result.brackets[0]!.rate).toBe(0.09);
    expect(result.brackets[0]!.taxable).toBe(10_000);
  });

  it("taxes income of 1 EUR at 9% — single cent in first bracket", () => {
    // Math.round(1 * 0.09 * 100) / 100 = Math.round(9) / 100 = 0.09
    const result = calculateTax(1);
    expect(gross(result)).toBe(0.09);
  });

  it("taxes exactly 20,000 — fills brackets 1 and 2", () => {
    // b1: 10,000 × 9% = 900
    // b2: 10,000 × 20% = 2,000
    const result = calculateTax(20_000);
    expect(gross(result)).toBe(2_900);
    expect(result.brackets).toHaveLength(2);
  });

  it("taxes exactly 30,000 — fills brackets 1, 2, and 3", () => {
    // b1: 900  b2: 2,000  b3: 10,000 × 26% = 2,600
    const result = calculateTax(30_000);
    expect(gross(result)).toBe(5_500);
    expect(result.brackets).toHaveLength(3);
  });

  it("taxes exactly 40,000 — fills brackets 1–4", () => {
    // b4: 10,000 × 34% = 3,400 → cumulative 8,900
    const result = calculateTax(40_000);
    expect(gross(result)).toBe(8_900);
    expect(result.brackets).toHaveLength(4);
  });

  it("taxes exactly 60,000 — fills brackets 1–5", () => {
    // b5: 20,000 × 39% = 7,800 → cumulative 16,700
    const result = calculateTax(60_000);
    expect(gross(result)).toBe(16_700);
    expect(result.brackets).toHaveLength(5);
  });

  it("taxes income of 100,000 — all 6 brackets active", () => {
    // b6: 40,000 × 44% = 17,600 → cumulative 34,300
    const result = calculateTax(100_000);
    expect(gross(result)).toBe(34_300);
    expect(result.brackets).toHaveLength(6);
  });

  it("returns the correct per-bracket breakdown for 35,000", () => {
    // b1: 900  b2: 2,000  b3: 2,600  b4: 5,000×34%=1,700  total: 7,200
    const result = calculateTax(35_000);
    expect(gross(result)).toBe(7_200);

    const b1 = result.brackets[0]!;
    const b2 = result.brackets[1]!;
    const b3 = result.brackets[2]!;
    const b4 = result.brackets[3]!;
    expect(b1.from).toBe(0);
    expect(b1.to).toBe(10_000);
    expect(b1.rate).toBe(0.09);
    expect(b1.taxable).toBe(10_000);
    expect(b1.tax).toBe(900);

    expect(b2.from).toBe(10_000);
    expect(b2.to).toBe(20_000);
    expect(b2.rate).toBe(0.2);
    expect(b2.taxable).toBe(10_000);
    expect(b2.tax).toBe(2_000);

    expect(b3.from).toBe(20_000);
    expect(b3.to).toBe(30_000);
    expect(b3.rate).toBe(0.26);
    expect(b3.taxable).toBe(10_000);
    expect(b3.tax).toBe(2_600);

    expect(b4.from).toBe(30_000);
    expect(b4.to).toBe(35_000);
    expect(b4.rate).toBe(0.34);
    expect(b4.taxable).toBe(5_000);
    expect(b4.tax).toBe(1_700);
  });

  it("computes effectiveRate correctly at 60,000", () => {
    const result = calculateTax(60_000);
    // 16,700 / 60,000 ≈ 0.27833...
    expect(result.effectiveRate).toBeCloseTo(16_700 / 60_000, 5);
  });
});

// ---------------------------------------------------------------------------
// Family reductions — brackets 2 and 3 rates change for isEmployee=true, age>30
// ---------------------------------------------------------------------------

describe("calculateTax — family reductions (age=35, isEmployee=true)", () => {
  it("0 children: bracket 2 rate stays at 20%, bracket 3 at 26%", () => {
    const result = calculateTax(30_000, 0, 35, true);
    expect(result.brackets[1]!.rate).toBe(0.2);
    expect(result.brackets[2]!.rate).toBe(0.26);
    expect(gross(result)).toBe(5_500);
  });

  it("1 child: bracket 2 drops to 18%, bracket 3 to 24%", () => {
    // b1: 900  b2: 10,000×18%=1,800  b3: 10,000×24%=2,400  total: 5,100
    const result = calculateTax(30_000, 1, 35, true);
    expect(result.brackets[1]!.rate).toBe(0.18);
    expect(result.brackets[2]!.rate).toBe(0.24);
    expect(gross(result)).toBe(5_100);
  });

  it("2 children: bracket 2 drops to 16%, bracket 3 to 22%", () => {
    // b1: 900  b2: 1,600  b3: 2,200  total: 4,700
    const result = calculateTax(30_000, 2, 35, true);
    expect(result.brackets[1]!.rate).toBe(0.16);
    expect(result.brackets[2]!.rate).toBe(0.22);
    expect(gross(result)).toBe(4_700);
  });

  it("3 children: bracket 2 drops to 9%, bracket 3 to 20%", () => {
    // b1: 900  b2: 900  b3: 2,000  total: 3,800
    const result = calculateTax(30_000, 3, 35, true);
    expect(result.brackets[1]!.rate).toBe(0.09);
    expect(result.brackets[2]!.rate).toBe(0.2);
    expect(gross(result)).toBe(3_800);
  });

  it("4 children: bracket 2 drops to 0%, bracket 3 to 18%", () => {
    // b1: 900  b2: 0  b3: 1,800  total: 2,700
    const result = calculateTax(30_000, 4, 35, true);
    expect(result.brackets[1]!.rate).toBe(0);
    expect(result.brackets[2]!.rate).toBe(0.18);
    expect(gross(result)).toBe(2_700);
  });

  it("5 children: bracket 3 drops to 16%", () => {
    // b2 is 0% (4+), b3 is 16% (5+)
    const result = calculateTax(30_000, 5, 35, true);
    expect(result.brackets[2]!.rate).toBe(0.16);
  });

  it("6 children: bracket 3 drops to 14% (continues -2pp per child beyond 4)", () => {
    const result = calculateTax(30_000, 6, 35, true);
    expect(result.brackets[1]!.rate).toBe(0);
    expect(result.brackets[2]!.rate).toBe(0.14);
  });

  it("family reductions only affect brackets 2 and 3; bracket 4+ stays unchanged", () => {
    const result3children = calculateTax(40_000, 3, 35, true);
    const result0children = calculateTax(40_000, 0, 35, true);
    // bracket 4 (30k–40k @ 34%) should be identical in both
    expect(result3children.brackets[3]!.rate).toBe(0.34);
    expect(result0children.brackets[3]!.rate).toBe(0.34);
    expect(result3children.brackets[3]!.tax).toBe(
      result0children.brackets[3]!.tax,
    );
  });
});

// ---------------------------------------------------------------------------
// Youth rate overrides
// ---------------------------------------------------------------------------

describe("calculateTax — youth overrides", () => {
  it("age <= 25: first two brackets are 0%", () => {
    // Income of 20,000: b1 at 0%, b2 at 0% → grossTax = 0
    const result = calculateTax(20_000, 0, 25, true);
    expect(result.brackets[0]!.rate).toBe(0);
    expect(result.brackets[1]!.rate).toBe(0);
    expect(gross(result)).toBe(0);
  });

  it("age <= 25: income above 20,000 only pays tax on the excess beyond the two zero brackets", () => {
    // b1: 0  b2: 0  b3: 10,000×26%=2,600  total: 2,600 (0 children, bracket 3 stays standard)
    const result = calculateTax(30_000, 0, 25, true);
    expect(gross(result)).toBe(2_600);
  });

  it("age 25 is the upper edge of the zero-rate band (25 qualifies, 26 does not)", () => {
    const at25 = calculateTax(20_000, 0, 25, true);
    const at26 = calculateTax(20_000, 0, 26, true);
    expect(gross(at25)).toBe(0);
    expect(gross(at26)).toBeGreaterThan(0);
  });

  it("age 26–30: bracket 2 is 9% instead of 20%", () => {
    // b1: 900  b2: 10,000×9%=900  total for 20,000: 1,800
    const result = calculateTax(20_000, 0, 26, true);
    expect(result.brackets[1]!.rate).toBe(0.09);
    expect(gross(result)).toBe(1_800);
  });

  it("age 30 still gets the 9% bracket-2 rate (30 qualifies, 31 does not)", () => {
    const at30 = calculateTax(20_000, 0, 30, true);
    const at31 = calculateTax(20_000, 0, 31, true);
    expect(at30.brackets[1]!.rate).toBe(0.09);
    expect(at31.brackets[1]!.rate).toBe(0.2);
  });

  it("age 26–30: family reductions apply to bracket 3; bracket 2 uses min(9%, familyRate)", () => {
    // 3 children: family bracket 2 = 9%, min(9%, 9%) = 9%
    // 3 children: family bracket 3 = 20%
    // b1: 900  b2: 10,000×9%=900  b3: 10,000×20%=2,000  total: 3,800
    const result = calculateTax(30_000, 3, 28, true);
    expect(result.brackets[1]!.rate).toBe(0.09);
    expect(result.brackets[2]!.rate).toBe(0.2);
    expect(gross(result)).toBe(3_800);
  });

  it("age 26–30, 4+ children: bracket 2 is 0% (family override lower than youth 9%)", () => {
    // 4 children: family bracket 2 = 0%, min(9%, 0%) = 0%
    // 4 children: family bracket 3 = 18%
    // b1: 900  b2: 0  b3: 10,000×18%=1,800  total: 2,700
    const result = calculateTax(30_000, 4, 28, true);
    expect(result.brackets[1]!.rate).toBe(0);
    expect(result.brackets[2]!.rate).toBe(0.18);
    expect(gross(result)).toBe(2_700);
  });

  it("age <= 25 with children: bracket 3 still gets family reduction", () => {
    // 3 children: bracket 3 = 20%
    // b1: 0  b2: 0  b3: 10,000×20%=2,000  total: 2,000
    const result = calculateTax(30_000, 3, 24, true);
    expect(result.brackets[0]!.rate).toBe(0);
    expect(result.brackets[1]!.rate).toBe(0);
    expect(result.brackets[2]!.rate).toBe(0.2);
    expect(gross(result)).toBe(2_000);
  });

  it("age 31+: standard rates apply — youth override is not in effect", () => {
    const result = calculateTax(10_000, 0, 31, true);
    expect(result.brackets[0]!.rate).toBe(0.09);
  });
});

// ---------------------------------------------------------------------------
// isEmployee=false — no family reductions, no age-unrelated bracket changes
// ---------------------------------------------------------------------------

describe("calculateTax — isEmployee=false (self-employed)", () => {
  it("family reductions are NOT applied when isEmployee=false, even with children", () => {
    const selfEmployed = calculateTax(30_000, 3, 35, false);
    const employee = calculateTax(30_000, 3, 35, true);
    // Self-employed gets standard brackets, employee gets family-reduced ones
    expect(selfEmployed.brackets[1]!.rate).toBe(0.2);
    expect(selfEmployed.brackets[2]!.rate).toBe(0.26);
    expect(gross(selfEmployed)).toBeGreaterThan(gross(employee));
  });

  it("youth overrides (age <=25) still apply for self-employed", () => {
    // Youth benefit is age-driven, not employment-type driven
    const result = calculateTax(20_000, 0, 24, false);
    expect(result.brackets[0]!.rate).toBe(0);
    expect(result.brackets[1]!.rate).toBe(0);
    expect(gross(result)).toBe(0);
  });

  it("age 26–30 bracket-2 override still applies for self-employed", () => {
    const result = calculateTax(20_000, 0, 28, false);
    expect(result.brackets[1]!.rate).toBe(0.09);
  });

  it("standard 30,000 income produces 5,500 for self-employed with no children", () => {
    // Same as employee at 0 children and age>30 — no reduction either way
    const result = calculateTax(30_000, 0, 35, false);
    expect(gross(result)).toBe(5_500);
  });
});
