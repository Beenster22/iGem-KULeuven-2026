// Edited with Claude Opus 5.5 (Anthropic), 2026-10-01
// Purpose: replaced the placeholder figures/copy with the team's sourced
// numbers and text from "Text for HOME PAGE" (Section 2 — Planet).
import { Continent } from "./pmosContinents";

// Headline total: women affected during their reproductive years.
// Source: "Prevalence of polycystic ovary syndrome: a global and regional
// systematic review and meta-analysis", Hum Reprod Update, 2026
// (https://doi.org/10.1093/humupd/dmaf030).
export const PMOS_TOTAL = 170_000_000;

// Per-continent figures derived by the team from IHME GBD data (method to be
// explained on its own wiki page). NOTE: these are recorded cases and sum to
// ~67.85M, not to PMOS_TOTAL above, which comes from a different source.
export const PMOS_STATS_BY_CONTINENT: Record<Continent, number> = {
  Asia: 39_800_000,
  "North America": 8_900_000,
  Europe: 7_800_000,
  Africa: 7_000_000,
  "South America": 3_500_000,
  Oceania: 850_000,
};

// One short note per continent, shown in the globe's info panel. Asia has
// none yet — the panel simply omits the note until the team supplies one.
export const PMOS_CONTINENT_NOTES: Partial<Record<Continent, string>> = {
  Asia: "Asia accounts for more than half of all recorded PMOS cases worldwide, largely because it is home to most of the world's population.",
  "North America": "In the US alone, PMOS-related healthcare costs exceed $8 billion a year.",
  Europe:
    "95% of Europe's recorded cases are in Western Europe. Central and Eastern Europe report the lowest rates in the world, a sign of missed diagnoses rather than fewer cases.",
  Africa:
    "Likely the most underestimated continent: where diagnosis and healthcare access are limited, most cases are never recorded.",
  "South America":
    "Recorded numbers vary widely: the Andean countries (Peru, Ecuador, Bolivia) report more cases than Brazil, despite having about a third of its population, which shows how much depends on diagnosis.",
  Oceania:
    "Australia and New Zealand have some of the highest recorded rates in the world, and Australia leads the international guidelines on diagnosing and treating PMOS.",
};
