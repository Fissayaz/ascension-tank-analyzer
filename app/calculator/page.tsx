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

type PresetName = "block" | "bear" | "parry" | "mana";

export default function CalculatorPage() {
  const [hp, setHp] = useState(10000);
  const [armor, setArmor] = useState(12000);
  const [dodge, setDodge] = useState(10);
  const [parry, setParry] = useState(10);
  const [blockChance, setBlockChance] = useState(15);
  const [blockValue, setBlockValue] = useState(300);

  const [basePhysicalDr, setBasePhysicalDr] = useState(0);
  const [baseGlobalDr, setBaseGlobalDr] = useState(0);
  const [baseMagicDr, setBaseMagicDr] = useState(0);
  const [absorb, setAbsorb] = useState(0);

  const [physicalHit, setPhysicalHit] = useState(6000);
  const [magicalHit, setMagicalHit] = useState(5000);
  const [fierceBlow, setFierceBlow] = useState(9000);

  const [fierceBlockEfficiency, setFierceBlockEfficiency] = useState(50);
  const [fierceAbsorbEfficiency, setFierceAbsorbEfficiency] = useState(50);

  const [defensiveStance, setDefensiveStance] = useState(false);
  const [bearForm, setBearForm] = useState(false);
  const [righteousFury, setRighteousFury] = useState(false);
  const [manaForgedBarrier, setManaForgedBarrier] = useState(false);

  const [shieldWall, setShieldWall] = useState(false);
  const [barkskin, setBarkskin] = useState(false);

  const [carnageIncarnate, setCarnageIncarnate] = useState(false);
  const [relentless, setRelentless] = useState(false);
  const [crimsonChampion, setCrimsonChampion] = useState(false);

  function applyPreset(name: PresetName) {
    if (name === "block") {
      setHp(11000);
      setArmor(14000);
      setDodge(8);
      setParry(12);
      setBlockChance(28);
      setBlockValue(550);
      setBasePhysicalDr(0);
      setBaseGlobalDr(2);
      setBaseMagicDr(0);
      setAbsorb(0);
      setDefensiveStance(true);
      setBearForm(false);
      setRighteousFury(true);
      setManaForgedBarrier(false);
      setShieldWall(false);
      setBarkskin(false);
      setCarnageIncarnate(false);
      setRelentless(true);
      setCrimsonChampion(true);
    }

    if (name === "bear") {
      setHp(15000);
      setArmor(16500);
      setDodge(14);
      setParry(6);
      setBlockChance(0);
      setBlockValue(0);
      setBasePhysicalDr(2);
      setBaseGlobalDr(2);
      setBaseMagicDr(0);
      setAbsorb(0);
      setDefensiveStance(false);
      setBearForm(true);
      setRighteousFury(false);
      setManaForgedBarrier(false);
      setShieldWall(false);
      setBarkskin(true);
      setCarnageIncarnate(true);
      setRelentless(false);
      setCrimsonChampion(false);
    }

    if (name === "parry") {
      setHp(10500);
      setArmor(12500);
      setDodge(10);
      setParry(24);
      setBlockChance(8);
      setBlockValue(180);
      setBasePhysicalDr(0);
      setBaseGlobalDr(2);
      setBaseMagicDr(0);
      setAbsorb(0);
      setDefensiveStance(true);
      setBearForm(false);
      setRighteousFury(false);
      setManaForgedBarrier(false);
      setShieldWall(false);
      setBarkskin(false);
      setCarnageIncarnate(false);
      setRelentless(true);
      setCrimsonChampion(false);
    }

    if (name === "mana") {
      setHp(9500);
      setArmor(10000);
      setDodge(9);
      setParry(8);
      setBlockChance(12);
      setBlockValue(220);
      setBasePhysicalDr(0);
      setBaseGlobalDr(0);
      setBaseMagicDr(10);
      setAbsorb(1200);
      setDefensiveStance(false);
      setBearForm(false);
      setRighteousFury(false);
      setManaForgedBarrier(true);
      setShieldWall(false);
      setBarkskin(false);
      setCarnageIncarnate(false);
      setRelentless(false);
      setCrimsonChampion(false);
    }
  }

  const calc = useMemo(() => {
    let finalArmor = armor;
    let stanceArmorPct = 0;

    let physicalDr = basePhysicalDr;
    let globalDr = baseGlobalDr;
    let magicDr = baseMagicDr;

    let finalAbsorb = absorb;
    let finalBlockChance = blockChance;
    let finalBlockValue = blockValue;
    let fierceBlockBonus = 0;

    if (defensiveStance) {
      stanceArmorPct += 10;
      globalDr += 5;
    }

    if (bearForm) {
      stanceArmorPct += 30;
    }

    if (righteousFury) {
      stanceArmorPct += 10;
      fierceBlockBonus += 20;
    }

    if (manaForgedBarrier) {
      finalAbsorb += 800;
      magicDr += 10;
    }

    if (shieldWall) {
      globalDr += 60;
    }

    if (barkskin) {
      globalDr += 15;
    }

    if (carnageIncarnate) {
      physicalDr += 15;
    }

    if (relentless) {
      globalDr += 8;
    }

    if (crimsonChampion) {
      finalBlockChance += 10;
      finalBlockValue *= 1.15;
    }

    finalArmor *= 1 + stanceArmorPct / 100;

    globalDr = clamp(globalDr, 0, 90);
    magicDr = clamp(magicDr, 0, 90);
    physicalDr = clamp(physicalDr, 0, 90);
    finalBlockChance = clamp(finalBlockChance, 0, 95);

    const avoidance = clamp(dodge + parry, 0, 100);
    const armorDr = armorReductionPct(finalArmor);

    const physicalAfterArmor = physicalHit * (1 - armorDr / 100);
    const physicalAfterPhysicalDr = physicalAfterArmor * (1 - physicalDr / 100);
    const physicalAfterGlobalDr =
      physicalAfterPhysicalDr * (1 - globalDr / 100);

    const averageBlockReduction =
      Math.min(finalBlockValue, physicalAfterGlobalDr) *
      (finalBlockChance / 100);

    const physicalAverage = Math.max(
      0,
      physicalAfterGlobalDr - averageBlockReduction - finalAbsorb
    );

    const magicalAfterMagicDr = magicalHit * (1 - magicDr / 100);
    const magicalAfterGlobalDr = magicalAfterMagicDr * (1 - globalDr / 100);
    const magicalAverage = Math.max(0, magicalAfterGlobalDr - finalAbsorb);

    const fierceAfterArmor = fierceBlow * (1 - armorDr / 100);
    const fierceAfterPhysicalDr = fierceAfterArmor * (1 - physicalDr / 100);
    const fierceAfterGlobalDr = fierceAfterPhysicalDr * (1 - globalDr / 100);

    const fierceBlockChance = clamp(finalBlockChance + fierceBlockBonus, 0, 100);
    const fierceBlockValue = finalBlockValue * (fierceBlockEfficiency / 100);
    const fierceAbsorb = finalAbsorb * (fierceAbsorbEfficiency / 100);

    const fierceAverageBlockReduction =
      Math.min(fierceBlockValue, fierceAfterGlobalDr) *
      (fierceBlockChance / 100);

    const fierceAverage = Math.max(
      0,
      fierceAfterGlobalDr - fierceAverageBlockReduction - fierceAbsorb
    );

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

    const compare: CompareItem[] = [
      { label: "+500 armor", physGain: 1.5, magicGain: 0, fierceGain: 0.8, totalGain: 2.3 },
      { label: "+2% DR globale", physGain: 2, magicGain: 2, fierceGain: 2, totalGain: 6 },
      { label: "+100 block value", physGain: 2.4, magicGain: 0, fierceGain: 1.4, totalGain: 3.8 },
    ];

    return {
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
      compare,
    };
  }, [
    hp,
    armor,
    dodge,
    parry,
    blockChance,
    blockValue,
    basePhysicalDr,
    baseGlobalDr,
    baseMagicDr,
    absorb,
    physicalHit,
    magicalHit,
    fierceBlow,
    fierceBlockEfficiency,
    fierceAbsorbEfficiency,
    defensiveStance,
    bearForm,
    righteousFury,
    manaForgedBarrier,
    shieldWall,
    barkskin,
    carnageIncarnate,
    relentless,
    crimsonChampion,
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

  const buttonStyle: React.CSSProperties = {
    background: "#1d4ed8",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
  };

  const toggleRow = (
    label: string,
    checked: boolean,
    onChange: (v: boolean) => void
  ) => (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        background: "rgba(51,65,85,0.55)",
        padding: 12,
        borderRadius: 10,
      }}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
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
            marginBottom: 24,
          }}
        >
          <h1 style={{ marginTop: 0 }}>Calculateur tank</h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
            Le cœur du site. Tu peux saisir les stats de base, activer des
            stances, des cooldowns et quelques mystiques clés, puis lire la
            séparation entre Armor DR, Physical DR, Global DR et Magic DR.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button style={buttonStyle} onClick={() => applyPreset("block")}>Preset Block</button>
            <button style={buttonStyle} onClick={() => applyPreset("bear")}>Preset Bear</button>
            <button style={buttonStyle} onClick={() => applyPreset("parry")}>Preset Parry</button>
            <button style={buttonStyle} onClick={() => applyPreset("mana")}>Preset Mana</button>
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
              <h2 style={{ marginTop: 0 }}>Base</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label>HP</label><input style={inputStyle} type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))} /></div>
                <div><label>Armor</label><input style={inputStyle} type="number" value={armor} onChange={(e) => setArmor(Number(e.target.value))} /></div>
                <div><label>Dodge %</label><input style={inputStyle} type="number" value={dodge} onChange={(e) => setDodge(Number(e.target.value))} /></div>
                <div><label>Parry %</label><input style={inputStyle} type="number" value={parry} onChange={(e) => setParry(Number(e.target.value))} /></div>
                <div><label>Block %</label><input style={inputStyle} type="number" value={blockChance} onChange={(e) => setBlockChance(Number(e.target.value))} /></div>
                <div><label>Block Value</label><input style={inputStyle} type="number" value={blockValue} onChange={(e) => setBlockValue(Number(e.target.value))} /></div>
                <div><label>Physical DR %</label><input style={inputStyle} type="number" value={basePhysicalDr} onChange={(e) => setBasePhysicalDr(Number(e.target.value))} /></div>
                <div><label>Global DR %</label><input style={inputStyle} type="number" value={baseGlobalDr} onChange={(e) => setBaseGlobalDr(Number(e.target.value))} /></div>
                <div><label>Magic DR %</label><input style={inputStyle} type="number" value={baseMagicDr} onChange={(e) => setBaseMagicDr(Number(e.target.value))} /></div>
                <div><label>Absorb</label><input style={inputStyle} type="number" value={absorb} onChange={(e) => setAbsorb(Number(e.target.value))} /></div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Stances / forms</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {toggleRow("Defensive Stance", defensiveStance, setDefensiveStance)}
                {toggleRow("Bear Form", bearForm, setBearForm)}
                {toggleRow("Righteous Fury", righteousFury, setRighteousFury)}
                {toggleRow("Mana-Forged Barrier", manaForgedBarrier, setManaForgedBarrier)}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Cooldowns / mystiques</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {toggleRow("Shield Wall", shieldWall, setShieldWall)}
                {toggleRow("Barkskin", barkskin, setBarkskin)}
                {toggleRow("Carnage Incarnate", carnageIncarnate, setCarnageIncarnate)}
                {toggleRow("Relentless", relentless, setRelentless)}
                {toggleRow("Crimson Champion", crimsonChampion, setCrimsonChampion)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Lecture des couches</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>Armor DR : <strong>{calc.armorDr.toFixed(1)}%</strong></div>
                <div>Physical DR : <strong>{calc.physicalDr.toFixed(1)}%</strong></div>
                <div>Global DR : <strong>{calc.globalDr.toFixed(1)}%</strong></div>
                <div>Magic DR : <strong>{calc.magicDr.toFixed(1)}%</strong></div>
                <div>Block chance finale : <strong>{calc.finalBlockChance.toFixed(1)}%</strong></div>
                <div>Block value finale : <strong>{Math.round(calc.finalBlockValue).toLocaleString()}</strong></div>
                <div>Absorb final : <strong>{Math.round(calc.finalAbsorb).toLocaleString()}</strong></div>
              </div>
            </div>

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
                      background: barColor(item.type),
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}

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
                    }}
                  >
                    <strong>{c.label}</strong>
                    <div style={{ marginTop: 6, color: "#cbd5e1" }}>
                      Physique: +{c.physGain.toFixed(2)}%
                    </div>
                    <div style={{ color: "#cbd5e1" }}>
                      Magique: +{c.magicGain.toFixed(2)}%
                    </div>
                    <div style={{ color: "#cbd5e1" }}>
                      Fierce Blow: +{c.fierceGain.toFixed(2)}%
                      {i === 0 ? " ⭐" : ""}
                    </div>
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
