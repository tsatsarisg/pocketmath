"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl justify-center px-4 sm:justify-start sm:px-7">
        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            {t("footer.privacy")}
          </Link>
          <span className="text-muted-foreground/30">&middot;</span>
          <a
            href="https://github.com/tsatsarisg/pocketmath/blob/main/docs/tax-formulas.md"
            className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            {t("footer.sources")}
          </a>
        </div>
      </div>
    </footer>
  );
}
