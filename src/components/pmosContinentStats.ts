import { Continent } from "./pmosContinents";

// The headline total — supplied directly, treated as real.
export const PMOS_TOTAL = 115_000_000;

// PLACEHOLDER DATA — NOT REAL FIGURES.
// Unlike PMOS_TOTAL above, this per-continent breakdown was never supplied —
// these are round, made-up numbers (that happen to sum to PMOS_TOTAL) so the
// globe's click interaction can be built and previewed. Per the team's own
// RESPONSIBLE_AI_USE.md ("never fabricate... statistics"), replace every
// value below with real, sourced per-continent figures (and cite the
// source) before this page is published.
export const PMOS_STATS_BY_CONTINENT_PLACEHOLDER: Record<Continent, number> = {
  Asia: 60_000_000,
  Africa: 25_000_000,
  Europe: 12_000_000,
  "North America": 10_000_000,
  "South America": 6_000_000,
  Oceania: 2_000_000,
};
