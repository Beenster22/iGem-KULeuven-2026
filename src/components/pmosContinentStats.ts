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

// PLACEHOLDER COPY — NOT REAL CONTENT.
// One short paragraph per continent on how PMOS presentation, diagnosis, or
// care differs there. This is structure only, written so the info panel has
// something to render — replace each string with real, sourced content
// before this page is published (see RESPONSIBLE_AI_USE.md).
export const PMOS_CONTINENT_NOTES_PLACEHOLDER: Record<Continent, string> = {
  Africa: "Add a short paragraph on how PMOS presents, is diagnosed, or is treated in Africa.",
  Asia: "Add a short paragraph on how PMOS presents, is diagnosed, or is treated in Asia.",
  Europe: "Add a short paragraph on how PMOS presents, is diagnosed, or is treated in Europe.",
  "North America":
    "Add a short paragraph on how PMOS presents, is diagnosed, or is treated in North America.",
  "South America":
    "Add a short paragraph on how PMOS presents, is diagnosed, or is treated in South America.",
  Oceania: "Add a short paragraph on how PMOS presents, is diagnosed, or is treated in Oceania.",
};
