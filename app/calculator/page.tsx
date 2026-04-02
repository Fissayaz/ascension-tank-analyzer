"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Working approximation for Ascension burst calculations.
// White swing coverage uses the validated macro-style CTC logic.
// Burst math remains adjustable as more logs are collected.
function armorReductionPct(armor: number, k = 4000) {
  return (armor / (armor + k)) * 100;
}

type CalculatorState = {
  hp: number;
  armor: number;
  defenseBonus: number;
  dodge: number;
  parry: number;
  block: number;
  blockValue: number;
  physicalDR: number;
  globalDR: number;
  magicDR: number;
  absorb: number;

  whiteHit: number;
  fierceBlow: number;
  magicHit: number;

  fierceBlockEfficiency: number;
  fierceAbsorbEfficiency: number;
};

const DEFAULT_STATE: CalculatorState = {
  hp: 12000,
  armor: 18000,
  defenseBonus: 228,
  dodge: 20,
  parry: 20,
  block: 20,
  blockValue: 500,
  physicalDR: 0,
  globalDR: 0,
  magicDR: 0,
  absorb: 0,

  whiteHit: 4000,
  fierceBlow: 9000,
  magicHit: 5000,

  fierceBlockEfficiency: 0,
  fierceAbsorbEfficiency: 0,
};

export default function CalculatorPage() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  function updateField<K extends keyof CalculatorState>(
    key: K,
    value: number
  ) {
    setState((prev) => ({
      ...prev,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  }

  const result = useMemo(() => {
    const dodge = clamp(state.dodge, 0, 100);
    const parry = clamp(state.parry, 0, 100);
    const block = clamp(state.block, 0, 100);

    const missFromDefense = 5 + state.defenseBonus * 0.04;
    const totalCTC = dodge + parry + block + missFromDefense;
    const ctcCapped = totalCTC >= 102.4;

    const armorDR = armorReductionPct(Math.max(0, state.armor));
    const physicalDR = clamp(state.physicalDR, 0, 95);
    const globalDR = clamp(state.globalDR, 0, 95);
    const magicDR = clamp(state.magicDR, 0, 95);

    // White swings
    const whiteAfterArmor = state.whiteHit * (1 - armorDR / 100);
    const whiteAfterPhysical = whiteAfterArmor * (1 - physicalDR / 100);
    const whiteAfterGlobal = whiteAfterPhysical * (1 - globalDR / 100);

    const whiteBlocked = Math.max(
      0,
      whiteAfterGlobal - Math.min(state.blockValue, whiteAfterGlobal)
    );
    const whiteUnblocked = Math.max(0, whiteAfterGlobal);

    const missChance = clamp(missFromDefense, 0, 100);
    const dodgeChance = clamp(dodge, 0, 100);
    const parryChance = clamp(parry, 0, 100);
    const blockChance = clamp(block, 0, 100);

    const whiteRemainingHitChance = Math.max(
      0,
      100 - (missChance + dodgeChance + parryChance + blockChance)
    );

    const whiteAverageTaken = ctcCapped
      ? 0
      : Math.max(
          0,
          (whiteBlocked * blockChance + whiteUnblocked * whiteRemainingHitChance) /
            100
        );

    const whiteWorstTaken = ctcCapped
      ? 0
      : Math.max(0, whiteUnblocked - state.absorb);

    // Magic hit
    const magicAfterMagic = state.magicHit * (1 - magicDR / 100);
    const magicAfterGlobal = magicAfterMagic * (1 - globalDR / 100);
    const magicFinal = Math.max(0, magicAfterGlobal - state.absorb);

    // Fierce Blow
    const fierceAfterArmor = state.fierceBlow * (1 - armorDR / 100);
    const fierceAfterPhysical = fierceAfterArmor * (1 - physicalDR / 100);
    const fierceAfterGlobal = fierceAfterPhysical * (1 - globalDR / 100);

    const fierceBlockValue =
      state.blockValue * (clamp(state.fierceBlockEfficiency, 0, 100) / 100);
    const fierceAbsorbValue =
      state.absorb * (clamp(state.fierceAbsorbEfficiency, 0, 100) / 100);

    const fierceBlocked = Math.max(
      0,
      fierceAfterGlobal - Math.min(fierceBlockValue, fierceAfterGlobal)
    );
    const fierceUnblocked = Math.max(0, fierceAfterGlobal - fierceAbsorbValue);

    const fierceAverageTaken = Math.max(
      0,
      (fierceBlocked * blockChance + fierceUnblocked * (100 - blockChance)) / 100
    );
    const fierceWorstTaken = Math.max(0, fierceAfterGlobal - fierceAbsorbValue);

    // Diagnostics
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (ctcCapped) {
      issues.push("You are CTC-capped against white swings.");
    } else {
      issues.push("You are not CTC-capped against white swings.");
      recommendations.push("Increase dodge, parry, block, or defense.");
    }

    if (fierceWorstTaken > state.hp * 0.6) {
      issues.push("Fierce Blow burst is dangerous.");
      recommendations.push("Increase armor, DR, absorb, or health.");
    }

    if (magicFinal > state.hp * 0.35) {
      issues.push("Magic damage is still a serious weakness.");
      recommendations.push("Increase magic DR, global DR, absorb, or health.");
    }

    if (!ctcCapped && whiteWorstTaken > state.hp * 0.2) {
      issues.push("White swing damage is still meaningful when hits go through.");
      recommendations.push("Reduce incoming white hit damage or finish CTC coverage.");
    }

    if (recommendations.length === 0) {
      recommendations.push("No major weakness detected from current inputs.");
    }

    return {
      missFromDefense,
      totalCTC,
      ctcCapped,
      armorDR,
      whiteAverageTaken,
      whiteWorstTaken,
      whiteBlocked,
      whiteUnblocked,
      magicFinal,
      fierceAverageTaken,
      fierceWorstTaken,
      issues,
      recommendations,
    };
  }, [state]);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 18%), radial-gradient(circle at bottom left, rgba(168,85,247,0.10), transparent 18%), #020617",
    color: "white",
    padding: 32,
    fontFamily: "Arial, sans-serif",
  };

  const shellStyle: React.CSSProperties = {
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gap: 24,
  };

  const heroStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.88))",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
  };

  const sectionTitleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 14,
    fontSize: 18,
  };

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

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    color: "#cbd5e1",
  };

  const metricCard = (label: string, value: string, sub?: string) => (
    <div
      style={{
        background: "rgba(30,41,59,0.55)",
        border: "1px solid rgba(148,163,184,0.12)",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 13, color: "#94a3b8" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{value}</div>
      {sub ? <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 6 }}>{sub}</div> : null}
    </div>
  );

  const barBlock = (
    label: string,
    value: number,
    color: string,
    helper?: string
  ) => (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          gap: 12,
        }}
      >
        <span>{label}</span>
        <strong>{value.toFixed(1)}%</strong>
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
            width: `${clamp(value, 0, 100)}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
      {helper ? (
        <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>{helper}</div>
      ) : null}
    </div>
  );

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroStyle}>
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
            Calculator — V12
          </div>

          <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.05 }}>
            White Swing CTC and Burst Survival, separated properly.
          </h1>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.7,
              fontSize: 17,
              maxWidth: 940,
              marginTop: 14,
            }}
          >
            This calculator is intentionally focused on real in-game sheet values.
            White swing coverage and Fierce Blow survival are treated as separate
            problems, because being CTC-capped does not automatically make you safe
            against burst.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Character Stats</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  ["Health", "hp"],
                  ["Armor", "armor"],
                  ["Defense Bonus", "defenseBonus"],
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
                    <label style={labelStyle}>{label}</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={state[key as keyof CalculatorState] as number}
                      onChange={(e) =>
                        updateField(
                          key as keyof CalculatorState,
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Encounter Inputs</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  ["White Hit", "whiteHit"],
                  ["Fierce Blow", "fierceBlow"],
                  ["Magic Hit", "magicHit"],
                  ["Fierce Block Efficiency %", "fierceBlockEfficiency"],
                  ["Fierce Absorb Efficiency %", "fierceAbsorbEfficiency"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={state[key as keyof CalculatorState] as number}
                      onChange={(e) =>
                        updateField(
                          key as keyof CalculatorState,
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>How this version thinks</h2>
              <div style={{ display: "grid", gap: 8, color: "#cbd5e1", lineHeight: 1.6 }}>
                <div>
                  <strong>White swings:</strong> handled through CTC logic using dodge,
                  parry, block, base miss, and defense-derived miss.
                </div>
                <div>
                  <strong>Fierce Blow:</strong> treated separately as burst, because logs
                  show it is not protected by standard white-swing coverage.
                </div>
                <div>
                  <strong>Absorb:</strong> treated as a later defensive layer, especially
                  important for burst testing.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>White Swing Coverage</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                {result.ctcCapped ? "CTC-Capped" : "Not CTC-Capped"}
              </div>
              <div style={{ marginTop: 12, color: "#cbd5e1" }}>
                Total CTC: <strong>{result.totalCTC.toFixed(2)} / 102.4</strong>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {metricCard(
                "Miss from Defense",
                `${result.missFromDefense.toFixed(2)}%`,
                "Base miss + defense contribution"
              )}
              {metricCard(
                "Armor DR",
                `${result.armorDR.toFixed(1)}%`,
                "Working burst approximation"
              )}
              {metricCard(
                "White Avg Taken",
                `${Math.round(result.whiteAverageTaken)}`,
                result.ctcCapped ? "Expected to be zero for normal white swings" : "Average white-swing damage taken"
              )}
              {metricCard(
                "White Worst Taken",
                `${Math.round(result.whiteWorstTaken)}`,
                result.ctcCapped ? "Expected to be zero for normal white swings" : "Worst unavoided white hit"
              )}
            </div>

            {barBlock(
              "CTC Progress",
              (result.totalCTC / 102.4) * 100,
              "linear-gradient(90deg, #22c55e, #16a34a)",
              result.ctcCapped
                ? "You are capped against standard white swings."
                : "You still have white-swing coverage missing."
            )}

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Burst Survival</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  Average Fierce Blow Taken:{" "}
                  <strong>{Math.round(result.fierceAverageTaken).toLocaleString()}</strong>
                </div>
                <div>
                  Worst Fierce Blow Taken:{" "}
                  <strong>{Math.round(result.fierceWorstTaken).toLocaleString()}</strong>
                </div>
                <div>
                  Magic Hit Taken:{" "}
                  <strong>{Math.round(result.magicFinal).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {barBlock(
              "Burst vs Health",
              (result.fierceWorstTaken / Math.max(1, state.hp)) * 100,
              "linear-gradient(90deg, #fb7185, #dc2626)",
              "Measures how much of your health one worst-case Fierce Blow consumes."
            )}

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Diagnosis</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {result.issues.map((issue) => (
                  <div
                    key={issue}
                    style={{
                      background: "rgba(51,65,85,0.55)",
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    {issue}
                  </div>
                ))}
              </div>

              <h3 style={{ marginTop: 18, marginBottom: 10 }}>Recommendations</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {result.recommendations.map((rec) => (
                  <div
                    key={rec}
                    style={{
                      background: "rgba(30,41,59,0.55)",
                      borderRadius: 12,
                      padding: 12,
                      color: "#cbd5e1",
                    }}
                  >
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
