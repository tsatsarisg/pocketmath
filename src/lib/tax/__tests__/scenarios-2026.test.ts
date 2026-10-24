import { describe, expect, it } from "vitest";
import { calculateSelfEmployed } from "../self-employed";
import { calculateMplokaki } from "../mplokaki";
import { calculateEmployee } from "../employee";
import { compareAll } from "../compare";

const business = {
  annualRevenue: 10000,
  annualExpenses: 2000,
  age: 35,
  yearsInBusiness: 4,
  efkaCategory: "1st" as const,
};
const invoice = {
  qualifiesForEmployeeTax: true as const,
  annualGrossInvoiced: 30000,
  age: 35,
  children: 0,
  efkaCategory: "1st" as const,
};

describe("2026 scenario safeguards", () => {
  it("requires the applicable business minimum after year three", () => {
    expect(() => calculateSelfEmployed(business)).toThrow(/minimum/);
    expect(() =>
      calculateSelfEmployed({ ...business, yearsInBusiness: 3 }),
    ).not.toThrow();
  });
  it("taxes the minimum without treating presumed income as cash earned", () => {
    const result = calculateSelfEmployed({
      ...business,
      minimumTaxableIncome: 14000,
    });
    expect(result.actualProfit).toBe(4870.76);
    expect(result.taxableIncome).toBe(14000);
    expect(result.annualTax).toBe(1700);
    expect(result.annualNet).toBe(3170.76);
    expect(result.netAfterPrepayment).toBe(2235.76);
  });
  it("uses actual profit when it exceeds the supplied minimum", () => {
    const result = calculateSelfEmployed({
      ...business,
      annualRevenue: 33129.24,
      annualExpenses: 0,
      minimumTaxableIncome: 14000,
    });
    expect(result.taxableIncome).toBe(30000);
    expect(result.annualTax).toBe(5500);
  });
  it("adds additional contributions once, including their tax deduction", () => {
    const result = calculateSelfEmployed({
      ...business,
      minimumTaxableIncome: 0,
      additionalMonthlyInsurance: 50,
    });
    expect(result.annualEFKA).toBe(3729.24);
    expect(result.actualProfit).toBe(4270.76);
  });
  it("ties the reduced advance to the first declaration, independently of business age", () => {
    expect(
      calculateSelfEmployed({
        ...business,
        yearsInBusiness: 1,
        firstIncomeDeclaration: false,
      }).prepaymentRate,
    ).toBe(0.55);
    expect(
      calculateSelfEmployed({
        ...business,
        minimumTaxableIncome: 0,
        firstIncomeDeclaration: true,
      }).prepaymentRate,
    ).toBe(0.275);
  });
  it("rejects an ineligible special category", () => {
    expect(() =>
      calculateSelfEmployed({
        ...business,
        yearsInBusiness: 6,
        efkaCategory: "special",
        minimumTaxableIncome: 0,
      }),
    ).toThrow(/special/);
  });
  it("requires confirmed Article 12 treatment at the domain boundary", () => {
    const { qualifiesForEmployeeTax, ...unconfirmed } = invoice;
    expect(qualifiesForEmployeeTax).toBe(true);
    // @ts-expect-error Runtime callers also need an explicit qualification.
    expect(() => calculateMplokaki(unconfirmed)).toThrow();
  });
  it("uses only supplied worker contributions for Article 39, without adding category fees", () => {
    const result = calculateMplokaki({
      ...invoice,
      insurance: { kind: "article39", annualWorkerContributions: 2400 },
    });
    expect(result.annualEFKA).toBe(2400);
    expect(result.taxableIncome).toBe(27600);
    expect(result.annualTax).toBe(4411);
    expect(result.annualNet).toBe(23189);
  });
  it("actual withholding changes settlement but not annual net or tax", () => {
    const assumed = calculateMplokaki(invoice);
    const actual = calculateMplokaki({ ...invoice, annualWithheld: 0 });
    expect(assumed.totalWithheld).toBe(6000);
    expect(actual.totalWithheld).toBe(0);
    expect(actual.balanceDue).toBe(actual.annualTax);
    expect(actual.annualNet).toBe(assumed.annualNet);
    expect(actual.annualTax).toBe(assumed.annualTax);
  });
  it("caps the applied credit at gross tax", () => {
    expect(
      calculateEmployee({ monthlyGross: 500, children: 2, age: 35 }).taxCredit,
    ).toBe(545.77);
    expect(
      calculateMplokaki({ ...invoice, age: 25, annualGrossInvoiced: 10000 })
        .taxCredit,
    ).toBe(0);
  });
  it("comparison totals reconcile to income and exclude the tax advance", () => {
    const result = compareAll(2000, 14000);
    for (const mode of ["employee", "self-employed", "mplokaki"] as const) {
      const entry = result[mode];
      const gross = 2000 * (mode === "employee" ? 14 : 12);
      expect(entry.annualNet + entry.totalTaxesAnnual).toBeCloseTo(gross, 2);
      expect(entry.effectiveTaxRate).toBeCloseTo(
        entry.totalTaxesAnnual / gross,
        5,
      );
    }
  });
});
