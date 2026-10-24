import { useTranslation } from "react-i18next";
import { CheckField } from "./check-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { NumberField } from "./number-field";
import type { MplokakiState } from "@/hooks/use-calculator";
import { EfkaField } from "./efka-field";
import { getAllEfkaCategories } from "@/lib/tax/efka";

export function MplokakiInputs({ state }: { state: MplokakiState }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NumberField
        field="monthly"
        label={t("inputs.invoiced")}
        value={state.monthly}
        onChange={state.setMonthly}
        placeholder="2000"
      />
      <NumberField
        field="children"
        label={t("inputs.children")}
        value={state.children}
        onChange={state.setChildren}
        placeholder="0"
      />
      <NumberField
        field="age"
        label={t("inputs.age")}
        value={state.age}
        onChange={state.setAge}
        placeholder="35"
      />
      <div className="sm:col-span-2 space-y-3">
        <CheckField checked={state.qualified} onChange={state.setQualified}>
          {t("inputs.article12Confirmed")}
        </CheckField>
        <p className="text-sm text-muted-foreground">
          {t("inputs.article12Help")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("inputs.insuranceMethod")}
        </p>
        <SegmentedControl
          label={t("inputs.insuranceMethod")}
          value={state.insuranceMethod}
          onChange={state.setInsuranceMethod}
          options={[
            { id: "category", label: t("inputs.categoryInsurance") },
            { id: "article39", label: t("inputs.article39Insurance") },
          ]}
        />
      </div>
      {state.insuranceMethod === "category" ? (
        <>
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
          <p className="sm:col-span-2 text-sm text-muted-foreground">
            {t("efka.additionalHelp")}
          </p>
        </>
      ) : (
        <div className="sm:col-span-2 space-y-2">
          <NumberField
            field="amount"
            label={t("inputs.workerInsurance")}
            value={state.workerInsurance}
            onChange={state.setWorkerInsurance}
          />
          <p className="text-sm text-muted-foreground">
            {t("inputs.article39Help")}
          </p>
        </div>
      )}
      <div className="sm:col-span-2 space-y-2">
        <CheckField
          checked={state.actualWithholding}
          onChange={state.setActualWithholding}
        >
          {t("inputs.actualWithholding")}
        </CheckField>
        {state.actualWithholding && (
          <NumberField
            field="amount"
            label={t("inputs.withheld")}
            value={state.withheld}
            onChange={state.setWithheld}
          />
        )}
        <p className="text-sm text-muted-foreground">
          {t("inputs.withholdingHelp")}
        </p>
      </div>
    </div>
  );
}
