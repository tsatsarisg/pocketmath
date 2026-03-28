"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LegalSection as Section } from "@/components/ui/legal-section";

export default function TermsPage() {
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
          {t("legal.terms.title")}
        </h1>
        <p className="text-[0.8125rem] text-muted-foreground">
          {t("legal.lastUpdated")}
        </p>
      </div>

      <Section heading={t("legal.terms.acceptance.heading")}>
        <p>{t("legal.terms.acceptance.text")}</p>
      </Section>

      <Section heading={t("legal.terms.nature.heading")}>
        <p>{t("legal.terms.nature.text")}</p>
      </Section>

      <Section heading={t("legal.terms.noAdvice.heading")}>
        <p>{t("legal.terms.noAdvice.intro")}</p>
        <ul className="list-disc pl-5 space-y-2">
          {(
            t("legal.terms.noAdvice.list", { returnObjects: true }) as string[]
          ).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 font-medium text-foreground">
          {t("legal.terms.noAdvice.responsibility")}
        </p>
      </Section>

      <Section heading={t("legal.terms.accuracy.heading")}>
        <p>{t("legal.terms.accuracy.text")}</p>
        <p className="mt-2">{t("legal.terms.accuracy.asOf")}</p>
      </Section>

      <Section heading={t("legal.terms.liability.heading")}>
        <p>{t("legal.terms.liability.intro")}</p>
        <ul className="list-disc pl-5 space-y-2">
          {(
            t("legal.terms.liability.list", { returnObjects: true }) as string[]
          ).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section heading={t("legal.terms.sponsorships.heading")}>
        <p>{t("legal.terms.sponsorships.text")}</p>
      </Section>

      <Section heading={t("legal.terms.ip.heading")}>
        <p>{t("legal.terms.ip.text")}</p>
      </Section>

      <Section heading={t("legal.terms.externalLinks.heading")}>
        <p>{t("legal.terms.externalLinks.text")}</p>
      </Section>

      <Section heading={t("legal.terms.availability.heading")}>
        <p>{t("legal.terms.availability.text")}</p>
      </Section>

      <Section heading={t("legal.terms.law.heading")}>
        <p>{t("legal.terms.law.text")}</p>
      </Section>

      <Section heading={t("legal.terms.changes.heading")}>
        <p>{t("legal.terms.changes.text")}</p>
      </Section>
    </article>
  );
}
