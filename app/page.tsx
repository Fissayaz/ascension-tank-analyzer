"use client";

import { useMemo, useState } from "react";

type Stats = {
  level: number;
  hp: number;
  armor: number;
  dodge: number;
  parry: number;
  blockChance: number;
  blockValue: number;
  fireRes: number;
  frostRes: number;
  natureRes: number;
  shadowRes: number;
  arcaneRes: number;
  physicalDr: number;
  globalDr: number;
  magicDr: number;
  absorb: number;
  incomingPhysicalHit: number;
  incomingMagicalHit: number;
  fierceBlowHit: number;
  fierceBlockEfficiency: number;
  fierceAbsorbEfficiency: number;
};

type Modifier = {
  id: string;
  name: string;
  kind: "stance" | "talent" | "mystic" | "cd";
  note: string;
  effects: Partial<{
    armorPct: number;
    hpPct: number;
    dodgePct: number;
    parryPct: number;
    blockChancePct: number;
    blockValuePct: number;
    physicalDrPct: number;
    globalDrPct: number;
    magicDrPct: number;
    absorbFlat: number;
    fierceBlockBonusPct: number;
  }>;
};

const DEFAULT_STATS: Stats = {
  level: 70,
  hp: 10000,
  armor: 12000,
  dodge: 10,
  parry: 10,
  blockChance: 15,
  blockValue: 300,
  fireRes: 50,
  frostRes: 50,
  natureRes: 50,
  shadowRes: 50,
  arcaneRes: 50,
  physicalDr: 0,
  globalDr: 0,
  magicDr: 0,
  absorb: 0,
  incomingPhysicalHit: 6000,
  incomingMagicalHit: 5000,
  fierceBlowHit: 9000,
  fierceBlockEfficiency: 50,
  fierceAbsorbEfficiency: 50,
};

const MODIFIERS: Modifier[] = [
  {
    id: "defensive_stance",
    name: "Defensive Stance",
    kind: "stance",
    note: "+10% armor, +5% DR physique",
    effects: { armorPct: 10, physicalDrPct: 5 },
  },
  {
    id: "bear_form",
    name: "Bear Form",
    kind: "stance",
    note: "+30% armor, +15% HP",
    effects: { armorPct: 30, hpPct: 15 },
  },
  {
    id: "righteous_fury",
    name: "Righteous Fury",
    kind: "stance",
    note: "+10% armor, bonus block Fierce Blow",
    effects: { armorPct: 10, fierceBlockBonusPct: 60 },
  },
  {
    id: "mana_forged_barrier",
    name: "Mana-Forged Barrier",
    kind: "stance",
    note: "Absorb de base orienté tank",
    effects: { absorbFlat: 300 },
  },

  {
    id: "shield_specialization",
    name: "Shield Specialization",
    kind: "talent",
    note: "+4% block chance",
    effects: { blockChancePct: 4 },
  },
  {
    id: "shield_mastery",
    name: "Shield Mastery",
    kind: "talent",
    note: "+10% block value",
    effects: { blockValuePct: 10 },
  },
  {
    id: "improved_defensive_stance",
    name: "Improved Defensive Stance",
    kind: "talent",
    note: "+4% DR globale",
    effects: { globalDrPct: 4 },
  },
  {
    id: "deflection",
    name: "Deflection",
    kind: "talent",
    note: "+1% parry",
    effects: { parryPct: 1 },
  },
  {
    id: "anticipation",
    name: "Anticipation",
    kind: "talent",
    note: "+1% dodge",
    effects: { dodgePct: 1 },
  },

  {
    id: "relentless",
    name: "Relentless",
    kind: "mystic",
    note: "+8% DR globale",
    effects: { globalDrPct: 8 },
  },
  {
    id: "carnage_incarnate",
    name: "Carnage Incarnate",
    kind: "mystic",
    note: "+15% DR physique",
    effects: { physicalDrPct: 15 },
  },
  {
    id: "crimson_champion",
    name: "Crimson Champion",
    kind: "mystic",
    note: "+10% block chance, +15% block value",
    effects: { blockChancePct: 10, blockValuePct: 15 },
  },
  {
    id: "thermal_void",
    name: "Thermal Void",
    kind: "mystic",
    note: "+5% DR globale",
    effects: { globalDrPct: 5 },
  },

  {
    id: "shield_wall",
    name: "Shield Wall",
    kind: "cd",
    note: "+60% DR globale",
    effects: { globalDrPct: 60 },
  },
  {
    id: "barkskin",
    name: "Barkskin",
    kind: "cd",
    note: "+15% DR globale",
    effects: { globalDrPct: 15 },
  },
  {
    id: "survival_instincts",
    name: "Survival Instincts",
    kind: "cd",
    note: "+20% HP",
    effects: { hpPct: 20 },
  },
  {
    id: "evasion",
    name: "Evasion",
    kind: "cd",
    note: "+50% dodge",
    effects: { dodgePct: 50 },
  },
  {
    id: "power_word_shield",
    name: "Power Word: Shield",
    kind: "cd",
    note: "+600 absorb",
    effects: { absorbFlat: 600 },
  },
];

const QUICK_DELTAS = [
  {
    id: "armor_500",
    label: "+500 armor",
    apply: (s: Stats): Stats => ({ ...s, armor: s.armor + 500 }),
  },
  {
    id: "dr_2",
    label: "+2% DR",
    apply: (s: Stats): Stats => ({ ...s, globalDr: s.globalDr + 2 }),
  },
  {
    id: "blockv_100",
    label: "+100 block value",
    apply: (s: Stats): Stats => ({ ...s, blockValue: s.blockValue + 100 }),
  },
  {
    id: "blockc_3",
    label: "+3% block",
    apply: (s: Stats): Stats => ({ ...s, blockChance: s.blockChance + 3 }),
  },
  {
    id: "parry_5",
    label: "+5% parry",
    apply: (s: Stats): Stats => ({ ...s, parry: s.parry + 5 }),
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function kForLevel(level: number) {
  return 467.5 * level - 22167.5;
}

function pctMult(percent: number) {
  return Math.max(0, 1 - percent / 100);
}

function applyMult(base: number, reductions: number[]) {
  return reductions.reduce((acc, r) => acc * pctMult(r), base);
}

function averageRes(stats: Stats) {
  return (
    (stats.fireRes +
      stats.frostRes +
      stats.natureRes +
      stats.shadowRes +
      stats.arcaneRes) /
    5
  );
}

function resistPct(stats: Stats) {
  const avg = averageRes(stats);
  return clamp((avg / (avg + 400)) * 100, 0, 75);
}

function evaluate(stats: Stats, selected: string[]) {
  const picked = MODIFIERS.filter((m) => selected.includes(m.id));

  const sum = {
    armorPct: 0,
    hpPct: 0,
    dodgePct: 0,
    parryPct: 0,
    blockChancePct: 0,
    blockValuePct: 0,
    physicalDrPct: stats.physicalDr,
    globalDrPct: stats.globalDr,
    magicDrPct: stats.magicDr,
    absorbFlat: stats.absorb,
    fierceBlockBonusPct: 0,
  };

  picked.forEach((m) => {
    Object.entries(m.effects).forEach(([key, value]) => {
      const typedKey = key as keyof typeof sum;
      sum[typedKey] += value as number;
    });
  });

  const finalArmor = Math.round(stats.armor * (1 + sum.armorPct / 100));
  const finalHp = Math.round(stats.hp * (1 + sum.hpPct / 100));
  const finalDodge = clamp(stats.dodge + sum.dodgePct, 0, 95);
  const finalParry = clamp(stats.parry + sum.parryPct, 0, 95);
  const finalBlockChance = clamp(stats.blockChance + sum.blockChancePct, 0, 95);
  const finalBlockValue = Math.round(
    stats.blockValue * (1 + sum.blockValuePct / 100)
  );

  const armorDr = clamp(
    (finalArmor / (finalArmor + kForLevel(stats.level))) * 100,
    0,
    75
  );

  const physicalTaken = applyMult(stats.incomingPhysicalHit, [
    armorDr,
    sum.physicalDrPct,
    sum.globalDrPct,
  ]);

  const blockAverageReduction =
    Math.min(finalBlockValue, physicalTaken) * (finalBlockChance / 100);

  const physicalAverage = Math.max(
    0,
    physicalTaken - blockAverageReduction - sum.absorbFlat
  );
  const physicalWorst = Math.max(0, physicalTaken - sum.absorbFlat);

  const magicalTaken = applyMult(stats.incomingMagicalHit, [
    resistPct(stats),
    sum.magicDrPct,
    sum.globalDrPct,
  ]);
  const magicalAverage = Math.max(0, magicalTaken - sum.absorbFlat);

  const fierceTaken = applyMult(stats.fierceBlowHit, [
    armorDr,
    sum.physicalDrPct,
    sum.globalDrPct,
  ]);

  const fierceBlockChance = clamp(
    finalBlockChance + sum.fierceBlockBonusPct,
    0,
    100
  );
  const fierceBlockValue =
    finalBlockValue * (stats.fierceBlockEfficiency / 100);
  const fierceAbsorb = sum.absorbFlat * (stats.fierceAbsorbEfficiency / 100);

  const fierceAverageReduction =
    Math.min(fierceBlockValue, fierceTaken) * (fierceBlockChance / 100);

  const fierceAverage = Math.max(
    0,
    fierceTaken - fierceAverageReduction - fierceAbsorb
  );
  const fierceWorst = Math.max(0, fierceTaken - fierceAbsorb);

  const avoidancePure = clamp(finalDodge + finalParry, 0, 100);
  const fullHitChance = clamp(
    100 - finalDodge - finalParry - finalBlockChance,
    0,
    100
  );

  const physicalReductionShown = clamp(
    (1 - physicalAverage / Math.max(1, stats.incomingPhysicalHit)) * 100,
    0,
    99
  );
  const magicalReductionShown = clamp(
    (1 - magicalAverage / Math.max(1, stats.incomingMagicalHit)) * 100,
    0,
    99
  );
  const fierceReductionShown = clamp(
    (1 - fierceAverage / Math.max(1, stats.fierceBlowHit)) * 100,
    0,
    99
  );

  const ehpPhysical =
    finalHp /
    Math.max(0.01, 1 - (armorDr + sum.physicalDrPct + sum.globalDrPct) / 100);
  const ehpMagical =
    finalHp /
    Math.max(
      0.01,
      1 - (resistPct(stats) + sum.magicDrPct + sum.globalDrPct) / 100
    );

  const diagnosis: string[] = [];
  if (fierceReductionShown < 45)
    diagnosis.push("Fierce Blow reste ton gros point faible.");
  if (finalBlockChance >= 25 && finalBlockValue < stats.incomingPhysicalHit * 0.08)
    diagnosis.push("Tu as du block chance, mais pas assez de block value.");
  if (magicalReductionShown < 30)
    diagnosis.push("Tu es trop vulnérable au magique soutenu.");
  if (avoidancePure > 35 && finalHp < 9000)
    diagnosis.push("Build avoidance avec peu de marge HP : attention au burst.");
  if (!diagnosis.length)
    diagnosis.push(
      "Profil assez équilibré. Le prochain gain dépend du contenu ciblé."
    );

  return {
    finalArmor,
    finalHp,
    finalDodge,
    finalParry,
    finalBlockChance,
    finalBlockValue,
    armorDr,
    physicalAverage,
    physicalWorst,
    magicalAverage,
    fierceAverage,
    fierceWorst,
    avoidancePure,
    fullHitChance,
    physicalReductionShown,
    magicalReductionShown,
    fierceReductionShown,
    ehpPhysical,
    ehpMagical,
    diagnosis,
  };
}

function deltaClass(value: number) {
  if (value >= 2) return "delta pos";
  if (value > 0) return "delta warn";
  return "delta bad";
}

export default function Page() {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [selected, setSelected] = useState<string[]>([
    "defensive_stance",
    "shield_specialization",
    "shield_mastery",
    "relentless",
    "crimson_champion",
  ]);

  const result = useMemo(() => evaluate(stats, selected), [stats, selected]);

  const comparisons = useMemo(() => {
    return QUICK_DELTAS.map((d) => {
      const next = evaluate(d.apply(stats), selected);
      return {
        label: d.label,
        phys: next.physicalReductionShown - result.physicalReductionShown,
        mag: next.magicalReductionShown - result.magicalReductionShown,
        fierce: next.fierceReductionShown - result.fierceReductionShown,
      };
    }).sort((a, b) => b.phys + b.fierce - (a.phys + a.fierce));
  }, [stats, selected, result]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function updateField<K extends keyof Stats>(key: K, value: number) {
    setStats((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="container">
      <section className="hero">
        <div>
          <div className="badge">
            Ascension Tank Analyzer — version publique de départ
          </div>
          <h1>Le site pensé pour aider tous les tanks du serveur.</h1>
          <p className="lead">
            Entre tes stats visibles, active tes stances, talents, mystiques et
            CDs, puis lis directement ta mitigation physique, ta survie magique,
            ton comportement contre Fierce Blow et l’endroit exact où ton tank
            pêche le plus.
          </p>
          <div className="actions">
            <button
              className="btn primary"
              onClick={() =>
                setSelected([
                  "defensive_stance",
                  "shield_specialization",
                  "shield_mastery",
                  "relentless",
                  "crimson_champion",
                  "shield_wall",
                ])
              }
            >
              Preset Block Tank
            </button>
            <button
              className="btn"
              onClick={() =>
                setSelected([
                  "bear_form",
                  "anticipation",
                  "deflection",
                  "carnage_incarnate",
                  "barkskin",
                  "survival_instincts",
                ])
              }
            >
              Preset Bear Tank
            </button>
            <button
              className="btn"
              onClick={() =>
                setSelected([
                  "mana_forged_barrier",
                  "thermal_void",
                  "power_word_shield",
                ])
              }
            >
              Preset Mana-Forged
            </button>
          </div>
        </div>

        <div className="card soft">
          <div className="row">
            <strong>Résultat instantané</strong>
            <span className="muted small">lecture rapide</span>
          </div>

          <div className="bar-wrap">
            <div className="small muted">
              Physique — {result.physicalReductionShown.toFixed(1)}%
            </div>
            <div className="bar blue">
              <span style={{ width: `${result.physicalReductionShown}%` }} />
            </div>
          </div>

          <div className="bar-wrap">
            <div className="small muted">
              Magique — {result.magicalReductionShown.toFixed(1)}%
            </div>
            <div className="bar violet">
              <span style={{ width: `${result.magicalReductionShown}%` }} />
            </div>
          </div>

          <div className="bar-wrap">
            <div className="small muted">
              Fierce Blow — {result.fierceReductionShown.toFixed(1)}%
            </div>
            <div className="bar red">
              <span style={{ width: `${result.fierceReductionShown}%` }} />
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="card">
              <div className="muted small">EHP physique</div>
              <div className="value">
                {Math.round(result.ehpPhysical).toLocaleString()}
              </div>
            </div>
            <div className="card">
              <div className="muted small">EHP magique</div>
              <div className="value">
                {Math.round(result.ehpMagical).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="main-grid">
        <aside className="sidebar">
          <div className="card">
            <div className="section-title">Stats affichées</div>
            <div className="fields">
              {[
                ["level", "Niveau"],
                ["hp", "HP"],
                ["armor", "Armor"],
                ["dodge", "Dodge %"],
                ["parry", "Parry %"],
                ["blockChance", "Block %"],
                ["blockValue", "Block Value"],
                ["physicalDr", "Physical DR %"],
                ["globalDr", "Global DR %"],
                ["magicDr", "Magic DR %"],
                ["absorb", "Absorb"],
                ["fierceBlowHit", "Fierce Blow"],
              ].map(([key, label]) => (
                <div className="field" key={key}>
                  <label>{label}</label>
                  <input
                    className="input"
                    type="number"
                    value={stats[key as keyof Stats] as number}
                    onChange={(e) =>
                      updateField(key as keyof Stats, Number(e.target.value || 0))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title">Résistances</div>
            <div className="fields">
              {[
                ["fireRes", "Fire"],
                ["frostRes", "Frost"],
                ["natureRes", "Nature"],
                ["shadowRes", "Shadow"],
                ["arcaneRes", "Arcane"],
              ].map(([key, label]) => (
                <div className="field" key={key}>
                  <label>{label}</label>
                  <input
                    className="input"
                    type="number"
                    value={stats[key as keyof Stats] as number}
                    onChange={(e) =>
                      updateField(key as keyof Stats, Number(e.target.value || 0))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <div className="section-title">
              Stances, talents, mystiques et CDs
            </div>
            <div className="pill-grid">
              {MODIFIERS.map((m) => (
                <label key={m.id} className="pill">
                  <input
                    type="checkbox"
                    checked={selected.includes(m.id)}
                    onChange={() => toggle(m.id)}
                  />
                  <div>
                    <div>
                      <strong>{m.name}</strong>{" "}
                      <span className="muted small">· {m.kind}</span>
                    </div>
                    <div className="muted small">{m.note}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="results-grid">
            <div className="metric">
              <div className="muted small">Avoidance pure</div>
              <div className="value">{result.avoidancePure.toFixed(1)}%</div>
              <div className="muted small">Dodge + parry uniquement</div>
            </div>
            <div className="metric">
              <div className="muted small">Block final</div>
              <div className="value">{result.finalBlockChance.toFixed(1)}%</div>
              <div className="muted small">
                Réduction partielle, pas avoidance pure
              </div>
            </div>
            <div className="metric">
              <div className="muted small">Block value finale</div>
              <div className="value">
                {result.finalBlockValue.toLocaleString()}
              </div>
              <div className="muted small">Crucial si build block</div>
            </div>
          </div>

          <div className="card">
            <div className="row">
              <strong>Tester des améliorations</strong>
              <span className="muted small">
                compare ce qui t’aide le plus
              </span>
            </div>
            <div className="compare-grid" style={{ marginTop: 14 }}>
              {comparisons.map((c, idx) => (
                <div className="compare-card" key={c.label}>
                  <strong>
                    {c.label} {idx === 0 ? "⭐" : ""}
                  </strong>
                  <div className={deltaClass(c.phys)}>
                    Physique: {c.phys >= 0 ? "+" : ""}
                    {c.phys.toFixed(2)}%
                  </div>
                  <div className={deltaClass(c.mag)}>
                    Magique: {c.mag >= 0 ? "+" : ""}
                    {c.mag.toFixed(2)}%
                  </div>
                  <div className={deltaClass(c.fierce)}>
                    Fierce Blow: {c.fierce >= 0 ? "+" : ""}
                    {c.fierce.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <strong>Diagnostic</strong>
              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                {result.diagnosis.map((d) => (
                  <div className="notice small" key={d}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <strong>Lecture rapide</strong>
              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <div className="row">
                  <span className="muted">Réduction physique</span>
                  <strong>{result.physicalReductionShown.toFixed(1)}%</strong>
                </div>
                <div className="row">
                  <span className="muted">Réduction magique</span>
                  <strong>{result.magicalReductionShown.toFixed(1)}%</strong>
                </div>
                <div className="row">
                  <span className="muted">Réduction Fierce Blow</span>
                  <strong>{result.fierceReductionShown.toFixed(1)}%</strong>
                </div>
                <div className="row">
                  <span className="muted">Worst case physique</span>
                  <strong>
                    {Math.round(result.physicalWorst).toLocaleString()}
                  </strong>
                </div>
                <div className="row">
                  <span className="muted">Worst case Fierce Blow</span>
                  <strong>
                    {Math.round(result.fierceWorst).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
