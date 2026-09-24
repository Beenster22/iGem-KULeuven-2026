// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Purpose: home-page "two guts" section, the step between "What is PMOS?"
// and the BSH diagram. Two circular windows into the gut start identical;
// scrolling through the pinned section makes some bacterial groups in the
// "With PMOS" window get crowded out and replaced by a few dominant groups,
// so visitors watch diversity drop and the mix change. The composition bars
// underneath are computed from the cells actually drawn, so they always
// match the picture. This is an ILLUSTRATION, not data: the groups are
// generic shapes/colours, not real taxa. Same sticky-in-a-tall-wrapper
// technique as BodySymptomsSection (no wheel hijacking), but progress is
// continuous and reversible rather than a ratchet. prefers-reduced-motion
// skips the pin and shows the finished comparison.
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type Shape = "rod" | "short-rod" | "coccus" | "diplo" | "chain" | "curved" | "spiral";

interface Group {
  id: string;
  shape: Shape;
  color: string;
}

const GROUPS: Group[] = [
  { id: "a", shape: "rod", color: "#8f7fc4" },
  { id: "b", shape: "coccus", color: "#4fae9a" },
  { id: "c", shape: "chain", color: "#e0a84a" },
  { id: "d", shape: "curved", color: "#d9779b" },
  { id: "e", shape: "short-rod", color: "#6f9bd6" },
  { id: "f", shape: "diplo", color: "#8cc27a" },
  { id: "g", shape: "spiral", color: "#e2825a" },
];

// In the PMOS window these groups get crowded out, and each lost cell is
// taken over by one of the dominant groups.
const LOST = new Set(["c", "f", "g"]);
const DOMINANT = ["d", "e"];

const SLOTS = 49;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const VB = 300;
const CENTER = VB / 2;
const LENS_R = 138;

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface Slot {
  x: number;
  y: number;
  rotation: number;
  groupIndex: number;
  // Where in the scroll (0-1) this cell starts being replaced, if it is.
  threshold: number;
  replacementIndex: number;
  delay: number;
}

const SLOT_LAYOUT: Slot[] = Array.from({ length: SLOTS }, (_, i) => {
  const angle = i * GOLDEN_ANGLE + (seededValue(i + 3) - 0.5) * 0.4;
  const radius = Math.sqrt((i + 0.5) / SLOTS) * (LENS_R - 22);
  const groupIndex = i % GROUPS.length;
  const replacementId = DOMINANT[Math.floor(seededValue(i + 9) * DOMINANT.length)];
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
    rotation: Math.round(seededValue(i + 17) * 360),
    groupIndex,
    threshold: seededValue(i + 29) * 0.8,
    replacementIndex: GROUPS.findIndex((g) => g.id === replacementId),
    delay: -seededValue(i + 41) * 8,
  };
});

// 0 before this cell's threshold, 1 once it has fully swapped over.
function swapAmount(slot: Slot, progress: number) {
  if (!LOST.has(GROUPS[slot.groupIndex].id)) return 0;
  return Math.min(1, Math.max(0, (progress - slot.threshold) / 0.18));
}

function CellShape({ shape, color }: { shape: Shape; color: string }) {
  const stroke = "rgba(0, 0, 0, 0.28)";
  switch (shape) {
    case "rod":
      return <rect x={-17} y={-7} width={34} height={14} rx={7} fill={color} stroke={stroke} strokeWidth={1.5} />;
    case "short-rod":
      return <rect x={-10} y={-7} width={20} height={14} rx={7} fill={color} stroke={stroke} strokeWidth={1.5} />;
    case "coccus":
      return <circle r={8} fill={color} stroke={stroke} strokeWidth={1.5} />;
    case "diplo":
      return (
        <>
          <circle cx={-6} r={6} fill={color} stroke={stroke} strokeWidth={1.5} />
          <circle cx={6} r={6} fill={color} stroke={stroke} strokeWidth={1.5} />
        </>
      );
    case "chain":
      return (
        <>
          {[-11, 0, 11].map((cx) => (
            <circle key={cx} cx={cx} r={5} fill={color} stroke={stroke} strokeWidth={1.5} />
          ))}
        </>
      );
    case "curved":
      return <path d="M-14 5 Q0 -13 14 5" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />;
    case "spiral":
      return (
        <path d="M-16 0 q4 -8 8 0 t8 0 t8 0 t8 0" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
      );
  }
}

function GutWindow({ label, progress }: { label: string; progress: number }) {
  const clipId = `two-guts-clip-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <figure className="two-guts-window">
      <figcaption className="two-guts-window-label">{label}</figcaption>
      <svg viewBox={`0 0 ${VB} ${VB}`} className="two-guts-lens" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <circle cx={CENTER} cy={CENTER} r={LENS_R} />
          </clipPath>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={LENS_R} className="two-guts-lens-bg" />
        <g clipPath={`url(#${clipId})`}>
          {SLOT_LAYOUT.map((slot, i) => {
            const swap = swapAmount(slot, progress);
            const from = GROUPS[slot.groupIndex];
            const to = GROUPS[slot.replacementIndex];
            return (
              <g key={i} transform={`translate(${slot.x} ${slot.y}) rotate(${slot.rotation})`}>
                <g className="two-guts-cell" style={{ animationDelay: `${slot.delay}s` }}>
                  {swap < 1 && (
                    <g opacity={1 - swap} transform={`scale(${1 - swap * 0.6})`}>
                      <CellShape shape={from.shape} color={from.color} />
                    </g>
                  )}
                  {swap > 0 && (
                    <g opacity={swap} transform={`scale(${0.4 + swap * 0.6})`}>
                      <CellShape shape={to.shape} color={to.color} />
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </g>
        <circle cx={CENTER} cy={CENTER} r={LENS_R} className="two-guts-lens-rim" />
      </svg>
      <CompositionBar progress={progress} />
    </figure>
  );
}

// Share of each group among the cells currently drawn (a swapping cell
// counts partly for both), so the bar always mirrors the window above it.
function CompositionBar({ progress }: { progress: number }) {
  const weights = GROUPS.map(() => 0);
  for (const slot of SLOT_LAYOUT) {
    const swap = swapAmount(slot, progress);
    weights[slot.groupIndex] += 1 - swap;
    weights[slot.replacementIndex] += swap;
  }
  return (
    <div className="two-guts-bar" aria-hidden="true">
      {GROUPS.map((group, i) => (
        <span
          key={group.id}
          className="two-guts-bar-segment"
          style={{ flexGrow: weights[i], backgroundColor: group.color }}
        />
      ))}
    </div>
  );
}

interface TwoGutsSectionProps {
  heading: string;
  // Intro/explanation text and source line, written in home.mdx so the
  // science and citations stay in the team's content files.
  children?: ReactNode;
}

export function TwoGutsSection({ heading, children }: TwoGutsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [progressState, setProgressState] = useState(0);
  const progress = prefersReducedMotion ? 1 : progressState;

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    const pinned = pinnedRef.current;
    if (!wrapper || !pinned) return;

    let frame: number | null = null;

    // Roughly one and a half screens of scrolling to play the whole change.
    const recomputeHeight = () => {
      wrapper.style.height = `${pinned.offsetHeight + Math.round(window.innerHeight * 1.5)}px`;
    };

    const updateProgress = () => {
      frame = null;
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - pinned.offsetHeight;
      const next = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      setProgressState(Math.round(next * 200) / 200); // skip re-renders for sub-pixel scroll changes
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

  return (
    <div className="two-guts-scroller" ref={wrapperRef}>
      <div
        className={`two-guts-pinned${prefersReducedMotion ? "" : " two-guts-pinned--sticky"}`}
        ref={pinnedRef}
      >
        <h3 className="two-guts-heading">{heading}</h3>
        <div className="two-guts-intro">{children}</div>

        <div
          className="two-guts-row"
          role="img"
          aria-label="Illustration: two windows into the gut microbiome. Without PMOS, many different kinds of bacteria are evenly mixed. With PMOS, several kinds disappear and a few take over, so the community is less diverse and differently composed."
        >
          <GutWindow label="Without PMOS" progress={0} />
          <GutWindow label="With PMOS" progress={progress} />
        </div>

        <p className="two-guts-note">
          Illustration only: each shape and colour stands for a different group of gut bacteria; not measured data.
        </p>

        {!prefersReducedMotion && (
          <p className={`two-guts-hint${progress >= 1 ? " two-guts-hint--done" : ""}`} aria-hidden="true">
            Keep scrolling to see how the gut changes ↓
          </p>
        )}
      </div>
    </div>
  );
}
