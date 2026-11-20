import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Σύγκριση Εισοδήματος 2026 | Ατομική, ΙΚΕ, Ε.Ε., Μισθωτός, Μπλοκάκι",
  description:
    "Σύγκρινε καθαρό εισόδημα για ατομική, μονοπρόσωπη ΙΚΕ, Ε.Ε., μισθωτό και μπλοκάκι με το ίδιο μεικτό μηνιαίο ποσό για το 2026.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    type: "website",
    url: "https://tsatsarisg.github.io/pocketmath/compare",
    title: "PocketMath Σύγκριση 2026 | Ατομική, ΙΚΕ, Ε.Ε., Μισθωτός, Μπλοκάκι",
    description:
      "Ενδεικτική σύγκριση καθαρού ετήσιου εισοδήματος για επιλεγμένα σενάρια στην Ελλάδα το 2026.",
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
      "Σύγκριση καθαρού εισοδήματος για ατομική, μονοπρόσωπη ΙΚΕ, Ε.Ε., μισθωτό και μπλοκάκι.",
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
