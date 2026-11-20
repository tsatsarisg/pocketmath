import { describe, expect, it } from "vitest";
import { calculateIke } from "../ike";
import { compareAll } from "../compare";

describe("single-member IKE in tax year 2026", () => {
  it("taxes company profit before the business levy and distributes profit after the reserve", () => {
    const result = calculateIke({
      annualRevenue: 40_100,
      annualExpenses: 10_000,
      headOfficeLevy: 1_000,
    });

    expect(result).toMatchObject({
      annualGemiFee: 100,
      taxableProfit: 30_000,
      corporateTax: 6_600,
      profitAfterTax: 22_400,
      legalReserve: 1_120,
      grossDividend: 21_280,
      dividendTax: 1_064,
      annualEFKA: 3_129.24,
      annualNet: 17_086.76,
      prepayment: 5_280,
      companyBalanceAfterPrepayment: -4_160,
    });
    expect(
      result.annualNet + result.totalTaxesAnnual + result.retainedProfit,
    ).toBeCloseTo(30_000, 2);
  });

  it("keeps a reduced corporate advance out of owner net and taxes only distributed profit", () => {
    const input = { annualRevenue: 10_100, distributionPercent: 25 };
    const result = calculateIke({ ...input, reducedPrepayment: true });
    const standard = calculateIke(input);

    expect(result.prepayment).toBe(880);
    expect(standard.prepayment).toBe(1_760);
    expect(result.annualNet).toBe(standard.annualNet);
    expect(result.grossDividend).toBe(1_852.5);
    expect(result.dividendTax).toBe(92.63);
    expect(result.retainedProfit).toBe(5_947.5);
  });

  it("keeps insurance and cash obligations in a loss year", () => {
    const result = calculateIke({
      annualRevenue: 1_000,
      annualExpenses: 1_900,
      headOfficeLevy: 800,
      additionalMonthlyInsurance: 20,
    });
    expect(result).toMatchObject({
      corporateTax: 0,
      dividendTax: 0,
      prepayment: 0,
      legalReserve: 0,
      operatingShortfall: 1_800,
      annualNet: -5_169.24,
    });
  });

  it("uses independent business expenses and the selected IKE levy in comparisons", () => {
    const result = compareAll(3_000, 14_000, {
      annualSelfEmployedExpenses: 3_000,
      annualIkeExpenses: 5_000,
      ikeHeadOfficeLevy: 800,
    });
    const ike = calculateIke({
      annualRevenue: 36_000,
      annualExpenses: 5_000,
      headOfficeLevy: 800,
    });
    expect(result.ike.annualNet).toBe(ike.annualNet);
    expect(result["self-employed"].annualNet).toBeLessThan(
      compareAll(3_000, 14_000)["self-employed"].annualNet,
    );
  });
});
