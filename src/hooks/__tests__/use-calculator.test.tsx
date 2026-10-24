import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import "@/i18n";
import { useCalculator, type CalculatorReturn } from "../use-calculator";
import { getAnnualEfka } from "@/lib/tax/efka";
import type { Mode } from "@/types/calculator";

// Render-phase updates let these hook state transitions run with React's
// server renderer, without requiring a browser DOM dependency.
function runSteps(mode: Mode, steps: ((calc: CalculatorReturn) => void)[]) {
  function Harness() {
    const calc = useCalculator(mode, "monthly");
    const [step, setStep] = useState(0);
    if (step < steps.length) {
      const action = steps[step];
      if (!action) {
        throw new Error("Missing calculator test step");
      }
      action(calc);
      setStep(step + 1);
    }
    return (
      <script
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calc) }}
      />
    );
  }
  const markup = renderToStaticMarkup(<Harness />);
  return JSON.parse(
    markup.slice(markup.indexOf(">") + 1, markup.lastIndexOf("</script>")),
  ) as CalculatorReturn;
}

describe("calculator state transitions", () => {
  it("normalizes an ineligible EFKA selection and does not restore it implicitly", () => {
    const result = runSteps("self-employed", [
      (calc) => {
        calc.se.setMonthly("2000");
        calc.se.setMinimumIncome("0");
        calc.se.setEfka("special");
      },
      (calc) => {
        expect(calc.se.efka).toBe("special");
        calc.se.setYears("6");
      },
      (calc) => {
        expect(calc.se.efka).toBe("1st");
        expect(calc.seResult?.annualEFKA).toBe(getAnnualEfka("1st"));
        calc.se.setYears("4");
      },
    ]);
    expect(result.se.efka).toBe("1st");
  });
  it("preserves invalid age text and suppresses results until corrected", () => {
    const result = runSteps("employee", [
      (calc) => {
        calc.emp.setMonthly("2000");
        calc.emp.setAge("15");
      },
      (calc) => {
        expect(calc.emp.age).toBe("15");
        expect(calc.empResult).toBeNull();
        expect(calc.hasResult).toBe(false);
        calc.emp.setAge("35");
      },
    ]);
    expect(result.hasResult).toBe(true);
  });
  it("distinguishes empty income from zero income", () => {
    expect(runSteps("employee", []).hasUserInput).toBe(false);
    const result = runSteps("employee", [
      (calc) => {
        calc.emp.setMonthly("0");
      },
    ]);
    expect(result.hasResult).toBe(true);
    expect(result.empResult?.annualNet).toBe(0);
  });
  it("keeps inactive mode inputs", () => {
    const result = runSteps("employee", [
      (calc) => {
        calc.se.setMonthly("2500");
        calc.emp.setMonthly("2000");
      },
    ]);
    expect(result.se.monthly).toBe("2500");
    expect(result.emp.monthly).toBe("2000");
  });
});

describe("scenario input requirements", () => {
  it("blocks an established business until the minimum is entered", () => {
    const result = runSteps("self-employed", [
      (calc) => {
        calc.se.setMonthly("2000");
      },
      (calc) => {
        expect(calc.seResult).toBeNull();
        calc.se.setMinimumIncome("14000");
      },
    ]);
    expect(result.seResult?.minimumTaxableIncome).toBe(14000);
  });
  it("ignores the minimum field in the first three years and preserves it on return", () => {
    const result = runSteps("self-employed", [
      (calc) => {
        calc.se.setMonthly("2000");
        calc.se.setYears("3");
        calc.se.setMinimumIncome("14000");
      },
      (calc) => {
        expect(calc.seResult?.minimumTaxableIncome).toBe(0);
        calc.se.setYears("4");
      },
    ]);
    expect(result.seResult?.minimumTaxableIncome).toBe(14000);
  });
  it("requires eligibility and active insurance and withholding inputs", () => {
    const result = runSteps("mplokaki", [
      (calc) => {
        calc.mp.setMonthly("2000");
      },
      (calc) => {
        expect(calc.mpResult).toBeNull();
        calc.mp.setQualified(true);
        calc.mp.setInsuranceMethod("article39");
      },
      (calc) => {
        expect(calc.mpResult).toBeNull();
        calc.mp.setWorkerInsurance("2400");
      },
      (calc) => {
        expect(calc.mpResult?.annualEFKA).toBe(2400);
        calc.mp.setActualWithholding(true);
      },
      (calc) => {
        expect(calc.mpResult).toBeNull();
        calc.mp.setWithheld("0");
      },
    ]);
    expect(result.mpResult?.totalWithheld).toBe(0);
  });
});
