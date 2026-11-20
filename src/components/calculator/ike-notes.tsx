import { useTranslation } from "react-i18next";

const sources = [
  [
    "taxSource",
    "https://www.aade.gr/sites/default/files/2021-06/e_2125_2021pro.pdf",
  ],
  [
    "dividendSource",
    "https://www.aade.gr/sites/default/files/2026-05/egxeiridio_erotiseon_apantiseon_forologias_may_2026.pdf",
  ],
  [
    "efkaEligibilitySource",
    "https://www.e-efka.gov.gr/el/sychnes-eroteseis/asphalisi-eisphores/asphalismenoi/genika/eleytheroi-epaggelmaties-aytoapascholoymenoi-kai-agrotes",
  ],
  [
    "efkaSource",
    "https://www.e-efka.gov.gr/el/egkyklioi-kai-genika-eggrapha/egkyklios-62026",
  ],
  ["levySource", "https://aade.gr/egkyklioi-kai-apofaseis/o-3055-19-11-2026"],
  [
    "gemiSource",
    "https://gge.mindev.gov.gr/tomeas-emporiou/sixnes-erotiseis-gemh/",
  ],
  [
    "reserveSource",
    "https://ependyseis.mindev.gov.gr/uploads/photos/fek-a-86-2012.pdf",
  ],
] as const;

const linkClass = "text-primary underline underline-offset-2";

export function IkeTransitionNote() {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-muted-foreground">
      {t("ike.transition")}{" "}
      <a
        href="https://www.aade.gr/sites/default/files/2025-01/arthro28_5073.pdf"
        className={linkClass}
      >
        {t("ike.transitionSource")}
      </a>
    </p>
  );
}

export function IkeNotes({
  includeTransition = true,
}: {
  includeTransition?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <details className="space-y-3 text-sm text-muted-foreground">
      <summary className="cursor-pointer font-medium text-foreground">
        {t("ike.notes")}
      </summary>
      {includeTransition && <IkeTransitionNote />}
      <p>
        {t("ike.setup")}{" "}
        <a href="https://eu-go.gov.gr/services/596897" className={linkClass}>
          {t("ike.setupSource")}
        </a>
        {" · "}
        <a
          href="https://www.aade.gr/egkyklioi-kai-apofaseis/e-2088-10-10-2025"
          className={linkClass}
        >
          {t("ike.transferSource")}
        </a>
      </p>
      <p>
        {t("ike.transferRelief")}{" "}
        <a
          href="https://www.aade.gr/egkyklioi-kai-apofaseis/o-deaf-1048263-ex-2022"
          className={linkClass}
        >
          {t("ike.transferReliefSource")}
        </a>
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {sources.map(([key, href]) => (
          <li key={key}>
            <a href={href} className={linkClass}>
              {t(`ike.${key}`)}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
