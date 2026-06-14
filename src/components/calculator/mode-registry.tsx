import type { ReactNode } from "react";
import type { Mode, Period } from "@/types/calculator";
import type { CalculatorReturn } from "@/hooks/use-calculator";
import { EmployeeInputs } from "@/components/calculator/employee-inputs";
import { SelfEmployedInputs } from "@/components/calculator/self-employed-inputs";
import { MplokakiInputs } from "@/components/calculator/mplokaki-inputs";
import { EmployeeBreakdown } from "@/components/calculator/employee-breakdown";
import { SelfEmployedBreakdown } from "@/components/calculator/self-employed-breakdown";
import { MplokakiBreakdown } from "@/components/calculator/mplokaki-breakdown";

// Single source of truth for the per-mode delivery wiring.
//
// Each mode maps to: the inputs renderer (fed the grouped state from the hook),
// the breakdown renderer (fed that mode's result + period), and the i18n key
// announced to assistive tech when the mode is selected. Render *functions*
// (not bare components) are used because each mode pulls a different slice of
// the CalculatorReturn — this keeps page.tsx free of `mode === ...` branches:
// adding a mode means adding one entry here (plus its state in the hook).
export interface ModeConfig {
  /** i18n key for the aria-live mode-change announcement. */
  a11yKey: string;
  /** Renders the mode's input fields from the calculator state. */
  renderInputs: (calc: CalculatorReturn) => ReactNode;
  /** Renders the mode's result breakdown, or null when there is no result. */
  renderBreakdown: (calc: CalculatorReturn, period: Period) => ReactNode;
}

export const MODE_REGISTRY: { [K in Mode]: ModeConfig } = {
  employee: {
    a11yKey: "a11y.modeEmployee",
    renderInputs: (calc) => <EmployeeInputs state={calc.emp} />,
    renderBreakdown: (calc, period) =>
      calc.empResult ? (
        <EmployeeBreakdown result={calc.empResult} period={period} />
      ) : null,
  },
  "self-employed": {
    a11yKey: "a11y.modeSelfEmployed",
    renderInputs: (calc) => <SelfEmployedInputs state={calc.se} />,
    renderBreakdown: (calc, period) =>
      calc.seResult ? (
        <SelfEmployedBreakdown result={calc.seResult} period={period} />
      ) : null,
  },
  mplokaki: {
    a11yKey: "a11y.modeMplokaki",
    renderInputs: (calc) => <MplokakiInputs state={calc.mp} />,
    renderBreakdown: (calc, period) =>
      calc.mpResult ? (
        <MplokakiBreakdown result={calc.mpResult} period={period} />
      ) : null,
  },
};
