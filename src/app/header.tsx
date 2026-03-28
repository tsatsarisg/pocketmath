"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("en") ? "en" : "el";

  return (
    <div
      role="radiogroup"
      aria-label="Language / Γλώσσα"
      className="inline-flex rounded-xl bg-secondary/60 p-0.5 gap-0.5"
    >
      {(["el", "en"] as const).map((lang) => (
        <button
          key={lang}
          role="radio"
          aria-checked={current === lang}
          onClick={() => void i18n.changeLanguage(lang)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150",
            current === lang
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {lang === "el" ? "ΕΛ" : "EN"}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-200"
          >
            PocketMath
          </Link>
          <Link
            href="/compare"
            className="text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            {t("nav.compare")}
          </Link>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}
