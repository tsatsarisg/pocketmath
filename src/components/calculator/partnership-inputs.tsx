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
import { PARTNERSHIP_BOOKKEEPING } from "@/lib/tax/partnership";
import type { CalculatorReturn } from "@/hooks/use-calculator";
import { CheckField } from "./check-field";
import { HeadOfficeLevyField } from "./head-office-levy-field";
import { NumberField } from "./number-field";
import { PartnershipNotes } from "./partnership-notes";

type PartnershipState = CalculatorReturn["partnership"];

export function PartnershipFields({
  fields,
  comparison = false,
}: {
  fields: PartnershipState["fields"];
  comparison?: boolean;
}) {
  const bookkeepingId = useId();
  const { t } = useTranslation();

  return (
    <>
      <NumberField
        field="expenses"
        label={t(comparison ? "compare.partnershipExpenses" : "ike.expenses")}
        value={fields.expenses}
        onChange={fields.setExpenses}
      />
      <FieldRow>
        <Label htmlFor={bookkeepingId}>{t("partnership.bookkeeping")}</Label>
        <Select
          value={fields.bookkeeping}
          onValueChange={(value) => {
            const bookkeeping = PARTNERSHIP_BOOKKEEPING.find(
              (entry) => entry === value,
            );
            if (bookkeeping) {
              fields.setBookkeeping(bookkeeping);
            }
          }}
        >
          <SelectTrigger
            id={bookkeepingId}
            className="min-h-10 data-[size=default]:h-auto"
          >
            <SelectValue className="min-w-0 whitespace-normal">
              {t(`partnership.${fields.bookkeeping}`)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            alignItemWithTrigger={false}
            className="[&_[data-slot=select-item]>span:first-child]:shrink [&_[data-slot=select-item]>span:first-child]:whitespace-normal"
          >
            {PARTNERSHIP_BOOKKEEPING.map((entry) => (
              <SelectItem key={entry} value={entry}>
                {t(`partnership.${entry}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
      <HeadOfficeLevyField
        value={fields.levy}
        onChange={fields.setLevy}
        label={t(comparison ? "compare.partnershipLevy" : "ike.levyLabel")}
      />
      <NumberField
        field="profitShare"
        label={t("partnership.share")}
        value={fields.share}
        onChange={fields.setShare}
      />
      <NumberField
        field="amount"
        label={t("partnership.partnerEfka")}
        value={fields.partnerEfka}
        onChange={fields.setPartnerEfka}
      />
      <NumberField
        field="amount"
        label={t("partnership.otherPartnerEfka")}
        value={fields.otherPartnerEfka}
        onChange={fields.setOtherPartnerEfka}
      />
    </>
  );
}

export function PartnershipInputs({ state }: { state: PartnershipState }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("partnership.scope")}</p>
      <p className="text-sm text-muted-foreground">
        {t("partnership.liability")}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          field="monthly"
          label={t("inputs.revenue")}
          value={state.monthly}
          onChange={state.setMonthly}
          placeholder="2000"
        />
        <PartnershipFields fields={state.fields} />
        <NumberField
          field="percentage"
          label={t("ike.distribution")}
          value={state.distribution}
          onChange={state.setDistribution}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {t("partnership.efkaHelp")}
      </p>
      <CheckField
        checked={state.reducedPrepayment}
        onChange={state.setReducedPrepayment}
      >
        {t("ike.reducedPrepayment")}
        <span className="block text-muted-foreground">
          {t("ike.reducedHelp")}
        </span>
      </CheckField>
      <PartnershipNotes />
    </div>
  );
}
