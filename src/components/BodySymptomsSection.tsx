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
// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request): symptom
// chips show an explanation on hover/focus again (text supplied by the team).
// Edited with Claude Sonnet 5 (Anthropic), 2026-10-20 (team feedback): the
// puzzle wrapper now has id="symptoms" so PmosEffectsSection's "See all
// symptoms" link can jump straight to it instead of the page top.
// Purpose: home-page "What is PMOS?" definition (PmosDefinition), and — the definition on its own
// the team's four symptom groups as cards (SymptomGroups, description page).
import type { ReactNode } from "react";
import { GlossaryTerm } from "./GlossaryTerm";
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
      <rect
        x="4"
        y="8"
        width="14"
        height="8"
        rx="4"
        transform="rotate(-30 11 12)"
      />
      <path d="M17.5 6.5c1.5-1 2.5-.5 3.5-2M18.5 9c1.8-.2 2.6.6 3.8.1M4.5 17.5c-1.5 1-1.8 2.3-3 2.8" />
      <circle cx="9" cy="13" r="0.9" />
      <circle cx="12.5" cy="10.5" r="0.9" />
    </>
  ),
};

interface Symptom {
  label: string;
  // Shown in a tooltip on hover / keyboard focus. Supplied by the team; a
  // symptom without one gets no tooltip.
  explanation?: string;
  // The term explained by Elle in a bubble when it is clicked (see
  // GlossaryTerm.tsx), as on the funding table of the Entrepreneurship page.
  // Takes the place of the hover tooltip for this symptom. Supplied by the team
  // (2026-10-20).
  definition?: string;
}

interface SymptomGroup {
  id: string;
  title: string;
  symptoms: Symptom[];
}

// Group and symptom names as supplied by the team ("Text for HOME PAGE",
// Section 4), in the team's order.
const SYMPTOM_GROUPS: SymptomGroup[] = [
  {
    id: "hormonal",
    title: "Hormonal and reproductive issues",
    symptoms: [
      {
        label: "Hyperandrogenism",
        definition: "Elevated male hormone levels.",
        explanation: "Increased levels of male hormones (androgens).",
      },
      {
        label: "Hirsutism",
        definition: "Excessive male-pattern hair growth in women.",
        explanation: "Irregular hair growth: excess hair on the face and body.",
      },
      {
        label: "Androgenic alopecia",
        definition: "Hair thinning and hair loss.",
        explanation: "Thinning hair on the scalp.",
      },

      {
        label: "Acne and oily skin",
        explanation:
          "Extra androgens make the skin produce more oil, which can cause breakouts.",
      },
      {
        label: "Anovulation",
        definition: "Absence of ovulation.",
        explanation: "Missing ovulation: the ovaries do not release an egg.",
      },
      {
        label: "Polycystic ovarian morphology",
        definition: "Ovaries containing multiple immature eggs.",
        explanation:
          "Ovaries with undeveloped follicles that look like cysts on an ultrasound.",
      },
      {
        label: "Irregular or absent periods",
        explanation:
          "Cycles that are infrequent, unpredictable or missing altogether, often because ovulation does not happen.",
      },
      {
        label: "Infertility",
        explanation:
          "Difficulty getting pregnant, mostly as a result of missing ovulation.",
      },
    ],
  },
  {
    id: "metabolic",
    title: "Metabolic complications",
    symptoms: [
      {
        label: "Low grade chronic inflammation",
        definition: "Persistent, low-level inflammation throughout the body.",
        explanation:
          "A mild but long-lasting activation of the immune system, often linked to excess body fat.",
      },
      {
        label: "Hyperinsulinaemia",
        definition: "High insulin levels in the blood.",
        explanation:
          "Higher than normal insulin levels in the blood, as the body tries to compensate for a reduced response to insulin.",
      },
      {
        label: "Dyslipidaemia",
        definition: "Abnormal levels of fats in the blood.",
        explanation: "Unhealthy levels of fats (lipids) in the blood.",
      },
      {
        label: "Raised cardiovascular risk",
        definition: "A higher risk of heart and blood vessel disease.",
        explanation:
          "Unhealthy blood fats raise the risk of heart and blood vessel disease.",
      },

      {
        label: "Hepatic steatosis",
        definition: "Fat buildup in the liver.",
        explanation: "Fat building up in the liver (fatty liver).",
      },
    ],
  },
  {
    id: "wellbeing",
    title: "Psychological symptoms",
    symptoms: [
      {
        label: "Anxiety",
        explanation: "Persistent worry is more common in PMOS.",
      },
      {
        label: "Depression",
        explanation: "Low mood and loss of interest are more common in PMOS.",
      },
      {
        label: "Mental burden",
        explanation:
          "Many women wait years and see several doctors before getting a diagnosis, which takes a toll on their mental health.",
      },
    ],
  },
  {
    id: "gut",
    title: "Reduced microbial diversity",
    symptoms: [
      {
        label: "Reduced microbial diversity",
        explanation:
          "A less varied community of bacteria in the gut than in healthy women.",
      },
    ],
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
                  {...(word === "Metabolic"
                    ? { [FALLING_M_SOURCE_ATTR]: "" }
                    : {})}
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

// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request): the
// four cards are now a jigsaw — wellbeing across the top, hormonal and
// metabolic below it either side (hormonal left, metabolic right), and the
// gut microbiome as the missing piece in the middle that the other three are
// cut around (clip-paths in App.css, .symptoms-puzzle). DOM order is the
// phone's stacking order.
const PUZZLE_ORDER = ["wellbeing", "gut", "hormonal", "metabolic"];
const PUZZLE_SLOTS = ["top", "gut", "left", "right"];

export function SymptomGroups() {
  const groups = PUZZLE_ORDER.map(
    (id) => SYMPTOM_GROUPS.find((g) => g.id === id)!,
  );
  return (
    <div className="symptoms-puzzle-wrap" id="symptoms">
      <div className="symptoms-puzzle">
        {groups.map((group) => (
          <article
            key={group.id}
            className={`symptom-card symptom-piece--${PUZZLE_SLOTS[groups.indexOf(group)]} symptom-group--${group.id}`}
          >
            <div className="symptom-card-head">
              <svg
                className="symptom-card-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {ICONS[group.id]}
              </svg>
              <h3 className="symptom-card-title">
                {group.id === "gut" ? (
                  <GlossaryTerm
                    hover
                    definition={group.symptoms[0].explanation as string}
                  >
                    {group.title}
                  </GlossaryTerm>
                ) : (
                  group.title
                )}
              </h3>
            </div>
            {group.id !== "gut" && (
              <ul className="symptom-card-list">
                {group.symptoms.map((symptom) => (
                  <li key={symptom.label}>
                    {symptom.definition || symptom.explanation ? (
                      <GlossaryTerm
                        hover
                        definition={
                          (symptom.definition ?? symptom.explanation) as string
                        }
                      >
                        {symptom.label}
                      </GlossaryTerm>
                    ) : (
                      symptom.label
                    )}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
