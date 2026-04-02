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
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gap: 24 }}>
        <section
          style={{
            ...cardStyle,
            padding: 28,
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
            Ascension Tank Analyzer — V10
          </div>

          <h1 style={{ fontSize: 46, margin: 0, lineHeight: 1.05 }}>
            A tank reference site for Ascension, built step by step.
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 16,
              fontSize: 18,
              maxWidth: 960,
              lineHeight: 1.6,
            }}
          >
            The goal is no longer to build a small personal calculator. This site
            is being shaped into a real tank reference for the Ascension
            community: readable for newer players, useful for experienced tanks,
            and structured to grow without turning into a mess.
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
              Open Calculator
            </Link>
            <Link
              href="/builds"
              style={{ ...buttonStyle, background: "#475569" }}
            >
              View Tank Archetypes
            </Link>
            <Link
              href="/guide"
              style={{ ...buttonStyle, background: "#334155" }}
            >
              Read the Guide
            </Link>
            <Link
              href="/fierce-blow"
              style={{ ...buttonStyle, background: "#7c2d12" }}
            >
              Understand Fierce Blow
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 20,
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Calculator</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Simulate physical mitigation, magical mitigation, block, absorb,
              and Fierce Blow survival in one place.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Archetypes</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Compare major tank styles such as Block Tank, Bear/EHP Tank,
              Parry Tank, and Mana/Absorb Tank.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Guide</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Learn how Armor DR, Physical DR, Global DR, Magic DR, block chance,
              block value, and avoidance actually fit together.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Burst Analysis</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Read Fierce Blow separately from normal hits so burst weaknesses do
              not get hidden behind average mitigation.
            </p>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 20,
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>What the site already does well</h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Separates physical, magical, and Fierce Blow reads</li>
              <li>Shows multiple defensive layers instead of one fake score</li>
              <li>Provides quick presets and meaningful toggles</li>
              <li>Highlights upgrade priorities instead of just showing numbers</li>
              <li>Begins to speak the language of real tanking decisions</li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>What comes next</h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
              <li>More structured talent and mystic categories</li>
              <li>Better tank archetype pages</li>
              <li>Cleaner calculator data organization</li>
              <li>Stronger “what is my real weakness?” guidance</li>
              <li>More Ascension-specific defensive logic over time</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
