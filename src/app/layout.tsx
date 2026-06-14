import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./header";
import { Footer } from "./footer";
import { safeJsonStringify } from "@/lib/safe-json";

export const metadata: Metadata = {
  title:
    "PocketMath – Υπολογιστής Καθαρού Μισθού 2026 | Net Salary Calculator Greece",
  description:
    "Δωρεάν υπολογιστής καθαρού μισθού για Ελλάδα 2026. Σύγκριση μισθωτού, ελεύθερου επαγγελματία και μπλοκάκι. Βασισμένο στον Ν.5246/2025.",
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
      "Δωρεάν υπολογιστής καθαρού μισθού για Ελλάδα 2026. Σύγκριση μισθωτού, ελεύθερου επαγγελματία και μπλοκάκι.",
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
      "Δωρεάν υπολογιστής καθαρού μισθού για Ελλάδα 2026. Σύγκριση μισθωτού, ελεύθερου επαγγελματία και μπλοκάκι.",
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
  alternateName: "PocketMath.gr",
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

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Πόσο είναι ο καθαρός μισθός για μεικτό 2000€ το 2026;",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Για μεικτό μισθό 2000€/μήνα το 2026, ο καθαρός μισθός ανέρχεται περίπου στα 1.590€ ανά μισθοδοσία (1/14 ετήσιου καθαρού). Ο μισθωτός λαμβάνει 14 μισθούς το χρόνο.",
      },
    },
    {
      "@type": "Question",
      name: "Τι είναι το μπλοκάκι και πώς φορολογείται;",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Το μπλοκάκι (Άρθρο 12 ΚΦΕ) είναι τρόπος παροχής υπηρεσιών με δελτία παροχής. Φορολογείται ως μισθωτή εργασία, με παρακράτηση 20% από τον εκδότη. Συνδυάζεται με εισφορές ΕΦΚΑ.",
      },
    },
    {
      "@type": "Question",
      name: "Ποιο συμφέρει περισσότερο: μισθωτός, ελεύθερος επαγγελματίας ή μπλοκάκι;",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Εξαρτάται από το εισόδημα και τις συνθήκες. Το PocketMath προσφέρει εργαλείο σύγκρισης που δείχνει το καθαρό ετήσιο εισόδημα και για τις τρεις μορφές απασχόλησης για το ίδιο μεικτό εισόδημα.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className="dark" suppressHydrationWarning>
      <head>
        {/*
          Best-effort Content Security Policy for the GitHub Pages static export.

          GitHub Pages serves plain files and cannot send custom response
          headers, so the authoritative CSP in next.config.ts (headers()) does
          NOT apply on that host. This <meta> tag mirrors the production
          (non-dev) CSP so the policy still reaches the browser on Pages.

          IMPORTANT LIMITATIONS — a CSP delivered via <meta> is weaker than one
          sent as a header:
            • frame-ancestors is IGNORED in meta-CSP, so clickjacking
              protection (also normally via X-Frame-Options) is NOT enforced
              on GitHub Pages.
            • Strict-Transport-Security (HSTS) CANNOT be set via meta at all.
          These two protections are simply unavailable on GitHub Pages. The
          frame-ancestors directive is left in below only so this policy stays
          identical to the header version on server-target builds; do not treat
          it as effective on Pages. Header-based delivery (Vercel/Docker/CDN)
          remains the authoritative, fully-enforced source.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; ")}
        />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLdFaq) }}
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
