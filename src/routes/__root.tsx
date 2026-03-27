import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
      className="inline-flex rounded-lg bg-muted p-0.5 gap-0.5"
    >
      {(['el', 'en'] as const).map((lang) => (
        <button
          key={lang}
          role="radio"
          aria-checked={current === lang}
          onClick={() => void i18n.changeLanguage(lang)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
            current === lang
              ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
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
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            to="/"
            className="text-base font-semibold tracking-tight hover:opacity-80 transition-opacity duration-150"
          >
            PocketMath
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:py-3">
          <p className="text-xs text-muted-foreground/70 text-center sm:text-left">
            {t("footer.taxYear")}
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://ko-fi.com/pocketmath"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              ☕ Ko-fi
            </a>
            <a
              href="https://revolut.me/pocketmath"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              ⚡ Revolut
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
