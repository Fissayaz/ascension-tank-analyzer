"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type State = {
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

  function set<K extends keyof State>(k: K, v: number) {
    setS((p) => ({ ...p, [k]: Number.isFinite(v) ? v : 0 }));
  }

  const r = useMemo(() => {
    const defenseDelta = Math.max(0, s.defenseCurrent - s.defenseBase);

    const missFromDefense = 5 + defenseDelta * 0.04;

    const totalCTC =
      s.dodge + s.parry + s.block + missFromDefense;

    const capped = totalCTC >= 102.4;

    // White hit
    const whiteAfterArmor = s.whiteHit * (1 - s.armorDR / 100);
    const whiteAfterPhys = whiteAfterArmor * (1 - s.physicalDR / 100);
    const whiteAfterGlobal = whiteAfterPhys * (1 - s.globalDR / 100);

    const whiteWorst = Math.max(0, whiteAfterGlobal - s.absorb);

    const whiteAvg = capped ? 0 : whiteWorst * 0.5;

    // Fierce Blow
    const fierceAfterArmor = s.fierceBlow * (1 - s.armorDR / 100);
    const fierceAfterPhys = fierceAfterArmor * (1 - s.physicalDR / 100);
    const fierceAfterGlobal = fierceAfterPhys * (1 - s.globalDR / 100);

    const fierceFinal = Math.max(0, fierceAfterGlobal - s.absorb);

    // Magic
    const magicAfter = s.magicHit * (1 - s.magicDR / 100);
    const magicFinal = Math.max(0, magicAfter * (1 - s.globalDR / 100) - s.absorb);

    const issues: string[] = [];
    const rec: string[] = [];

    if (capped) {
      issues.push("CTC capped vs white swings");
    } else {
      issues.push("Not CTC capped");
      rec.push("Increase dodge, parry, block or defense");
    }

    if (fierceFinal > s.hp * 0.6) {
      issues.push("Fierce Blow burst is dangerous");
      rec.push("Increase armor DR, absorb or HP");
    }

    if (magicFinal > s.hp * 0.35) {
      issues.push("Magic damage is a weakness");
      rec.push("Increase magic DR or global DR");
    }

    return {
      defenseDelta,
      missFromDefense,
      totalCTC,
      capped,
      whiteAvg,
      whiteWorst,
      fierceFinal,
      magicFinal,
      issues,
      rec,
    };
  }, [s]);

  const input = (label: string, key: keyof State) => (
    <div>
      <div style={{ fontSize: 13 }}>{label}</div>
      <input
        type="number"
        value={s[key]}
        onChange={(e) => set(key, Number(e.target.value))}
        style={{
          width: "100%",
          padding: 8,
          background: "#111",
          color: "white",
          border: "1px solid #333",
          borderRadius: 6,
        }}
      />
    </div>
  );

  return (
    <main style={{ padding: 30, background: "#020617", minHeight: "100vh", color: "white" }}>
      <h1>Tank Analyzer V12</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        <div>
          <h2>Character</h2>

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

        <div>
          <h2>Encounter</h2>

          {input("White Hit", "whiteHit")}
          {input("Fierce Blow", "fierceBlow")}
          {input("Magic Hit", "magicHit")}

          <h2 style={{ marginTop: 20 }}>Results</h2>

          <div>Defense Delta: {r.defenseDelta}</div>
          <div>Miss from Defense: {r.missFromDefense.toFixed(2)}%</div>
          <div>CTC: {r.totalCTC.toFixed(2)} / 102.4</div>
          <div>Status: {r.capped ? "CTC Capped" : "Not Capped"}</div>

          <div style={{ marginTop: 10 }}>
            White Avg: {Math.round(r.whiteAvg)}
          </div>
          <div>White Worst: {Math.round(r.whiteWorst)}</div>

          <div style={{ marginTop: 10 }}>
            Fierce Blow: {Math.round(r.fierceFinal)}
          </div>

          <div>Magic Hit: {Math.round(r.magicFinal)}</div>

          <h3 style={{ marginTop: 20 }}>Diagnosis</h3>
          {r.issues.map((i) => (
            <div key={i}>• {i}</div>
          ))}

          <h3>Recommendations</h3>
          {r.rec.map((i) => (
            <div key={i}>• {i}</div>
          ))}
        </div>
      </div>
    </main>
  );
}
