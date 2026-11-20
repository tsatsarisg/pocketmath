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
import { IKE_HEAD_OFFICE_LEVIES, type IkeHeadOfficeLevy } from "@/lib/tax/ike";

export function IkeLevyField({
  value,
  onChange,
}: {
  value: IkeHeadOfficeLevy;
  onChange: (value: IkeHeadOfficeLevy) => void;
}) {
  const id = useId();
  const { t } = useTranslation();
  return (
    <FieldRow>
      <Label htmlFor={id}>{t("ike.levyLabel")}</Label>
      <Select
        value={String(value)}
        onValueChange={(next) => {
          const levy = IKE_HEAD_OFFICE_LEVIES.find(
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
          {IKE_HEAD_OFFICE_LEVIES.map((levy) => (
            <SelectItem key={levy} value={String(levy)}>
              {t(`ike.levy${levy}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldRow>
  );
}
