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
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { GLOBE_LANDED, globeDropProgress, PMOS_EFFECTS_ID } from "./globeDrop";
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

const DROP_DURATION_MS = 1100;
// Wheel and touch input arriving just after the drop (a trackpad's momentum)
// is still swallowed for this long, so it doesn't carry the page on.
const DROP_SETTLE_MS = 400;
const EASE_IN_OUT_CUBIC = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request: the
// whole drop in one scroll): as soon as the page is scrolled into the
// stretch between the globe and this screen, it carries on by itself — down
// to this screen, so the globe falls and lands in one go, or back up to the
// globe if the scroll was upwards. The drop itself still follows the scroll
// position (see useGlobeDrop in PmosGlobe.tsx); this only moves the page.
// Scrolling input is held back while it plays.
function useGlobeDropAutoScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lastY = window.scrollY;
    let busyUntil = 0;
    let frame: number | null = null;

    const block = (event: Event) => {
      if (performance.now() < busyUntil) event.preventDefault();
    };
    const blockKeys = (event: KeyboardEvent) => {
      if (
        performance.now() < busyUntil &&
        [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)
      )
        event.preventDefault();
    };

    const glide = (to: number) => {
      const from = window.scrollY;
      const start = performance.now();
      busyUntil = start + DROP_DURATION_MS + DROP_SETTLE_MS;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DROP_DURATION_MS);
        window.scrollTo({
          top: from + (to - from) * EASE_IN_OUT_CUBIC(t),
          behavior: "instant",
        });
        frame = t < 1 ? requestAnimationFrame(tick) : null;
      };
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastY;
      lastY = y;
      if (performance.now() < busyUntil) return;
      const section = document.getElementById(PMOS_EFFECTS_ID);
      const progress = globeDropProgress();
      if (!section || progress === null || progress <= 0 || progress >= 1)
        return;
      const sectionTop = y + section.getBoundingClientRect().top;
      glide(down ? sectionTop : sectionTop - window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [enabled]);
}

// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request): the
// globe from the screen above now falls onto the first circle and becomes it
// (PmosGlobe.tsx) — all from a single scroll, see useGlobeDropAutoScroll;
// the moment it lands, the other circles come in by themselves one after
// another, left to right, from hormonal imbalance to psychological burden
// (the delays are --i in App.css).
export function PmosEffectsSection() {
  const prefersReducedMotion = useReducedMotion();
  const landed = useGlobeLanded(!prefersReducedMotion);
  useGlobeDropAutoScroll(!prefersReducedMotion);

  return (
    <section
      id={PMOS_EFFECTS_ID}
      className={`pmos-effects${landed ? " is-landed" : ""}`}
      data-snap=""
    >
      <h2 className="pmos-effects-title">
        PMOS manifests differently in patients
      </h2>
      <ul className="pmos-effects-grid">
        {EFFECTS.map((effect, i) => (
          <li
            key={effect.id}
            className={`pmos-effect symptom-group--${effect.id}`}
            style={{ "--i": i } as CSSProperties}
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
        className="pmos-effects-more"
        style={{ "--i": EFFECTS.length } as CSSProperties}
        to="/description"
      >
        See all symptoms on the project description page →
      </Link>
    </section>
  );
}
