// Generated with Claude Opus 5.5 (Anthropic), 2026-10-15
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-15: the panels are now
// the team's four labels (hormonal imbalance, reproductive issues,
// metabolic complications, psychological burden); the gut panel is gone.
// Purpose: home-page section on how PMOS affects women, replacing the
// symptom cards (which moved to the Project description page as
// SymptomGroups, see BodySymptomsSection.tsx). One panel per area PMOS
// affects: a steroid-hormone molecule (drawn here — the team has no
// drawing for this one), then the team's own uterus and ovaries and brain
// (BodyOrgans.tsx) and liver (LiverDrawing.tsx). Colours match the symptom
// groups' (.symptom-group--*).
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { GLOBE_LANDED, globeDropProgress, PMOS_EFFECTS_ID } from "./globeDrop";
import { SnapSteps } from "./HomeSnapScroll";
import { usePinnedStep } from "./usePinnedStep";
import { BrainOrgan, UterusOrgan } from "./BodyOrgans";
import {
  LIVER_DRAWING_HEIGHT,
  LIVER_DRAWING_WIDTH,
  LiverDrawing,
} from "./LiverDrawing";

// The four-ring steroid skeleton shared by sex hormones such as
// testosterone: three hexagons and a pentagon, with the two methyl groups
// as short stubs. Line art on a regular-hexagon grid (side 10).
const STEROID_MOLECULE = (
  <g
    className="pmos-effect-molecule"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0 -10 8.66 -5 8.66 5 0 10 -8.66 5 -8.66 -5Z" />
    <path d="M8.66 -5 17.32 -10 25.98 -5 25.98 5 17.32 10 8.66 5" />
    <path d="M17.32 -10 17.32 -20 25.98 -25 34.64 -20 34.64 -10 25.98 -5" />
    <path d="M34.64 -20 44.15 -23.09 50.03 -15 44.15 -6.91 34.64 -10" />
    <path d="M8.66 -5V-12M34.64 -20V-27" />
  </g>
);

interface Effect {
  id: string;
  label: string;
  // The drawing's bounds in its own coordinates. BodyOrgans' organs sit in
  // the body diagram's coordinates, so theirs were measured with getBBox().
  viewBox: string;
  art: ReactNode;
}

// Labels as supplied by the team (2026-10-15).
const EFFECTS: Effect[] = [
  {
    id: "hormonal",
    label: "Hormonal imbalance",
    viewBox: "-12 -30 65 43",
    art: STEROID_MOLECULE,
  },
  {
    id: "reproductive",
    label: "Reproductive issues",
    viewBox: "38.5 92.9 29.7 17.8",
    art: <UterusOrgan />,
  },
  {
    id: "metabolic",
    label: "Metabolic complications",
    viewBox: `0 0 ${LIVER_DRAWING_WIDTH} ${LIVER_DRAWING_HEIGHT}`,
    art: <LiverDrawing />,
  },
  {
    id: "wellbeing",
    label: "Psychological burden",
    viewBox: "44 14.25 19.4 10.7",
    art: <BrainOrgan />,
  },
];

// Whether the globe has landed on the first circle (see globeDrop.ts).
function useGlobeLanded(enabled: boolean) {
  const [landed, setLanded] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    let frame: number | null = null;
    const update = () => {
      frame = null;
      setLanded((globeDropProgress() ?? 0) >= GLOBE_LANDED);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return landed;
}

// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request): the
// globe from the screen above now falls onto the first circle and becomes it
// (PmosGlobe.tsx), and the screen stays pinned while the circles come in one
// per scroll step, left to right, from hormonal imbalance to psychological
// burden.
export function PmosEffectsSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const step = usePinnedStep(wrapperRef, EFFECTS.length);
  const landed = useGlobeLanded(!prefersReducedMotion);
  const shown = (i: number) => prefersReducedMotion || (landed && i <= step);

  return (
    <div
      id={PMOS_EFFECTS_ID}
      className={prefersReducedMotion ? undefined : "home-snap-pin"}
      ref={wrapperRef}
      style={{ "--snap-steps": EFFECTS.length } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={EFFECTS.length} />}
      <section
        className={`pmos-effects${prefersReducedMotion ? "" : " home-snap-stage"}`}
      >
        <h2 className="pmos-effects-title">
          PMOS manifests differently in patients
        </h2>
        <ul className="pmos-effects-grid">
          {EFFECTS.map((effect, i) => (
            <li
              key={effect.id}
              className={`pmos-effect symptom-group--${effect.id}${shown(i) ? " is-shown" : ""}`}
            >
              <div className="pmos-effect-art">
                <svg
                  viewBox={effect.viewBox}
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  {effect.art}
                </svg>
              </div>
              <h3 className="pmos-effect-label">{effect.label}</h3>
            </li>
          ))}
        </ul>
        <Link
          className={`pmos-effects-more${shown(EFFECTS.length - 1) ? " is-shown" : ""}`}
          to="/description"
        >
          See all symptoms on the project description page →
        </Link>
      </section>
    </div>
  );
}
