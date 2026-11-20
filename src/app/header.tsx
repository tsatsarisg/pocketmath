"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const current = i18n.language.startsWith("en") ? "en" : "el";
  return (
    <SegmentedControl
      compact
      label={t("a11y.language")}
      value={current}
      onChange={(language) => void i18n.changeLanguage(language)}
      options={[
        { id: "el", label: "ΕΛ" },
        { id: "en", label: "EN" },
      ]}
    />
  );
}

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-border bg-card">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:ring-2 focus:ring-ring"
      >
        {t("a11y.skipToContent")}
      </a>
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-7">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-lg text-base font-bold tracking-tight text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="size-4" aria-hidden="true" />
          </span>
          PocketMath
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
