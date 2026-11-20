import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { calculateEmployee } from "@/lib/tax/employee";
import { calculateSelfEmployed } from "@/lib/tax/self-employed";
import { calculateMplokaki } from "@/lib/tax/mplokaki";
import {
  calculateIke,
  type IkeHeadOfficeLevy,
  type IkeResult,
} from "@/lib/tax/ike";
import type {
  EfkaCategoryId,
  EmployeeResult,
  SelfEmployedResult,
  MplokakiResult,
} from "@/lib/tax/types";
import type { Mode, Period } from "@/types/calculator";
import { getCalculatorStats, type Stats } from "@/lib/calculator-stats";
import { parseField } from "@/lib/parse";

export interface EmployeeState {
  monthly: string;
  setMonthly: (v: string) => void;
  children: string;
  setChildren: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
}

export interface SelfEmployedState {
  children: string;
  setChildren: (v: string) => void;
  minimumIncome: string;
  setMinimumIncome: (v: string) => void;
  additionalInsurance: string;
  setAdditionalInsurance: (v: string) => void;
  firstDeclaration: boolean;
  setFirstDeclaration: (v: boolean) => void;
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
  qualified: boolean;
  setQualified: (v: boolean) => void;
  insuranceMethod: "category" | "article39";
  setInsuranceMethod: (v: "category" | "article39") => void;
  workerInsurance: string;
  setWorkerInsurance: (v: string) => void;
  additionalInsurance: string;
  setAdditionalInsurance: (v: string) => void;
  actualWithholding: boolean;
  setActualWithholding: (v: boolean) => void;
  withheld: string;
  setWithheld: (v: string) => void;
  monthly: string;
  setMonthly: (v: string) => void;
  efka: EfkaCategoryId;
  setEfka: (v: EfkaCategoryId) => void;
  children: string;
  setChildren: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
}

export interface IkeState {
  monthly: string;
  setMonthly: (v: string) => void;
  expenses: string;
  setExpenses: (v: string) => void;
  efka: EfkaCategoryId;
  setEfka: (v: EfkaCategoryId) => void;
  additionalInsurance: string;
  setAdditionalInsurance: (v: string) => void;
  levy: IkeHeadOfficeLevy;
  setLevy: (v: IkeHeadOfficeLevy) => void;
  distribution: string;
  setDistribution: (v: string) => void;
  reducedPrepayment: boolean;
  setReducedPrepayment: (v: boolean) => void;
}

export interface CalculatorReturn {
  ike: IkeState;
  ikeResult: IkeResult | null;
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

  const [seChildren, setSeChildren] = useState("0");
  const [seMinimumIncome, setSeMinimumIncome] = useState("");
  const [seAdditionalInsurance, setSeAdditionalInsurance] = useState("0");
  const [seFirstDeclaration, setSeFirstDeclaration] = useState(false);

  // Self-employed state
  const [seMonthly, setSeMonthly] = useState("");
  const [seExpenses, setSeExpenses] = useState("0");
  const [seEfka, setSeEfka] = useState<EfkaCategoryId>("1st");
  const [seYears, setSeYears] = useState("4");
  const [seAge, setSeAge] = useState("35");

  const [mpQualified, setMpQualified] = useState(false);
  const [mpInsuranceMethod, setMpInsuranceMethod] = useState<
    "category" | "article39"
  >("category");
  const [mpWorkerInsurance, setMpWorkerInsurance] = useState("");
  const [mpAdditionalInsurance, setMpAdditionalInsurance] = useState("0");
  const [mpActualWithholding, setMpActualWithholding] = useState(false);
  const [mpWithheld, setMpWithheld] = useState("");

  // Mplokaki state
  const [mpMonthly, setMpMonthly] = useState("");
  const [mpEfka, setMpEfka] = useState<EfkaCategoryId>("1st");
  const [mpChildren, setMpChildren] = useState("0");
  const [mpAge, setMpAge] = useState("35");

  const [ikeMonthly, setIkeMonthly] = useState("");
  const [ikeExpenses, setIkeExpenses] = useState("0");
  const [ikeEfka, setIkeEfka] = useState<EfkaCategoryId>("1st");
  const [ikeAdditionalInsurance, setIkeAdditionalInsurance] = useState("0");
  const [ikeLevy, setIkeLevy] = useState<IkeHeadOfficeLevy>(0);
  const [ikeDistribution, setIkeDistribution] = useState("100");
  const [ikeReducedPrepayment, setIkeReducedPrepayment] = useState(false);

  function updateSeYears(value: string) {
    setSeYears(value);
    const years = parseField(value, "years");
    if (years !== null && years > 5 && seEfka === "special") {
      setSeEfka("1st");
    }
  }

  // Calculations
  const empResult = useMemo(() => {
    const monthlyGross = parseField(empMonthly, "monthly");
    const children = parseField(empChildren, "children");
    const age = parseField(empAge, "age");
    if (monthlyGross === null || children === null || age === null) {
      return null;
    }
    return calculateEmployee({ monthlyGross, children, age });
  }, [empMonthly, empChildren, empAge]);

  const seResult = useMemo(() => {
    const monthlyRevenue = parseField(seMonthly, "monthly");
    const monthlyExpenses = parseField(seExpenses, "expenses");
    const yearsInBusiness = parseField(seYears, "years");
    const age = parseField(seAge, "age");
    const children = parseField(seChildren, "children");
    const minimumTaxableIncome =
      yearsInBusiness !== null && yearsInBusiness <= 3
        ? 0
        : parseField(seMinimumIncome, "amount");
    const additionalMonthlyInsurance = parseField(
      seAdditionalInsurance,
      "amount",
    );
    if (
      children === null ||
      minimumTaxableIncome === null ||
      additionalMonthlyInsurance === null
    ) {
      return null;
    }
    if (
      monthlyRevenue === null ||
      monthlyExpenses === null ||
      yearsInBusiness === null ||
      age === null
    ) {
      return null;
    }
    return calculateSelfEmployed({
      minimumTaxableIncome,
      children,
      additionalMonthlyInsurance,
      firstIncomeDeclaration: seFirstDeclaration,
      annualRevenue: monthlyRevenue * 12,
      annualExpenses: monthlyExpenses * 12,
      efkaCategory: seEfka,
      age,
      yearsInBusiness,
    });
  }, [
    seMonthly,
    seExpenses,
    seEfka,
    seYears,
    seAge,
    seChildren,
    seMinimumIncome,
    seAdditionalInsurance,
    seFirstDeclaration,
  ]);

  const mpResult = useMemo(() => {
    const monthlyInvoiced = parseField(mpMonthly, "monthly");
    const children = parseField(mpChildren, "children");
    const age = parseField(mpAge, "age");
    const contribution = parseField(
      mpInsuranceMethod === "article39"
        ? mpWorkerInsurance
        : mpAdditionalInsurance,
      "amount",
    );
    const annualWithheld = mpActualWithholding
      ? parseField(mpWithheld, "amount")
      : undefined;
    if (!mpQualified || contribution === null || annualWithheld === null) {
      return null;
    }
    if (monthlyInvoiced === null || children === null || age === null) {
      return null;
    }
    return calculateMplokaki({
      qualifiesForEmployeeTax: true,
      insurance:
        mpInsuranceMethod === "article39"
          ? { kind: "article39", annualWorkerContributions: contribution }
          : { kind: "category", additionalMonthly: contribution },
      annualWithheld,
      annualGrossInvoiced: monthlyInvoiced * 12,
      efkaCategory: mpEfka,
      children,
      age,
    });
  }, [
    mpMonthly,
    mpEfka,
    mpChildren,
    mpAge,
    mpQualified,
    mpInsuranceMethod,
    mpWorkerInsurance,
    mpAdditionalInsurance,
    mpActualWithholding,
    mpWithheld,
  ]);

  const ikeResult = useMemo(() => {
    const monthlyRevenue = parseField(ikeMonthly, "monthly");
    const monthlyExpenses = parseField(ikeExpenses, "expenses");
    const additionalMonthlyInsurance = parseField(
      ikeAdditionalInsurance,
      "amount",
    );
    const distributionPercent = parseField(ikeDistribution, "percentage");
    if (
      monthlyRevenue === null ||
      monthlyExpenses === null ||
      additionalMonthlyInsurance === null ||
      distributionPercent === null
    ) {
      return null;
    }
    return calculateIke({
      annualRevenue: monthlyRevenue * 12,
      annualExpenses: monthlyExpenses * 12,
      efkaCategory: ikeEfka,
      additionalMonthlyInsurance,
      distributionPercent,
      headOfficeLevy: ikeLevy,
      reducedPrepayment: ikeReducedPrepayment,
    });
  }, [
    ikeMonthly,
    ikeExpenses,
    ikeAdditionalInsurance,
    ikeDistribution,
    ikeEfka,
    ikeLevy,
    ikeReducedPrepayment,
  ]);

  const stats = getCalculatorStats(
    mode,
    period,
    empResult,
    seResult,
    mpResult,
    t,
    ikeResult,
  );

  // Gate results on actual user input. The "primary" revenue field differs per
  // mode, so look it up rather than branching by hand.
  const primaryInput: { [K in Mode]: string } = {
    employee: empMonthly,
    "self-employed": seMonthly,
    mplokaki: mpMonthly,
    ike: ikeMonthly,
  };
  const hasUserInput = primaryInput[mode] !== "";

  const hasResult = stats !== null && hasUserInput;

  return {
    ike: {
      monthly: ikeMonthly,
      setMonthly: setIkeMonthly,
      expenses: ikeExpenses,
      setExpenses: setIkeExpenses,
      efka: ikeEfka,
      setEfka: setIkeEfka,
      additionalInsurance: ikeAdditionalInsurance,
      setAdditionalInsurance: setIkeAdditionalInsurance,
      levy: ikeLevy,
      setLevy: setIkeLevy,
      distribution: ikeDistribution,
      setDistribution: setIkeDistribution,
      reducedPrepayment: ikeReducedPrepayment,
      setReducedPrepayment: setIkeReducedPrepayment,
    },
    ikeResult,
    emp: {
      monthly: empMonthly,
      setMonthly: setEmpMonthly,
      children: empChildren,
      setChildren: setEmpChildren,
      age: empAge,
      setAge: setEmpAge,
    },
    se: {
      children: seChildren,
      setChildren: setSeChildren,
      minimumIncome: seMinimumIncome,
      setMinimumIncome: setSeMinimumIncome,
      additionalInsurance: seAdditionalInsurance,
      setAdditionalInsurance: setSeAdditionalInsurance,
      firstDeclaration: seFirstDeclaration,
      setFirstDeclaration: setSeFirstDeclaration,
      monthly: seMonthly,
      setMonthly: setSeMonthly,
      expenses: seExpenses,
      setExpenses: setSeExpenses,
      efka: seEfka,
      setEfka: setSeEfka,
      years: seYears,
      setYears: updateSeYears,
      age: seAge,
      setAge: setSeAge,
    },
    mp: {
      qualified: mpQualified,
      setQualified: setMpQualified,
      insuranceMethod: mpInsuranceMethod,
      setInsuranceMethod: setMpInsuranceMethod,
      workerInsurance: mpWorkerInsurance,
      setWorkerInsurance: setMpWorkerInsurance,
      additionalInsurance: mpAdditionalInsurance,
      setAdditionalInsurance: setMpAdditionalInsurance,
      actualWithholding: mpActualWithholding,
      setActualWithholding: setMpActualWithholding,
      withheld: mpWithheld,
      setWithheld: setMpWithheld,
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
