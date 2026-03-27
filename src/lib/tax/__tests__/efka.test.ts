/**
 * Tests for the EFKA (self-employed social insurance) helpers.
 *
 * The 7 categories in order are:
 *   "special"  (first 5 years only) — monthly: 150.46
 *   "1st"      (default)            — monthly: 250.77
 *   "2nd"                           — monthly: 300.93
 *   "3rd"                           — monthly: 360.63
 *   "4th"                           — monthly: 433.47
 *   "5th"                           — monthly: 519.45
 *   "6th"                           — monthly: 675.87
 *
 * Rules:
 *   getAvailableCategories(years):
 *     years <= 5 → all 7 categories (including "special")
 *     years > 5  → 6 categories (excluding "special")
 *
 * Annual EFKA = monthly × 12 (rounded to 2 dp)
 */
import { describe, it, expect } from "vitest";
import {
  getAvailableCategories,
  getAllEfkaCategories,
  getAnnualEfka,
  getMonthlyEfka,
} from "../efka";
import { EFKA_CATEGORIES } from "../constants";

// ---------------------------------------------------------------------------
// getAvailableCategories — special category availability
// ---------------------------------------------------------------------------

describe("getAvailableCategories — special category eligibility", () => {
  it("year 1: includes the 'special' category", () => {
    const cats = getAvailableCategories(1);
    const ids = cats.map((c) => c.id);
    expect(ids).toContain("special");
  });

  it("year 5 (last eligible year): includes the 'special' category", () => {
    const cats = getAvailableCategories(5);
    const ids = cats.map((c) => c.id);
    expect(ids).toContain("special");
  });

  it("year 6 (first ineligible year): excludes the 'special' category", () => {
    const cats = getAvailableCategories(6);
    const ids = cats.map((c) => c.id);
    expect(ids).not.toContain("special");
  });

  it("year 10: still excludes 'special'", () => {
    const cats = getAvailableCategories(10);
    const ids = cats.map((c) => c.id);
    expect(ids).not.toContain("special");
  });

  it("year 5 vs year 6: the boundary returns different counts", () => {
    const year5 = getAvailableCategories(5);
    const year6 = getAvailableCategories(6);
    expect(year5.length).toBe(year6.length + 1);
  });
});

// ---------------------------------------------------------------------------
// getAvailableCategories — total count
// ---------------------------------------------------------------------------

describe("getAvailableCategories — total category count", () => {
  it("all 7 categories are returned when years <= 5", () => {
    const totalCategories = EFKA_CATEGORIES.length; // 7
    for (const years of [1, 2, 3, 4, 5]) {
      const cats = getAvailableCategories(years);
      expect(cats.length).toBe(totalCategories);
    }
  });

  it("6 categories (all except 'special') returned when years > 5", () => {
    const totalCategories = EFKA_CATEGORIES.length;
    const cats = getAvailableCategories(6);
    expect(cats.length).toBe(totalCategories - 1);
  });

  it("all standard categories (1st through 6th) are present regardless of years", () => {
    const standardIds = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    for (const years of [1, 6, 20]) {
      const ids = getAvailableCategories(years).map((c) => c.id);
      for (const id of standardIds) {
        expect(ids).toContain(id);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// getAllEfkaCategories — always returns all 7
// ---------------------------------------------------------------------------

describe("getAllEfkaCategories", () => {
  it("returns all 7 categories", () => {
    expect(getAllEfkaCategories().length).toBe(7);
  });

  it("first category is 'special'", () => {
    expect(getAllEfkaCategories()[0]!.id).toBe("special");
  });

  it("last category is '6th'", () => {
    const all = getAllEfkaCategories();
    expect(all[all.length - 1]!.id).toBe("6th");
  });
});

// ---------------------------------------------------------------------------
// Monthly amounts — spot-check against known constants
// ---------------------------------------------------------------------------

describe("getMonthlyEfka — spot-check monthly amounts", () => {
  it("'special' category: monthly = 150.46", () => {
    expect(getMonthlyEfka("special")).toBe(150.46);
  });

  it("'1st' category: monthly = 250.77", () => {
    expect(getMonthlyEfka("1st")).toBe(250.77);
  });

  it("'6th' category: monthly = 675.87", () => {
    expect(getMonthlyEfka("6th")).toBe(675.87);
  });

  it("categories are monotonically increasing by monthly contribution", () => {
    const all = getAllEfkaCategories();
    for (let i = 1; i < all.length; i++) {
      expect(all[i]!.monthly).toBeGreaterThan(all[i - 1]!.monthly);
    }
  });
});

// ---------------------------------------------------------------------------
// Annual EFKA — monthly × 12 rounded to 2 dp
// ---------------------------------------------------------------------------

describe("getAnnualEfka — annual cost is monthly × 12", () => {
  it("'special' category: annual = round(150.46 * 12 * 100) / 100 = 1,805.52", () => {
    const expected = Math.round(150.46 * 12 * 100) / 100;
    expect(getAnnualEfka("special")).toBeCloseTo(expected, 2);
  });

  it("'1st' category: annual = round(250.77 * 12 * 100) / 100 = 3,009.24", () => {
    const expected = Math.round(250.77 * 12 * 100) / 100;
    expect(getAnnualEfka("1st")).toBeCloseTo(expected, 2);
  });

  it("'6th' category: annual = round(675.87 * 12 * 100) / 100 = 8,110.44", () => {
    const expected = Math.round(675.87 * 12 * 100) / 100;
    expect(getAnnualEfka("6th")).toBeCloseTo(expected, 2);
  });

  it("all annual amounts are exactly monthly × 12 (within floating-point tolerance)", () => {
    const all = getAllEfkaCategories();
    for (const cat of all) {
      const expected = Math.round(cat.monthly * 12 * 100) / 100;
      expect(getAnnualEfka(cat.id)).toBeCloseTo(expected, 2);
    }
  });

  it("annual > monthly for every category", () => {
    const all = getAllEfkaCategories();
    for (const cat of all) {
      expect(getAnnualEfka(cat.id)).toBeGreaterThan(cat.monthly);
    }
  });
});

// ---------------------------------------------------------------------------
// Category structure integrity
// ---------------------------------------------------------------------------

describe("EFKA category data integrity", () => {
  it("every category has pension + health components", () => {
    for (const cat of getAllEfkaCategories()) {
      expect(cat.pension).toBeGreaterThan(0);
      expect(cat.health).toBeGreaterThan(0);
    }
  });

  it("monthly ≈ pension + health for each category (within 1 cent)", () => {
    for (const cat of getAllEfkaCategories()) {
      expect(cat.monthly).toBeCloseTo(cat.pension + cat.health, 2);
    }
  });

  it("each category has a non-empty label", () => {
    for (const cat of getAllEfkaCategories()) {
      expect(cat.label.length).toBeGreaterThan(0);
    }
  });
});
