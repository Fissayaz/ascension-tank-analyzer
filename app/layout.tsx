import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ascension Tank Analyzer",
  description:
    "Calculateur et guide tank pour Ascension : mitigation, avoidance, block, absorb et Fierce Blow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            backdropFilter: "blur(10px)",
            background: "rgba(2,6,23,0.8)",
            borderBottom: "1px solid rgba(148,163,184,0.15)",
          }}
        >
          <div
            style={{
              maxWidth: 1320,
              margin: "0 auto",
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <Link
              href="/"
              style={{
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
              }}
            >
              Ascension Tank Analyzer
            </Link>

            <nav
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Link href="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                Accueil
              </Link>
              <Link
                href="/calculator"
                style={{ color: "#cbd5e1", textDecoration: "none" }}
              >
                Calculateur
              </Link>
              <Link
                href="/guide"
                style={{ color: "#cbd5e1", textDecoration: "none" }}
              >
                Guide
              </Link>
              <Link
                href="/fierce-blow"
                style={{ color: "#cbd5e1", textDecoration: "none" }}
              >
                Fierce Blow
              </Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
