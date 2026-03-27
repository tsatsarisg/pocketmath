import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const Route = createRootRoute({
  component: RootLayout,
});

function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith('en') ? 'en' : 'el';

  return (
    <div
      role="radiogroup"
      aria-label="Language / Γλώσσα"
      className="inline-flex rounded-xl bg-secondary/60 p-0.5 gap-0.5"
    >
      {(['el', 'en'] as const).map((lang) => (
        <button
          key={lang}
          role="radio"
          aria-checked={current === lang}
          onClick={() => void i18n.changeLanguage(lang)}
          className={cn(
            'rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150',
            current === lang
              ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {lang === 'el' ? 'ΕΛ' : 'EN'}
        </button>
      ))}
    </div>
  );
}

function RootLayout() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith("en") ? "en" : "el";
  }, [i18n.language]);

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-200"
            >
              PocketMath
            </Link>
            <Link
              to="/compare"
              className="text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {t("nav.compare")}
            </Link>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>

      <footer className="mt-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:py-4">
          <p className="text-[0.6875rem] text-muted-foreground/50 text-center">
            {t("footer.taxYear")}
          </p>
          <div className="flex items-center gap-3 text-[0.6875rem]">
            <Link
              to="/privacy"
              className="text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
            >
              {t("footer.privacy")}
            </Link>
            <span className="text-muted-foreground/30">·</span>
            <Link
              to="/terms"
              className="text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
            >
              {t("footer.terms")}
            </Link>
            <span className="text-muted-foreground/30">·</span>
            <a
              href="https://ko-fi.com/pocketmath"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
            >
              ☕ Ko-fi
            </a>
            <span className="text-muted-foreground/30">·</span>
            <a
              href="https://revolut.me/pocketmath"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
            >
              ⚡ Revolut
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
