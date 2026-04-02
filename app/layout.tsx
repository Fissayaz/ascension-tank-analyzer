import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ascension Tank Analyzer",
  description:
    "Tank calculator and reference site for Ascension: mitigation, avoidance, block, absorb and Fierce Blow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#020617",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* HEADER / NAV */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            backdropFilter: "blur(10px)",
            background: "rgba(2,6,23,0.85)",
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
            {/* LOGO / TITLE */}
            <Link
              href="/"
              style={{
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
                fontSize: 16,
              }}
            >
              Ascension Tank Analyzer
            </Link>

            {/* NAVIGATION */}
            <nav
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Link href="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                Home
              </Link>

              <Link
                href="/calculator"
                style={{ color: "#cbd5e1", textDecoration: "none" }}
              >
                Calculator
              </Link>

              <Link
                href="/builds"
                style={{ color: "#cbd5e1", textDecoration: "none" }}
              >
                Builds
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

        {/* PAGE CONTENT */}
        <main>{children}</main>
      </body>
    </html>
  );
}
