import { useTranslation } from "react-i18next";
import { NumberField } from "./number-field";
import { EfkaField } from "./efka-field";
import { CheckField } from "./check-field";
import { HeadOfficeLevyField } from "./head-office-levy-field";
import { getAllEfkaCategories } from "@/lib/tax/efka";
import type { IkeState } from "@/hooks/use-calculator";

export function IkeInputs({ state }: { state: IkeState }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("ike.scope")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          field="monthly"
          label={t("inputs.revenue")}
          value={state.monthly}
          onChange={state.setMonthly}
          placeholder="2000"
        />
        <NumberField
          field="expenses"
          label={t("ike.expenses")}
          value={state.expenses}
          onChange={state.setExpenses}
        />
        <HeadOfficeLevyField value={state.levy} onChange={state.setLevy} />
        <NumberField
          field="percentage"
          label={t("ike.distribution")}
          value={state.distribution}
          onChange={state.setDistribution}
        />
        <EfkaField
          value={state.efka}
          onChange={state.setEfka}
          categories={getAllEfkaCategories()}
        />
        <NumberField
          field="amount"
          label={t("inputs.additionalInsurance")}
          value={state.additionalInsurance}
          onChange={state.setAdditionalInsurance}
        />
      </div>
      <p className="text-sm text-muted-foreground">{t("ike.efkaHelp")}</p>
      <CheckField
        checked={state.reducedPrepayment}
        onChange={state.setReducedPrepayment}
      >
        {t("ike.reducedPrepayment")}
        <span className="block text-muted-foreground">
          {t("ike.reducedHelp")}
        </span>
      </CheckField>
      <p className="text-sm text-muted-foreground">{t("ike.transition")}</p>
    </div>
  );
}
