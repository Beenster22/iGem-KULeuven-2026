// Generated with Claude Opus 5.5 (Anthropic), 2026-10-07
// Purpose: the AutoDock Vina binding affinities (kcal/mol) behind the docking
// heatmap on the Dry Lab page, transcribed from the team's own plot of the
// run. Rows are BSH homologs, columns bile salts; order matches the original
// figure. Values are the top-scoring pose per protein-ligand pair.
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
    homolog: "bcas",
    affinities: [-6.3, -6.0, -5.9, -6.1, -6.0, -5.9, -6.0, -6.5, -6.4, -5.9],
  },
  {
    homolog: "bdor",
    affinities: [-7.4, -5.3, -7.6, -7.7, -7.3, -6.6, -7.4, -7.3, -8.1, -8.1],
  },
  {
    homolog: "bgal",
    affinities: [-8.9, -8.7, -8.6, -8.8, -8.7, -8.0, -7.3, -7.8, -8.0, -8.6],
  },
  {
    homolog: "bifi",
    affinities: [-7.3, -7.4, -8.5, -8.5, -8.6, -7.5, -7.7, -8.5, -8.4, -8.5],
  },
  {
    homolog: "blong",
    affinities: [-8.4, -7.6, -7.5, -8.3, -8.7, -7.7, -7.4, -7.2, -7.0, -7.8],
  },
  {
    homolog: "bobe",
    affinities: [-9.6, -9.4, -9.4, -9.8, -10.0, -9.6, -9.3, -9.3, -9.7, -10.4],
  },
  {
    homolog: "bwex",
    affinities: [-9.7, -9.0, -9.0, -10.2, -9.9, -9.4, -8.8, -9.4, -9.3, -9.3],
  },
  {
    homolog: "caer",
    affinities: [-7.6, -7.5, -7.6, -7.7, -7.5, -7.5, -7.5, -7.4, -7.9, -7.5],
  },
  {
    homolog: "laci",
    affinities: [
      -9.4, -9.5, -10.2, -10.5, -10.5, -9.9, -9.1, -10.2, -10.5, -10.1,
    ],
  },
  {
    homolog: "lcri",
    affinities: [-8.1, -7.9, -8.0, -8.3, -8.4, -7.4, -7.5, -8.2, -8.5, -8.5],
  },
  {
    homolog: "lreu",
    affinities: [-8.0, -7.9, -8.0, -8.8, -8.6, -8.4, -8.3, -8.4, -8.5, -8.4],
  },
  {
    homolog: "lrham",
    affinities: [-6.5, -6.5, -6.6, -6.1, -6.0, -6.0, -6.0, -6.9, -6.1, -6.0],
  },
  {
    homolog: "pmer",
    affinities: [-0.7, 2.6, -3.2, 1.4, -4.6, 1.7, 12.8, -1.0, 0.7, 5.5],
  },
  {
    homolog: "ppleb",
    affinities: [-7.0, -6.9, -6.2, -7.0, -7.2, -6.9, -7.2, -7.1, -7.3, -7.2],
  },
  {
    homolog: "pvul1",
    affinities: [-5.7, -7.5, -7.5, -7.6, -4.3, -7.0, -7.8, -5.8, -5.8, -6.7],
  },
];
