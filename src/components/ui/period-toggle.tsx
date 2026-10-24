import { useTranslation } from "react-i18next";
import type { Period } from "@/types/calculator";
import { SegmentedControl } from "./segmented-control";

export function PeriodToggle({
  value,
  onChange,
}: {
  value: Period;
  onChange: (value: Period) => void;
}) {
  const { t } = useTranslation();
  return (
    <SegmentedControl
      compact
      label={t("a11y.period")}
      value={value}
      onChange={onChange}
      options={[
        { id: "monthly", label: t("period.monthly") },
        { id: "annual", label: t("period.annual") },
      ]}
    />
  );
}
