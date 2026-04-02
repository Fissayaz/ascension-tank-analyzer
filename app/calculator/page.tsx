"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Vanilla-like approximation (à valider ensuite avec tes logs)
function armorDR(armor: number) {
  const K = 4000;
  return (armor / (armor + K)) * 100;
}

export default function CalculatorPage() {
  const [state, setState] = useState({
    hp: 12000,
    armor: 12000,
    dodge: 10,
    parry: 10,
    block: 20,
    blockValue: 300,
    physicalDR: 0,
    globalDR: 0,
    magicDR: 0,
    resist: 0,
    absorb: 0,

    whiteHit: 6000,
    fierceBlow: 9000,
    magicHit: 5000,

    fierceBlockEff: 50,
    fierceAbsorbEff: 50,
  });

  function update(key: string, value: number) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  const calc = useMemo(() => {
    const avoidance = state.dodge + state.parry + state.block;
    const isCapped = avoidance >= 102.4;

    const armorReduction = armorDR(state.armor);

    // === PHYSICAL ===
    const physAfterArmor =
      state.whiteHit * (1 - armorReduction / 100);

    const physAfterPhysical =
      physAfterArmor * (1 - state.physicalDR / 100);

    const physAfterGlobal =
      physAfterPhysical * (1 - state.globalDR / 100);

    const avgBlock =
      Math.min(state.blockValue, physAfterGlobal) *
      (state.block / 100);

    const physicalAvg = Math.max(
      0,
      physAfterGlobal - avgBlock - state.absorb
    );

    const physicalWorst = Math.max(
      0,
      physAfterGlobal - state.absorb
    );

    // === MAGIC ===
    const magicAfter =
      state.magicHit *
      (1 - state.magicDR / 100) *
      (1 - state.globalDR / 100);

    const magicFinal = Math.max(
      0,
      magicAfter - state.absorb
    );

    // === FIERCE BLOW ===
    const fierceAfterArmor =
      state.fierceBlow * (1 - armorReduction / 100);

    const fierceAfterPhysical =
      fierceAfterArmor * (1 - state.physicalDR / 100);

    const fierceAfterGlobal =
      fierceAfterPhysical * (1 - state.globalDR / 100);

    const fbBlockValue =
      state.blockValue * (state.fierceBlockEff / 100);

    const fbAbsorb =
      state.absorb * (state.fierceAbsorbEff / 100);

    const fbAvgBlock =
      Math.min(fbBlockValue, fierceAfterGlobal) *
      (state.block / 100);

    const fierceAvg = Math.max(
      0,
      fierceAfterGlobal - fbAvgBlock - fbAbsorb
    );

    const fierceWorst = Math.max(
      0,
      fierceAfterGlobal - fbAbsorb
    );

    // === DIAGNOSTIC ===
    let issue = "Balanced";
    let advice = "No major weakness detected.";

    if (!isCapped) {
      issue = "Avoidance not capped";
      advice = "Increase dodge / parry / block.";
    } else if (fierceAvg > state.hp * 0.6) {
      issue = "Fierce Blow too high";
      advice = "Increase block value or mitigation.";
    } else if (physicalAvg > state.hp * 0.4) {
      issue = "Weak vs physical";
      advice = "Increase armor or DR.";
    } else if (magicFinal > state.hp * 0.4) {
      issue = "Weak vs magic";
      advice = "Increase magic DR or resist.";
    }

    return {
      avoidance,
      isCapped,
      armorReduction,
      physicalAvg,
      physicalWorst,
      magicFinal,
      fierceAvg,
      fierceWorst,
      issue,
      advice,
    };
  }, [state]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 8,
    marginTop: 4,
    background: "#0f172a",
    color: "white",
    border: "1px solid #334155",
    borderRadius: 8,
  };

  const card: React.CSSProperties = {
    background: "#020617",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #1e293b",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: 30,
      }}
    >
      <h1>Tank Analyzer V12</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={card}>
          <h2>Character Stats</h2>

          {[
            ["HP", "hp"],
            ["Armor", "armor"],
            ["Dodge %", "dodge"],
            ["Parry %", "parry"],
            ["Block %", "block"],
            ["Block Value", "blockValue"],
            ["Physical DR %", "physicalDR"],
            ["Global DR %", "globalDR"],
            ["Magic DR %", "magicDR"],
            ["Absorb", "absorb"],
          ].map(([label, key]) => (
            <div key={key}>
              <label>{label}</label>
              <input
                style={inputStyle}
                type="number"
                value={(state as any)[key]}
                onChange={(e) =>
                  update(key, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <div style={card}>
          <h2>Encounter</h2>

          {[
            ["White Hit", "whiteHit"],
            ["Fierce Blow", "fierceBlow"],
            ["Magic Hit", "magicHit"],
            ["Fierce Block %", "fierceBlockEff"],
            ["Fierce Absorb %", "fierceAbsorbEff"],
          ].map(([label, key]) => (
            <div key={key}>
              <label>{label}</label>
              <input
                style={inputStyle}
                type="number"
                value={(state as any)[key]}
                onChange={(e) =>
                  update(key, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 30, ...card }}>
        <h2>Results</h2>

        <p>
          Avoidance: {calc.avoidance.toFixed(1)}%{" "}
          {calc.isCapped ? "✅ (102.4% reached)" : "❌"}
        </p>

        <p>Armor DR: {calc.armorReduction.toFixed(1)}%</p>

        <p>White Hit Avg: {Math.round(calc.physicalAvg)}</p>
        <p>White Hit Worst: {Math.round(calc.physicalWorst)}</p>

        <p>Magic Hit: {Math.round(calc.magicFinal)}</p>

        <p>Fierce Blow Avg: {Math.round(calc.fierceAvg)}</p>
        <p>Fierce Blow Worst: {Math.round(calc.fierceWorst)}</p>

        <h3>Diagnosis</h3>
        <p>{calc.issue}</p>
        <p>{calc.advice}</p>
      </div>
    </main>
  );
}
