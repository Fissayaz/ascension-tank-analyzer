const cardStyle: React.CSSProperties = {
  background: "rgba(30, 41, 59, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  borderRadius: 18,
  padding: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

export default function GuidePage() {
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
            Cette page sert à poser les bases. Un tank solide ne repose jamais sur
            un seul chiffre. Il faut raisonner en couches défensives, en scénarios
            de dégâts, et en stabilité réelle contre les hits normaux comme contre
            les bursts.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>1. Armor DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            C’est la réduction apportée par l’armure seule. Elle est très
            importante contre le physique, mais elle ne suffit pas à elle seule à
            définir la qualité d’un tank.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>2. Physical DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            C’est la réduction physique hors armure. Elle complète Armor DR et peut
            être très puissante pour tenir les hits lourds et certains bursts.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>3. Global DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            C’est une couche plus large, souvent très forte, car elle réduit
            plusieurs types de dégâts. C’est souvent l’une des stats les plus
            rentables quand ton build manque de stabilité générale.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>4. Magic DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Un tank très solide contre le physique peut rester fragile contre le
            magique. D’où l’intérêt de séparer clairement Magic DR dans le site.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>5. Avoidance</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Dodge et parry empêchent une partie des hits, mais n’aident pas quand
            tu prends réellement le coup. Un build avoidance sans marge HP ou sans
            mitigation stable peut se faire surprendre par le burst.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>6. Block chance vs block value</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Beaucoup de joueurs surinvestissent la block chance sans assez de block
            value. Résultat : le build a l’air “block”, mais ne réduit pas assez
            les gros hits.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>7. Absorb</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            L’absorb est excellent dans beaucoup de situations, surtout sur des
            hits moyens ou répétés. Mais il ne faut pas le lire comme une solution
            universelle à tous les bursts.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>8. EHP</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            L’EHP donne une idée de ta marge brute contre certains dégâts. C’est
            utile, mais ça ne remplace jamais une lecture du worst case et des
            mécaniques de burst.
          </p>
        </section>
      </div>
    </main>
  );
}
