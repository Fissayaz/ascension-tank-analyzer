import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ascension Tank Analyzer",
  description: "Analyse ton tanking Ascension : mitigation, avoidance, block, absorb et Fierce Blow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
