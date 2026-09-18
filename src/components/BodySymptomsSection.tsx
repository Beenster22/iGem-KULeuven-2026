// Generated with Claude Sonnet 5 (Anthropic), 2026-09-18
// Purpose: home-page "What is PMOS?" section — heading + overview paragraph
// centered above a centered body diagram. Scroll-linked reveal: the section
// pins in place (CSS position: sticky inside a tall wrapper) while the
// visitor scrolls through it, popping up one symptom label at a time next to
// the body part it affects — connected by a bent leader line, like an
// infographic annotation, no card/tooltip box. Once all are shown, the
// wrapper's extra height runs out and the page resumes normal scrolling
// automatically — no wheel-event hijacking involved. prefers-reduced-motion
// skips the pin entirely and shows every label at once in a static layout.
import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BodyDiagram } from "./BodyDiagram";

interface SymptomStep {
  id: string;
  side: "left" | "right";
  label: string;
  blurb: string;
  // Anchor point in the row's virtual-canvas coordinate space (see
  // VIRTUAL_W/VIRTUAL_H below) — measured from BodyDiagram's own paths, so
  // the leader line starts exactly on the body part it's pointing at.
  anchor: [number, number];
  // Where this symptom's text sits, as a percentage down the row — assigned
  // per side independently of the anchor's own height (see the sketch this
  // is based on: labels stack in even slots beside the figure, and the bent
  // line is what connects each one back to its real spot on the body).
  slotTopPct: number;
}

// TODO: labels/blurbs below are a first-pass draft based on general PMOS
// (formerly PCOS) medical literature — verify wording/sources before this
// goes on the published wiki.
const OVERVIEW_TEXT =
  "PMOS (formerly PCOS) is one of the most common hormonal conditions affecting people with ovaries — but its effects reach far beyond the reproductive system. Disrupted hormone signaling and insulin resistance can touch the brain, heart, pancreas, and skin too. Scroll to see how, organ by organ.";

// The figure + its two label columns are laid out on a fixed virtual canvas
// (see body-symptoms-figure-row in App.css, which locks the row to this same
// 760:400 aspect ratio via CSS so every percentage below still lines up
// however large or small the row actually renders).
const VIRTUAL_W = 760;
const VIRTUAL_H = 400;
const LEFT_EDGE_X = 240; // where left-column text ends and its leader line starts
const RIGHT_EDGE_X = 520; // where right-column text starts and its leader line starts
const BEND_OFFSET = 30; // length of the flat segment leaving the body before the diagonal

// Ordered top-to-bottom down the body for the reveal sequence; side
// alternates so two anchors close together vertically (brain/hair, both in
// the head) never land in the same column and collide once both are shown.
const SYMPTOM_STEPS: SymptomStep[] = [
  {
    id: "brain",
    side: "left",
    label: "Brain",
    blurb: "Irregular hormone signals disrupt ovulation at the source.",
    anchor: [381, 37],
    slotTopPct: 15,
  },
  {
    id: "hair",
    side: "right",
    label: "Hair",
    blurb: "Excess androgens reshape hair growth — thicker on the face, thinner at the scalp.",
    anchor: [382, 47],
    slotTopPct: 25,
  },
  {
    id: "heart",
    side: "left",
    label: "Heart",
    blurb: "Raises long-term blood pressure and cardiovascular risk.",
    anchor: [382, 105],
    slotTopPct: 50,
  },
  {
    id: "pancreas",
    side: "right",
    label: "Pancreas",
    blurb: "Insulin resistance drives it to produce more insulin — and more androgens.",
    anchor: [386, 143],
    slotTopPct: 75,
  },
  {
    id: "uterus",
    side: "left",
    label: "Uterus & Ovaries",
    blurb: "Irregular shedding of the uterine lining raises long-term endometrial risk.",
    anchor: [381, 192],
    slotTopPct: 85,
  },
];

const STEPS = SYMPTOM_STEPS.length;
// Fallback used only for the very first paint, before the layout effect
// below measures the real pinned height and overwrites it.
const FALLBACK_WRAPPER_HEIGHT = 700 + STEPS * 380;

function pct(value: number, of: number) {
  return (value / of) * 100;
}

// A flat segment leaving the anchor, then a single diagonal into the label
// column's edge — the "elbow" leader-line look, built once from static data
// (no runtime measurement needed since the whole row scales as one unit).
function elbowPath(step: SymptomStep) {
  const [ax, ay] = step.anchor;
  const edgeX = step.side === "left" ? LEFT_EDGE_X : RIGHT_EDGE_X;
  const bendX = step.side === "left" ? ax - BEND_OFFSET : ax + BEND_OFFSET;
  const edgeY = (step.slotTopPct / 100) * VIRTUAL_H;
  return `M ${ax} ${ay} L ${bendX} ${ay} L ${edgeX} ${edgeY}`;
}

export function BodySymptomsSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [revealedState, setRevealedState] = useState(0);
  // Once every symptom has been seen once, the pin/scroll-jack mechanism is
  // pointless friction — it forces the same long scroll distance every time
  // the visitor passes back through, whichever direction they're going. So
  // this flips once (per page visit) and never resets, at which point the
  // section collapses back to a normal, short, static block (see the effect
  // below and the wrapper's conditional style/className further down).
  const [completed, setCompleted] = useState(false);
  const revealed = prefersReducedMotion || completed ? STEPS : revealedState;

  useLayoutEffect(() => {
    if (prefersReducedMotion || completed) {
      // Drop any tall height a previous (pre-completion) render left on the
      // wrapper via the imperative recomputeHeight() below — React's own
      // style prop won't clear it on its own here since, as an object with
      // the same literal shape every render, React's diffing sees no change
      // to reconcile (see FALLBACK_WRAPPER_HEIGHT's comment).
      if (wrapperRef.current) wrapperRef.current.style.height = "";
      return;
    }
    const wrapper = wrapperRef.current;
    const pinned = pinnedRef.current;
    if (!wrapper || !pinned) return;

    let frame: number | null = null;

    // Each step "costs" a chunk of the viewport's height to scroll through —
    // tall enough that a normal scroll/trackpad tick doesn't skip a step,
    // short enough that revealing all five doesn't take forever.
    const recomputeHeight = () => {
      const stepPx = Math.max(260, Math.round(window.innerHeight * 0.42));
      wrapper.style.height = `${pinned.offsetHeight + STEPS * stepPx}px`;
    };

    const updateProgress = () => {
      frame = null;
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - pinned.offsetHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      const next = Math.min(STEPS, Math.floor(progress * STEPS + 1e-6));
      // Ratchet, not a mirror of scroll position: once a symptom has been
      // revealed, scrolling back up must not un-reveal it — only ever raise
      // the count, never lower it.
      setRevealedState((prev) => Math.max(prev, next));
      if (next >= STEPS) setCompleted(true);
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
  }, [prefersReducedMotion, completed]);

  return (
    <div
      className="body-symptoms-scroller"
      ref={wrapperRef}
      style={prefersReducedMotion || completed ? undefined : { height: FALLBACK_WRAPPER_HEIGHT }}
    >
      <div
        className={`body-symptoms-pinned${!prefersReducedMotion && !completed ? " body-symptoms-pinned--sticky" : ""}`}
        ref={pinnedRef}
      >
        <div className="body-symptoms-intro">
          <h3 className="body-symptoms-heading">What is PMOS?</h3>
          <p className="body-symptoms-blurb">{OVERVIEW_TEXT}</p>
        </div>

        <div className="body-symptoms-figure-row">
          <svg
            className="body-symptoms-lines"
            viewBox={`0 0 ${VIRTUAL_W} ${VIRTUAL_H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {SYMPTOM_STEPS.map((step, index) => (
              <path
                key={step.id}
                d={elbowPath(step)}
                className={`symptom-callout-path${index < revealed ? " symptom-callout-path--visible" : ""}`}
              />
            ))}
            {SYMPTOM_STEPS.map((step, index) => (
              <circle
                key={step.id}
                cx={step.anchor[0]}
                cy={step.anchor[1]}
                r={4}
                className={`symptom-callout-dot${index < revealed ? " symptom-callout-dot--visible" : ""}`}
              />
            ))}
          </svg>

          <div className="body-symptoms-figure">
            <BodyDiagram className="body-symptoms-figure-svg" />
          </div>

          {SYMPTOM_STEPS.map((step, index) => {
            const isVisible = index < revealed;
            const edgePct = pct(step.side === "left" ? LEFT_EDGE_X : RIGHT_EDGE_X, VIRTUAL_W);
            return (
              <div
                key={step.id}
                className={`symptom-callout symptom-callout--${step.side}${isVisible ? " symptom-callout--visible" : ""}`}
                style={{
                  top: `${step.slotTopPct}%`,
                  [step.side === "left" ? "right" : "left"]: `${step.side === "left" ? 100 - edgePct : edgePct}%`,
                }}
                aria-hidden={!isVisible}
              >
                <strong>{step.label}</strong>
                <span>{step.blurb}</span>
              </div>
            );
          })}
        </div>

        {!prefersReducedMotion && !completed && (
          <p className={`body-symptoms-hint${revealed >= STEPS ? " body-symptoms-hint--done" : ""}`} aria-hidden="true">
            Keep scrolling to see how PMOS affects the body ↓
          </p>
        )}
      </div>
    </div>
  );
}
