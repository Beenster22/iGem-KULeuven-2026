// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: the rows of the Parts page, transcribed from the "Parts Page" sheet
// of the team's Completion Tracker workbook (code, name, part type, usage).
// Each code links to its page on the iGEM Registry, as in the sheet.
//
// Open question for the team: the sheet gives BBa_26KZW2V8 to both
// cfxA-mCherry and PAM3-NanoLuc. Kept as written; one of the two is almost
// certainly a copy-paste slip, so check the Registry and fix it here.
export type PartType = "Basic Part" | "Composite Part";

export interface Part {
  code: string;
  name: string;
  type: PartType;
  usage: string;
  // Marks the row with an asterisk and prints this text under its table.
  footnote?: string;
  // Optional link appended to the footnote text, closing with ").".
  footnoteLink?: { text: string; to: string };
}

export const PARTS: Part[] = [
  { code: "BBa_26KZW2V8", name: "cfxA-mCherry", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26NECIU3", name: "cfxA-NanoLuc", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26OP711K", name: "cfxA-KOFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26GG0JE9", name: "cfxA-GFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26KZW2V8", name: "PAM3-NanoLuc", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26ZYB3W5", name: "PAM3-mCherry", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26ZY6BGI", name: "PAM3-KOFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26OUK351", name: "PAM3-GFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26BBOCDP", name: "BT1311-NanoLuc", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26H8MAQU", name: "BT1311-mCherry", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_266L7BW6", name: "BT1311-KOFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26F5TJT5", name: "BT1311-GFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26CRMF30", name: "BT4001-NanoLuc", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26XB7TFA", name: "BT4001-mCherry", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26TL0CTV", name: "BT4001-KOFP7", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26S78MGZ", name: "BT4001-GFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26K7ORYG", name: "Bfp1E6-Nanoluc", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26HAQ60N", name: "Bfp1E6-KOFP7", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26VM4LBB", name: "Bfp1E6-mCherry", type: "Composite Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26OGTOKC", name: "Bfp1E6-GFP", type: "Composite Part", usage: "Promoter Reporter Library" },
  {
    code: "BBa_263M4C35",
    name: "Bfp1E6",
    type: "Basic Part",
    usage: "Promoter Reporter Library",
    footnote:
      "This part was submitted to the Registry by HZAU-China (2026), designed by Binbin He. We added the first documentation to it. We chose to use it because it was recommended to us by Prof. Dr. Weston Whitaker, who advised using strong, well-established promoters (see our",
    footnoteLink: {
      text: "Integrated Human Practices page",
      to: "/human-practices#weston-whitaker",
    },
  },
  { code: "BBa_26I902HD", name: "BT4001", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26ZSXZLD", name: "BT1311", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26N22478", name: "PAM", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26YAK9O9", name: "cfxA", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26QEHAQR", name: "rpiL", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26RRDVIB", name: "GFP", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26O5Q2UI", name: "KOFP-7", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26OFZ23W", name: "mCherry", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_264MT6BZ", name: "NanoLuc", type: "Basic Part", usage: "Promoter Reporter Library" },
  { code: "BBa_26TKMNW3", name: "rrnB T1", type: "Basic Part", usage: "Promoter Reporter Library" },
];
