import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Σύγκριση Καθαρού Εισοδήματος 2026 | Μισθωτός vs Ελ. Επαγγελματίας vs Μπλοκάκι",
  description:
    "Σύγκρινε καθαρό εισόδημα για μισθωτό, ελεύθερο επαγγελματία και μπλοκάκι με το ίδιο μεικτό ποσό για το 2026.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    type: "website",
    url: "https://pocketmath.gr/compare",
    title: "PocketMath Σύγκριση 2026 | Μισθωτός, Ελ. Επαγγελματίας, Μπλοκάκι",
    description:
      "Δες ποια μορφή απασχόλησης συμφέρει περισσότερο με σύγκριση καθαρού ετήσιου εισοδήματος.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PocketMath Σύγκριση Καθαρού Εισοδήματος 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PocketMath Σύγκριση 2026",
    description:
      "Σύγκριση καθαρού εισοδήματος για μισθωτό, ελεύθερο επαγγελματία και μπλοκάκι.",
    images: ["/og-image.png"],
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
