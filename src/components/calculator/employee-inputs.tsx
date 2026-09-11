import { useTranslation } from "react-i18next";
import { NumberField } from "./number-field";
import type { EmployeeState } from "@/hooks/use-calculator";

export function EmployeeInputs({ state }: { state: EmployeeState }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NumberField
        field="monthly"
        label={t("inputs.grossMonthly")}
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
    </div>
  );
}
