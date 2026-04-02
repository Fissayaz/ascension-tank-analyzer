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
          <h1 style={{ marginTop: 0 }}>Tanking Guide</h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            A strong tank is never defined by one number. Real survivability comes
            from stacked defensive layers, how those layers interact, and how they
            hold up against both average hits and burst events.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Armor DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Armor DR is the reduction provided by armor alone. It is a foundation
            of physical tanking, but it should never be read as the whole story.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Physical DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Physical DR is separate from armor. This is important, because some
            builds are not really “armor builds” or “block builds” — they are
            simply stacking another physical mitigation layer.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Global DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Global DR is often one of the strongest layers in the game because it
            improves survivability in multiple scenarios at once. If your build
            feels unstable everywhere, this is often one of the first places to
            look.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Magic DR</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Many tanks look good on physical damage and then collapse against magic.
            That is why this site separates magical reads instead of hiding them
            inside a broad average.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Block chance vs block value</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            A common mistake is to stack block chance without enough block value.
            That creates a build that sounds strong on paper but does not actually
            cut enough damage off large hits.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Avoidance</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Dodge and parry are powerful, but they are still “no-hit” mechanics.
            If the hit lands, the rest of your build has to hold up. Avoidance-only
            logic becomes dangerous when burst enters the picture.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Absorb</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Absorb can be excellent against repeat damage and medium hits. But it
            should not be treated as a universal answer to every burst problem.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Decision-making, not just math</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            A good tank tool should not only say “you have X mitigation.” It should
            also help answer:
          </p>
          <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
            <li>Am I weak to average physical hits or burst?</li>
            <li>Is my block setup actually paying off?</li>
            <li>Am I overinvested in avoidance?</li>
            <li>Should I improve armor, DR, block value, or magical survival next?</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
