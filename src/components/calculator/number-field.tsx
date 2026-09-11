import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { EuroInput } from "@/components/ui/euro-input";
import { FieldRow } from "@/components/ui/field-row";
import { Label } from "@/components/ui/label";
import { validateField, type NumericField } from "@/lib/parse";

interface NumberFieldProps {
  field: NumericField;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NumberField({ field, label, value, onChange, placeholder }: NumberFieldProps) {
  const id = useId();
  const { t } = useTranslation();
  const error = field === "monthly" && value === "" ? undefined : validateField(value, field);
  const inputProps = {
    id,
    value,
    placeholder,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <FieldRow>
      <Label htmlFor={id}>{label}</Label>
      {field === "monthly" || field === "expenses" || field === "amount" ? (
        <EuroInput {...inputProps} onChange={onChange} />
      ) : (
        <Input
          {...inputProps}
          type="text"
          inputMode="numeric"
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {t(`validation.${error}`)}
        </p>
      )}
    </FieldRow>
  );
}
