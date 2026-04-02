const cardStyle: React.CSSProperties = {
  background: "rgba(30, 41, 59, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  borderRadius: 18,
  padding: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

function BuildCard({
  title,
  strengths,
  weaknesses,
  bestFor,
}: {
  title: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
}) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{ marginTop: 12 }}>
        <strong>Strengths</strong>
        <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
          {strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 12 }}>
        <strong>Weaknesses</strong>
        <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
          {weaknesses.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 12, color: "#cbd5e1" }}>
        <strong>Best for:</strong> {bestFor}
      </div>
    </div>
  );
}

export default function BuildsPage() {
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
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 20 }}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Tank Archetypes</h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            This page does not try to list every possible Ascension tank build.
            Instead, it organizes the major defensive archetypes in a way that is
            useful for players trying to understand what kind of tank they are
            building.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 20,
          }}
        >
          <BuildCard
            title="Block Tank"
            strengths={[
              "Stable against repeat physical hits",
              "Can feel very safe when block value is actually high enough",
              "Often gains a lot from shield-oriented effects",
            ]}
            weaknesses={[
              "Can underperform if block chance is stacked without enough block value",
              "May still struggle on magical pressure",
            ]}
            bestFor="Players who want a structured, shield-like physical mitigation style."
          />

          <BuildCard
            title="Bear / EHP Tank"
            strengths={[
              "Strong HP + armor style",
              "Usually easier to understand for players who want raw durability",
              "Can be very stable against physical damage",
            ]}
            weaknesses={[
              "May not have elegant answers to every magical or burst scenario",
              "Can feel blunt rather than flexible",
            ]}
            bestFor="Players who value raw survivability and large margins."
          />

          <BuildCard
            title="Parry Tank"
            strengths={[
              "Can feel extremely smooth when avoidance works in your favor",
              "Often attractive to advanced players who enjoy finesse-based tanking",
            ]}
            weaknesses={[
              "Can become fragile when burst lands",
              "Easy to overestimate if avoidance is high but real mitigation is low",
            ]}
            bestFor="Players who understand the risk of relying more heavily on avoidance."
          />

          <BuildCard
            title="Mana / Absorb Tank"
            strengths={[
              "Can be excellent in scenarios where absorb gets strong value",
              "Can cover some incoming damage in a way that feels unique",
            ]}
            weaknesses={[
              "May look stronger on average hits than on burst windows",
              "Needs careful interpretation against special mechanics",
            ]}
            bestFor="Players who want a more specialized and unconventional defensive profile."
          />
        </section>
      </div>
    </main>
  );
}
