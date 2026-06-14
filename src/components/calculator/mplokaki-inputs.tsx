import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EuroInput, FieldRow } from "@/components/ui/euro-input";
import { getAllEfkaCategories } from "@/lib/tax/efka";
import type { EfkaCategoryId } from "@/lib/tax/types";
import type { MplokakiState } from "@/hooks/use-calculator";
import { fmt } from "@/lib/format";

const EFKA_CATEGORIES = getAllEfkaCategories();

export function MplokakiInputs({ state }: { state: MplokakiState }) {
  const { monthly, setMonthly, efka, setEfka, children, setChildren, age, setAge } =
    state;
  const { t } = useTranslation();
  const monthlyId = useId();
  const childrenId = useId();
  const ageId = useId();
  const efkaId = useId();

  const efkaCategory = EFKA_CATEGORIES.find((c) => c.id === efka);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FieldRow>
        <Label htmlFor={monthlyId}>{t("inputs.invoiced")}</Label>
        <EuroInput
          id={monthlyId}
          value={monthly}
          onChange={setMonthly}
          placeholder="2000"
        />
      </FieldRow>
      <FieldRow>
        <Label htmlFor={efkaId}>{t("inputs.efkaCategory")}</Label>
        <Select
          value={efka}
          onValueChange={(v) => setEfka(v as EfkaCategoryId)}
        >
          <SelectTrigger id={efkaId} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EFKA_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label} — {fmt(cat.monthly)}{t("results.perMonth")}
                {cat.note ? ` (${cat.note})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {efkaCategory && (
          <p className="text-xs text-muted-foreground">
            {fmt(efkaCategory.monthly * 12)}{t("results.perYear")}
          </p>
        )}
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
