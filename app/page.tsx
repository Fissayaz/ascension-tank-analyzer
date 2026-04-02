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

export default function Page() {
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

  // Stances / Forms
  const [defensiveStance, setDefensiveStance] = useState(false);
  const [bearForm, setBearForm] = useState(false);
  const [righteousFury, setRighteousFury] = useState(false);
  const [manaForgedBarrier, setManaForgedBarrier] = useState(false);

  // CDs
  const [shieldWall, setShieldWall] = useState(false);
  const [barkskin, setBarkskin] = useState(false);

  // Mystics
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

    // Stances / forms
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

    // CDs
    if (shieldWall) {
      globalDr += 60;
    }

    if (barkskin) {
      globalDr += 15;
    }

    // Mystics
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
    const physicalWorst = Math.max(0, physicalAfterGlobalDr - finalAbsorb);

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
    const fierceWorst = Math.max(0, fierceAfterGlobalDr - fierceAbsorb);

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

    const totalDisplayedPhysicalDr = clamp(
      armorDr + physicalDr + globalDr,
      0,
      99
    );

    const ehp = hp / Math.max(0.01, 1 - totalDisplayedPhysicalDr / 100);
    const fierceSurvivable = Math.max(
      1,
      Math.floor(hp / Math.max(1, fierceWorst))
    );

    let tankProfile = "Hybrid Tank";
    if (finalBlockChance >= 22 && finalBlockValue >= physicalHit * 0.08) {
      tankProfile = "Block Tank";
    } else if (parry >= dodge + 5) {
      tankProfile = "Parry Tank";
    } else if (hp >= 14000 && finalArmor >= 15000) {
      tankProfile = "Bear / EHP Tank";
    } else if (manaForgedBarrier || finalAbsorb >= 1000) {
      tankProfile = "Mana / Absorb Tank";
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

    if (finalBlockChance >= 20 && finalBlockValue < physicalHit * 0.08) {
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
    if (fierceReduction < 35 && finalBlockValue < physicalHit * 0.08) {
      priority = "Monte la block value en priorité.";
    } else if (fierceReduction < 35) {
      priority = "Monte la mitigation physique pour mieux tenir les Fierce Blows.";
    } else if (physicalReduction < 50) {
      priority = "Monte l’armor, la DR physique ou la DR globale.";
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
      const nextArmor = finalArmor + (variant.armor ?? 0);
      const nextGlobalDr = globalDr + (variant.globalDr ?? 0);
      const nextBlockValue = finalBlockValue + (variant.blockValue ?? 0);
      const nextBlockChance = finalBlockChance + (variant.blockChance ?? 0);
      const nextParry = parry + (variant.parry ?? 0);

      const nextArmorDr = armorReductionPct(nextArmor);

      const nextPhysicalAfterArmor = physicalHit * (1 - nextArmorDr / 100);
      const nextPhysicalAfterPhysicalDr =
        nextPhysicalAfterArmor * (1 - physicalDr / 100);
      const nextPhysicalAfterGlobalDr =
        nextPhysicalAfterPhysicalDr * (1 - nextGlobalDr / 100);

      const nextAverageBlockReduction =
        Math.min(nextBlockValue, nextPhysicalAfterGlobalDr) *
        (nextBlockChance / 100);

      const nextPhysicalAverage = Math.max(
        0,
        nextPhysicalAfterGlobalDr - nextAverageBlockReduction - finalAbsorb
      );

      const nextPhysicalReduction = clamp(
        (1 - nextPhysicalAverage / Math.max(1, physicalHit)) * 100,
        0,
        99
      );

      const nextMagicalAfterMagicDr = magicalHit * (1 - magicDr / 100);
      const nextMagicalAfterGlobalDr =
        nextMagicalAfterMagicDr * (1 - nextGlobalDr / 100);
      const nextMagicalAverage = Math.max(
        0,
        nextMagicalAfterGlobalDr - finalAbsorb
      );

      const nextMagicalReduction = clamp(
        (1 - nextMagicalAverage / Math.max(1, magicalHit)) * 100,
        0,
        99
      );

      const nextFierceAfterArmor = fierceBlow * (1 - nextArmorDr / 100);
      const nextFierceAfterPhysicalDr =
        nextFierceAfterArmor * (1 - physicalDr / 100);
      const nextFierceAfterGlobalDr =
        nextFierceAfterPhysicalDr * (1 - nextGlobalDr / 100);

      const nextFierceBlockValue =
        nextBlockValue * (fierceBlockEfficiency / 100);

      const nextFierceAverageBlockReduction =
        Math.min(nextFierceBlockValue, nextFierceAfterGlobalDr) *
        (nextBlockChance / 100);

      const nextFierceAverage = Math.max(
        0,
        nextFierceAfterGlobalDr -
          nextFierceAverageBlockReduction -
          finalAbsorb * (fierceAbsorbEfficiency / 100)
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
      { label: "+2% DR globale", ...simulateVariant({ globalDr: 2 }), totalGain: 0 },
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
    ]
      .map((x) => ({
        ...x,
        totalGain: x.physGain + x.magicGain + x.fierceGain,
      }))
      .sort((a, b) => b.totalGain - a.totalGain);

    return {
      finalArmor,
      physicalDr,
      globalDr,
      magicDr,
      finalAbsorb,
      finalBlockChance,
      finalBlockValue,
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
      totalDisplayedPhysicalDr,
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

  const problemBox = (title: string, items: string[], color: string) => (
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

  const metricCard = (label: string, value: string) => (
    <div
      style={{
        ...cardStyle,
        padding: 18,
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 6 }}>{value}</div>
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
            Ascension Tank Analyzer — V7 structure serveur
          </div>

          <h1 style={{ fontSize: 40, margin: 0, lineHeight: 1.05 }}>
            Un outil qui commence à parler le langage des tanks Ascension.
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 16,
              fontSize: 18,
              maxWidth: 980,
              lineHeight: 1.6,
            }}
          >
            Cette version sépare mieux Armor DR, Physical DR, Global DR et Magic
            DR, ajoute quelques stances et mystiques nommés proprement, et améliore
            la lecture pour les novices comme pour les tanks avancés.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <button style={buttonStyle} onClick={() => applyPreset("block")}>Preset Block Tank</button>
            <button style={buttonStyle} onClick={() => applyPreset("bear")}>Preset Bear Tank</button>
            <button style={buttonStyle} onClick={() => applyPreset("parry")}>Preset Parry Tank</button>
            <button style={buttonStyle} onClick={() => applyPreset("mana")}>Preset Mana Tank</button>
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
              <h2 style={{ marginTop: 0 }}>Base du personnage</h2>
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
              <h2 style={{ marginTop: 0 }}>Stances / forms / auras</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {toggleRow("Defensive Stance", defensiveStance, setDefensiveStance)}
                {toggleRow("Bear Form", bearForm, setBearForm)}
                {toggleRow("Righteous Fury", righteousFury, setRighteousFury)}
                {toggleRow("Mana-Forged Barrier", manaForgedBarrier, setManaForgedBarrier)}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Cooldowns & mystiques</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {toggleRow("Shield Wall", shieldWall, setShieldWall)}
                {toggleRow("Barkskin", barkskin, setBarkskin)}
                {toggleRow("Carnage Incarnate", carnageIncarnate, setCarnageIncarnate)}
                {toggleRow("Relentless", relentless, setRelentless)}
                {toggleRow("Crimson Champion", crimsonChampion, setCrimsonChampion)}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Simulation</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label>Hit physique</label><input style={inputStyle} type="number" value={physicalHit} onChange={(e) => setPhysicalHit(Number(e.target.value))} /></div>
                <div><label>Hit magique</label><input style={inputStyle} type="number" value={magicalHit} onChange={(e) => setMagicalHit(Number(e.target.value))} /></div>
                <div><label>Fierce Blow</label><input style={inputStyle} type="number" value={fierceBlow} onChange={(e) => setFierceBlow(Number(e.target.value))} /></div>
                <div><label>Block efficiency FB %</label><input style={inputStyle} type="number" value={fierceBlockEfficiency} onChange={(e) => setFierceBlockEfficiency(Number(e.target.value))} /></div>
                <div><label>Absorb efficiency FB %</label><input style={inputStyle} type="number" value={fierceAbsorbEfficiency} onChange={(e) => setFierceAbsorbEfficiency(Number(e.target.value))} /></div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Comment lire cette page</h2>
              <div style={{ display: "grid", gap: 8, color: "#cbd5e1" }}>
                <div><strong>Armor DR</strong> : réduction fournie par l’armure seule.</div>
                <div><strong>Physical DR</strong> : réduction physique hors armure.</div>
                <div><strong>Global DR</strong> : réduction qui s’applique à plusieurs types de dégâts.</div>
                <div><strong>Magic DR</strong> : réduction spécifique au magique.</div>
                <div><strong>Fierce Blow</strong> : traité à part pour éviter de mélanger burst spécial et hit normal.</div>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {metricCard("Avoidance", `${calc.avoidance.toFixed(1)}%`)}
              {metricCard("EHP", Math.round(calc.ehp).toLocaleString())}
              {metricCard("Armor DR", `${calc.armorDr.toFixed(1)}%`)}
              {metricCard("FB survivables", `${calc.fierceSurvivable}`)}
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Couches défensives</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>Armor DR : <strong>{calc.armorDr.toFixed(1)}%</strong></div>
                <div>Physical DR : <strong>{calc.physicalDr.toFixed(1)}%</strong></div>
                <div>Global DR : <strong>{calc.globalDr.toFixed(1)}%</strong></div>
                <div>Magic DR : <strong>{calc.magicDr.toFixed(1)}%</strong></div>
                <div>Block chance finale : <strong>{calc.finalBlockChance.toFixed(1)}%</strong></div>
                <div>Block value finale : <strong>{Math.round(calc.finalBlockValue).toLocaleString()}</strong></div>
                <div>Absorb final : <strong>{Math.round(calc.finalAbsorb).toLocaleString()}</strong></div>
                <div>Physical DR affichée (approx) : <strong>{calc.totalDisplayedPhysicalDr.toFixed(1)}%</strong></div>
              </div>
            </div>

            {[
              { label: "Mitigation physique", value: calc.physicalReduction, type: "physical" as const },
              { label: "Mitigation magique", value: calc.magicalReduction, type: "magic" as const },
              { label: "Fierce Blow", value: calc.fierceReduction, type: "fierce" as const },
            ].map((item) => (
              <div key={item.label} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
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
              <h2 style={{ marginTop: 0 }}>Résumé hits</h2>
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
