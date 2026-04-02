export default function GuidePage() {
  const cardStyle: React.CSSProperties = {
    background: "rgba(30, 41, 59, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

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
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Guide du tanking</h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Cette page est pensée pour donner une lecture claire des couches
            défensives. L’idée est simple : un tank solide ne repose pas sur un
            seul chiffre, mais sur la combinaison de plusieurs couches.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Armor DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            C’est la réduction apportée par l’armure. Elle s’applique surtout aux
            dégâts physiques. Elle ne dit pas tout à elle seule, mais elle est une
            des bases d’un tank physique stable.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Physical DR / Global DR / Magic DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            <strong>Physical DR</strong> : réduction physique hors armure.{" "}
            <strong>Global DR</strong> : réduction plus large, souvent très
            puissante. <strong>Magic DR</strong> : réduction spécifique au
            magique. La séparation de ces couches évite de raconter n’importe quoi
            sur la résistance réelle d’un tank.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Block chance vs block value</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Avoir beaucoup de block chance sans vraie block value peut donner une
            illusion de solidité. Plus les hits sont gros, plus la block value
            compte.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Avoidance</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            L’avoidance regroupe surtout dodge et parry. C’est puissant, mais ça
            reste une logique de non-hit. Si tu prends le hit, tes autres couches
            doivent tenir.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Absorb</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            L’absorb est souvent excellent contre des hits normaux ou répétés,
            mais il peut être moins impressionnant contre certains bursts ou
            mécaniques spéciales. Il faut toujours le lire avec le reste.
          </p>
        </section>
      </div>
    </main>
  );
}
