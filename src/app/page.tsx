"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Calculator, Wallet } from "lucide-react";
import type { Mode, Period } from "@/types/calculator";
import { useCalculator } from "@/hooks/use-calculator";
import { MODE_REGISTRY } from "@/components/calculator/mode-registry";
import { CalculatorHeading } from "@/components/ui/calculator-heading";
import { Disclosure } from "@/components/ui/disclosure";
import { FieldRow } from "@/components/ui/field-row";
import { Label } from "@/components/ui/label";
import { PeriodToggle } from "@/components/ui/period-toggle";
import { ResultsPlaceholder } from "@/components/ui/results-placeholder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";

export default function HomePage() {
  const { t } = useTranslation();
  const modeId = useId();
  const [mode, setMode] = useState<Mode>("employee");
  const [period, setPeriod] = useState<Period>("monthly");

  const calc = useCalculator(mode, period);
  const { stats, hasUserInput, hasResult } = calc;
  const errorMessage =
    mode === "mplokaki" && !calc.mp.qualified
      ? t("inputs.article12Required")
      : t("results.invalid");
  const modeConfig = MODE_REGISTRY[mode];
  const modes = Object.keys(MODE_REGISTRY) as Mode[];

  return (
    <>
      <CalculatorHeading
        title={t("hero.headline")}
        description={t("hero.subtitle")}
        action={
          <Link href="/compare" className="calculator-action">
            {t("compare.openQuick")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <div className="calculator-layout">
        <section
          className="calculator-panel space-y-5"
          aria-labelledby="calculator-inputs"
        >
          <h2 id="calculator-inputs" className="calculator-panel-title">
            <Calculator aria-hidden="true" />
            {t("inputs.details")}
          </h2>
          <div className="border-b border-border pb-5">
            <FieldRow>
              <Label htmlFor={modeId}>{t("a11y.employment")}</Label>
              <Select
                value={mode}
                onValueChange={(value) => {
                  const next = modes.find((item) => item === value);
                  if (next) {
                    setMode(next);
                  }
                }}
              >
                <SelectTrigger id={modeId}>
                  <SelectValue>{t(modeConfig.labelKey)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {modes.map((id) => (
                    <SelectItem key={id} value={id}>
                      {t(MODE_REGISTRY[id].labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>
          </div>
          <div aria-live="polite" className="sr-only" aria-atomic="true">
            {t(modeConfig.a11yKey)}
          </div>
          {modeConfig.renderInputs(calc)}
        </section>

        <section
          className="calculator-panel space-y-4"
          aria-labelledby="calculator-results"
        >
          <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
            <h2 id="calculator-results" className="calculator-panel-title">
              <Wallet aria-hidden="true" />
              {t("results.headline")}
            </h2>
            {hasResult && <PeriodToggle value={period} onChange={setPeriod} />}
          </div>

          <div role="status" className="sr-only" aria-atomic="true">
            {hasResult && stats
              ? `${stats.netLabel}: ${stats.netValue} ${stats.netSub}`
              : hasUserInput
                ? errorMessage
                : ""}
          </div>

          {hasResult && stats ? (
            <>
              <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2">
                <StatCard
                  label={stats.netLabel}
                  amount={stats.netValue}
                  sub={stats.netSub}
                  badge={
                    mode === "employee" && period === "monthly"
                      ? t("results.paycheckBadge")
                      : undefined
                  }
                  hero
                  className="col-span-full"
                />
                <StatCard
                  label={stats.grossLabel}
                  amount={stats.grossValue}
                  sub={stats.grossSub}
                />
                <StatCard
                  label={stats.taxLabel}
                  amount={stats.taxValue}
                  sub={stats.taxSub}
                />
              </div>

              <Disclosure key={mode} label={t("results.breakdown")}>
                {modeConfig.renderBreakdown(calc, period)}
              </Disclosure>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {t("disclaimer")}
              </p>
            </>
          ) : (
            <ResultsPlaceholder
              invalid={hasUserInput}
              message={hasUserInput ? errorMessage : t("results.emptyState")}
            />
          )}
        </section>
      </div>
    </>
  );
}
