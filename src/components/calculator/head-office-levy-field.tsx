import { useId } from "react";
import { useTranslation } from "react-i18next";
import { FieldRow } from "@/components/ui/field-row";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HEAD_OFFICE_LEVIES, type HeadOfficeLevy } from "@/lib/tax/corporate";

export function HeadOfficeLevyField({
  value,
  onChange,
  label,
}: {
  value: HeadOfficeLevy;
  onChange: (value: HeadOfficeLevy) => void;
  label?: string;
}) {
  const id = useId();
  const { t } = useTranslation();
  return (
    <FieldRow>
      <Label htmlFor={id}>{label ?? t("ike.levyLabel")}</Label>
      <Select
        value={String(value)}
        onValueChange={(next) => {
          const levy = HEAD_OFFICE_LEVIES.find(
            (amount) => String(amount) === next,
          );
          if (levy !== undefined) {
            onChange(levy);
          }
        }}
      >
        <SelectTrigger id={id} className="min-h-10 data-[size=default]:h-auto">
          <SelectValue className="min-w-0 whitespace-normal">
            {t(`ike.levy${value}`)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          className="[&_[data-slot=select-item]>span:first-child]:shrink [&_[data-slot=select-item]>span:first-child]:whitespace-normal"
        >
          {HEAD_OFFICE_LEVIES.map((levy) => (
            <SelectItem key={levy} value={String(levy)}>
              {t(`ike.levy${levy}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldRow>
  );
}
