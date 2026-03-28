import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Πολιτική Απορρήτου – PocketMath",
  description:
    "Πολιτική απορρήτου του PocketMath. Πώς χειριζόμαστε τα δεδομένα σας στον υπολογιστή καθαρού μισθού.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
