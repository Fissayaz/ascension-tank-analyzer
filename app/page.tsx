"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function armorReductionPct(armor: number, k = 4000) {
  return (armor / (armor + k)) * 100;
}

function barColor(value: number, type: "physical" | "magic" | "fierce") {
  if (type === "physical") return "linear-gradient(90deg, #38bdf8, #2563eb)";
  if (type === "magic") return "linear-gradient(90deg, #a78bfa, #7c3aed)";
  return "linear-gradient(90deg, #fb7185, #dc2626)";
}

export default function Page() {
  const [hp, setHp] = useState(10000);
  const [armor, setArmor] = useState(12000);
  const [dodge, setDodge] = useState(10);
  const [parry, setParry] = useState(10);
  const [blockChance, setBlockChance] = useState(15);
  const [blockValue, setBlockValue] = useState(300);
  const [globalDr, setGlobalDr] = useState(0);
  const [magicDr, setMagicDr] = useState(0);
  const [absorb, setAbsorb] = useState(0);

  const [physicalHit, setPhysicalHit] = useState(6000);
  const [magicalHit, setMagicalHit] = useState(5000);
  const [fierceBlow, setFierceBlow] = useState(9000);

  const [fierceBlockEfficiency, setFierceBlockEfficiency] = useState(50);
  const [fierceAbsorbEfficiency, setFierceAbsorbEfficiency] = useState(50);

  const calc = useMemo(() => {
    const avoidance = clamp(dodge + parry, 0, 100);
    const armorDr = armorReductionPct(armor);

    const physicalAfterArmor = physicalHit * (1 - armorDr / 100);
    const physicalAfterDr = physicalAfterArmor * (1 - globalDr / 100);
    const averageBlockReduction =
      Math.min(blockValue, physicalAfterDr) * (blockChance / 100);

    const physicalAverage = Math.max(
      0,
      physicalAfterDr - averageBlockReduction - absorb
    );
    const physicalWorst = Math.max(0, physicalAfterDr - absorb);

    const magicalAfterDr =
      magicalHit * (1 - magicDr / 100) * (1 - globalDr / 100);
    const magicalAverage = Math.max(0, magicalAfterDr - absorb);

    const fierceAfterArmor = fierceBlow * (1 - armorDr / 100);
    const fierceAfterDr = fierceAfterArmor * (1 - globalDr / 100);

    const fierceBlockValue = blockValue * (fierceBlockEfficiency / 100);
    const fierceAbsorb = absorb * (fierceAbsorbEfficiency / 100);
    const fierceAverageBlockReduction =
      Math.min(fierceBlockValue, fierceAfterDr) * (blockChance / 100);

    const fierceAverage = Math.max(
      0,
      fierceAfterDr - fierceAverageBlockReduction - fierceAbsorb
    );
    const fierceWorst = Math.max(0, fierceAfterDr - fierceAbsorb);

    const physicalReduction = clamp(
      (1 - physicalAverage / Math.max(1, physicalHit)) * 100,
      0,
      99
    );
    const magicalReduction = clamp(
      (1 - magicalAverage / Math.max(1, magicalHit)) * 100,
      0,
      99
    );
    const fierceReduction = clamp(
      (1 - fierceAverage / Math.max(1, fierceBlow)) * 100,
      0,
      99
    );

    const ehp = hp / Math.max(0.01, 1 - ((armorDr + globalDr) / 100));
    const fierceSurvivable = Math.max(1, Math.floor(hp / Math.max(1, fierceWorst)));

    const diagnosis: string[] = [];
    if (avoidance < 20) diagnosis.push("Avoidance faible.");
    if (physicalReduction < 50) diagnosis.push("Mitigation physique insuffisante.");
    if (magicalReduction < 20) diagnosis.push("Mitigation magique faible.");
    if (blockChance >= 20 && blockValue < physicalHit * 0.08) {
      diagnosis.push("Tu as du block chance, mais pas assez de block value.");
    }
    if (fierceReduction < 35) diagnosis.push("Fierce Blow très dangereux.");
    if (ehp < 20000) diagnosis.push("EHP trop faible pour un profil tank solide.");
    if (diagnosis.length === 0) diagnosis.push("Profil assez équilibré.");

    const compare = [
      {
        label: "+500 armor",
        physGain:
          ((1 -
            Math.max(
              0,
              (physicalHit *
                (1 - armorReductionPct(armor + 500) / 100) *
                (1 - globalDr / 100) -
                averageBlockReduction -
                absorb) /
                Math.max(1, physicalHit)
            )) *
            100) -
          physicalReduction,
      },
      {
        label: "+2% DR",
        physGain:
          ((1 -
            Math.max(
              0,
              (physicalHit *
                (1 - armorDr / 100) *
                (1 - (globalDr + 2) / 100) -
                averageBlockReduction -
                absorb) /
                Math.max(1, physicalHit)
            )) *
            100) -
          physicalReduction,
      },
      {
        label: "+100 block value",
        physGain:
          ((1 -
            Math.max(
              0,
              (physicalAfterDr -
                Math.min(blockValue + 100, physicalAfterDr) * (blockChance / 100) -
                absorb) /
                Math.max(1, physicalHit)
            )) *
            100) -
          physicalReduction,
      },
    ].sort((a, b) => b.physGain - a.physGain);

    return {
      avoidance,
      armorDr,
      physicalAverage,
      physicalWorst,
      physicalReduction,
      magicalAverage,
      magicalReduction,
      fierceAverage,
      fierceWorst,
      fierceReduction,
      ehp,
      fierceSurvivable,
      diagnosis,
      compare,
    };
  }, [
    hp,
    armor,
    dodge,
    parry,
    blockChance,
    blockValue,
    globalDr,
    magicDr,
    absorb,
    physicalHit,
    magicalHit,
    fierceBlow,
    fierceBlockEfficiency,
    fierceAbsorbEfficiency,
  ]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    marginTop: 6,
    background: "#0f172a",
    border: "1px solid #334155",
    color: "white",
    borderRadius: 10,
    outline: "none",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(30, 41, 59, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const statCardStyle: React.CSSProperties = {
    ...cardStyle,
    padding: 18,
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
            Ascension Tank Analyzer — V4
          </div>

          <h1 style={{ fontSize: 40, margin: 0, lineHeight: 1.05 }}>
            Un analyseur tank plus lisible, plus stylé, plus utile.
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
            Entre tes stats visibles, simule un hit physique, un hit magique et un
            Fierce Blow, puis lis instantanément où ton tank est fort, où il est
            fragile, et quelle amélioration te donnerait le plus de valeur.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Stats du tank</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label>HP</label>
                  <input style={inputStyle} type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))} />
                </div>
                <div>
                  <label>Armor</label>
                  <input style={inputStyle} type="number" value={armor} onChange={(e) => setArmor(Number(e.target.value))} />
                </div>
                <div>
                  <label>Dodge %</label>
                  <input style={inputStyle} type="number" value={dodge} onChange={(e) => setDodge(Number(e.target.value))} />
                </div>
                <div>
                  <label>Parry %</label>
                  <input style={inputStyle} type="number" value={parry} onChange={(e) => setParry(Number(e.target.value))} />
                </div>
                <div>
                  <label>Block %</label>
                  <input style={inputStyle} type="number" value={blockChance} onChange={(e) => setBlockChance(Number(e.target.value))} />
                </div>
                <div>
                  <label>Block Value</label>
                  <input style={inputStyle} type="number" value={blockValue} onChange={(e) => setBlockValue(Number(e.target.value))} />
                </div>
                <div>
                  <label>DR globale %</label>
                  <input style={inputStyle} type="number" value={globalDr} onChange={(e) => setGlobalDr(Number(e.target.value))} />
                </div>
                <div>
                  <label>DR magique %</label>
                  <input style={inputStyle} type="number" value={magicDr} onChange={(e) => setMagicDr(Number(e.target.value))} />
                </div>
                <div>
                  <label>Absorb</label>
                  <input style={inputStyle} type="number" value={absorb} onChange={(e) => setAbsorb(Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Simulation</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label>Hit physique</label>
                  <input style={inputStyle} type="number" value={physicalHit} onChange={(e) => setPhysicalHit(Number(e.target.value))} />
                </div>
                <div>
                  <label>Hit magique</label>
                  <input style={inputStyle} type="number" value={magicalHit} onChange={(e) => setMagicalHit(Number(e.target.value))} />
                </div>
                <div>
                  <label>Fierce Blow</label>
                  <input style={inputStyle} type="number" value={fierceBlow} onChange={(e) => setFierceBlow(Number(e.target.value))} />
                </div>
                <div>
                  <label>Block efficiency FB %</label>
                  <input style={inputStyle} type="number" value={fierceBlockEfficiency} onChange={(e) => setFierceBlockEfficiency(Number(e.target.value))} />
                </div>
                <div>
                  <label>Absorb efficiency FB %</label>
                  <input style={inputStyle} type="number" value={fierceAbsorbEfficiency} onChange={(e) => setFierceAbsorbEfficiency(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div style={statCardStyle}>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>Avoidance</div>
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                  {calc.avoidance.toFixed(1)}%
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>Armor DR</div>
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                  {calc.armorDr.toFixed(1)}%
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>EHP</div>
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                  {Math.round(calc.ehp).toLocaleString()}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                  FB survivables
                </div>
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                  {calc.fierceSurvivable}
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Vue rapide</h2>

              {[
                {
                  label: "Mitigation physique",
                  value: calc.physicalReduction,
                  type: "physical" as const,
                },
                {
                  label: "Mitigation magique",
                  value: calc.magicalReduction,
                  type: "magic" as const,
                },
                {
                  label: "Fierce Blow",
                  value: calc.fierceReduction,
                  type: "fierce" as const,
                },
              ].map((item) => (
                <div key={item.label} style={{ marginTop: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      marginBottom: 8,
                    }}
                  >
                    <span>{item.label}</span>
                    <strong>{item.value.toFixed(1)}%</strong>
                  </div>
                  <div
                    style={{
                      height: 12,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${item.value}%`,
                        height: "100%",
                        background: barColor(item.value, item.type),
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Diagnostic</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {calc.diagnosis.map((d) => (
                  <div
                    key={d}
                    style={{
                      background: "rgba(51,65,85,0.8)",
                      padding: 12,
                      borderRadius: 10,
                      borderLeft: "4px solid #f59e0b",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Comparaison rapide</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {calc.compare.map((c, i) => (
                  <div
                    key={c.label}
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(90deg, rgba(37,99,235,0.35), rgba(59,130,246,0.18))"
                          : "rgba(51,65,85,0.8)",
                      padding: 12,
                      borderRadius: 10,
                      border:
                        i === 0
                          ? "1px solid rgba(96,165,250,0.5)"
                          : "1px solid rgba(148,163,184,0.15)",
                    }}
                  >
                    <strong>{c.label}</strong>
                    <div style={{ marginTop: 6, color: "#cbd5e1" }}>
                      Gain physique : {c.physGain >= 0 ? "+" : ""}
                      {c.physGain.toFixed(2)}%
                      {i === 0 ? " ⭐ meilleur choix actuel" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Détails hits</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>Hit physique moyen : <strong>{Math.round(calc.physicalAverage).toLocaleString()}</strong></div>
                <div>Worst case physique : <strong>{Math.round(calc.physicalWorst).toLocaleString()}</strong></div>
                <div>Hit magique moyen : <strong>{Math.round(calc.magicalAverage).toLocaleString()}</strong></div>
                <div>Fierce Blow moyen : <strong>{Math.round(calc.fierceAverage).toLocaleString()}</strong></div>
                <div>Worst case Fierce Blow : <strong>{Math.round(calc.fierceWorst).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
