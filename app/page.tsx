"use client";

import { useState, useMemo } from "react";

export default function Page() {
  const [hp, setHp] = useState(10000);
  const [armor, setArmor] = useState(12000);
  const [dodge, setDodge] = useState(10);
  const [parry, setParry] = useState(10);
  const [block, setBlock] = useState(15);
  const [blockValue, setBlockValue] = useState(300);

  const result = useMemo(() => {
    const avoidance = dodge + parry;

    // Formule simplifiée armor (WoW-like)
    const armorReduction = armor / (armor + 4000);

    const physicalReduction = armorReduction * 100;
    const magicalReduction = 20; // placeholder

    const effectiveHp = hp / (1 - armorReduction);

    return {
      avoidance,
      physicalReduction,
      magicalReduction,
      effectiveHp,
    };
  }, [hp, armor, dodge, parry]);

  return (
    <main style={{ padding: 40, background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>
        🛡️ Ascension Tank Analyzer V2
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>

        {/* INPUTS */}
        <div style={{ background: "#1e293b", padding: 20, borderRadius: 10 }}>
          <h2>Stats</h2>

          {[
            ["HP", hp, setHp],
            ["Armor", armor, setArmor],
            ["Dodge %", dodge, setDodge],
            ["Parry %", parry, setParry],
            ["Block %", block, setBlock],
            ["Block Value", blockValue, setBlockValue],
          ].map(([label, value, setter]: any) => (
            <div key={label} style={{ marginTop: 15 }}>
              <label>{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: 8,
                  marginTop: 5,
                  background: "#020617",
                  border: "1px solid #334155",
                  color: "white",
                }}
              />
            </div>
          ))}
        </div>

        {/* RESULTS */}
        <div style={{ background: "#1e293b", padding: 20, borderRadius: 10 }}>
          <h2>Résultats</h2>

          <div style={{ marginTop: 20 }}>
            <strong>Avoidance :</strong> {result.avoidance.toFixed(1)}%
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Réduction physique :</strong>{" "}
            {result.physicalReduction.toFixed(1)}%
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Réduction magique :</strong>{" "}
            {result.magicalReduction.toFixed(1)}%
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Effective HP :</strong>{" "}
            {Math.round(result.effectiveHp).toLocaleString()}
          </div>

          {/* DIAGNOSTIC */}
          <div style={{ marginTop: 25 }}>
            <h3>Diagnostic</h3>

            {result.physicalReduction < 50 && (
              <div>⚠️ Ton armor est trop faible</div>
            )}

            {result.avoidance < 25 && (
              <div>⚠️ Ton avoidance est trop faible</div>
            )}

            {result.effectiveHp < 20000 && (
              <div>⚠️ Ton EHP est trop bas</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
