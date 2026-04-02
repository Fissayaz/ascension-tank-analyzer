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
            Ascension Tank Analyzer — V9
          </div>

          <h1 style={{ fontSize: 46, margin: 0, lineHeight: 1.05 }}>
            Un site pensé pour devenir une vraie référence tank sur Ascension.
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 16,
              fontSize: 18,
              maxWidth: 920,
              lineHeight: 1.6,
            }}
          >
            Le projet avance dans la bonne direction : un calculateur lisible, une
            structure de site propre, une page guide, une lecture séparée de Fierce
            Blow, et une base prête à accueillir davantage de talents, mystiques et
            logiques défensives spécifiques à Ascension.
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
              Aller au calculateur
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
              Lire la page Fierce Blow
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
            <h2 style={{ marginTop: 0 }}>Pour les nouveaux tanks</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Comprendre les bases : avoidance, armor, DR, block, absorb, EHP,
              burst et lecture anti-Fierce Blow.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Pour les tanks avancés</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Lire rapidement où un build pêche, voir si le block est rentable, et
              comparer des améliorations concrètes.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Pour le theorycraft</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Séparer Armor DR, Physical DR, Global DR, Magic DR, et préparer une
              base de données interne plus structurée.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Pour la suite</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              Presets plus riches, talents et mystiques rangés par catégorie, guide
              plus complet, et moteur plus proche du vrai tanking Ascension.
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
            <h2 style={{ marginTop: 0 }}>Ce que le site sait déjà faire</h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Comparer la mitigation physique, magique et Fierce Blow</li>
              <li>Détecter un profil de tank</li>
              <li>Donner une priorité d’amélioration</li>
              <li>Tester quelques presets simples</li>
              <li>Activer des stances / cooldowns / mystiques clés</li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Ce qu’il ne fait pas encore</h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Tous les talents Ascension</li>
              <li>Tous les mystic enchants</li>
              <li>Le calcul slot par slot du stuff</li>
              <li>Une modélisation parfaite de chaque mécanique contextuelle</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
