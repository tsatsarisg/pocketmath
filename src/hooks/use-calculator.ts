import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { calculateEmployee } from "@/lib/tax/employee";
import { calculateSelfEmployed } from "@/lib/tax/self-employed";
import { calculateMplokaki } from "@/lib/tax/mplokaki";
import type { EfkaCategoryId } from "@/lib/tax/types";
import type { EmployeeResult } from "@/lib/tax/types";
import type { SelfEmployedResult } from "@/lib/tax/types";
import type { MplokakiResult } from "@/lib/tax/types";
import type { Mode } from "@/types/calculator";
import { fmt } from "@/lib/format";

type Period = "monthly" | "annual";

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

  // Reset seEfka to "1st" when seYears changes to >5 and current value is "special"
  const prevSeYears = Number(seYears);
  if (prevSeYears > 5 && seEfka === "special") {
    setSeEfka("1st");
  }

  // Calculations
  const empResult = useMemo(() => {
    try {
      const monthlyGross = Math.max(0, parseFloat(empMonthly) || 0);
      const children = Math.max(0, parseInt(empChildren, 10) || 0);
      const age = Math.min(120, Math.max(16, parseInt(empAge, 10) || 35));
      return calculateEmployee({ monthlyGross, children, age });
    } catch {
      return null;
    }
  }, [empMonthly, empChildren, empAge]);

  const seResult = useMemo(() => {
    try {
      const annualRevenue = Math.max(0, (parseFloat(seMonthly) || 0) * 12);
      const annualExpenses = Math.max(0, (parseFloat(seExpenses) || 0) * 12);
      const yearsInBusiness = Math.max(1, parseInt(seYears, 10) || 4);
      const age = Math.min(120, Math.max(16, parseInt(seAge, 10) || 35));
      return calculateSelfEmployed({
        annualRevenue,
        annualExpenses,
        efkaCategory: seEfka,
        age,
        yearsInBusiness,
      });
    } catch {
      return null;
    }
  }, [seMonthly, seExpenses, seEfka, seYears, seAge]);

  const mpResult = useMemo(() => {
    try {
      const annualGrossInvoiced = Math.max(
        0,
        (parseFloat(mpMonthly) || 0) * 12,
      );
      const children = Math.max(0, parseInt(mpChildren, 10) || 0);
      const age = Math.min(120, Math.max(16, parseInt(mpAge, 10) || 35));
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

  // Derived display values
  const stats = useMemo(() => {
    if (mode === "employee" && empResult) {
      const m = period === "monthly";
      const gross = m ? empResult.monthlyGross : empResult.annualGross;
      const tax = m
        ? empResult.annualTax / 14 + empResult.annualEmployeeSS / 14
        : empResult.annualTax + empResult.annualEmployeeSS;
      const net = m ? empResult.monthlyNet : empResult.annualNet;
      const periodLabel = m ? t("results.perMonth") : t("results.perYear");
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
    }
    if (mode === "self-employed" && seResult) {
      const m = period === "monthly";
      const div = m ? 12 : 1;
      const gross = seResult.annualRevenue / div;
      const tax =
        (seResult.annualTax + seResult.annualEFKA + seResult.prepayment) / div;
      const net = seResult.annualNet / div;
      const periodLabel = m ? t("results.perMonth") : t("results.perYear");
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
    }
    if (mode === "mplokaki" && mpResult) {
      const m = period === "monthly";
      const div = m ? 12 : 1;
      const gross = mpResult.annualGrossInvoiced / div;
      const tax = (mpResult.annualTax + mpResult.annualEFKA) / div;
      const net = mpResult.annualNet / div;
      const periodLabel = m ? t("results.perMonth") : t("results.perYear");
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
    }
    return null;
  }, [mode, period, empResult, seResult, mpResult, t]);

  // Gate results on actual user input
  const hasUserInput =
    mode === "employee"
      ? empMonthly !== "" && empMonthly !== "0"
      : mode === "self-employed"
        ? seMonthly !== "" && seMonthly !== "0"
        : mpMonthly !== "" && mpMonthly !== "0";

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
