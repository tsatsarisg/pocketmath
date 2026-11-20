import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./header";
import { Footer } from "./footer";
import { safeJsonStringify } from "@/lib/safe-json";

export const metadata: Metadata = {
  title:
    "PocketMath – Υπολογιστής Καθαρού Μισθού 2026 | Net Salary Calculator Greece",
  description:
    "Δωρεάν υπολογιστής καθαρού εισοδήματος για Ελλάδα 2026. Σύγκριση μισθωτού, ατομικής, μπλοκακίου, μονοπρόσωπης ΙΚΕ και Ε.Ε.",
  keywords:
    "υπολογιστής καθαρού μισθού, φόρος εισοδήματος, μπλοκάκι υπολογιστής, ελεύθερος επαγγελματίας φόρος, net salary calculator greece 2026, ΕΦΚΑ",
  authors: [{ name: "PocketMath" }],
  metadataBase: new URL("https://tsatsarisg.github.io/pocketmath"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://tsatsarisg.github.io/pocketmath/",
    title: "PocketMath – Υπολογιστής Καθαρού Μισθού 2026",
    description:
      "Δωρεάν υπολογιστής καθαρού εισοδήματος για Ελλάδα 2026. Σύγκριση μισθωτού, ατομικής, μπλοκακίου, μονοπρόσωπης ΙΚΕ και Ε.Ε.",
    locale: "el_GR",
    alternateLocale: "en_US",
    siteName: "PocketMath",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PocketMath – Υπολογιστής Καθαρού Μισθού 2026",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PocketMath – Υπολογιστής Καθαρού Μισθού 2026",
    description:
      "Δωρεάν υπολογιστής καθαρού εισοδήματος για Ελλάδα 2026. Σύγκριση μισθωτού, ατομικής, μπλοκακίου, μονοπρόσωπης ΙΚΕ και Ε.Ε.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: "index, follow",
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PocketMath",
  description:
    "Δωρεάν υπολογιστής καθαρού μισθού και σύγκριση φορολόγησης για Ελλάδα 2026",
  url: "https://tsatsarisg.github.io/pocketmath",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  inLanguage: ["el", "en"],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  about: {
    "@type": "Thing",
    name: "Greek Income Tax & Net Salary Calculator 2026",
  },
  audience: {
    "@type": "Audience",
    geographicArea: {
      "@type": "Country",
      name: "Greece",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className="dark" suppressHydrationWarning>
      <head>
        {/* The Pages build hashes inline scripts and moves this policy ahead of them. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "font-src 'self'",
            "connect-src 'self'",
            "object-src 'none'",
            "frame-src 'none'",
            "base-uri 'none'",
            "form-action 'none'",
          ].join("; ")}
        />
        <meta name="referrer" content="no-referrer" />
        {/*
          Inline theme-init script — runs synchronously before paint so there
          is never a flash of the wrong theme.  Dark is the app default.
          If the user has previously chosen light (stored in localStorage as
          "theme": "light") we honour that; otherwise we keep dark.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
        <meta
          name="theme-color"
          content="#141826"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#f7f8fb"
          media="(prefers-color-scheme: light)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLdWebApp) }}
        />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-svh flex-col bg-background text-foreground">
            <Header />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
