"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LegalSection as Section } from "@/components/ui/legal-section";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <article className="mx-auto max-w-[640px] space-y-8 pb-8">
      <div className="space-y-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          &larr; {t("legal.backToCalculator")}
        </Link>
        <h1 className="text-[1.875rem] font-bold tracking-tight text-foreground">
          {t("legal.privacy.title")}
        </h1>
        <p className="text-[0.8125rem] text-muted-foreground">
          {t("legal.lastUpdated")}
        </p>
      </div>

      <Section heading={t("legal.privacy.whoWeAre.heading")}>
        <p>{t("legal.privacy.whoWeAre.text")}</p>
      </Section>

      <Section heading={t("legal.privacy.whatData.heading")}>
        <p>{t("legal.privacy.whatData.intro")}</p>
        <ul className="list-disc pl-5 space-y-3">
          <li>
            <strong>
              {t("legal.privacy.whatData.calculations").split(":")[0]}:
            </strong>{" "}
            {t("legal.privacy.whatData.calculations")
              .split(":")
              .slice(1)
              .join(":")}
          </li>
          <li>
            <strong>
              {t("legal.privacy.whatData.serverLogs").split(":")[0]}:
            </strong>{" "}
            {t("legal.privacy.whatData.serverLogs")
              .split(":")
              .slice(1)
              .join(":")}
          </li>
          <li>
            <strong>
              {t("legal.privacy.whatData.language").split(":")[0]}:
            </strong>{" "}
            {t("legal.privacy.whatData.language").split(":").slice(1).join(":")}
          </li>
          <li>
            <strong>{t("legal.privacy.whatData.theme").split(":")[0]}:</strong>{" "}
            {t("legal.privacy.whatData.theme").split(":").slice(1).join(":")}
          </li>
          <li>
            <strong>
              {t("legal.privacy.whatData.emailContact").split(":")[0]}:
            </strong>{" "}
            {t("legal.privacy.whatData.emailContact")
              .split(":")
              .slice(1)
              .join(":")}
          </li>
          <li>
            <strong>
              {t("legal.privacy.whatData.sponsorships").split(":")[0]}:
            </strong>{" "}
            {t("legal.privacy.whatData.sponsorships")
              .split(":")
              .slice(1)
              .join(":")}
          </li>
        </ul>
        <p className="mt-3">{t("legal.privacy.whatData.noCookies")}</p>
      </Section>

      <Section heading={t("legal.privacy.legalBasis.heading")}>
        <p>{t("legal.privacy.legalBasis.text")}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t("legal.privacy.legalBasis.serverLogs")}</li>
          <li>{t("legal.privacy.legalBasis.localStorage")}</li>
          <li>{t("legal.privacy.legalBasis.emailContact")}</li>
          <li>{t("legal.privacy.legalBasis.sponsorships")}</li>
        </ul>
      </Section>

      <Section heading={t("legal.privacy.dataSharing.heading")}>
        <p>{t("legal.privacy.dataSharing.text")}</p>
      </Section>

      <Section heading={t("legal.privacy.retention.heading")}>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t("legal.privacy.retention.serverLogs")}</li>
          <li>{t("legal.privacy.retention.localStorage")}</li>
          <li>{t("legal.privacy.retention.contactEmails")}</li>
          <li>{t("legal.privacy.retention.sponsorships")}</li>
        </ul>
      </Section>

      <Section heading={t("legal.privacy.rights.heading")}>
        <p>{t("legal.privacy.rights.intro")}</p>
        <p className="mt-2">{t("legal.privacy.rights.list")}</p>
        <p className="mt-3">{t("legal.privacy.rights.howTo")}</p>
        <p className="mt-3 text-[0.8125rem] text-muted-foreground">
          {t("legal.privacy.rights.hdpa")}
        </p>
      </Section>

      <Section heading={t("legal.privacy.children.heading")}>
        <p>{t("legal.privacy.children.text")}</p>
      </Section>

      <Section heading={t("legal.privacy.changes.heading")}>
        <p>{t("legal.privacy.changes.text")}</p>
      </Section>
    </article>
  );
}
