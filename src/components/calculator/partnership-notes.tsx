import { useTranslation } from "react-i18next";

const sources = [
  [
    "taxSource",
    "https://www.aade.gr/sites/default/files/2021-06/e_2125_2021pro.pdf",
    "ike",
  ],
  [
    "dividendSource",
    "https://www.aade.gr/sites/default/files/2026-05/egxeiridio_erotiseon_apantiseon_forologias_may_2026.pdf#page=42",
    "ike",
  ],
  [
    "efkaEligibilitySource",
    "https://eugo.gov.gr/page/insurance-rules-for-businesses-in-greece",
    "partnership",
  ],
  [
    "efkaSource",
    "https://www.e-efka.gov.gr/el/egkyklioi-kai-genika-eggrapha/egkyklios-62026",
    "ike",
  ],
  [
    "levySource",
    "https://www.aade.gr/egkyklioi-kai-apofaseis/o-3055-19-11-2026",
    "ike",
  ],
  [
    "gemiSource",
    "https://gge.mindev.gov.gr/tomeas-emporiou/sixnes-erotiseis-gemh/",
    "ike",
  ],
  [
    "efkaDeductionSource",
    "https://gsri.gov.gr/wp-content/uploads/2021/12/4-%CE%A0%CE%9F%CE%9B-1113_2015.pdf#page=10",
    "partnership",
  ],
  [
    "booksSource",
    "https://www.elte.org.gr/wp-content/uploads/2020/12/Logistiki-Odigia-N4308_2014.pdf",
    "partnership",
  ],
  [
    "liabilitySource",
    "https://gge.mindev.gov.gr/tomeas-emporiou/%CE%B4%CE%AF%CE%BA%CE%B1%CE%B9%CE%BF-%CF%84%CE%B7%CF%82-%CE%B5%CF%84%CE%B5%CF%81%CF%8C%CF%81%CF%81%CF%85%CE%B8%CE%BC%CE%B7%CF%82-%CE%B5%CF%84%CE%B1%CE%B9%CF%81%CE%B5%CE%AF%CE%B1%CF%82-%CE%B5-%CE%B5/",
    "partnership",
  ],
  [
    "transferReliefSource",
    "https://www.aade.gr/egkyklioi-kai-apofaseis/o-deaf-1048263-ex-2022",
    "ike",
  ],
  [
    "abuseSource",
    "https://www.aade.gr/sites/default/files/2024-04/5104_2024_a58.pdf",
    "partnership",
  ],
] as const;

const linkClass = "text-primary underline underline-offset-2";

export function PartnershipNotes() {
  const { t } = useTranslation();
  return (
    <details className="space-y-3 text-sm text-muted-foreground">
      <summary className="cursor-pointer font-medium text-foreground">
        {t("partnership.notes")}
      </summary>
      <p>{t("partnership.bookkeepingHelp")}</p>
      <p>
        {t("partnership.setup")}{" "}
        <a href="https://eu-go.gov.gr/services/815536" className={linkClass}>
          {t("partnership.setupEe")}
        </a>
      </p>
      <p>{t("partnership.transition")}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {sources.map(([key, href, namespace]) => (
          <li key={key}>
            <a href={href} className={linkClass}>
              {t(`${namespace}.${key}`)}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
