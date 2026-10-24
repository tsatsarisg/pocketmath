import { describe, it, expect } from "vitest";
import { taxCredit } from "../tax-credit";

describe("Article 16 credit", () => {
  it.each([777, 900, 1120, 1340, 1580, 1780, 2000, 2220])(
    "base credit %s at the threshold",
    (credit) => {
      const children = [777, 900, 1120, 1340, 1580, 1780, 2000, 2220].indexOf(
        credit,
      );
      expect(taxCredit(12000, children)).toBe(credit);
    },
  );
  it.each([
    [12001, 776.98],
    [12500, 767],
    [12999, 757.02],
    [13000, 757],
    [13999, 737.02],
    [20000, 617],
    [50849, 0.02],
    [50850, 0],
    [100000, 0],
  ])("tapers proportionally at income %s", (income, credit) => {
    expect(taxCredit(income, 0)).toBe(credit);
  });
  it("uses the family base before tapering", () => {
    expect(taxCredit(13000, 1)).toBe(880);
    expect(taxCredit(14000, 2)).toBe(1080);
    expect(taxCredit(20000, 3)).toBe(1180);
    expect(taxCredit(79000, 3)).toBe(0);
  });
  it("exempts five or more children from the taper", () => {
    expect(taxCredit(500000, 5)).toBe(1780);
    expect(taxCredit(500000, 6)).toBe(2000);
  });
});
