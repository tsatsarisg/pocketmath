import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EuroInput, FieldRow } from "@/components/ui/euro-input";

export function EmployeeInputs({
  monthly,
  setMonthly,
  children,
  setChildren,
  age,
  setAge,
}: {
  monthly: string;
  setMonthly: (v: string) => void;
  children: string;
  setChildren: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
}) {
  const { t } = useTranslation();
  const monthlyId = useId();
  const childrenId = useId();
  const ageId = useId();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FieldRow>
        <Label htmlFor={monthlyId}>{t("inputs.grossMonthly")}</Label>
        <EuroInput
          id={monthlyId}
          value={monthly}
          onChange={setMonthly}
          placeholder="2000"
        />
      </FieldRow>
      <FieldRow>
        <Label htmlFor={childrenId}>{t("inputs.children")}</Label>
        <Input
          id={childrenId}
          type="number"
          inputMode="numeric"
          min={0}
          max={10}
          value={children}
          onChange={(e) => setChildren(e.target.value)}
          placeholder="0"
        />
      </FieldRow>
      <FieldRow>
        <Label htmlFor={ageId}>{t("inputs.age")}</Label>
        <Input
          id={ageId}
          type="number"
          inputMode="numeric"
          min={16}
          max={120}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="35"
        />
      </FieldRow>
    </div>
  );
}
