/**
 * Generates SHA-256 CSP hashes for the JSON-LD <script> blocks in layout.tsx.
 *
 * Run this whenever you modify jsonLdWebApp or jsonLdFaq in src/app/layout.tsx,
 * then update the 'sha256-...' values in:
 *   - next.config.ts  (script-src directive)
 *   - public/_headers (script-src directive)
 *
 * Usage:
 *   node scripts/gen-csp-hashes.mjs
 */

import { createHash } from "node:crypto";

// Keep these objects in sync with layout.tsx

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

/**
 * Must match safeJsonStringify in src/lib/safe-json.ts exactly.
 */
function safeJsonStringify(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function cspHash(content) {
  return (
    "'sha256-" +
    createHash("sha256").update(content, "utf8").digest("base64") +
    "'"
  );
}

const webAppStr = safeJsonStringify(jsonLdWebApp);
const faqStr = safeJsonStringify(jsonLdFaq);

console.log("Update script-src in next.config.ts and public/_headers with:\n");
console.log(
  `script-src 'self' ${cspHash(webAppStr)} ${cspHash(faqStr)}`
);
