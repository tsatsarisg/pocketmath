export const CORPORATE_TAX_RATE = 0.22;
export const DIVIDEND_TAX_RATE = 0.05;
export const HEAD_OFFICE_LEVIES = [0, 800, 1000] as const;
export type HeadOfficeLevy = (typeof HEAD_OFFICE_LEVIES)[number];

export function getCorporatePrepaymentRate(reduced: boolean): number {
  return reduced ? 0.4 : 0.8;
}

export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
