"use client";

import { useEffect } from "react";
import i18n from "@/i18n/index";

// Allowlist of valid language codes. localStorage is attacker-writable — never
// pass a raw localStorage value to i18n.changeLanguage() without validation.
const SUPPORTED_LANGS = new Set<string>(["el", "en"]);

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore saved language after hydration to avoid SSR/client mismatch.
    // Runs once on mount — server always renders 'el', client switches if needed.
    const raw = localStorage.getItem("i18nextLng");
    const saved = raw !== null && SUPPORTED_LANGS.has(raw) ? (raw as "el" | "en") : null;
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, []);

  return <>{children}</>;
}
