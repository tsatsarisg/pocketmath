import type { ReactNode } from "react";
import type { Mode, Period } from "@/types/calculator";
import type { CalculatorReturn } from "@/hooks/use-calculator";
import { EmployeeInputs } from "@/components/calculator/employee-inputs";
import { SelfEmployedInputs } from "@/components/calculator/self-employed-inputs";
import { MplokakiInputs } from "@/components/calculator/mplokaki-inputs";
import { EmployeeBreakdown } from "@/components/calculator/employee-breakdown";
import { SelfEmployedBreakdown } from "@/components/calculator/self-employed-breakdown";
import { MplokakiBreakdown } from "@/components/calculator/mplokaki-breakdown";

import { IkeInputs } from "./ike-inputs";
import { IkeBreakdown } from "./ike-breakdown";
import { PartnershipInputs } from "./partnership-inputs";
import { PartnershipBreakdown } from "./partnership-breakdown";

export interface ModeConfig {
  labelKey: string;
  /** i18n key for the aria-live mode-change announcement. */
  a11yKey: string;
  /** Renders the mode's input fields from the calculator state. */
  renderInputs: (calc: CalculatorReturn) => ReactNode;
  /** Renders the mode's result breakdown, or null when there is no result. */
  renderBreakdown: (calc: CalculatorReturn, period: Period) => ReactNode;
}

export const MODE_REGISTRY: { [K in Mode]: ModeConfig } = {
  employee: {
    labelKey: "modes.employee",
    a11yKey: "a11y.modeEmployee",
    renderInputs: (calc) => <EmployeeInputs state={calc.emp} />,
    renderBreakdown: (calc, period) =>
      calc.empResult ? (
        <EmployeeBreakdown result={calc.empResult} period={period} />
      ) : null,
  },
  "self-employed": {
    labelKey: "modes.selfEmployed",
    a11yKey: "a11y.modeSelfEmployed",
    renderInputs: (calc) => <SelfEmployedInputs state={calc.se} />,
    renderBreakdown: (calc, period) =>
      calc.seResult ? (
        <SelfEmployedBreakdown result={calc.seResult} period={period} />
      ) : null,
  },
  mplokaki: {
    labelKey: "modes.mplokaki",
    a11yKey: "a11y.modeMplokaki",
    renderInputs: (calc) => <MplokakiInputs state={calc.mp} />,
    renderBreakdown: (calc, period) =>
      calc.mpResult ? (
        <MplokakiBreakdown result={calc.mpResult} period={period} />
      ) : null,
  },
  ike: {
    labelKey: "modes.ike",
    a11yKey: "a11y.modeIke",
    renderInputs: (calc) => <IkeInputs state={calc.ike} />,
    renderBreakdown: (calc, period) =>
      calc.ikeResult ? (
        <IkeBreakdown result={calc.ikeResult} period={period} />
      ) : null,
  },
  partnership: {
    labelKey: "modes.partnership",
    a11yKey: "a11y.modePartnership",
    renderInputs: (calc) => <PartnershipInputs state={calc.partnership} />,
    renderBreakdown: (calc, period) =>
      calc.partnershipResult ? (
        <PartnershipBreakdown result={calc.partnershipResult} period={period} />
      ) : null,
  },
};
