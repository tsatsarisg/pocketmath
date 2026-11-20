import { useMemo, useState } from "react";
import { parseField } from "@/lib/parse";
import type { HeadOfficeLevy } from "@/lib/tax/corporate";
import {
  DEFAULT_PARTNER_MONTHLY_EFKA,
  DEFAULT_PARTNER_PROFIT_SHARE,
  type PartnershipBookkeeping,
} from "@/lib/tax/partnership";

export function usePartnershipFields() {
  const [expenses, setExpenses] = useState("0");
  const [bookkeeping, setBookkeeping] =
    useState<PartnershipBookkeeping>("singleEntry");
  const [share, setShare] = useState(String(DEFAULT_PARTNER_PROFIT_SHARE));
  const [partnerEfka, setPartnerEfka] = useState(
    String(DEFAULT_PARTNER_MONTHLY_EFKA),
  );
  const [otherPartnerEfka, setOtherPartnerEfka] = useState(
    String(DEFAULT_PARTNER_MONTHLY_EFKA),
  );
  const [levy, setLevy] = useState<HeadOfficeLevy>(0);

  const input = useMemo(() => {
    const monthlyExpenses = parseField(expenses, "expenses");
    const partnerShare = parseField(share, "profitShare");
    const monthlyPartnerEfka = parseField(partnerEfka, "amount");
    const monthlyOtherPartnerEfka = parseField(otherPartnerEfka, "amount");
    if (
      monthlyExpenses === null ||
      partnerShare === null ||
      monthlyPartnerEfka === null ||
      monthlyOtherPartnerEfka === null
    ) {
      return null;
    }
    return {
      annualExpenses: monthlyExpenses * 12,
      bookkeeping,
      partnerShare,
      monthlyPartnerEfka,
      monthlyOtherPartnerEfka,
      headOfficeLevy: levy,
    };
  }, [expenses, share, partnerEfka, otherPartnerEfka, bookkeeping, levy]);

  return {
    expenses,
    setExpenses,
    bookkeeping,
    setBookkeeping,
    share,
    setShare,
    partnerEfka,
    setPartnerEfka,
    otherPartnerEfka,
    setOtherPartnerEfka,
    levy,
    setLevy,
    input,
  };
}
