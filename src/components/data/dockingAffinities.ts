// Generated with Claude Opus 5.5 (Anthropic), 2026-10-07
// Purpose: the AutoDock Vina binding affinities (kcal/mol) behind the docking
// heatmap on the Dry Lab page, transcribed from the team's own plot of the
// run. Rows are BSH candidates, columns bile salts. Values are the
// top-scoring pose per protein-ligand pair.
// Edited with Claude Opus 5 (Anthropic), 2026-10-15
// Purpose: rows are labelled by construct name (BSH1-BSH15) instead of the
// donor species abbreviation, which the team is not disclosing. Rows are now
// in construct order rather than the original figure's alphabetical order.
// Edited with Claude Opus 5 (Anthropic), 2026-10-17
// Purpose: the pose images have been re-uploaded under the BSH names, so the
// `poseSlug` species abbreviations they used to be addressed by are gone and
// the image URL is built from `homolog` again.
export const BILE_SALTS = [
  "glycochenodeoxycholic",
  "glycocholic",
  "glycodeoxycholic",
  "glycolithocholic",
  "glycoursodeoxycholic",
  "taurochenodeoxycholic",
  "taurocholic",
  "taurodeoxycholic",
  "taurolithocholic",
  "tauroursodeoxycholic",
] as const;

export type BileSalt = (typeof BILE_SALTS)[number];

export interface HomologRow {
  homolog: string;
  // One affinity per bile salt, in BILE_SALTS order.
  affinities: number[];
}

export const DOCKING_AFFINITIES: HomologRow[] = [
  {
    homolog: "BSH1",
    affinities: [-8.4, -7.6, -7.5, -8.3, -8.7, -7.7, -7.4, -7.2, -7.0, -7.8],
  },
  {
    homolog: "BSH2",
    affinities: [
      -9.4, -9.5, -10.2, -10.5, -10.5, -9.9, -9.1, -10.2, -10.5, -10.1,
    ],
  },
  {
    homolog: "BSH3",
    affinities: [-8.9, -8.7, -8.6, -8.8, -8.7, -8.0, -7.3, -7.8, -8.0, -8.6],
  },
  {
    homolog: "BSH4",
    affinities: [-8.1, -7.9, -8.0, -8.3, -8.4, -7.4, -7.5, -8.2, -8.5, -8.5],
  },
  {
    homolog: "BSH5",
    affinities: [-8.0, -7.9, -8.0, -8.8, -8.6, -8.4, -8.3, -8.4, -8.5, -8.4],
  },
  {
    homolog: "BSH6",
    affinities: [-9.7, -9.0, -9.0, -10.2, -9.9, -9.4, -8.8, -9.4, -9.3, -9.3],
  },
  {
    homolog: "BSH7",
    affinities: [-7.6, -7.5, -7.6, -7.7, -7.5, -7.5, -7.5, -7.4, -7.9, -7.5],
  },
  {
    homolog: "BSH8",
    affinities: [-5.7, -7.5, -7.5, -7.6, -4.3, -7.0, -7.8, -5.8, -5.8, -6.7],
  },
  {
    homolog: "BSH9",
    affinities: [-6.5, -6.5, -6.6, -6.1, -6.0, -6.0, -6.0, -6.9, -6.1, -6.0],
  },
  {
    homolog: "BSH10",
    affinities: [-7.0, -6.9, -6.2, -7.0, -7.2, -6.9, -7.2, -7.1, -7.3, -7.2],
  },
  {
    homolog: "BSH11",
    affinities: [-7.4, -5.3, -7.6, -7.7, -7.3, -6.6, -7.4, -7.3, -8.1, -8.1],
  },
  {
    homolog: "BSH12",
    affinities: [-0.7, 2.6, -3.2, 1.4, -4.6, 1.7, 12.8, -1.0, 0.7, 5.5],
  },
  {
    homolog: "BSH13",
    affinities: [-6.3, -6.0, -5.9, -6.1, -6.0, -5.9, -6.0, -6.5, -6.4, -5.9],
  },
  {
    homolog: "BSH14",
    affinities: [-9.6, -9.4, -9.4, -9.8, -10.0, -9.6, -9.3, -9.3, -9.7, -10.4],
  },
  {
    homolog: "BSH15",
    affinities: [-7.3, -7.4, -8.5, -8.5, -8.6, -7.5, -7.7, -8.5, -8.4, -8.5],
  },
];
