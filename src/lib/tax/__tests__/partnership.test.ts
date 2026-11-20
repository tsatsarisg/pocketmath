import { describe, expect, it } from "vitest";
import { compareAll } from "../compare";
import { calculatePartnership } from "../partnership";

describe("O.E. and E.E. in tax year 2026", () => {
  const annualRevenue = 72_000;
  const annualExpenses = 12_000;

  it("deducts both partners' contributions and allocates net profits 99/1", () => {
    const result = calculatePartnership({ annualRevenue, annualExpenses });
    expect(result).toMatchObject({
      annualGemiFee: 80,
      annualPartnerEfka: 3_129.24,
      annualOtherPartnerEfka: 3_129.24,
      taxableProfit: 53_661.52,
      corporateTax: 11_805.53,
      partnerDividendTax: 0,
      annualNet: 41_437.43,
      otherPartnerNet: 418.56,
      prepayment: 9_444.42,
      companyBalanceAfterPrepayment: -9_444.42,
    });
    expect(
      result.annualNet + result.otherPartnerNet + result.totalTaxesAnnual,
    ).toBeCloseTo(annualRevenue - annualExpenses - result.annualGemiFee, 2);
  });

  it("withholds on both shares with double-entry books and shows the advance separately", () => {
    const result = calculatePartnership({
      annualRevenue,
      annualExpenses,
      bookkeeping: "doubleEntry",
      headOfficeLevy: 1000,
      partnerShare: 85,
      distributionPercent: 60,
      reducedPrepayment: true,
    });
    expect(result).toMatchObject({
      corporateTax: 11_805.53,
      distribution: 24_513.59,
      retainedProfit: 16_342.4,
      partnerDividendTax: 1_041.83,
      annualNet: 19_794.72,
      otherPartnerNet: 3_493.19,
      totalTaxesAnnual: 20_289.69,
      prepayment: 4_722.21,
      companyBalanceAfterPrepayment: 11_620.19,
    });
  });

  it("keeps a loss and estimated funding separate from any distribution", () => {
    expect(
      calculatePartnership({
        annualRevenue: 0,
        monthlyPartnerEfka: 0,
        monthlyOtherPartnerEfka: 0,
        partnerShare: 50,
        headOfficeLevy: 800,
      }),
    ).toMatchObject({
      taxableProfit: 0,
      corporateTax: 0,
      distribution: 0,
      partnerShortfall: 440,
      annualNet: -440,
      prepayment: 0,
      companyBalanceAfterPrepayment: -880,
    });
  });

  it("uses the selected partner's net and passes each business's own expenses", () => {
    const comparison = compareAll(6000, 14_000, {
      annualSelfEmployedExpenses: annualExpenses,
      annualIkeExpenses: annualExpenses,
      partnership: { annualExpenses, bookkeeping: "doubleEntry" },
    });
    expect(comparison.partnership.annualNet).toBe(39_365.56);
    expect(comparison["self-employed"].annualNet).toBeCloseTo(41_391.16, 2);
    expect(comparison.ike.annualNet).toBe(39_037.36);
  });
});
