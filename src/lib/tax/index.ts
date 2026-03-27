// Types and schemas
export type {
  TaxBracket,
  EfkaCategoryId,
  EfkaCategory,
  CalculateTaxInput,
  CalculateTaxResult,
  TaxCreditInput,
  EmployeeInput,
  EmployeeResult,
  SelfEmployedInput,
  SelfEmployedResult,
  MplokakiInput,
  MplokakiResult,
} from "./types";

export {
  TaxBracketSchema,
  EFKA_CATEGORY_IDS,
  EfkaCategoryIdSchema,
  CalculateTaxInputSchema,
  TaxCreditInputSchema,
  EmployeeInputSchema,
  SelfEmployedInputSchema,
  MplokakiInputSchema,
} from "./types";

// Constants
export {
  TAX_YEAR,
  STANDARD_BRACKETS,
  EMPLOYEE_SS_RATE,
  EMPLOYER_SS_RATE,
  EMPLOYEE_SS_CEILING_MONTHLY,
  SALARY_MONTHS,
  MPLOKAKI_WITHHOLDING_RATE,
  FIRST_YEAR_BRACKET_DISCOUNT,
  FIRST_YEAR_BENEFIT_MAX_YEARS,
  PREPAYMENT_RATE_FIRST_YEAR,
  PREPAYMENT_RATE_STANDARD,
  getPrepaymentRate,
  getBracket2Rate,
  getBracket3Rate,
} from "./constants";

// Core calculation functions
export { calculateTax } from "./calculate-tax";
export { taxCredit } from "./tax-credit";
export { calculateEmployee } from "./employee";
export { calculateSelfEmployed } from "./self-employed";
export { calculateMplokaki } from "./mplokaki";

// EFKA helpers
export {
  getAllEfkaCategories,
  getAnnualEfka,
  getMonthlyEfka,
  getAvailableCategories,
} from "./efka";
