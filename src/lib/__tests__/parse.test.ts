import { describe, expect, it } from "vitest";
import { parseField, validateField, type NumericField } from "../parse";

describe("calculator field validation", () => {
  it.each<[string, NumericField]>([
    ["", "age"], ["15", "age"], ["121", "age"], ["35.5", "age"],
    ["-1", "children"], ["1.5", "children"], ["11", "children"],
    ["0", "years"], ["2.5", "years"], ["Infinity", "years"],
    ["10000001", "monthly"], ["2,000.50", "monthly"], ["-100", "expenses"],
    ["1e3", "monthly"], ["2000abc", "monthly"],
  ])("rejects %s for %s without substitution", (value, field) => {
    expect(validateField(value, field)).toBeDefined();
    expect(parseField(value, field)).toBeNull();
  });
  it.each<[string, NumericField, number]>([
    ["0", "monthly", 0], ["00", "monthly", 0], ["2000.50", "monthly", 2000.5],
    ["2000,50", "monthly", 2000.5], ["16", "age", 16], ["120", "age", 120],
    ["10", "children", 10], ["1", "years", 1], ["10000000", "expenses", 10000000],
  ])("accepts %s for %s", (value, field, expected) => {
    expect(parseField(value, field)).toBe(expected);
  });
});
