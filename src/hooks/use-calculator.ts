import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { calculateEmployee } from "@/lib/tax/employee";
import { calculateSelfEmployed } from "@/lib/tax/self-employed";
import { calculateMplokaki } from "@/lib/tax/mplokaki";
import type { EfkaCategoryId } from "@/lib/tax/types";
import type { EmployeeResult } from "@/lib/tax/types";
import type { SelfEmployedResult } from "@/lib/tax/types";
import type { MplokakiResult } from "@/lib/tax/types";
import type { Mode, Period } from "@/types/calculator";
import { fmt } from "@/lib/format";
import { parseNonNegative, parseNonNegativeInt, clampAge } from "@/lib/parse";
import { getAvailableCategories } from "@/lib/tax/efka";

export interface Stats {
  grossLabel: string;
  grossValue: string;
  grossSub: string;
  taxLabel: string;
  taxValue: string;
  taxSub: string;
  netLabel: string;
  netValue: string;
  netSub: string;
}

export interface EmployeeState {
  monthly: string;
  setMonthly: (v: string) => void;
  children: string;
  setChildren: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
}

export interface SelfEmployedState {
  monthly: string;
  setMonthly: (v: string) => void;
  expenses: string;
  setExpenses: (v: string) => void;
  efka: EfkaCategoryId;
  setEfka: (v: EfkaCategoryId) => void;
  years: string;
  setYears: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
}

export interface MplokakiState {
  monthly: string;
  setMonthly: (v: string) => void;
  efka: EfkaCategoryId;
  setEfka: (v: EfkaCategoryId) => void;
  children: string;
  setChildren: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
}

export interface CalculatorReturn {
  emp: EmployeeState;
  se: SelfEmployedState;
  mp: MplokakiState;
  empResult: EmployeeResult | null;
  seResult: SelfEmployedResult | null;
  mpResult: MplokakiResult | null;
  stats: Stats | null;
  hasUserInput: boolean;
  hasResult: boolean;
}

export function useCalculator(mode: Mode, period: Period): CalculatorReturn {
  const { t } = useTranslation();

  // Employee state
  const [empMonthly, setEmpMonthly] = useState("");
  const [empChildren, setEmpChildren] = useState("0");
  const [empAge, setEmpAge] = useState("35");

  // Self-employed state
  const [seMonthly, setSeMonthly] = useState("");
  const [seExpenses, setSeExpenses] = useState("0");
  const [seEfka, setSeEfka] = useState<EfkaCategoryId>("1st");
  const [seYears, setSeYears] = useState("4");
  const [seAge, setSeAge] = useState("35");

  // Mplokaki state
  const [mpMonthly, setMpMonthly] = useState("");
  const [mpEfka, setMpEfka] = useState<EfkaCategoryId>("1st");
  const [mpChildren, setMpChildren] = useState("0");
  const [mpAge, setMpAge] = useState("35");

  // The "special" EFKA category is only offered for <=5 years in business
  // (see getAvailableCategories). Rather than mutate state during render when
  // years grows past 5, we derive the *effective* category here: if the stored
  // selection is no longer available for the current years, fall back to "1st".
  // This keeps render pure and avoids a double-render from a corrective effect.
  const effectiveSeEfka: EfkaCategoryId = useMemo(() => {
    const available = getAvailableCategories(Number(seYears));
    return available.some((c) => c.id === seEfka) ? seEfka : "1st";
  }, [seEfka, seYears]);

  // Calculations
  const empResult = useMemo(() => {
    try {
      const monthlyGross = parseNonNegative(empMonthly);
      const children = parseNonNegativeInt(empChildren);
      const age = clampAge(empAge);
      return calculateEmployee({ monthlyGross, children, age });
    } catch {
      return null;
    }
  }, [empMonthly, empChildren, empAge]);

  const seResult = useMemo(() => {
    try {
      const annualRevenue = parseNonNegative(seMonthly) * 12;
      const annualExpenses = parseNonNegative(seExpenses) * 12;
      const yearsInBusiness = Math.max(1, parseInt(seYears, 10) || 4);
      const age = clampAge(seAge);
      return calculateSelfEmployed({
        annualRevenue,
        annualExpenses,
        efkaCategory: effectiveSeEfka,
        age,
        yearsInBusiness,
      });
    } catch {
      return null;
    }
  }, [seMonthly, seExpenses, effectiveSeEfka, seYears, seAge]);

  const mpResult = useMemo(() => {
    try {
      const annualGrossInvoiced = parseNonNegative(mpMonthly) * 12;
      const children = parseNonNegativeInt(mpChildren);
      const age = clampAge(mpAge);
      return calculateMplokaki({
        annualGrossInvoiced,
        efkaCategory: mpEfka,
        children,
        age,
      });
    } catch {
      return null;
    }
  }, [mpMonthly, mpEfka, mpChildren, mpAge]);

  // Derived display values.
  //
  // Each mode turns its (annual) domain result into the same three-stat shape.
  // Rather than a three-way `mode === ...` branch, we look up a per-mode adapter
  // keyed by Mode. To add/adjust a mode's stats you edit exactly one entry here.
  // The shared period scaffolding (monthly flag + period label) is computed once
  // and passed in, so adapters only express what differs between modes.
  const stats = useMemo(() => {
    const m = period === "monthly";
    const periodLabel = m ? t("results.perMonth") : t("results.perYear");

    const adapters: { [K in Mode]: () => Stats | null } = {
      employee: () => {
        if (!empResult) return null;
        const gross = m ? empResult.monthlyGross : empResult.annualGross;
        const tax = m
          ? empResult.annualTax / 14 + empResult.annualEmployeeSS / 14
          : empResult.annualTax + empResult.annualEmployeeSS;
        const net = m ? empResult.monthlyNet : empResult.annualNet;
        return {
          grossLabel: t("results.gross"),
          grossValue: fmt(gross),
          grossSub: periodLabel,
          taxLabel: t("results.taxAndContributions"),
          taxValue: fmt(tax),
          taxSub: periodLabel,
          netLabel: t("results.net"),
          netValue: fmt(net),
          netSub: periodLabel,
        };
      },
      "self-employed": () => {
        if (!seResult) return null;
        const div = m ? 12 : 1;
        const gross = seResult.annualRevenue / div;
        const tax =
          (seResult.annualTax + seResult.annualEFKA + seResult.prepayment) / div;
        const net = seResult.annualNet / div;
        return {
          grossLabel: t("results.revenue"),
          grossValue: fmt(gross),
          grossSub: periodLabel,
          taxLabel: t("results.taxAndEfka"),
          taxValue: fmt(tax),
          taxSub: periodLabel,
          netLabel: t("results.net"),
          netValue: fmt(net),
          netSub: periodLabel,
        };
      },
      mplokaki: () => {
        if (!mpResult) return null;
        const div = m ? 12 : 1;
        const gross = mpResult.annualGrossInvoiced / div;
        const tax = (mpResult.annualTax + mpResult.annualEFKA) / div;
        const net = mpResult.annualNet / div;
        return {
          grossLabel: t("results.invoiced"),
          grossValue: fmt(gross),
          grossSub: periodLabel,
          taxLabel: t("results.taxAndEfka"),
          taxValue: fmt(tax),
          taxSub: periodLabel,
          netLabel: t("results.net"),
          netValue: fmt(net),
          netSub: periodLabel,
        };
      },
    };

    return adapters[mode]();
  }, [mode, period, empResult, seResult, mpResult, t]);

  // Gate results on actual user input. The "primary" revenue field differs per
  // mode, so look it up rather than branching by hand.
  const primaryInput: { [K in Mode]: string } = {
    employee: empMonthly,
    "self-employed": seMonthly,
    mplokaki: mpMonthly,
  };
  const hasUserInput =
    primaryInput[mode] !== "" && primaryInput[mode] !== "0";

  const hasResult = stats !== null && hasUserInput;

  return {
    emp: {
      monthly: empMonthly,
      setMonthly: setEmpMonthly,
      children: empChildren,
      setChildren: setEmpChildren,
      age: empAge,
      setAge: setEmpAge,
    },
    se: {
      monthly: seMonthly,
      setMonthly: setSeMonthly,
      expenses: seExpenses,
      setExpenses: setSeExpenses,
      efka: seEfka,
      setEfka: setSeEfka,
      years: seYears,
      setYears: setSeYears,
      age: seAge,
      setAge: setSeAge,
    },
    mp: {
      monthly: mpMonthly,
      setMonthly: setMpMonthly,
      efka: mpEfka,
      setEfka: setMpEfka,
      children: mpChildren,
      setChildren: setMpChildren,
      age: mpAge,
      setAge: setMpAge,
    },
    empResult,
    seResult,
    mpResult,
    stats,
    hasUserInput,
    hasResult,
  };
}
