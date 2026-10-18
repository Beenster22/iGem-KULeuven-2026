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
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import {
  GLOBE_LANDED,
  globeDropProgress,
  globeDropRange,
  PMOS_EFFECTS_ID,
} from "./globeDrop";
import { BrainOrgan, UterusOrgan } from "./BodyOrgans";
import { GLIDE, glideStartRate } from "./scrollGlide";
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

// Each circle's drawing by id, for Elle's tour of the body below
// (ElleTour.tsx), which shows the same drawings close up.
export const EFFECT_ART: Record<string, Pick<Effect, "viewBox" | "art">> =
  Object.fromEntries(
    EFFECTS.map(({ id, viewBox, art }) => [id, { viewBox, art }]),
  );

// Whether the globe has landed on the first circle (see globeDrop.ts).
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback: a
// glitch just before the circle appears): the section's "is-landed" class
// is now also set straight on the element in the same frame the globe hides
// itself (useGlobeDrop in PmosGlobe.tsx), rather than only through React
// state, whose re-render could land a frame later and leave neither the
// globe nor the circle on screen for that frame.
function useGlobeLanded(
  enabled: boolean,
  sectionRef: RefObject<HTMLElement | null>,
) {
  const [landed, setLanded] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const now = (globeDropProgress() ?? 0) >= GLOBE_LANDED;
      sectionRef.current?.classList.toggle("is-landed", now);
      setLanded(now);
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
  }, [enabled, sectionRef]);

  return landed;
}

const DROP_DURATION_MS = 1100;
// Wheel and touch input arriving just after the drop (a trackpad's momentum)
// is still swallowed for this long, so it doesn't carry the page on.
const DROP_SETTLE_MS = 400;
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback: a
// glitch as the drop began): the glide used to start from a standstill
// (ease-in-out), so a page already being scrolled stopped dead for a moment
// and then sped up again; it now carries on at the speed the page was
// already moving and eases to a stop (see scrollGlide.ts).

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
    let lastTime = performance.now();
    let velocity = 0; // px per ms, smoothed
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
      const distance = to - from;
      const start = performance.now();
      busyUntil = start + DROP_DURATION_MS + DROP_SETTLE_MS;
      const startRate = glideStartRate(velocity, distance, DROP_DURATION_MS);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DROP_DURATION_MS);
        window.scrollTo({
          top: from + distance * GLIDE(t, startRate),
          behavior: "instant",
        });
        frame = t < 1 ? requestAnimationFrame(tick) : null;
      };
      tick(start);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const now = performance.now();
      const down = y > lastY;
      const dt = now - lastTime;
      if (dt > 0) {
        const sample = (y - lastY) / dt;
        // A gap of more than a few frames means the page had come to rest.
        velocity = dt > 100 ? sample : velocity * 0.5 + sample * 0.5;
      }
      lastY = y;
      lastTime = now;
      if (performance.now() < busyUntil) return;
      const progress = globeDropProgress();
      const range = globeDropRange();
      if (!range || progress === null || progress <= 0 || progress >= 1)
        return;
      // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback:
      // going back up wasn't smooth): back up, the glide now ends exactly
      // where the drop starts (it used to aim a screen above this one, which
      // could leave the globe half-dropped and set off a second glide).
      glide(down ? range.end : range.start);
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
  const sectionRef = useRef<HTMLElement>(null);
  const landed = useGlobeLanded(!prefersReducedMotion, sectionRef);
  useGlobeDropAutoScroll(!prefersReducedMotion);

  return (
    <section
      ref={sectionRef}
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
