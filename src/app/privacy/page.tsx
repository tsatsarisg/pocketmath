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
        <p>{t("legal.privacy.whatData.calculations")}</p>
        <p className="mt-2">{t("legal.privacy.whatData.preferences")}</p>
      </Section>

      <Section heading={t("legal.privacy.hosting.heading")}>
        <p>{t("legal.privacy.hosting.text")}</p>
        <a
          className="mt-2 inline-block text-primary underline underline-offset-2"
          href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
        >
          {t("legal.privacy.hosting.link")}
        </a>
      </Section>

      <Section heading={t("legal.privacy.email.heading")}>
        <p>{t("legal.privacy.email.text")}</p>
        <p className="mt-2">{t("legal.privacy.email.retention")}</p>
      </Section>

      <Section heading={t("legal.privacy.rights.heading")}>
        <p>{t("legal.privacy.rights.text")}</p>
        <p className="mt-2">
          {t("legal.privacy.rights.complaint")}{" "}
          <a
            className="text-primary underline underline-offset-2"
            href="https://www.dpa.gr/"
          >
            {t("legal.privacy.rights.hdpa")}
          </a>
        </p>
      </Section>
    </article>
  );
}
