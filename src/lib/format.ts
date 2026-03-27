const eurFmt = new Intl.NumberFormat("el-GR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const pctFmt = new Intl.NumberFormat("el-GR", {
  style: "percent",
  maximumFractionDigits: 1,
});

export function fmt(n: number): string {
  return eurFmt.format(n);
}

export function fmtPct(n: number): string {
  return pctFmt.format(n);
}
