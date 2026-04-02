import Link from "next/link";

const cardStyle: React.CSSProperties = {
  background: "rgba(30, 41, 59, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#1d4ed8",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "12px 16px",
  textDecoration: "none",
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(59,130,246,0.15), transparent 20%), radial-gradient(circle at bottom left, rgba(168,85,247,0.12), transparent 20%), #020617",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <section
          style={{
            ...cardStyle,
            padding: 28,
            marginBottom: 24,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 12,
              color: "#cbd5e1",
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.2)",
              marginBottom: 16,
            }}
          >
            Ascension Tank Analyzer — V8
          </div>

          <h1 style={{ fontSize: 44, margin: 0, lineHeight: 1.05 }}>
            La base d’un vrai site de référence tank pour Ascension.
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 16,
              fontSize: 18,
              maxWidth: 900,
              lineHeight: 1.6,
            }}
          >
            Cette version structure enfin le projet comme un vrai site : une page
            d’accueil, un calculateur, un guide et une page dédiée à Fierce Blow.
            L’objectif est clair : aider les tanks débutants comme avancés à mieux
            comprendre leur build et leurs priorités défensives.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <Link href="/calculator" style={buttonStyle}>
              Ouvrir le calculateur
            </Link>
            <Link
              href="/guide"
              style={{ ...buttonStyle, background: "#334155" }}
            >
              Lire le guide
            </Link>
            <Link
              href="/fierce-blow"
              style={{ ...buttonStyle, background: "#7c2d12" }}
            >
              Comprendre Fierce Blow
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 20,
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Calculateur</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Analyse avoidance, mitigation physique, mitigation magique, EHP,
              block, absorb et résistance à Fierce Blow.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Guide</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Comprends la différence entre Armor DR, Physical DR, Global DR,
              Magic DR, block chance, block value et absorb.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Fierce Blow</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Lis une explication claire de la logique du site pour le burst, les
              limitations du block/absorb et la lecture anti-burst.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
