import type { CompareEntry } from "@/lib/tax/compare";

import type { Mode } from "./calculator";
export type ModeKey = Mode;

export interface RankedEntry {
  key: ModeKey;
  label: string;
  data: CompareEntry;
  rank: number;
  barWidth: number;
}
