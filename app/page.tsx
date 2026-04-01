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
    tempArmorPct: number;
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
