import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FieldRow } from "@/components/ui/field-row";
import type { EfkaCategory, EfkaCategoryId } from "@/lib/tax/types";
import { getMonthlyEfka, getAnnualEfka } from "@/lib/tax/efka";
import { fmt } from "@/lib/format";

interface EfkaFieldProps {
  value: EfkaCategoryId;
  onChange: (value: EfkaCategoryId) => void;
  categories: readonly EfkaCategory[];
}

export function EfkaField({ value, onChange, categories }: EfkaFieldProps) {
  const id = useId();
  const { t } = useTranslation();
  const category = categories.find((entry) => entry.id === value);

  return (
    <FieldRow>
      <Label htmlFor={id}>{t("inputs.efkaCategory")}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          const selected = categories.find((entry) => entry.id === next);
          if (selected) onChange(selected.id);
        }}
      >
        <SelectTrigger id={id} aria-describedby={`${id}-cost`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((entry) => (
            <SelectItem key={entry.id} value={entry.id}>
              {t(`efka.${entry.id}`)} — {fmt(getMonthlyEfka(entry.id))}{t("results.perMonth")}
              {entry.id === "special" ? ` (${t("efka.specialNote")})` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p id={`${id}-cost`} className="text-sm text-muted-foreground">
        {category && `${fmt(getAnnualEfka(category.id))}${t("results.perYear")}`}
      </p>
      <p className="text-sm text-muted-foreground">{t("efka.includesUnemployment")}</p>
    </FieldRow>
  );
}
