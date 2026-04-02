"use client";

import { useMemo, useState } from "react";

type PresetName = "block" | "bear" | "parry" | "mana";

type ToggleItem = {
  key: string;
  label: string;
  category: "stances" | "cooldowns" | "mystics";
};

type CalcState = {
  hp: number;
  armor: number;
  dodge: number;
  parry: number;
  blockChance: number;
  blockValue: number;
  basePhysicalDr: number;
  baseGlobalDr: number;
  baseMagicDr: number;
  absorb: number;
  physicalHit: number;
  magicalHit: number;
  fierceBlow: number;
  fierceBlockEfficiency: number;
  fierceAbsorbEfficiency: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function armorReductionPct(armor: number, k = 4000) {
  return (armor / (armor + k)) * 100;
}

function barGradient(type: "physical" | "magic" | "fierce") {
  if (type === "physical") return "linear-gradient(90deg, #38bdf8, #2563eb)";
  if (type === "magic") return "linear-gradient(90deg, #a78bfa, #7c3aed)";
  return "linear-gradient(90deg, #fb7185, #dc2626)";
}

const DEFAULT_STATE: CalcState = {
  hp: 10000,
  armor: 12000,
  dodge: 10,
  parry: 10,
  blockChance: 15,
  blockValue: 300,
  basePhysicalDr: 0,
  baseGlobalDr: 0,
  baseMagicDr: 0,
  absorb: 0,
  physicalHit: 6000,
  magicalHit: 5000,
  fierceBlow: 9000,
  fierceBlockEfficiency: 50,
  fierceAbsorbEfficiency: 50,
};

const TOGGLES: ToggleItem[] = [
  { key: "defensiveStance", label: "Defensive Stance", category: "stances" },
  { key: "bearForm", label: "Bear Form", category: "stances" },
  { key: "righteousFury", label: "Righteous Fury", category: "stances" },
  { key: "manaForgedBarrier", label: "Mana-Forged Barrier", category: "stances" },

  { key: "shieldWall", label: "Shield Wall", category: "cooldowns" },
  { key: "barkskin", label: "Barkskin", category: "cooldowns" },

  { key: "carnageIncarnate", label: "Carnage Incarnate", category: "mystics" },
  { key: "relentless", label: "Relentless", category: "mystics" },
  { key: "crimsonChampion", label: "Crimson Champion", category: "mystics" },
];

const PRESETS: Record<
  PresetName,
  {
    state: CalcState;
    toggles: Record<string, boolean>;
  }
> = {
  block: {
    state: {
      ...DEFAULT_STATE,
      hp: 11000,
      armor: 14000,
      dodge: 8,
      parry: 12,
      blockChance: 28,
      blockValue: 550,
      baseGlobalDr: 2,
    },
    toggles: {
      defensiveStance: true,
      bearForm: false,
      righteousFury: true,
      manaForgedBarrier: false,
      shieldWall: false,
      barkskin: false,
      carnageIncarnate: false,
      relentless: true,
      crimsonChampion: true,
    },
  },
  bear: {
    state: {
      ...DEFAULT_STATE,
      hp: 15000,
      armor: 16500,
      dodge: 14,
      parry: 6,
      blockChance: 0,
      blockValue: 0,
      basePhysicalDr: 2,
      baseGlobalDr: 2,
    },
    toggles: {
      defensiveStance: false,
      bearForm: true,
      righteousFury: false,
      manaForgedBarrier: false,
      shieldWall: false,
      barkskin: true,
      carnageIncarnate: true,
      relentless: false,
      crimsonChampion: false,
    },
  },
  parry: {
    state: {
      ...DEFAULT_STATE,
      hp: 10500,
      armor: 12500,
      dodge: 10,
      parry: 24,
      blockChance: 8,
      blockValue: 180,
      baseGlobalDr: 2,
    },
    toggles: {
      defensiveStance: true,
      bearForm: false,
      righteousFury: false,
      manaForgedBarrier: false,
      shieldWall: false,
      barkskin: false,
      carnageIncarnate: false,
      relentless: true,
      crimsonChampion: false,
    },
  },
  mana: {
    state: {
      ...DEFAULT_STATE,
      hp: 9500,
      armor: 10000,
      dodge: 9,
      parry: 8,
      blockChance: 12,
      blockValue: 220,
      baseMagicDr: 10,
      absorb: 1200,
    },
    toggles: {
      defensiveStance: false,
      bearForm: false,
      righteousFury: false,
      manaForgedBarrier: true,
      shieldWall: false,
      barkskin: false,
      carnageIncarnate: false,
      relentless: false,
      crimsonChampion: false,
    },
  },
};

export default function CalculatorPage() {
  const [state, setState] = useState<CalcState>(DEFAULT_STATE);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    defensiveStance: false,
    bearForm: false,
    righteousFury: false,
    manaForgedBarrier: false,
    shieldWall: false,
    barkskin: false,
    carnageIncarnate: false,
    relentless: false,
    crimsonChampion: false,
  });

  function applyPreset(name: PresetName) {
    setState(PRESETS[name].state);
    setToggles(PRESETS[name].toggles);
  }

  function updateField<K extends keyof CalcState>(key: K, value: number) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function updateToggle(key: string, value: boolean) {
    setToggles((prev) => ({ ...prev, [key]: value }));
  }

  const calc = useMemo(() => {
    let finalArmor = state.armor;
    let stanceArmorPct = 0;

    let physicalDr = state.basePhysicalDr;
    let globalDr = state.baseGlobalDr;
    let magicDr = state.baseMagicDr;

    let finalAbsorb = state.absorb;
    let finalBlockChance = state.blockChance;
    let finalBlockValue = state.blockValue;
    let fierceBlockBonus = 0;

    if (toggles.defensiveStance) {
      stanceArmorPct += 10;
      globalDr += 5;
    }

    if (toggles.bearForm) {
      stanceArmorPct += 30;
    }

    if (toggles.righteousFury) {
      stanceArmorPct += 10;
      fierceBlockBonus += 20;
    }

    if (toggles.manaForgedBarrier) {
      finalAbsorb += 800;
      magicDr += 10;
    }

    if (toggles.shieldWall) {
      globalDr += 60;
    }

    if (toggles.barkskin) {
      globalDr += 15;
    }

    if (toggles.carnageIncarnate) {
      physicalDr += 15;
    }

    if (toggles.relentless) {
      globalDr += 8;
    }

    if (toggles.crimsonChampion) {
      finalBlockChance += 10;
      finalBlockValue *= 1.15;
    }

    finalArmor *= 1 + stanceArmorPct / 100;

    globalDr = clamp(globalDr, 0, 90);
    magicDr = clamp(magicDr, 0, 90);
    physicalDr = clamp(physicalDr, 0, 90);
    finalBlockChance = clamp(finalBlockChance, 0, 95);

    const avoidance = clamp(state.dodge + state.parry, 0, 100);
    const armorDr = armorReductionPct(finalArmor);

    const physicalAfterArmor = state.physicalHit * (1 - armorDr / 100);
    const physicalAfterPhysicalDr = physicalAfterArmor * (1 - physicalDr / 100);
    const physicalAfterGlobalDr = physicalAfterPhysicalDr * (1 - globalDr / 100);

    const averageBlockReduction =
      Math.min(finalBlockValue, physicalAfterGlobalDr) * (finalBlockChance / 100);

    const physicalAverage = Math.max(
      0,
      physicalAfterGlobalDr - averageBlockReduction - finalAbsorb
    );
    const physicalWorst = Math.max(0, physicalAfterGlobalDr - finalAbsorb);

    const magicalAfterMagicDr = state.magicalHit * (1 - magicDr / 100);
    const magicalAfterGlobalDr = magicalAfterMagicDr * (1 - globalDr / 100);
    const magicalAverage = Math.max(0, magicalAfterGlobalDr - finalAbsorb);

    const fierceAfterArmor = state.fierceBlow * (1 - armorDr / 100);
    const fierceAfterPhysicalDr = fierceAfterArmor * (1 - physicalDr / 100);
    const fierceAfterGlobalDr = fierceAfterPhysicalDr * (1 - globalDr / 100);

    const fierceBlockChance = clamp(finalBlockChance + fierceBlockBonus, 0, 100);
    const fierceBlockValue = finalBlockValue * (state.fierceBlockEfficiency / 100);
    const fierceAbsorb = finalAbsorb * (state.fierceAbsorbEfficiency / 100);

    const fierceAverageBlockReduction =
      Math.min(fierceBlockValue, fierceAfterGlobalDr) * (fierceBlockChance / 100);

    const fierceAverage = Math.max(
      0,
      fierceAfterGlobalDr - fierceAverageBlockReduction - fierceAbsorb
    );
    const fierceWorst = Math.max(0, fierceAfterGlobalDr - fierceAbsorb);

    const physicalReduction = clamp(
      (1 - physicalAverage / Math.max(1, state.physicalHit)) * 100,
      0,
      99
    );
    const magicalReduction = clamp(
      (1 - magicalAverage / Math.max(1, state.magicalHit)) * 100,
      0,
      99
    );
    const fierceReduction = clamp(
      (1 - fierceAverage / Math.max(1, state.fierceBlow)) * 100,
      0,
      99
    );

    let tankProfile = "Hybrid Tank";
    if (finalBlockChance >= 22 && finalBlockValue >= state.physicalHit * 0.08) {
      tankProfile = "Block Tank";
    } else if (state.parry >= state.dodge + 5) {
      tankProfile = "Parry Tank";
    } else if (state.hp >= 14000 && finalArmor >= 15000) {
      tankProfile = "Bear / EHP Tank";
    } else if (toggles.manaForgedBarrier || finalAbsorb >= 1000) {
      tankProfile = "Mana / Absorb Tank";
    }

    let priority = "No obvious priority.";
    if (fierceReduction < 35 && finalBlockValue < state.physicalHit * 0.08) {
      priority = "Increase block value first.";
    } else if (fierceReduction < 35) {
      priority = "Improve physical mitigation against burst.";
    } else if (physicalReduction < 50) {
      priority = "Improve armor, physical DR, or global DR.";
    } else if (magicalReduction < 20) {
      priority = "Improve magical survival.";
    }

    return {
      tankProfile,
      priority,
      avoidance,
      armorDr,
      physicalDr,
      globalDr,
      magicDr,
      finalAbsorb,
      finalBlockChance,
      finalBlockValue,
      physicalReduction,
      magicalReduction,
      fierceReduction,
      physicalAverage,
      physicalWorst,
      magicalAverage,
      fierceAverage,
      fierceWorst,
    };
  }, [state, toggles]);

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
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 12px 34px rgba(0,0,0,0.25)",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const sectionTitleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 14,
    fontSize: 18,
  };

  const labelStyle: React.CSSProperties = {
    color: "#cbd5e1",
    fontSize: 14,
  };

  const groupedToggles = {
    stances: TOGGLES.filter((x) => x.category === "stances"),
    cooldowns: TOGGLES.filter((x) => x.category === "cooldowns"),
    mystics: TOGGLES.filter((x) => x.category === "mystics"),
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(59,130,246,0.16), transparent 18%), radial-gradient(circle at bottom left, rgba(168,85,247,0.12), transparent 18%), #020617",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gap: 24 }}>
        <section
          style={{
            ...cardStyle,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
            padding: 28,
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
            Calculator — V11
          </div>

          <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.05 }}>
            Cleaner structure, better readability, stronger foundation.
          </h1>

          <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 17, maxWidth: 900, marginTop: 14 }}>
            This version focuses on maintainability and clarity: cleaner toggle groups,
            internal preset data, better visual hierarchy, and a more polished calculator
            without adding fragile complexity.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <button style={buttonStyle} onClick={() => applyPreset("block")}>Block Tank</button>
            <button style={buttonStyle} onClick={() => applyPreset("bear")}>Bear / EHP Tank</button>
            <button style={buttonStyle} onClick={() => applyPreset("parry")}>Parry Tank</button>
            <button style={buttonStyle} onClick={() => applyPreset("mana")}>Mana / Absorb Tank</button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.08fr 0.92fr",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Core Stats</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  ["HP", "hp"],
                  ["Armor", "armor"],
                  ["Dodge %", "dodge"],
                  ["Parry %", "parry"],
                  ["Block %", "blockChance"],
                  ["Block Value", "blockValue"],
                  ["Physical DR %", "basePhysicalDr"],
                  ["Global DR %", "baseGlobalDr"],
                  ["Magic DR %", "baseMagicDr"],
                  ["Absorb", "absorb"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={state[key as keyof CalcState] as number}
                      onChange={(e) =>
                        updateField(key as keyof CalcState, Number(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Simulation</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  ["Physical Hit", "physicalHit"],
                  ["Magical Hit", "magicalHit"],
                  ["Fierce Blow", "fierceBlow"],
                  ["Fierce Block Efficiency %", "fierceBlockEfficiency"],
                  ["Fierce Absorb Efficiency %", "fierceAbsorbEfficiency"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={state[key as keyof CalcState] as number}
                      onChange={(e) =>
                        updateField(key as keyof CalcState, Number(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Stances / Forms</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {groupedToggles.stances.map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(51,65,85,0.55)",
                      padding: 12,
                      borderRadius: 12,
                    }}
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={toggles[item.key]}
                      onChange={(e) => updateToggle(item.key, e.target.checked)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Cooldowns</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {groupedToggles.cooldowns.map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(51,65,85,0.55)",
                      padding: 12,
                      borderRadius: 12,
                    }}
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={toggles[item.key]}
                      onChange={(e) => updateToggle(item.key, e.target.checked)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Mystics</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {groupedToggles.mystics.map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(51,65,85,0.55)",
                      padding: 12,
                      borderRadius: 12,
                    }}
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={toggles[item.key]}
                      onChange={(e) => updateToggle(item.key, e.target.checked)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>Detected Profile</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
                {calc.tankProfile}
              </div>
              <div style={{ marginTop: 12, color: "#cbd5e1" }}>
                Current Priority: <strong>{calc.priority}</strong>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Defensive Layers</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>Armor DR: <strong>{calc.armorDr.toFixed(1)}%</strong></div>
                <div>Physical DR: <strong>{calc.physicalDr.toFixed(1)}%</strong></div>
                <div>Global DR: <strong>{calc.globalDr.toFixed(1)}%</strong></div>
                <div>Magic DR: <strong>{calc.magicDr.toFixed(1)}%</strong></div>
                <div>Final Block Chance: <strong>{calc.finalBlockChance.toFixed(1)}%</strong></div>
                <div>Final Block Value: <strong>{Math.round(calc.finalBlockValue).toLocaleString()}</strong></div>
                <div>Final Absorb: <strong>{Math.round(calc.finalAbsorb).toLocaleString()}</strong></div>
              </div>
            </div>

            {[
              { label: "Physical Mitigation", value: calc.physicalReduction, type: "physical" as const },
              { label: "Magical Mitigation", value: calc.magicalReduction, type: "magic" as const },
              { label: "Fierce Blow", value: calc.fierceReduction, type: "fierce" as const },
            ].map((item) => (
              <div key={item.label} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
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
                      background: barGradient(item.type),
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Average / Worst Case</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>Average Physical Hit: <strong>{Math.round(calc.physicalAverage).toLocaleString()}</strong></div>
                <div>Worst Physical Hit: <strong>{Math.round(calc.physicalWorst).toLocaleString()}</strong></div>
                <div>Average Magical Hit: <strong>{Math.round(calc.magicalAverage).toLocaleString()}</strong></div>
                <div>Average Fierce Blow: <strong>{Math.round(calc.fierceAverage).toLocaleString()}</strong></div>
                <div>Worst Fierce Blow: <strong>{Math.round(calc.fierceWorst).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
