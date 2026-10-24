import { useTranslation } from "react-i18next";
import { CheckField } from "./check-field";
import { NumberField } from "./number-field";
import type { SelfEmployedState } from "@/hooks/use-calculator";
import { EfkaField } from "./efka-field";
import { parseField } from "@/lib/parse";
import { getAvailableCategories, getAllEfkaCategories } from "@/lib/tax/efka";

export function SelfEmployedInputs({ state }: { state: SelfEmployedState }) {
  const { t } = useTranslation();
  const years = parseField(state.years, "years");
  const categories =
    years === null ? getAllEfkaCategories() : getAvailableCategories(years);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NumberField
        field="monthly"
        label={t("inputs.revenue")}
        value={state.monthly}
        onChange={state.setMonthly}
        placeholder="2000"
      />
      <NumberField
        field="expenses"
        label={t("inputs.expenses")}
        value={state.expenses}
        onChange={state.setExpenses}
        placeholder="0"
      />
      <NumberField
        field="years"
        label={t("inputs.yearsInBusiness")}
        value={state.years}
        onChange={state.setYears}
        placeholder="4"
      />
      <NumberField
        field="age"
        label={t("inputs.age")}
        value={state.age}
        onChange={state.setAge}
        placeholder="35"
      />
      <NumberField
        field="children"
        label={t("inputs.children")}
        value={state.children}
        onChange={state.setChildren}
      />
      <EfkaField
        value={state.efka}
        onChange={state.setEfka}
        categories={categories}
      />
      <NumberField
        field="amount"
        label={t("inputs.additionalInsurance")}
        value={state.additionalInsurance}
        onChange={state.setAdditionalInsurance}
      />
      <p className="sm:col-span-2 text-sm text-muted-foreground">
        {t("efka.additionalHelp")}
      </p>
      {years !== null && years > 3 && (
        <div className="sm:col-span-2 space-y-2">
          <NumberField
            field="amount"
            label={t("inputs.minimumIncome")}
            value={state.minimumIncome}
            onChange={state.setMinimumIncome}
          />
          <p className="text-sm text-muted-foreground">
            {t("inputs.minimumHelp")}
          </p>
          <a
            href="https://minfin.gov.gr/forologiki-politiki/forologikos-odigos/forologia-eisodimatos/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline"
          >
            {t("inputs.minimumSource")}
          </a>
        </div>
      )}
      <div className="sm:col-span-2 space-y-2">
        <CheckField
          checked={state.firstDeclaration}
          onChange={state.setFirstDeclaration}
        >
          {t("inputs.firstDeclaration")}
        </CheckField>
        <p className="text-sm text-muted-foreground">
          {t("inputs.businessScope")}
        </p>
      </div>
    </div>
  );
}
