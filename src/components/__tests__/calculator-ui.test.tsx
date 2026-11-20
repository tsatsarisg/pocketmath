import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import i18n from "@/i18n";
import ComparePage from "@/app/compare/page";
import { NumberField } from "@/components/calculator/number-field";
import { SelfEmployedBreakdown } from "@/components/calculator/self-employed-breakdown";
import { EmployeeBreakdown } from "@/components/calculator/employee-breakdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { calculateSelfEmployed } from "@/lib/tax/self-employed";
import { calculateEmployee } from "@/lib/tax/employee";
import { getCalculatorStats } from "@/lib/calculator-stats";
import { fmt } from "@/lib/format";

const noop = () => {};
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("calculator presentation", () => {
  it("opens the offer comparison in first-year business mode with optional expenses", async () => {
    await i18n.changeLanguage("el");
    const html = renderToStaticMarkup(<ComparePage />);
    const checkbox = html.match(/<input[^>]+type="checkbox"[^>]*>/)?.[0];
    expect(checkbox).toBeDefined();
    expect(checkbox).not.toContain("checked");
    expect(html).toContain("Αμοιβή προ ΦΠΑ / μήνα");
    expect(html).toContain("Κοινά έξοδα / μήνα (προαιρετικά)");
    expect(html).toContain("Πρώτη έναρξη");
    expect(html).not.toContain("Εφαρμοστέο ελάχιστο φορολογητέο εισόδημα");
    expect(html).toContain("Σύγκρινε και ετερόρρυθμη εταιρεία (Ε.Ε.)");
    expect(html).not.toContain("ΕΦΚΑ ετερόρρυθμου εταίρου");
  });

  it("shows the 2026 employee contribution rate in both languages", async () => {
    const result = calculateEmployee({
      monthlyGross: 2000,
      children: 0,
      age: 35,
    });
    for (const language of ["en", "el"]) {
      await i18n.changeLanguage(language);
      const html = renderToStaticMarkup(
        <EmployeeBreakdown result={result} period="annual" />,
      );
      expect(html).toContain(language === "en" ? "13.37%" : "13,37%");
      expect(html).toContain(fmt(3743.6));
    }
  });

  it("associates a translated validation message with the invalid field", async () => {
    await i18n.changeLanguage("en");
    const html = renderToStaticMarkup(
      <NumberField field="age" label="Age" value="15" onChange={noop} />,
    );
    expect(html).toContain('aria-invalid="true"');
    const errorId = html.match(/aria-describedby="([^"]+)"/)?.[1];
    expect(errorId).toBeDefined();
    expect(html).toContain(`id="${errorId}"`);
    expect(html).toContain("Enter a whole-number age from 16 to 120.");
    expect(html).toContain('value="15"');
  });
  it("uses a period-neutral revenue label in both languages", async () => {
    const result = calculateSelfEmployed({
      minimumTaxableIncome: 0,
      annualRevenue: 24000,
      annualExpenses: 0,
      efkaCategory: "1st",
      age: 35,
      yearsInBusiness: 4,
    });
    for (const language of ["en", "el"]) {
      await i18n.changeLanguage(language);
      const html = renderToStaticMarkup(
        <SelfEmployedBreakdown result={result} period="monthly" />,
      );
      expect(html).toContain(language === "en" ? "Revenue" : "Έσοδα");
      expect(html).toContain(fmt(2000));
      expect(html).not.toContain("Annual revenue");
    }
  });
  it("uses 14 paychecks for employee monthly results and full values for annual results", () => {
    const employee = calculateEmployee({
      monthlyGross: 2000,
      children: 0,
      age: 35,
    });
    const monthly = getCalculatorStats(
      "employee",
      "monthly",
      employee,
      null,
      null,
      i18n.t.bind(i18n),
    );
    const annual = getCalculatorStats(
      "employee",
      "annual",
      employee,
      null,
      null,
      i18n.t.bind(i18n),
    );
    expect(monthly?.netValue).toBe(fmt(employee.annualNet / 14));
    expect(annual?.netValue).toBe(fmt(employee.annualNet));
    expect(annual?.grossValue).toBe(fmt(28000));
  });
  it("keeps server markup stable even when a light-theme document exists", () => {
    const server = renderToStaticMarkup(<ThemeToggle />);
    vi.stubGlobal("document", {
      documentElement: { classList: { contains: () => false } },
    });
    expect(renderToStaticMarkup(<ThemeToggle />)).toBe(server);
  });
  it("exposes one tab stop and a supplied accessible name", () => {
    const html = renderToStaticMarkup(
      <SegmentedControl
        label="Language"
        value="en"
        onChange={noop}
        options={[
          { id: "el", label: "ΕΛ" },
          { id: "en", label: "EN" },
        ]}
      />,
    );
    expect(html).toContain('aria-label="Language"');
    expect(html.match(/tabindex="0"/g)).toHaveLength(1);
    expect(html.match(/aria-checked="true"/g)).toHaveLength(1);
  });
});
