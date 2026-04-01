"use client";

import { useState } from "react";

export default function Page() {
  const [hp, setHp] = useState(10000);
  const [armor, setArmor] = useState(12000);

  return (
    <main style={{ padding: 40, color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>Ascension Tank Analyzer</h1>

      <div style={{ marginTop: 20 }}>
        <label>HP:</label>
        <input
          type="number"
          value={hp}
          onChange={(e) => setHp(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Armor:</label>
        <input
          type="number"
          value={armor}
          onChange={(e) => setArmor(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <strong>Résumé :</strong>
        <p>HP: {hp}</p>
        <p>Armor: {armor}</p>
      </div>
    </main>
  );
}
