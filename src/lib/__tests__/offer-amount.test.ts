import { describe, expect, it } from "vitest";
import { getOfferAmounts } from "../offer-amount";

describe("offer periods", () => {
  it("keeps the same offer when displaying a monthly amount annually", () => {
    expect(getOfferAmounts("4000,50", "monthly", "annual")).toEqual({
      displayedAmount: "48006",
      monthlyGross: 4000.5,
      annualBusinessRevenue: 48006,
    });
  });

  it("uses the exact entered amount when the monthly display rounds to cents", () => {
    expect(getOfferAmounts("50000", "annual", "monthly")).toEqual({
      displayedAmount: "4166.67",
      monthlyGross: 50000 / 12,
      annualBusinessRevenue: 50000,
    });
  });

  it("supports equivalent amounts at the monthly and annual limits", () => {
    expect(getOfferAmounts("10000000", "monthly", "annual")).toEqual(
      getOfferAmounts("120000000", "annual", "annual"),
    );
    expect(
      getOfferAmounts("120000001", "annual", "annual").monthlyGross,
    ).toBeNull();
  });
});
