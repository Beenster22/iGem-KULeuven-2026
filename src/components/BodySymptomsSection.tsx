// Generated with Claude Sonnet 5 (Anthropic), 2026-09-18
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-01: the heading +
// overview paragraph are now their own near-full-screen block above the
// pinned figure (team feedback: make "What is PMOS?" stand out, with a
// further scroll leading to the figure).
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-03: reworked to the
// team's "Text for HOME PAGE" (Sections 3–4) — the per-organ callouts are
// replaced by the team's four colour-coded symptom groups, listed either
// side of the body and revealed one symptom per scroll step while the part
// of the body it concerns lights up. Added the team's hand-drawn gut
// (GutDrawing.tsx), liver (LiverDrawing.tsx) and adipose tissue
// (AdiposeDrawing.tsx) to the figure. The body itself is now the team's
// own figure drawing (FemaleFigure.tsx), with the existing organ artwork
// (BodyOrgans.tsx) placed on it.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-05: the definition and the
// figure are now two of the home page's full-screen sections (see
// HomeSnapScroll.tsx). The symptoms appear a whole group at a time, one
// group per scroll step, instead of one by one; the symptoms are styled as
// things to point at, a hint under the figure says so, and until the visitor
// has tried it the newest group's symptoms take turns lighting up their body
// part by themselves.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-06: the definition is its
// own component (PmosDefinition) so home.mdx can place it straight after the
// hero video, ahead of the counter and the globe (team request).
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-15 (team feedback: too
// complex for a home page): the pinned body figure, scroll-step reveal and
// hover-to-light-up are gone. The four symptom groups are now four cards on
// one screen, each with a simple drawn icon and its symptoms as chips.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-15 (team request): the
// four symptom cards moved to the Project description page as
// SymptomGroups (no full-screen band, no title of its own — the page's
// heading introduces it). The home page now shows PmosEffectsSection
// (PmosEffectsSection.tsx) in their place.
// Purpose: home-page "What is PMOS?" definition (PmosDefinition), and — the definition on its own
// the team's four symptom groups as cards (SymptomGroups, description page).
import type { ReactNode } from "react";
import { FALLING_M_SOURCE_ATTR } from "./useFallingM";

// Wording supplied by the team ("Text for HOME PAGE", Section 3) — keep as
// written. Edited with Claude Opus 5.5 (Anthropic), 2026-10-06: the team's
// one sentence is now laid out in three parts (team request) — the name
// spelled out down the left, one word per letter of PMOS, the "formerly
// known as" note under it, and the rest of the sentence beside it.
const PMOS_WORDS = ["Polyendocrine", "Metabolic", "Ovarian", "Syndrome"];
const FORMER_NAME_TEXT = "Formerly known as Polycystic Ovary Syndrome (PCOS)";
const OVERVIEW_TEXT =
  "The most common metabolic and endocrine disorder affecting women of reproductive age.";

// Simple line icons, one per group (drawn for this section, 24×24 grid).
const ICONS: Record<string, ReactNode> = {
  // Venus symbol.
  hormonal: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V22M8.5 18.5h7" />
    </>
  ),
  // A drop, with a small highlight.
  metabolic: (
    <>
      <path d="M12 2.5C9 7 5.5 10.5 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10.5 15 7 12 2.5Z" />
      <path d="M9 15a3 3 0 0 0 2.5 3" />
    </>
  ),
  // A thought cloud.
  wellbeing: (
    <>
      <path d="M7 16.5a4 4 0 0 1-.6-7.95A5 5 0 0 1 16 7.2a4 4 0 0 1 1.5 7.7 3 3 0 0 1-3.5 1.6Z" />
      <circle cx="7.5" cy="19.5" r="1.3" />
      <circle cx="4.5" cy="22" r="0.8" />
    </>
  ),
  // A rod-shaped bacterium with flagella.
  gut: (
    <>
      <rect x="4" y="8" width="14" height="8" rx="4" transform="rotate(-30 11 12)" />
      <path d="M17.5 6.5c1.5-1 2.5-.5 3.5-2M18.5 9c1.8-.2 2.6.6 3.8.1M4.5 17.5c-1.5 1-1.8 2.3-3 2.8" />
      <circle cx="9" cy="13" r="0.9" />
      <circle cx="12.5" cy="10.5" r="0.9" />
    </>
  ),
};

interface SymptomGroup {
  id: string;
  title: string;
  symptoms: string[];
}

// Group and symptom names as supplied by the team ("Text for HOME PAGE",
// Section 4), in the team's order.
const SYMPTOM_GROUPS: SymptomGroup[] = [
  {
    id: "hormonal",
    title: "Hormonal and reproductive issues",
    symptoms: [
      "Hyperandrogenism",
      "Hirsutism and androgenic alopecia",
      "Acne and oily skin",
      "Anovulation",
      "Polycystic ovarian morphology",
      "Irregular or absent periods",
      "Infertility",
    ],
  },
  {
    id: "metabolic",
    title: "Metabolic",
    symptoms: [
      "Low grade chronic inflammation",
      "Hyperinsulinaemia",
      "Dyslipidaemia and raised cardiovascular risk",
      "Hepatic steatosis",
    ],
  },
  {
    id: "wellbeing",
    title: "Wellbeing",
    symptoms: ["Anxiety and depression", "Diagnostic delay – mental burden"],
  },
  {
    id: "gut",
    title: "Gut microbiome",
    symptoms: ["Reduced microbial diversity"],
  },
];

export function PmosDefinition() {
  return (
    <div className="body-symptoms-intro" data-snap="">
      <div className="body-symptoms-definition">
        <div className="body-symptoms-name">
          <p
            className="body-symptoms-acrostic"
            aria-label={PMOS_WORDS.join(" ")}
          >
            {PMOS_WORDS.map((word) => (
              <span key={word} aria-hidden="true">
                {/* The M of "Metabolic" later falls down into the counter
                    below and becomes the M of "Million" (useFallingM.ts). */}
                <span
                  className="body-symptoms-acrostic-letter"
                  {...(word === "Metabolic" ? { [FALLING_M_SOURCE_ATTR]: "" } : {})}
                >
                  {word[0]}
                </span>
                {word.slice(1)}
              </span>
            ))}
          </p>
          <p className="body-symptoms-former-name">{FORMER_NAME_TEXT}</p>
        </div>
        <p className="body-symptoms-blurb">{OVERVIEW_TEXT}</p>
      </div>
    </div>
  );
}

export function SymptomGroups() {
  return (
    <div className="symptoms-overview-grid">
      {SYMPTOM_GROUPS.map((group) => (
        <article
          key={group.id}
          className={`symptom-card symptom-group--${group.id}`}
        >
          <div className="symptom-card-head">
            <svg
              className="symptom-card-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {ICONS[group.id]}
            </svg>
            <h3 className="symptom-card-title">{group.title}</h3>
          </div>
          <ul className="symptom-card-list">
            {group.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
