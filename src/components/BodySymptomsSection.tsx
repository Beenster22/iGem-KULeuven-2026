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
// Purpose: home-page "What is PMOS?" definition (PmosDefinition), and — the definition on its own
// the team's four symptom groups as cards (SymptomGroups, description page).
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
      <rect x="4" y="8" width="14" height="8" rx="4" transform="rotate(-30 11 12)" />
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
        explanation:
          "Increased levels of male hormones (androgens).",
      },
      {
        label: "Hirsutism and androgenic alopecia",
        definition: "Hirsutism: excessive male-pattern hair growth in women. Androgenic alopecia: hair thinning and hair loss.",
        explanation:
          "Irregular hair growth: excess hair on the face and body, and thinning hair on the scalp.",
      },
      {
        label: "Acne and oily skin",
        explanation:
          "Extra androgens make the skin produce more oil, which can cause breakouts.",
      },
      {
        label: "Anovulation",
        definition: "Absence of ovulation.",
        explanation:
          "Missing ovulation: the ovaries do not release an egg.",
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
    title: "Metabolic",
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
        label: "Dyslipidaemia and raised cardiovascular risk",
        definition: "Dyslipidaemia: abnormal levels of fats in the blood.",
        explanation:
          "Unhealthy levels of fats (lipids) in the blood, which raise the risk of heart and blood vessel disease.",
      },
      {
        label: "Hepatic steatosis",
        definition: "Fat buildup in the liver.",
        explanation:
          "Fat building up in the liver (fatty liver).",
      },
    ],
  },
  {
    id: "wellbeing",
    title: "Wellbeing",
    symptoms: [
      {
        label: "Anxiety and depression",
        explanation:
          "Psychological challenges: persistent worry, low mood and loss of interest are more common in PMOS.",
      },
      {
        label: "Diagnostic delay – mental burden",
        explanation:
          "Many women wait years and see several doctors before getting a diagnosis, which takes a toll on their mental health.",
      },
    ],
  },
  {
    id: "gut",
    title: "Gut microbiome",
    symptoms: [{
        label: "Reduced microbial diversity",
        explanation:
          "A less varied community of bacteria in the gut than in women without PMOS.",
      }],
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

interface HubLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// How far in from a card's corner a line starts, so it meets the straight
// part of the edge rather than the rounded corner.
const CORNER_INSET = 22;

export function SymptomGroups() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [lines, setLines] = useState<HubLine[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // The gut microbiome card sits in the middle and the other three around it,
  // joined to it by lines. Where those lines run depends on where the cards
  // end up (their heights follow their text), so they are measured rather
  // than guessed, and drawn in an overlay on top of the grid.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const base = grid.getBoundingClientRect();
      const rect = (id: string) => {
        const box = cardRefs.current[id]?.getBoundingClientRect();
        return box && {
          left: box.left - base.left,
          right: box.right - base.left,
          top: box.top - base.top,
          bottom: box.bottom - base.top,
        };
      };
      const gut = rect("gut");
      const hormonal = rect("hormonal");
      const metabolic = rect("metabolic");
      const wellbeing = rect("wellbeing");
      setSize({ width: base.width, height: base.height });
      // Below the width where the cards stack, there is nothing to join.
      if (!gut || !hormonal || !metabolic || !wellbeing || window.innerWidth < 900) {
        setLines([]);
        return;
      }
      setLines([
        {
          id: "hormonal",
          x1: hormonal.right - CORNER_INSET,
          y1: hormonal.bottom,
          x2: gut.left + CORNER_INSET,
          y2: gut.top,
        },
        {
          id: "metabolic",
          x1: metabolic.left + CORNER_INSET,
          y1: metabolic.bottom,
          x2: gut.right - CORNER_INSET,
          y2: gut.top,
        },
        {
          id: "wellbeing",
          x1: (gut.left + gut.right) / 2,
          y1: gut.bottom,
          x2: (wellbeing.left + wellbeing.right) / 2,
          y2: wellbeing.top,
        },
      ]);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    Object.values(cardRefs.current).forEach((card) => card && observer.observe(card));
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="symptoms-overview-grid" ref={gridRef}>
      {lines.length > 0 && (
        <svg
          className="symptoms-hub-lines"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          aria-hidden="true"
        >
          {lines.map((line) => (
            <g key={line.id}>
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
              <circle cx={line.x1} cy={line.y1} r={5} />
              <circle cx={line.x2} cy={line.y2} r={5} />
            </g>
          ))}
        </svg>
      )}
      {SYMPTOM_GROUPS.map((group) => (
        <article
          key={group.id}
          ref={(element) => {
            cardRefs.current[group.id] = element;
          }}
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
              <li key={symptom.label}>
                {symptom.definition || symptom.explanation ? (
                  <GlossaryTerm definition={(symptom.definition ?? symptom.explanation) as string}>
                    {symptom.label}
                  </GlossaryTerm>
                ) : (
                  symptom.label
                )}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
