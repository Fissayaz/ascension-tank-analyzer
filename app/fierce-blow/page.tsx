export default function FierceBlowPage() {
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
          "radial-gradient(circle at top right, rgba(239,68,68,0.14), transparent 20%), radial-gradient(circle at bottom left, rgba(168,85,247,0.12), transparent 20%), #020617",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Comprendre Fierce Blow</h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Le site traite Fierce Blow à part, et c’est volontaire. Le but est
            d’éviter de mélanger un hit physique normal avec une mécanique de burst
            qui se lit différemment.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Pourquoi une section dédiée ?</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Beaucoup de tanks ont l’impression d’être solides sur les hits moyens,
            puis explosent sur un gros burst. Si le calculateur mélange tout, il
            masque ce problème. Une lecture séparée rend le diagnostic bien plus
            honnête.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Ce que le site cherche à montrer</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            La page calculateur montre :
            la réduction moyenne sur Fierce Blow,
            le worst case,
            et combien de hits de ce type ton tank peut encaisser dans le scénario
            simulé. C’est une lecture anti-burst.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Lecture pratique</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Si ton tank est bon partout sauf ici, alors ton vrai problème n’est
            pas ton “tanking global”, mais ton manque de marge contre les gros
            bursts. En pratique, ça pointe souvent vers :
            block value,
            mitigation physique,
            HP / EHP,
            ou une dépendance excessive à l’absorb.
          </p>
        </section>
      </div>
    </main>
  );
}
