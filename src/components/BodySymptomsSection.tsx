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
// Purpose: home-page "What is PMOS?" section — a large heading + definition,
// then a centered body diagram. Scroll-linked reveal: the figure pins in
// place (CSS position: sticky inside a tall wrapper) while the visitor
// scrolls through it. Once every symptom is shown the wrapper holds the
// finished picture a little longer, then its extra height runs out and the
// page resumes normal scrolling — no wheel-event hijacking involved.
// prefers-reduced-motion skips the pin entirely and shows every symptom at
// once in a static layout.
import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AdiposeDrawing, ADIPOSE_DRAWING_WIDTH } from "./AdiposeDrawing";
import {
  BrainOrgan,
  HeartOrgan,
  PancreasOrgan,
  UterusOrgan,
} from "./BodyOrgans";
import {
  FemaleFigure,
  FEMALE_FIGURE_HEIGHT,
  FEMALE_FIGURE_WIDTH,
} from "./FemaleFigure";
import { GutDrawing, GUT_DRAWING_WIDTH } from "./GutDrawing";
import { LiverDrawing, LIVER_DRAWING_WIDTH } from "./LiverDrawing";

// Wording supplied by the team ("Text for HOME PAGE", Section 3) — keep as
// written.
const OVERVIEW_TEXT =
  "Polyendocrine Metabolic Ovarian Syndrome, formerly known as Polycystic Ovary Syndrome (PCOS), is the most common metabolic and endocrine disorder affecting women of reproductive age.";

// Everything in the figure is laid out on one canvas: the team's female
// figure (FemaleFigure.tsx) scaled so the body is 400 units tall. The organs
// are positioned on it by eye against a render of the figure: roughly where
// they belong anatomically, but nudged apart and kept large enough that each
// one can be seen on its own.
const CANVAS_HEIGHT = 400;
const FIGURE_SCALE = CANVAS_HEIGHT / FEMALE_FIGURE_HEIGHT;
const CANVAS_WIDTH = Math.round(FEMALE_FIGURE_WIDTH * FIGURE_SCALE);

// The organ artwork (BodyOrgans.tsx) is in the old body diagram's units; on
// that diagram's own 400-tall canvas one of its units was this many canvas
// units. `artCenter` is an organ's centre on that old canvas.
const ORGAN_UNIT = 400 / 211.66667;

// Moves an organ so its centre lands on `center` (canvas units), `scale`
// times its original size.
function placeOrgan(
  artCenter: [number, number],
  center: [number, number],
  scale: number,
) {
  const k = ORGAN_UNIT * scale;
  return `translate(${center[0]} ${center[1]}) scale(${k}) translate(${-artCenter[0] / ORGAN_UNIT} ${-artCenter[1] / ORGAN_UNIT})`;
}

// Top to bottom. The brain sits high on the forehead; the heart in the
// chest; liver (viewer's left) and pancreas (viewer's right) side by side
// under the bust; the gut fills the belly with the fat tissue on the flank
// beside it; the uterus sits low in the pelvis, its base at the crotch.
const BRAIN_TRANSFORM = placeOrgan([101.5, 37], [105, 15], 0.95);
const HEART_TRANSFORM = placeOrgan([102, 105.5], [111, 100], 1.15);
const PANCREAS_TRANSFORM = placeOrgan([105.5, 143], [122, 134], 1.1);
const UTERUS_TRANSFORM = placeOrgan([100.5, 192.5], [106, 195], 0.95);
const LIVER_BOX = { x: 73, y: 120, width: 33 };
const GUT_BOX = { x: 88, y: 143, width: 36 };
const ADIPOSE_BOX = { x: 125, y: 153, width: 15 };

// The face, for the skin symptoms: follows the figure's own hairline and
// jaw, in the figure drawing's coordinates. Only shown while lit.
const FACE_PATH =
  "M193 62L216 50L244 42L253 27L268 56L271 75L268 92L262 110L252 122L236 128L215 124L204 113L195 95L191 75Z";

// The parts of the figure a symptom can light up (see App.css, .lit-*).
type Region =
  | "brain"
  | "hair"
  | "face"
  | "heart"
  | "liver"
  | "pancreas"
  | "adipose"
  | "gut"
  | "ovaries"
  | "uterus"
  | "reproductive";

interface SymptomGroup {
  id: string;
  side: "left" | "right";
  title: string;
  // Which part of the figure lights up for each symptom is our reading of
  // the team's notes, not something the source text specifies.
  symptoms: { label: string; region: Region }[];
}

// Group and symptom names as supplied by the team ("Text for HOME PAGE",
// Section 4), in the team's order.
const SYMPTOM_GROUPS: SymptomGroup[] = [
  {
    id: "hormonal",
    side: "left",
    title: "Hormonal and reproductive issues",
    symptoms: [
      { label: "Hyperandrogenism", region: "ovaries" },
      { label: "Hirsutism and androgenic alopecia", region: "hair" },
      { label: "Acne and oily skin", region: "face" },
      { label: "Anovulation", region: "ovaries" },
      { label: "Polycystic ovarian morphology", region: "ovaries" },
      { label: "Irregular or absent periods", region: "uterus" },
      { label: "Infertility", region: "reproductive" },
    ],
  },
  {
    id: "metabolic",
    side: "right",
    title: "Metabolic",
    symptoms: [
      { label: "Low grade chronic inflammation", region: "adipose" },
      { label: "Insulin resistance and hyperinsulinaemia", region: "pancreas" },
      { label: "Dyslipidaemia and raised cardiovascular risk", region: "heart" },
      { label: "Hepatic steatosis", region: "liver" },
    ],
  },
  {
    id: "wellbeing",
    side: "right",
    title: "Wellbeing",
    symptoms: [
      { label: "Anxiety and depression", region: "brain" },
      { label: "Diagnostic delay – mental burden", region: "brain" },
    ],
  },
  {
    id: "gut",
    side: "right",
    title: "Gut microbiome",
    symptoms: [{ label: "Reduced microbial diversity", region: "gut" }],
  },
];

// Reveal order: group by group, symptom by symptom.
const SYMPTOMS = SYMPTOM_GROUPS.flatMap((group) =>
  group.symptoms.map((symptom) => ({ ...symptom, groupId: group.id })),
);
const STEPS = SYMPTOMS.length;
const FIRST_INDEX_OF_GROUP = Object.fromEntries(
  SYMPTOM_GROUPS.map((group) => [
    group.id,
    SYMPTOMS.findIndex((symptom) => symptom.groupId === group.id),
  ]),
);

// Fallback used only for the very first paint, before the layout effect
// below measures the real pinned height and overwrites it.
const FALLBACK_WRAPPER_HEIGHT = 700 + STEPS * 160;

export function BodySymptomsSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [revealedState, setRevealedState] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const revealed = prefersReducedMotion ? STEPS : revealedState;
  // The symptom whose body part is lit: the one being pointed at, otherwise
  // the one most recently revealed by scrolling.
  const litIndex =
    hovered ?? (prefersReducedMotion || revealed === 0 ? null : revealed - 1);
  const lit = litIndex === null ? undefined : SYMPTOMS[litIndex];

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    const pinned = pinnedRef.current;
    if (!wrapper || !pinned) return;

    let frame: number | null = null;
    let stepPx = 160;

    // Each step "costs" a slice of the viewport's height to scroll through —
    // enough that a normal scroll/trackpad tick doesn't skip a symptom, short
    // enough that revealing all of them doesn't take forever. The extra hold
    // at the end keeps the finished picture pinned for a while before the
    // page moves on.
    const recomputeHeight = () => {
      stepPx = Math.max(110, Math.round(window.innerHeight * 0.2));
      const holdPx = Math.round(window.innerHeight * 0.6);
      wrapper.style.height = `${pinned.offsetHeight + STEPS * stepPx + holdPx}px`;
    };

    const updateProgress = () => {
      frame = null;
      const scrolled = -wrapper.getBoundingClientRect().top;
      const next = Math.min(
        STEPS,
        Math.max(0, Math.floor(scrolled / stepPx + 0.6)),
      );
      // Ratchet, not a mirror of scroll position: once a symptom has been
      // revealed, scrolling back up must not un-reveal it — only ever raise
      // the count, never lower it.
      setRevealedState((prev) => Math.max(prev, next));
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(updateProgress);
    };
    const onResize = () => {
      recomputeHeight();
      updateProgress();
    };

    recomputeHeight();
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  const renderGroup = (group: SymptomGroup) => {
    const first = FIRST_INDEX_OF_GROUP[group.id];
    return (
      <div
        key={group.id}
        className={`symptom-group symptom-group--${group.id}${first < revealed ? " symptom-group--visible" : ""}`}
      >
        <h3 className="symptom-group-title">{group.title}</h3>
        <ul className="symptom-group-list">
          {group.symptoms.map((symptom, offset) => {
            const index = first + offset;
            const isVisible = index < revealed;
            return (
              <li
                key={symptom.label}
                className={`symptom-item${isVisible ? " symptom-item--visible" : ""}${index === litIndex ? " symptom-item--lit" : ""}`}
                aria-hidden={!isVisible}
                onMouseEnter={() => isVisible && setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {symptom.label}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="body-symptoms-intro">
        <h2 className="body-symptoms-heading">What is PMOS?</h2>
        <p className="body-symptoms-blurb">{OVERVIEW_TEXT}</p>
      </div>
      <div
        className="body-symptoms-scroller"
        ref={wrapperRef}
        style={
          prefersReducedMotion ? undefined : { height: FALLBACK_WRAPPER_HEIGHT }
        }
      >
        <div
          className={`body-symptoms-pinned${prefersReducedMotion ? "" : " body-symptoms-pinned--sticky"}`}
          ref={pinnedRef}
        >
          <div className="body-symptoms-figure-row">
            <div className="body-symptoms-column body-symptoms-column--left">
              {SYMPTOM_GROUPS.filter((group) => group.side === "left").map(
                renderGroup,
              )}
            </div>

            <div className="body-symptoms-figure">
              {/* Back to front: the figure outline, the gut (so the organs
                  it overlaps are drawn on top of it), then the other
                  organs. While a symptom is lit the svg carries
                  `has-lit lit-<region>` plus its group's colour class, and
                  App.css makes that part itself glow and dims the rest.
                  Each part's wrapper <g> takes the CSS pulse, so it does
                  not fight the positioning transform on the artwork. */}
              <svg
                className={`body-symptoms-figure-svg${lit ? ` has-lit lit-${lit.region} symptom-group--${lit.groupId}` : ""}`}
                viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
                aria-hidden="true"
              >
                <FemaleFigure transform={`scale(${FIGURE_SCALE})`} />
                <path
                  className="body-symptoms-face"
                  transform={`scale(${FIGURE_SCALE})`}
                  d={FACE_PATH}
                />
                <g className="body-part body-part--gut">
                  <GutDrawing
                    transform={`translate(${GUT_BOX.x} ${GUT_BOX.y}) scale(${GUT_BOX.width / GUT_DRAWING_WIDTH})`}
                  />
                </g>
                <g className="body-part body-part--adipose">
                  <AdiposeDrawing
                    transform={`translate(${ADIPOSE_BOX.x} ${ADIPOSE_BOX.y}) scale(${ADIPOSE_BOX.width / ADIPOSE_DRAWING_WIDTH})`}
                  />
                </g>
                <g className="body-part body-part--liver">
                  <LiverDrawing
                    transform={`translate(${LIVER_BOX.x} ${LIVER_BOX.y}) scale(${LIVER_BOX.width / LIVER_DRAWING_WIDTH})`}
                  />
                </g>
                <g className="body-part body-part--pancreas">
                  <PancreasOrgan transform={PANCREAS_TRANSFORM} />
                </g>
                <g className="body-part body-part--heart">
                  <HeartOrgan transform={HEART_TRANSFORM} />
                </g>
                <g className="body-part body-part--uterus">
                  <UterusOrgan transform={UTERUS_TRANSFORM} />
                </g>
                <g className="body-part body-part--brain">
                  <BrainOrgan transform={BRAIN_TRANSFORM} />
                </g>
              </svg>
            </div>

            <div className="body-symptoms-column body-symptoms-column--right">
              {SYMPTOM_GROUPS.filter((group) => group.side === "right").map(
                renderGroup,
              )}
            </div>
          </div>

          {!prefersReducedMotion && (
            <p
              className={`body-symptoms-hint${revealed >= STEPS ? " body-symptoms-hint--done" : ""}`}
              aria-hidden="true"
            >
              Keep scrolling to see how PMOS affects the body ↓
            </p>
          )}
        </div>
      </div>
    </>
  );
}
