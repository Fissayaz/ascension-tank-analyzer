"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type TankType = "classic" | "mind_over_matter";

type State = {
  tankType: TankType;

  hp: number;

  armor: number;
  armorDR: number;

  defenseCurrent: number;
  defenseBase: number;

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
};

const DEFAULT: State = {
  tankType: "classic",

  hp: 12000,

  armor: 15000,
  armorDR: 50,

  defenseCurrent: 540,
  defenseBase: 400,

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
};

export default function Page() {
  const [s, setS] = useState<State>(DEFAULT);

  function setField<K extends keyof State>(k: K, v: State[K]) {
    setS((prev) => ({ ...prev, [k]: v }));
  }

  const r = useMemo(() => {
    const defenseDelta = Math.max(0, s.defenseCurrent - s.defenseBase);

    const armorDR = clamp(s.armorDR, 0, 95);
    const physicalDR = clamp(s.physicalDR, 0, 95);
    const globalDR = clamp(s.globalDR, 0, 95);
    const magicDR = clamp(s.magicDR, 0, 95);

    const dodge = clamp(s.dodge, 0, 100);
    const parry = clamp(s.parry, 0, 100);
    const block = clamp(s.block, 0, 100);

    let missFromDefense = 0;
    let totalCTC = 0;
    let capped = false;
    let whiteCoverageLabel = "";
    let whiteAverageTaken = 0;
    let whiteWorstTaken = 0;
    let whiteBlockedValue = 0;
    let whiteUnblockedValue = 0;

    const whiteAfterArmor = s.whiteHit * (1 - armorDR / 100);
    const whiteAfterPhysical = whiteAfterArmor * (1 - physicalDR / 100);
    const whiteAfterGlobal = whiteAfterPhysical * (1 - globalDR / 100);

    const fierceAfterArmor = s.fierceBlow * (1 - armorDR / 100);
    const fierceAfterPhysical = fierceAfterArmor * (1 - physicalDR / 100);
    const fierceAfterGlobal = fierceAfterPhysical * (1 - globalDR / 100);

    const magicAfterMagic = s.magicHit * (1 - magicDR / 100);
    const magicAfterGlobal = magicAfterMagic * (1 - globalDR / 100);

    if (s.tankType === "classic") {
      missFromDefense = 5 + defenseDelta * 0.04;
      totalCTC = dodge + parry + block + missFromDefense;
      capped = totalCTC >= 102.4;

      whiteBlockedValue = Math.max(
        0,
        whiteAfterGlobal - Math.min(s.blockValue, whiteAfterGlobal) - s.absorb
      );
      whiteUnblockedValue = Math.max(0, whiteAfterGlobal - s.absorb);

      const missChance = clamp(missFromDefense, 0, 100);
      const dodgeChance = clamp(dodge, 0, 100);
      const parryChance = clamp(parry, 0, 100);
      const blockChance = clamp(block, 0, 100);

      const remainingHitChance = Math.max(
        0,
        100 - (missChance + dodgeChance + parryChance + blockChance)
      );

      whiteAverageTaken = capped
        ? 0
        : Math.max(
            0,
            (whiteBlockedValue * blockChance +
              whiteUnblockedValue * remainingHitChance) /
              100
          );

      whiteWorstTaken = capped ? 0 : whiteUnblockedValue;
      whiteCoverageLabel = capped
        ? "CTC-capped against white swings"
        : "Not CTC-capped against white swings";
    } else {
      // Mind over Matter:
      // Based on your logs, this behaves like MISS-only white coverage.
      // No dodge/parry/block coverage is used here.
      missFromDefense = defenseDelta * 0.04;
      totalCTC = missFromDefense;
      capped = false;

      whiteUnblockedValue = Math.max(0, whiteAfterGlobal - s.absorb);

      const missChance = clamp(missFromDefense, 0, 100);
      const hitChance = Math.max(0, 100 - missChance);

      whiteAverageTaken = (whiteUnblockedValue * hitChance) / 100;
      whiteWorstTaken = whiteUnblockedValue;

      whiteCoverageLabel = "Mind over Matter white-swing model";
    }

    const fierceFinal = Math.max(0, fierceAfterGlobal - s.absorb);
    const magicFinal = Math.max(0, magicAfterGlobal - s.absorb);

    const issues: string[] = [];
    const rec: string[] = [];

    if (s.tankType === "classic") {
      if (capped) {
        issues.push("You are CTC-capped against white swings.");
      } else {
        issues.push("You are not CTC-capped against white swings.");
        rec.push("Increase dodge, parry, block, or defense.");
      }
    } else {
      issues.push(
        "Mind over Matter is modeled as miss-based white swing coverage."
      );
      issues.push(
        "This setup is excellent against white swings but does not avoid burst abilities."
      );
      rec.push("Treat burst survival separately from white swing coverage.");
    }

    if (fierceFinal > s.hp * 0.6) {
      issues.push("Fierce Blow burst is dangerous.");
      rec.push("Increase armor DR, absorb, physical DR, global DR, or health.");
    }

    if (magicFinal > s.hp * 0.35) {
      issues.push("Magic damage is a meaningful weakness.");
      rec.push("Increase magic DR, global DR, absorb, or health.");
    }

    if (s.tankType === "mind_over_matter" && missFromDefense < 70) {
      rec.push("Increase defense if you want stronger Mind over Matter coverage.");
    }

    if (rec.length === 0) {
      rec.push("No major weakness detected from current inputs.");
    }

    return {
      defenseDelta,
      missFromDefense,
      totalCTC,
      capped,
      whiteCoverageLabel,
      whiteAverageTaken,
      whiteWorstTaken,
      whiteBlockedValue,
      whiteUnblockedValue,
      fierceFinal,
      magicFinal,
      issues,
      rec,
    };
  }, [s]);

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

  const sectionTitleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 14,
    fontSize: 18,
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
      {sub ? (
        <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 6 }}>{sub}</div>
      ) : null}
    </div>
  );

  const progressBar = (
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

  const input = (label: string, key: keyof State) => (
    <div key={key}>
      <label style={labelStyle}>{label}</label>
      <input
        style={inputStyle}
        type="number"
        value={typeof s[key] === "number" ? s[key] : 0}
        onChange={(e) => setField(key, Number(e.target.value) as State[typeof key])}
      />
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
            Calculator — V13
          </div>

          <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.05 }}>
            Tank model selection: Classic CTC or Mind over Matter.
          </h1>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.7,
              fontSize: 17,
              maxWidth: 960,
              marginTop: 14,
            }}
          >
            This version supports two defensive models. Classic tanks are evaluated
            through white swing CTC coverage. Mind over Matter tanks are evaluated
            through miss-based white swing coverage and separate burst survival.
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
              <h2 style={sectionTitleStyle}>Tank Type</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => setField("tankType", "classic")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(148,163,184,0.2)",
                    background:
                      s.tankType === "classic"
                        ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                        : "rgba(30,41,59,0.7)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Classic Tank
                </button>
                <button
                  onClick={() => setField("tankType", "mind_over_matter")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(148,163,184,0.2)",
                    background:
                      s.tankType === "mind_over_matter"
                        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                        : "rgba(30,41,59,0.7)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Mind over Matter
                </button>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Character Stats</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {input("Health", "hp")}
                {input("Armor (from sheet)", "armor")}
                {input("Armor DR % (from game)", "armorDR")}
                {input("Defense Current", "defenseCurrent")}
                {input("Defense Base", "defenseBase")}
                {input("Dodge %", "dodge")}
                {input("Parry %", "parry")}
                {input("Block %", "block")}
                {input("Block Value", "blockValue")}
                {input("Physical DR %", "physicalDR")}
                {input("Global DR %", "globalDR")}
                {input("Magic DR %", "magicDR")}
                {input("Absorb", "absorb")}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Encounter Inputs</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {input("White Hit", "whiteHit")}
                {input("Fierce Blow", "fierceBlow")}
                {input("Magic Hit", "magicHit")}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Notes</h2>
              <div style={{ display: "grid", gap: 8, color: "#cbd5e1", lineHeight: 1.6 }}>
                {s.tankType === "classic" ? (
                  <>
                    <div>
                      <strong>Classic mode:</strong> white swings are evaluated with
                      dodge, parry, block, base miss, and defense-based miss.
                    </div>
                    <div>
                      <strong>Important:</strong> Fierce Blow is still treated
                      separately from white swing coverage.
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>Mind over Matter mode:</strong> modeled from your logs as
                      miss-based white swing coverage.
                    </div>
                    <div>
                      <strong>Important:</strong> burst abilities are treated as always
                      connecting, so survival depends on DR, absorb, and health.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>White Swing Model</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                {r.whiteCoverageLabel}
              </div>
              <div style={{ marginTop: 12, color: "#cbd5e1" }}>
                Coverage Value: <strong>{r.totalCTC.toFixed(2)}</strong>
                {s.tankType === "classic" ? " / 102.4" : "% miss-based"}
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
                "Defense Delta",
                `${r.defenseDelta}`,
                "Current defense minus base defense"
              )}
              {metricCard(
                s.tankType === "classic" ? "Miss from Defense" : "Miss from Defense",
                `${r.missFromDefense.toFixed(2)}%`,
                s.tankType === "classic"
                  ? "Base miss + defense contribution"
                  : "Mind over Matter white swing miss model"
              )}
              {metricCard(
                "White Avg Taken",
                `${Math.round(r.whiteAverageTaken)}`,
                "Expected average white swing damage taken"
              )}
              {metricCard(
                "White Worst Taken",
                `${Math.round(r.whiteWorstTaken)}`,
                "Worst white hit that gets through"
              )}
            </div>

            {progressBar(
              s.tankType === "classic" ? "CTC Progress" : "Miss Coverage",
              s.tankType === "classic"
                ? (r.totalCTC / 102.4) * 100
                : r.totalCTC,
              s.tankType === "classic"
                ? "linear-gradient(90deg, #22c55e, #16a34a)"
                : "linear-gradient(90deg, #a78bfa, #7c3aed)",
              s.tankType === "classic"
                ? r.capped
                  ? "You are capped against standard white swings."
                  : "You still have white swing coverage missing."
                : "Mind over Matter is treated as white swing miss coverage."
            )}

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Burst Survival</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  Fierce Blow Taken:{" "}
                  <strong>{Math.round(r.fierceFinal).toLocaleString()}</strong>
                </div>
                <div>
                  Magic Hit Taken:{" "}
                  <strong>{Math.round(r.magicFinal).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {progressBar(
              "Burst vs Health",
              (r.fierceFinal / Math.max(1, s.hp)) * 100,
              "linear-gradient(90deg, #fb7185, #dc2626)",
              "Measures how much of your health one burst hit consumes."
            )}

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Diagnosis</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {r.issues.map((issue) => (
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
                {r.rec.map((item) => (
                  <div
                    key={item}
                    style={{
                      background: "rgba(30,41,59,0.55)",
                      borderRadius: 12,
                      padding: 12,
                      color: "#cbd5e1",
                    }}
                  >
                    {item}
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
