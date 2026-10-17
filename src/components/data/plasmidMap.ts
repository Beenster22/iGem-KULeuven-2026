// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-17
// Purpose: the pBSH-Cas9 plasmid map (results.mdx, "The construct"). One
// entry per row of the team's own component/role table, in the order the
// team's higher-resolution map draws them clockwise from oriT at the top,
// with a `weight` (relative feature length) used to size each arc and a
// `color` sampled from that map, reused to shade the table's component
// column so the two agree. `arrow: true` marks a coding sequence or
// selection marker, drawn with a directional arrowhead the way the map does;
// origins, sites and small regulatory features are drawn as plain blocks.
export interface PlasmidFeature {
  id: string;
  label: string;
  role: string;
  weight: number;
  color: string;
  arrow?: boolean;
}

export const PLASMID_NAME = "pBSH-Cas9";

export const PLASMID_FEATURES: PlasmidFeature[] = [
  {
    id: "oriT",
    label: "oriT",
    role: "Origin of transfer for mobilization",
    weight: 1,
    color: "#d6d6da",
  },
  {
    id: "ampr",
    label: "AmpR",
    role: "Selection marker (E. coli)",
    weight: 3,
    color: "#2b2136",
    arrow: true,
  },
  {
    id: "r6k",
    label: "R6K γ ori",
    role: "Conditional origin (pir-specific replication origin)",
    weight: 1.5,
    color: "#74747c",
  },
  {
    id: "pb851",
    label: "pB8-51",
    role: "Bacteroides plasmid replication origin",
    weight: 1.5,
    color: "#8a8a91",
  },
  {
    id: "cat",
    label: "Cat",
    role: "Chloramphenicol selection marker (P. vulgatus)",
    weight: 2.5,
    color: "#2b2136",
    arrow: true,
  },
  {
    id: "pcas9",
    label: "PCas9",
    role: "Cfx promoter to drive Cas9 expression",
    weight: 0.6,
    color: "#3a3a42",
  },
  {
    id: "rbs",
    label: "rpiL RBS",
    role: "Ribosome binding site",
    weight: 0.4,
    color: "#c3c3c8",
  },
  {
    id: "cas9",
    label: "Cas9",
    role: "Coding sequence",
    weight: 5,
    color: "#7d5a9e",
    arrow: true,
  },
  {
    id: "pgrna",
    label: "PgRNA",
    role: "Bfp promoter to drive gRNA expression",
    weight: 0.6,
    color: "#3a3a42",
  },
  {
    id: "term",
    label: "rrnB T1 terminator",
    role: "Transcription terminator",
    weight: 0.4,
    color: "#b7bcc2",
  },
  {
    id: "hal",
    label: "HAL",
    role: "Homology arm (left)",
    weight: 1.5,
    color: "#54a2a7",
  },
  {
    id: "har",
    label: "HAR",
    role: "Homology arm (right)",
    weight: 1.5,
    color: "#54a2a7",
  },
  {
    id: "bsh",
    label: "Replacement BSH",
    role: "Coding sequence (BSH enzyme)",
    weight: 2,
    color: "#e6f3f3",
    arrow: true,
  },
];
