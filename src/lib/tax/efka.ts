import type { EfkaCategory, EfkaCategoryId } from "./types";
import { EFKA_CATEGORIES, getEfkaCategory, UNEMPLOYMENT_CONTRIBUTION_MONTHLY } from "./constants";

/**
 * Get all available EFKA insurance categories.
 */
export function getAllEfkaCategories(): readonly EfkaCategory[] {
  return EFKA_CATEGORIES;
}

/**
 * Calculate annual EFKA cost for a given category.
 */
export function getAnnualEfka(categoryId: EfkaCategoryId): number {
  return Math.round(getMonthlyEfka(categoryId) * 12 * 100) / 100;
}

/**
 * Calculate monthly EFKA cost for a given category.
 */
export function getMonthlyEfka(categoryId: EfkaCategoryId): number {
  return Math.round((getEfkaCategory(categoryId).monthly + UNEMPLOYMENT_CONTRIBUTION_MONTHLY) * 100) / 100;
}

/**
 * Get categories available based on years in business.
 * The "special" category is only available for the first 5 years.
 */
export function getAvailableCategories(
  yearsInBusiness: number,
): readonly EfkaCategory[] {
  if (yearsInBusiness <= 5) {
    return EFKA_CATEGORIES;
  }
  return EFKA_CATEGORIES.filter((c) => c.id !== "special");
}
