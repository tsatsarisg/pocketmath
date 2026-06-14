/**
 * Tests for the tax credit phase-out function.
 *
 * Credit structure (2026, Law 5246/2025, Article 16 KFE):
 *   0 children: 777  |  1: 810  |  2: 900  |  3: 1,120  |  4: 1,340  |  5+: +220 per child beyond 4
 *
 * Phase-out mechanics:
 *   - Income <= 12,000 → full credit
 *   - Income > 12,000  → reduction = floor((income - 12,000) / 1,000) * 20
 *   - Credit is clamped to 0 (cannot go negative)
 *   - Phase-out does NOT apply for 5+ children
 *
 * The floor division means the reduction steps in discrete EUR 20 increments
 * every full EUR 1,000 above the threshold — fractional thousands produce no
 * additional reduction until the next whole-thousand boundary is crossed.
 */
import { describe, it, expect } from "vitest";
import { taxCredit } from "../tax-credit";

// ---------------------------------------------------------------------------
// Full credit at or below the phase-out threshold
// ---------------------------------------------------------------------------

describe("taxCredit — full credit at income <= 12,000", () => {
  it("0 children: full credit 777 at income 12,000", () => {
    expect(taxCredit(12_000, 0)).toBe(777);
  });

  it("0 children: full credit 777 at income 0 (zero-income edge case)", () => {
    expect(taxCredit(0, 0)).toBe(777);
  });

  it("1 child: full credit 810 at income <= 12,000", () => {
    expect(taxCredit(12_000, 1)).toBe(810);
    expect(taxCredit(5_000, 1)).toBe(810);
  });

  it("2 children: full credit 900 at income <= 12,000", () => {
    expect(taxCredit(12_000, 2)).toBe(900);
  });

  it("3 children: full credit 1,120 at income <= 12,000", () => {
    expect(taxCredit(12_000, 3)).toBe(1_120);
  });

  it("4 children: full credit 1,340", () => {
    expect(taxCredit(10_000, 4)).toBe(1_340);
  });

  it("5 children: credit = 1,340 + 220 = 1,560", () => {
    expect(taxCredit(10_000, 5)).toBe(1_560);
  });

  it("6 children: credit = 1,340 + 2×220 = 1,780", () => {
    expect(taxCredit(10_000, 6)).toBe(1_780);
  });
});

// ---------------------------------------------------------------------------
// Phase-out: stepping at each EUR 1,000 boundary above 12,000
// ---------------------------------------------------------------------------

describe("taxCredit — phase-out stepping (0 children, base=777)", () => {
  it("income 12,001: excess < 1,000 so floor=0, reduction=0, credit stays at 777", () => {
    // This is the key boundary: the phase-out uses floor division so fractions
    // of a thousand do not yet trigger a reduction step.
    expect(taxCredit(12_001, 0)).toBe(777);
  });

  it("income 12,999: still below next 1,000 boundary, credit stays at 777", () => {
    expect(taxCredit(12_999, 0)).toBe(777);
  });

  it("income 13,000: first full 1,000 above threshold → reduction=20, credit=757", () => {
    expect(taxCredit(13_000, 0)).toBe(757);
  });

  it("income 13,999: still only one full thousand above threshold, credit=757", () => {
    expect(taxCredit(13_999, 0)).toBe(757);
  });

  it("income 14,000: two full thousands above threshold → reduction=40, credit=737", () => {
    expect(taxCredit(14_000, 0)).toBe(737);
  });

  it("income 20,000: eight full thousands above threshold → reduction=160, credit=617", () => {
    // excess=8,000, floor(8000/1000)=8, reduction=160, 777-160=617
    expect(taxCredit(20_000, 0)).toBe(617);
  });

  it("income 50,000: floor(38000/1000)=38, reduction=760, 777-760=17", () => {
    expect(taxCredit(50_000, 0)).toBe(17);
  });
});

// ---------------------------------------------------------------------------
// Full phase-out — credit clamped to 0
// ---------------------------------------------------------------------------

describe("taxCredit — full phase-out to zero (0 children)", () => {
  it("income 51,000: reduction = floor(39000/1000)*20 = 780 > 777 → credit clamped to 0", () => {
    // 777 / 20 = 38.85, so 39 full thousands are needed for reduction >= 777
    // 12,000 + 39*1,000 = 51,000
    expect(taxCredit(51_000, 0)).toBe(0);
  });

  it("income 100,000: well past phase-out, credit remains 0 (never negative)", () => {
    expect(taxCredit(100_000, 0)).toBe(0);
  });

  it("credit is never returned as a negative number regardless of income", () => {
    expect(taxCredit(500_000, 0)).toBeGreaterThanOrEqual(0);
    expect(taxCredit(500_000, 5)).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// Phase-out for multiple children — higher base, later full phase-out
// ---------------------------------------------------------------------------

describe("taxCredit — phase-out with children (higher base = later full phase-out)", () => {
  it("1 child at 13,000: reduction=20, credit=810-20=790", () => {
    expect(taxCredit(13_000, 1)).toBe(790);
  });

  it("2 children at 14,000: reduction=40, credit=900-40=860", () => {
    expect(taxCredit(14_000, 2)).toBe(860);
  });

  it("3 children at 20,000: reduction=160, credit=1120-160=960", () => {
    expect(taxCredit(20_000, 3)).toBe(960);
  });

  it("3 children require more income to fully phase out than 0 children", () => {
    // 0 children fully phases out at 51,000; 3 children (base=1120) phase out later
    expect(taxCredit(51_000, 0)).toBe(0);
    expect(taxCredit(51_000, 3)).toBeGreaterThan(0);
  });

  it("3 children fully phase out at income 68,000: floor(56000/1000)*20=1120", () => {
    // 1120 / 20 = 56 thousands above threshold: 12,000 + 56,000 = 68,000
    expect(taxCredit(68_000, 3)).toBe(0);
    expect(taxCredit(67_000, 3)).toBeGreaterThan(0);
  });

  it("5+ children: phase-out does NOT apply, full credit always returned", () => {
    expect(taxCredit(100_000, 5)).toBe(1_560);
    expect(taxCredit(500_000, 5)).toBe(1_560);
    expect(taxCredit(100_000, 6)).toBe(1_780);
  });
});
