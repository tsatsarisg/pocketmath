import type { CompareEntry } from "@/lib/tax/compare";

export type ModeKey = "employee" | "selfEmployed" | "mplokaki";

export interface RankedEntry {
  key: ModeKey;
  label: string;
  data: CompareEntry;
  rank: number;
  barWidth: number;
}
