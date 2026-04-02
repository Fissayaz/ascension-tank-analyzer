"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function armorReductionPct(armor: number, k = 4000) {
  return (armor / (armor + k)) * 100;
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

    const magicalAfterDr = magicalHit * (1 - magicDr / 100) * (1 - globalDr / 100);
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

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    marginTop: 6,
    background: "#020617",
    border: "1px solid #334155",
    color: "white",
    borderRadius: 8,
  };

  const panelStyle: React.CSSProperties = {
    background: "#1e293b",
    padding: 20,
    borderRadius: 12,
  };

  return (
    <main
      style={{
        padding: 32,
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 30, marginBottom: 10 }}>
        🛡️ Ascension Tank Analyzer V3
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: 24 }}>
        Analyse avoidance, mitigation physique, mitigation magique, Fierce Blow et
        compare rapidement les améliorations les plus utiles.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 24,
        }}
      >
        <div style={panelStyle}>
          <h2>Stats du tank</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label>HP</label>
              <input style={fieldStyle} type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))} />
            </div>
            <div>
              <label>Armor</label>
              <input style={fieldStyle} type="number" value={armor} onChange={(e) => setArmor(Number(e.target.value))} />
            </div>
            <div>
              <label>Dodge %</label>
              <input style={fieldStyle} type="number" value={dodge} onChange={(e) => setDodge(Number(e.target.value))} />
            </div>
            <div>
              <label>Parry %</label>
              <input style={fieldStyle} type="number" value={parry} onChange={(e) => setParry(Number(e.target.value))} />
            </div>
            <div>
              <label>Block %</label>
              <input style={fieldStyle} type="number" value={blockChance} onChange={(e) => setBlockChance(Number(e.target.value))} />
            </div>
            <div>
              <label>Block Value</label>
              <input style={fieldStyle} type="number" value={blockValue} onChange={(e) => setBlockValue(Number(e.target.value))} />
            </div>
            <div>
              <label>DR globale %</label>
              <input style={fieldStyle} type="number" value={globalDr} onChange={(e) => setGlobalDr(Number(e.target.value))} />
            </div>
            <div>
              <label>DR magique %</label>
              <input style={fieldStyle} type="number" value={magicDr} onChange={(e) => setMagicDr(Number(e.target.value))} />
            </div>
            <div>
              <label>Absorb</label>
              <input style={fieldStyle} type="number" value={absorb} onChange={(e) => setAbsorb(Number(e.target.value))} />
            </div>
          </div>

          <h2 style={{ marginTop: 26 }}>Simulation</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label>Hit physique</label>
              <input style={fieldStyle} type="number" value={physicalHit} onChange={(e) => setPhysicalHit(Number(e.target.value))} />
            </div>
            <div>
              <label>Hit magique</label>
              <input style={fieldStyle} type="number" value={magicalHit} onChange={(e) => setMagicalHit(Number(e.target.value))} />
            </div>
            <div>
              <label>Fierce Blow</label>
              <input style={fieldStyle} type="number" value={fierceBlow} onChange={(e) => setFierceBlow(Number(e.target.value))} />
            </div>
            <div>
              <label>Block efficiency FB %</label>
              <input
                style={fieldStyle}
                type="number"
                value={fierceBlockEfficiency}
                onChange={(e) => setFierceBlockEfficiency(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Absorb efficiency FB %</label>
              <input
                style={fieldStyle}
                type="number"
                value={fierceAbsorbEfficiency}
                onChange={(e) => setFierceAbsorbEfficiency(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={panelStyle}>
            <h2>Résumé</h2>
            <div style={{ marginTop: 14 }}>Avoidance : <strong>{calc.avoidance.toFixed(1)}%</strong></div>
            <div style={{ marginTop: 10 }}>Armor DR : <strong>{calc.armorDr.toFixed(1)}%</strong></div>
            <div style={{ marginTop: 10 }}>Réduction physique : <strong>{calc.physicalReduction.toFixed(1)}%</strong></div>
            <div style={{ marginTop: 10 }}>Réduction magique : <strong>{calc.magicalReduction.toFixed(1)}%</strong></div>
            <div style={{ marginTop: 10 }}>Réduction Fierce Blow : <strong>{calc.fierceReduction.toFixed(1)}%</strong></div>
            <div style={{ marginTop: 10 }}>EHP : <strong>{Math.round(calc.ehp).toLocaleString()}</strong></div>
            <div style={{ marginTop: 10 }}>
              Fierce Blows survivables (worst case) : <strong>{calc.fierceSurvivable}</strong>
            </div>
          </div>

          <div style={panelStyle}>
            <h2>Diagnostic</h2>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {calc.diagnosis.map((d) => (
                <div
                  key={d}
                  style={{
                    background: "#334155",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div style={panelStyle}>
            <h2>Comparaison rapide</h2>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {calc.compare.map((c, i) => (
                <div
                  key={c.label}
                  style={{
                    background: i === 0 ? "#1d4ed8" : "#334155",
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <strong>{c.label}</strong> — gain physique:{" "}
                  {c.physGain >= 0 ? "+" : ""}
                  {c.physGain.toFixed(2)}%
                  {i === 0 ? " ⭐" : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
