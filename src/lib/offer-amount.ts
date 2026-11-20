import type { Period } from "@/types/calculator";
import { parseField } from "./parse";

const displayedCurrency = new Intl.NumberFormat("en", {
  useGrouping: false,
  maximumFractionDigits: 2,
});

export function getOfferAmounts(
  value: string,
  enteredPeriod: Period,
  displayedPeriod: Period,
) {
  const amount = parseField(
    value,
    enteredPeriod === "annual" ? "annual-offer" : "monthly",
  );
  if (amount === null) {
    return {
      displayedAmount: value,
      monthlyGross: null,
      annualBusinessRevenue: null,
    };
  }

  const monthlyGross = enteredPeriod === "annual" ? amount / 12 : amount;
  const annualBusinessRevenue =
    enteredPeriod === "annual" ? amount : amount * 12;
  const convertedAmount =
    displayedPeriod === "annual" ? annualBusinessRevenue : monthlyGross;

  return {
    displayedAmount:
      displayedPeriod === enteredPeriod
        ? value
        : displayedCurrency.format(convertedAmount),
    monthlyGross,
    annualBusinessRevenue,
  };
}
