"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:py-4">
        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            {t("footer.privacy")}
          </Link>
          <span className="text-muted-foreground/30">&middot;</span>
          <a
            href="https://github.com/tsatsarisg/pocketmath/blob/main/docs/tax-formulas.md"
            className="text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            {t("footer.sources")}
          </a>
        </div>
      </div>
    </footer>
  );
}
