import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./header";
import { Footer } from "./footer";

export const metadata: Metadata = {
  title: "PocketMath – Υπολογιστής Καθαρού Μισθού 2026 | Net Salary Calculator Greece",
  description:
    "Δωρεάν υπολογιστής καθαρού μισθού για Ελλάδα 2026. Σύγκριση μισθωτού, ελεύθερου επαγγελματία και μπλοκάκι. Βασισμένο στον Ν.5246/2025.",
  keywords:
    "υπολογιστής καθαρού μισθού, φόρος εισοδήματος, μπλοκάκι υπολογιστής, ελεύθερος επαγγελματίας φόρος, net salary calculator greece 2026, ΕΦΚΑ",
  authors: [{ name: "PocketMath" }],
  metadataBase: new URL("https://pocketmath.gr"),
  alternates: {
    canonical: "/",
    languages: {
      el: "/",
      en: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: "https://pocketmath.gr/",
    title: "PocketMath – Υπολογιστής Καθαρού Μισθού 2026",
    description:
      "Δωρεάν υπολογιστής καθαρού μισθού για Ελλάδα 2026. Σύγκριση μισθωτού, ελεύθερου επαγγελματία και μπλοκάκι.",
    locale: "el_GR",
    alternateLocale: "en_US",
    siteName: "PocketMath",
  },
  twitter: {
    card: "summary",
    title: "PocketMath – Υπολογιστής Καθαρού Μισθού 2026",
    description:
      "Δωρεάν υπολογιστής καθαρού μισθού για Ελλάδα 2026. Σύγκριση μισθωτού, ελεύθερου επαγγελματία και μπλοκάκι.",
  },
  icons: {
    icon: "/favicon.svg",
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
  url: "https://pocketmath.gr",
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
    <html lang="el" suppressHydrationWarning>
      <head>
        <meta
          name="theme-color"
          content="#faf8f5"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#09090b"
          media="(prefers-color-scheme: dark)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
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
