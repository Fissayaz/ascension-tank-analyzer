"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function armorReductionPct(armor: number, k = 4000) {
  return (armor / (armor + k)) * 100;
}

function barColor(type: "physical" | "magic" | "fierce") {
  if (type === "physical") return "linear-gradient(90deg, #38bdf8, #2563eb)";
  if (type === "magic") return "linear-gradient(90deg, #a78bfa, #7c3aed)";
  return "linear-gradient(90deg, #fb7185, #dc2626)";
}

type CompareItem = {
  label: string;
  physGain: number;
  magicGain: number;
  fierceGain: number;
  totalGain: number;
};

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
    const fierceSurvivable = Math.max(
      1,
      Math.floor(hp / Math.max(1, fierceWorst))
    );

    let tankProfile = "Hybrid Tank";
    if (blockChance >= 22 && blockValue >= physicalHit * 0.08) {
      tankProfile = "Block Tank";
    } else if (parry >= dodge + 5) {
      tankProfile = "Parry Tank";
    } else if (hp >= 14000 && armor >= 15000) {
      tankProfile = "Bear / EHP Tank";
    } else if (avoidance >= 30 && hp < 12000) {
      tankProfile = "Avoidance Tank";
    }

    const criticalProblems: string[] = [];
    const importantProblems: string[] = [];
    const secondaryProblems: string[] = [];

    if (fierceReduction < 35) {
      criticalProblems.push("Fierce Blow très dangereux.");
    }

    if (physicalReduction < 50) {
      importantProblems.push("Mitigation physique insuffisante.");
    }

    if (magicalReduction < 20) {
      importantProblems.push("Mitigation magique faible.");
    }

    if (blockChance >= 20 && blockValue < physicalHit * 0.08) {
      importantProblems.push("Tu as du block chance, mais pas assez de block value.");
    }

    if (avoidance < 20) {
      secondaryProblems.push("Avoidance faible.");
    }

    if (ehp < 20000) {
      secondaryProblems.push("EHP trop faible pour un profil tank solide.");
    }

    if (
      criticalProblems.length === 0 &&
      importantProblems.length === 0 &&
      secondaryProblems.length === 0
    ) {
      secondaryProblems.push("Profil assez équilibré.");
    }

    let priority = "Aucune priorité évidente.";
    if (fierceReduction < 35 && blockValue < physicalHit * 0.08) {
      priority = "Monte la block value en priorité.";
    } else if (fierceReduction < 35) {
      priority = "Monte ta mitigation physique pour mieux tenir les Fierce Blows.";
    } else if (physicalReduction < 50) {
      priority = "Monte l’armor ou la DR globale.";
    } else if (magicalReduction < 20) {
      priority = "Monte la mitigation magique.";
    } else if (avoidance < 20) {
      priority = "Ajoute dodge/parry si ton build le permet.";
    }

    function simulateVariant(variant: {
      armor?: number;
      globalDr?: number;
      blockValue?: number;
      blockChance?: number;
      parry?: number;
    }) {
      const nextArmor = armor + (variant.armor ?? 0);
      const nextGlobalDr = globalDr + (variant.globalDr ?? 0);
      const nextBlockValue = blockValue + (variant.blockValue ?? 0);
      const nextBlockChance = blockChance + (variant.blockChance ?? 0);
      const nextParry = parry + (variant.parry ?? 0);

      const nextArmorDr = armorReductionPct(nextArmor);

      const nextPhysicalAfterArmor = physicalHit * (1 - nextArmorDr / 100);
      const nextPhysicalAfterDr =
        nextPhysicalAfterArmor * (1 - nextGlobalDr / 100);
      const nextAverageBlockReduction =
        Math.min(nextBlockValue, nextPhysicalAfterDr) * (nextBlockChance / 100);
      const nextPhysicalAverage = Math.max(
        0,
        nextPhysicalAfterDr - nextAverageBlockReduction - absorb
      );
      const nextPhysicalReduction = clamp(
        (1 - nextPhysicalAverage / Math.max(1, physicalHit)) * 100,
        0,
        99
      );

      const nextMagicalAfterDr =
        magicalHit * (1 - magicDr / 100) * (1 - nextGlobalDr / 100);
      const nextMagicalAverage = Math.max(0, nextMagicalAfterDr - absorb);
      const nextMagicalReduction = clamp(
        (1 - nextMagicalAverage / Math.max(1, magicalHit)) * 100,
        0,
        99
      );

      const nextFierceAfterArmor = fierceBlow * (1 - nextArmorDr / 100);
      const nextFierceAfterDr =
        nextFierceAfterArmor * (1 - nextGlobalDr / 100);
      const nextFierceBlockValue =
        nextBlockValue * (fierceBlockEfficiency / 100);
      const nextFierceAverageBlockReduction =
        Math.min(nextFierceBlockValue, nextFierceAfterDr) *
        (nextBlockChance / 100);
      const nextFierceAverage = Math.max(
        0,
        nextFierceAfterDr -
          nextFierceAverageBlockReduction -
          absorb * (fierceAbsorbEfficiency / 100)
      );
      const nextFierceReduction = clamp(
        (1 - nextFierceAverage / Math.max(1, fierceBlow)) * 100,
        0,
        99
      );

      const nextAvoidance = clamp(dodge + nextParry, 0, 100);

      return {
        physGain: nextPhysicalReduction - physicalReduction,
        magicGain: nextMagicalReduction - magicalReduction,
        fierceGain: nextFierceReduction - fierceReduction,
        avoidanceGain: nextAvoidance - avoidance,
      };
    }

    const compare: CompareItem[] = [
      { label: "+500 armor", ...simulateVariant({ armor: 500 }), totalGain: 0 },
      { label: "+2% DR", ...simulateVariant({ globalDr: 2 }), totalGain: 0 },
      {
        label: "+100 block value",
        ...simulateVariant({ blockValue: 100 }),
        totalGain: 0,
      },
      {
        label: "+3% block chance",
        ...simulateVariant({ blockChance: 3 }),
        totalGain: 0,
      },
      { label: "+5% parry", ...simulateVariant({ parry: 5 }), totalGain: 0 },
    ].map((x) => ({
      ...x,
      totalGain: x.physGain + x.magicGain + x.fierceGain,
    }))
      .sort((a, b) => b.totalGain - a.totalGain);

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
      tankProfile,
      criticalProblems,
      importantProblems,
      secondaryProblems,
      priority,
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

  const problemBox = (
    title: string,
    items: string[],
    color: string
  ) => (
    <div style={{ ...cardStyle, borderLeft: `4px solid ${color}` }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              background: "rgba(51,65,85,0.8)",
              padding: 12,
              borderRadius: 10,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

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
            Ascension Tank Analyzer — V5 avancée
          </div>

          <h1 style={{ fontSize: 40, margin: 0, lineHeight: 1.05 }}>
            Un vrai assistant tank, pas juste un calculateur.
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
            Cette version te donne un profil de tank, une hiérarchie de problèmes,
            une priorité d’amélioration et une comparaison rapide des upgrades qui
            t’apportent le plus.
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
            <div style={cardStyle}>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>Profil détecté</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                {calc.tankProfile}
              </div>
              <div style={{ marginTop: 14, color: "#cbd5e1" }}>
                Priorité actuelle : <strong>{calc.priority}</strong>
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
                        background: barColor(item.type),
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {problemBox("❌ Problèmes critiques", calc.criticalProblems, "#ef4444")}
            {problemBox("⚠️ Problèmes importants", calc.importantProblems, "#f59e0b")}
            {problemBox("🟡 Problèmes secondaires", calc.secondaryProblems, "#eab308")}

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
                      Physique: {c.physGain >= 0 ? "+" : ""}{c.physGain.toFixed(2)}%
                    </div>
                    <div style={{ color: "#cbd5e1" }}>
                      Magique: {c.magicGain >= 0 ? "+" : ""}{c.magicGain.toFixed(2)}%
                    </div>
                    <div style={{ color: "#cbd5e1" }}>
                      Fierce Blow: {c.fierceGain >= 0 ? "+" : ""}{c.fierceGain.toFixed(2)}%
                      {i === 0 ? " ⭐ meilleur choix actuel" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Résumé chiffré</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>Avoidance : <strong>{calc.avoidance.toFixed(1)}%</strong></div>
                <div>Armor DR : <strong>{calc.armorDr.toFixed(1)}%</strong></div>
                <div>EHP : <strong>{Math.round(calc.ehp).toLocaleString()}</strong></div>
                <div>Fierce Blows survivables : <strong>{calc.fierceSurvivable}</strong></div>
                <div>Worst case physique : <strong>{Math.round(calc.physicalWorst).toLocaleString()}</strong></div>
                <div>Worst case Fierce Blow : <strong>{Math.round(calc.fierceWorst).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
