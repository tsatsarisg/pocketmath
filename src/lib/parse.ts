export type NumericField =
  | "monthly"
  | "annual-offer"
  | "expenses"
  | "amount"
  | "age"
  | "children"
  | "years"
  | "percentage"
  | "profitShare";
export type FieldError =
  | "required"
  | "amount"
  | "annual-offer"
  | "age"
  | "children"
  | "years"
  | "percentage"
  | "profitShare";

export function validateField(
  value: string,
  field: NumericField,
): FieldError | undefined {
  if (!value.trim()) {
    return "required";
  }
  const normalized = value.trim().replace(",", ".");
  const number = Number(normalized);
  const error =
    field === "monthly" || field === "expenses" || field === "amount"
      ? "amount"
      : field;
  if (!/^\d+(?:\.\d+)?$/.test(normalized) || !Number.isFinite(number)) {
    return error;
  }
  if (error === "amount") {
    return number <= 10_000_000 ? undefined : error;
  }
  if (field === "annual-offer") {
    return number <= 120_000_000 ? undefined : error;
  }
  if (field === "percentage") {
    return number <= 100 ? undefined : error;
  }
  if (field === "profitShare") {
    return number > 0 && number < 100 ? undefined : error;
  }
  if (!Number.isSafeInteger(number)) {
    return error;
  }
  if (field === "age") {
    return number >= 16 && number <= 120 ? undefined : error;
  }
  if (field === "children") {
    return number <= 10 ? undefined : error;
  }
  return number >= 1 ? undefined : error;
}

export function parseField(value: string, field: NumericField): number | null {
  return validateField(value, field)
    ? null
    : Number(value.trim().replace(",", "."));
}
