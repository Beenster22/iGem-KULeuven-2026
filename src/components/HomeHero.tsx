// Purpose: intro animation for the top of the home page — zooms from a body
// figure into the gut, into the microbiome, into a single bacterium (the
// logo's motif), then pulls back out to reveal the team logo. See the
// STAGES config below to swap in real artwork once it exists.
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useThemeMode } from "../ThemeModeContext";

type ZoomDirection = "in" | "out";

interface Stage {
  key: string;
  alt: string;
  // How the animation transitions INTO this stage from the previous one:
  // "in" dives further into the previous image, "out" pulls back out of it.
  direction: ZoomDirection;
  // Percentage point (of this stage's own artwork) that the zoom homes in
  // on/pulls back from. Once real art replaces a placeholder below, update
  // this to match where the next/previous stage should visually connect.
  focal: { x: number; y: number };
  Art: React.FC;
}

const STAGE_DURATION_MS = 1900;

// ---------------------------------------------------------------------
// Placeholder artwork. TODO(design): replace each <XxxArt> component with
// real illustrations uploaded via the iGEM uploads tool (see README.md ->
// "Getting Started"), referencing the resulting static.igem.wiki URL the
// same way LogoArt below references the existing logo asset.
// ---------------------------------------------------------------------

const BODY_ART_SRC =
  "https://static.igem.wiki/teams/6299/wiki/animations/femalefigure.avif";

function BodyArt() {
  return <img src={BODY_ART_SRC} alt="" role="presentation" />;
}

function GutArt() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="400" height="300" fill="var(--color-header-bg)" />
      <path
        d="M120 90 Q160 60 200 90 T280 90 Q320 100 310 140 Q300 180 260 170 Q230 162 235 130 Q200 150 210 185 Q220 220 180 225 Q140 230 140 195 Q120 190 120 160 Q120 120 120 90 Z"
        fill="none"
        stroke="var(--color-header-text)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="222" cy="150" r="16" fill="var(--color-accent)" />
    </svg>
  );
}

function MicrobiomeArt() {
  const dots = [
    { x: 90, y: 80, r: 10 }, { x: 140, y: 130, r: 14 }, { x: 80, y: 190, r: 9 },
    { x: 180, y: 70, r: 11 }, { x: 260, y: 100, r: 13 }, { x: 300, y: 170, r: 10 },
    { x: 230, y: 220, r: 12 }, { x: 320, y: 60, r: 8 }, { x: 60, y: 130, r: 8 },
  ];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="400" height="300" fill="var(--color-header-bg)" />
      {dots.map((d, i) => (
        <ellipse
          key={i}
          cx={d.x}
          cy={d.y}
          rx={d.r}
          ry={d.r * 0.6}
          fill="var(--color-header-text)"
          opacity="0.55"
        />
      ))}
      <ellipse cx="200" cy="150" rx="26" ry="15" fill="var(--color-accent)" />
    </svg>
  );
}

function BacteriaArt() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="400" height="300" fill="var(--color-header-bg)" />
      <rect
        x="140"
        y="120"
        width="120"
        height="60"
        rx="30"
        fill="var(--color-accent)"
      />
      <circle cx="160" cy="130" r="4" fill="var(--color-header-bg)" opacity="0.6" />
      <circle cx="220" cy="165" r="5" fill="var(--color-header-bg)" opacity="0.6" />
      <circle cx="190" cy="145" r="3" fill="var(--color-header-bg)" opacity="0.6" />
    </svg>
  );
}

// Generated with Claude Sonnet 5 (Anthropic), 2026-07-29
// Purpose: the icon-only logo mark, swapped per theme — same asset as the
// navbar (see Navbar.tsx NAVBAR_LOGO_BY_MODE).
const LOGO_BY_MODE = {
  light:
    "https://static.igem.wiki/teams/6299/wiki/icons/logo-dark-purple-no-text.avif",
  dark: "https://static.igem.wiki/teams/6299/wiki/icons/logo-light-purple-no-text.avif",
} as const;

function LogoArt() {
  const { mode } = useThemeMode();
  return (
    <div className="home-hero-logo-stage">
      <img src={LOGO_BY_MODE[mode]} alt={`${import.meta.env.VITE_TEAM_NAME} logo`} />
    </div>
  );
}

const STAGES: Stage[] = [
  { key: "body", alt: "the human body", direction: "in", focal: { x: 50, y: 61 }, Art: BodyArt },
  { key: "gut", alt: "the gut", direction: "in", focal: { x: 55, y: 50 }, Art: GutArt },
  { key: "microbiome", alt: "the gut microbiome", direction: "in", focal: { x: 50, y: 50 }, Art: MicrobiomeArt },
  { key: "bacteria", alt: "a single bacterium", direction: "in", focal: { x: 50, y: 50 }, Art: BacteriaArt },
  { key: "logo", alt: "the team logo", direction: "out", focal: { x: 50, y: 50 }, Art: LogoArt },
];

// Entry starts *below* 1 for "in" stages (0.65) so the motion keeps growing
// the whole way through — arrive small, settle at 1, keep growing straight
// into the exit scale (2.3) with no reversal in direction at the handoff.
const entryScale = (direction: ZoomDirection) => (direction === "in" ? 0.65 : 0.55);
const exitScale = (direction: ZoomDirection) => (direction === "in" ? 2.3 : 0.5);

// Linear, not eased: an eased-out entry ending at zero velocity followed by
// an eased-in exit starting at zero velocity reads as a pause even with no
// time gap between them. Constant velocity through both keeps it moving.
const EASE = "linear" as const;
// Nearly fills the full STAGE_DURATION_MS window (only ~50ms buffer) so a
// stage is still moving right up until the next one takes over, instead of
// sitting fully still for the ~800ms that used to separate the two.
const TRANSITION_DURATION_S = 1.85;

// Every stage stays mounted for the component's lifetime; only its target
// opacity/scale changes as `stageIndex` advances. This avoids driving the
// crossfade through mount/unmount (AnimatePresence's enter/exit), which was
// unreliable for this always-fixed-length, index-driven sequence.
function layerTarget(index: number, stageIndex: number) {
  if (index === stageIndex) {
    return { opacity: 1, scale: 1, transition: { duration: TRANSITION_DURATION_S, ease: EASE } };
  }
  if (index === stageIndex - 1) {
    const direction = STAGES[stageIndex].direction;
    return {
      opacity: 0,
      scale: exitScale(direction),
      transition: { duration: TRANSITION_DURATION_S, ease: EASE },
    };
  }
  return { opacity: 0, scale: entryScale(STAGES[index].direction), transition: { duration: 0 } };
}

export function HomeHero() {
  const [stageIndex, setStageIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (prefersReducedMotion) {
      setStageIndex(STAGES.length - 1);
      return;
    }
    if (stageIndex >= STAGES.length - 1) return;
    timerRef.current = setTimeout(() => {
      setStageIndex((current) => current + 1);
    }, STAGE_DURATION_MS);
    return () => clearTimeout(timerRef.current);
  }, [stageIndex, prefersReducedMotion]);

  const summary = STAGES.map((s) => s.alt).join(", then ");

  return (
    <div className="home-hero" role="img" aria-label={`Animated introduction zooming from ${summary}.`}>
      {STAGES.map((stage, index) => {
        const Art = stage.Art;
        return (
          <motion.div
            key={stage.key}
            className="home-hero-layer"
            style={{ transformOrigin: `${stage.focal.x}% ${stage.focal.y}%` }}
            initial={false}
            animate={layerTarget(index, stageIndex)}
          >
            <Art />
          </motion.div>
        );
      })}
    </div>
  );
}
