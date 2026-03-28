import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Όροι Χρήσης – PocketMath",
  description:
    "Όροι χρήσης του PocketMath. Ενημερωθείτε για τους όρους χρήσης του υπολογιστή καθαρού μισθού.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
