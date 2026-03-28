"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:py-4">
        <p className="text-[0.6875rem] text-muted-foreground/50 text-center">
          {t("footer.taxYear")}
        </p>
        <div className="flex items-center gap-3 text-[0.6875rem]">
          <Link
            href="/privacy"
            className="text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
          >
            {t("footer.privacy")}
          </Link>
          <span className="text-muted-foreground/30">&middot;</span>
          <Link
            href="/terms"
            className="text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
          >
            {t("footer.terms")}
          </Link>
          <span className="text-muted-foreground/30">&middot;</span>
          <a
            href="https://revolut.me/tsatsarisg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
          >
            ⚡ Revolut
          </a>
        </div>
      </div>
    </footer>
  );
}
