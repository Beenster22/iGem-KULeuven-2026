// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21
// Purpose: PubMed paper counts on PMOS and SLE per country, copied from the
// team's "GRAPHS LITERATURE REVIEW.xlsx" (Sheet1, rows 33–76), in the
// spreadsheet's order. Feeds <ResearchVolumeChart> (Figures 1 and 2 of the
// Legislators & Advocates section on the Human Practices page).

export interface CountryPaperCount {
  country: string;
  pmos: number;
  sle: number;
}

export const EUROPE_PAPER_COUNTS: CountryPaperCount[] = [
  { country: "Germany", pmos: 497, sle: 2796 },
  { country: "UK", pmos: 2011, sle: 4620 },
  { country: "France", pmos: 522, sle: 2699 },
  { country: "Italy", pmos: 1522, sle: 3511 },
  { country: "Spain", pmos: 508, sle: 2366 },
  { country: "Ukraine", pmos: 22, sle: 65 },
  { country: "Poland", pmos: 656, sle: 804 },
  { country: "Romania", pmos: 75, sle: 246 },
  { country: "Netherlands", pmos: 479, sle: 1433 },
  { country: "Belgium", pmos: 240, sle: 547 },
  { country: "Sweden", pmos: 478, sle: 1607 },
  { country: "Czech Republic", pmos: 81, sle: 161 },
  { country: "Portugal", pmos: 77, sle: 556 },
  { country: "Greece", pmos: 593, sle: 1042 },
  { country: "Hungary", pmos: 74, sle: 347 },
  { country: "Austria", pmos: 207, sle: 464 },
  { country: "Switzerland", pmos: 174, sle: 778 },
  { country: "Belarus", pmos: 2, sle: 6 },
  { country: "Bulgaria", pmos: 72, sle: 142 },
  { country: "Serbia", pmos: 116, sle: 108 },
  { country: "Denmark", pmos: 310, sle: 589 },
  { country: "Norway", pmos: 201, sle: 405 },
  { country: "Finland", pmos: 302, sle: 221 },
  { country: "Slovakia", pmos: 22, sle: 32 },
  { country: "Ireland", pmos: 164, sle: 245 },
  { country: "Croatia", pmos: 48, sle: 126 },
  { country: "Bosnia and Herzegovina", pmos: 19, sle: 23 },
  { country: "Moldova", pmos: 0, sle: 7 },
  { country: "Lithuania", pmos: 13, sle: 24 },
  { country: "Albania", pmos: 7, sle: 8 },
  { country: "Slovenia", pmos: 94, sle: 90 },
  { country: "Latvia", pmos: 5, sle: 5 },
  { country: "North Macedonia", pmos: 0, sle: 8 },
  { country: "Estonia", pmos: 44, sle: 20 },
  { country: "Luxembourg", pmos: 1, sle: 11 },
  { country: "Montenegro", pmos: 6, sle: 9 },
  { country: "Malta", pmos: 7, sle: 16 },
  { country: "Iceland", pmos: 13, sle: 74 },
  { country: "Andorra", pmos: 0, sle: 0 },
  { country: "Liechtenstein", pmos: 0, sle: 0 },
  { country: "Monaco", pmos: 0, sle: 1 },
  { country: "San Marino", pmos: 0, sle: 1 },
  { country: "Holy See (Vatican)", pmos: 0, sle: 0 },
];

export const US_PAPER_COUNT: CountryPaperCount = { country: "US", pmos: 3824, sle: 15376 };
