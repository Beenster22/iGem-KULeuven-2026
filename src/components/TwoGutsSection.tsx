// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-01: removed the
// scroll-pinned transition — both windows now show their final state
// straight away so the difference is obvious at a glance — and made the
// bacteria larger and livelier.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-03: the colours now stand
// for the bacterial groups named in the team's "Text for HOME PAGE"
// (Section 5), with the mix in each window and a legend following the
// team's table there.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-04: legend now only names
// the groups (no INCREASE/DECREASE labels), and the "With PMOS" window has
// fewer "other" bacteria and more of the two dominating groups. Bacteroides are drawn as capsules (and Lactobacilli
// and Bifidobacteria as the curved cells instead), and the lowest one in the
// "With PMOS" window is marked data-pv-zoom-source: it is the cell that
// BshStreamAnimation.tsx lifts out and enlarges on the way to the next
// section, so it stays still rather than drifting.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-05: one window instead of
// two, shown over two scroll steps of a pinned full-screen section (see
// HomeSnapScroll.tsx): first the healthy gut on the left with its text on the
// right, then the same window slides to the right while its bacteria change
// to the PMOS mix and the text gives way to the PMOS text on the left.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-06 (team request): the
// section's title is gone (StoryScrollSection.tsx now leads into it), and the
// two captions under the window and the sentence beside it in each state use
// the team's new wording.
// Purpose: home-page gut-microbiome section, the step between "What is
// PMOS?" and the BSH diagram. A circular window into the gut: with PMOS two
// groups have increased at the expense of the others, so diversity is
// visibly lower and the mix different. The composition bar underneath is
// computed from the cells actually drawn, so it always matches the picture.
// This is an ILLUSTRATION, not data: which groups go up or down follows the
// team's source, but the cell counts are only chosen to show that direction.
// The cells drift and turn on a CSS loop (off under prefers-reduced-motion,
// see App.css).
import { useRef, type CSSProperties } from "react";
import { SnapSteps } from "./HomeSnapScroll";
import { usePinnedStep } from "./usePinnedStep";

type Shape =
  | "rod"
  | "capsule"
  | "short-rod"
  | "coccus"
  | "diplo"
  | "chain"
  | "curved"
  | "spiral";

interface Group {
  id: string;
  shape: Shape;
  color: string;
  // Cells drawn without PMOS and with PMOS.
  healthy: number;
  pmos: number;
}

// Counts follow the team's table: without PMOS the purple group is the most
// abundant, pink and blue are level, teal sits just below them and the three
// "other" groups are unchanged; with PMOS pink and blue increase while every
// other group shrinks, the "other" groups down to a single cell each so the
// two dominating groups stand out. Both columns add up to the same number of
// cells.
const GROUPS: Group[] = [
  { id: "a", shape: "curved", color: "#8f7fc4", healthy: 8, pmos: 4 },
  { id: "b", shape: "coccus", color: "#4fae9a", healthy: 5, pmos: 3 },
  { id: "c", shape: "chain", color: "#e0a84a", healthy: 4, pmos: 1 },
  { id: "d", shape: "capsule", color: "#d9779b", healthy: 6, pmos: 14 },
  { id: "e", shape: "short-rod", color: "#6f9bd6", healthy: 6, pmos: 13 },
  { id: "f", shape: "diplo", color: "#8cc27a", healthy: 4, pmos: 1 },
  { id: "g", shape: "spiral", color: "#e2825a", healthy: 4, pmos: 1 },
];

// Legend entries, named as in the team's text: it only says which colour is
// which group. Entries with `italic` are bacterial names, set in italics.
const LEGEND: {
  groupIds: string[];
  name: string;
  italic?: boolean;
}[] = [
  { groupIds: ["d"], name: "Bacteroides", italic: true },
  { groupIds: ["e"], name: "Escherichia and Shigella", italic: true },
  { groupIds: ["a"], name: "Lactobacilli and Bifidobacteria", italic: true },
  { groupIds: ["b"], name: "Prevotellaceae", italic: true },
  { groupIds: ["g", "c", "f"], name: "other bacteria" },
];

// Deliberately few slots, so each cell can be drawn large (CELL_SCALE) and
// still has room to drift.
const SLOTS = GROUPS.reduce((sum, group) => sum + group.healthy, 0);
const CELL_SCALE = 1.35;
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
  // The group shown in the PMOS window (differs from groupIndex only for
  // cells taken over by one of the two groups that increase).
  pmosGroupIndex: number;
  // Per-cell drift so the cells don't all move in step (see two-guts-drift
  // in App.css).
  dx: number;
  dy: number;
  spin: number;
  duration: number;
  delay: number;
}

// Which group sits in each slot without PMOS: every group's cells, dealt out
// in a fixed pseudo-random order so no group clumps together.
const HEALTHY_ORDER = GROUPS.flatMap((group, groupIndex) =>
  Array.from({ length: group.healthy }, () => groupIndex),
)
  .map((groupIndex, i) => ({ groupIndex, key: seededValue(i + 29) }))
  .sort((a, b) => a.key - b.key)
  .map((entry) => entry.groupIndex);

// With PMOS: each shrinking group gives up its surplus cells, which the
// growing groups take over in turn, so a cell only changes when it has to.
const PMOS_ORDER = (() => {
  const order = [...HEALTHY_ORDER];
  const surplus = GROUPS.map((group) => group.healthy - group.pmos);
  const growing = GROUPS.flatMap((group, groupIndex) =>
    Array.from(
      { length: Math.max(0, group.pmos - group.healthy) },
      () => groupIndex,
    ),
  );
  let next = 0;
  for (let i = 0; i < order.length; i++) {
    if (surplus[order[i]] > 0 && next < growing.length) {
      surplus[order[i]] -= 1;
      // Alternate between the growing groups rather than filling one first.
      const pick =
        next % 2 === 0 ? next / 2 : growing.length - 1 - (next - 1) / 2;
      order[i] = growing[pick];
      next += 1;
    }
  }
  return order;
})();

const SLOT_LAYOUT: Slot[] = Array.from({ length: SLOTS }, (_, i) => {
  const angle = i * GOLDEN_ANGLE + (seededValue(i + 3) - 0.5) * 0.4;
  const radius = Math.sqrt((i + 0.5) / SLOTS) * (LENS_R - 22);
  const groupIndex = HEALTHY_ORDER[i];
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
    rotation: Math.round(seededValue(i + 17) * 360),
    groupIndex,
    pmosGroupIndex: PMOS_ORDER[i],
    dx: Math.round((seededValue(i + 53) - 0.5) * 36),
    dy: Math.round((seededValue(i + 61) - 0.5) * 36),
    spin: Math.round((seededValue(i + 71) - 0.5) * 90),
    duration: 4 + seededValue(i + 83) * 4,
    delay: -seededValue(i + 41) * 8,
  };
});

// Width of a capsule cell in viewBox units (see CellShape), and the slot of
// the Bacteroides cell handed over to the next section: the lowest one in the
// "With PMOS" window, so it has the shortest way down.
const CAPSULE_W = 34;
const ZOOM_SOURCE_SLOT = SLOT_LAYOUT.reduce(
  (best, slot, i) =>
    GROUPS[slot.pmosGroupIndex].id === "d" &&
    (best < 0 || slot.y > SLOT_LAYOUT[best].y)
      ? i
      : best,
  -1,
);

function CellShape({ shape, color }: { shape: Shape; color: string }) {
  const stroke = "rgba(0, 0, 0, 0.28)";
  switch (shape) {
    case "rod":
      return (
        <rect
          x={-17}
          y={-7}
          width={34}
          height={14}
          rx={7}
          fill={color}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    // Same proportions as the P. vulgatus in BshStreamAnimation.tsx.
    case "capsule":
      return (
        <rect
          x={-CAPSULE_W / 2}
          y={-8.2}
          width={CAPSULE_W}
          height={16.4}
          rx={8.2}
          fill={color}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case "short-rod":
      return (
        <rect
          x={-10}
          y={-7}
          width={20}
          height={14}
          rx={7}
          fill={color}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case "coccus":
      return <circle r={8} fill={color} stroke={stroke} strokeWidth={1.5} />;
    case "diplo":
      return (
        <>
          <circle
            cx={-6}
            r={6}
            fill={color}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <circle cx={6} r={6} fill={color} stroke={stroke} strokeWidth={1.5} />
        </>
      );
    case "chain":
      return (
        <>
          {[-11, 0, 11].map((cx) => (
            <circle
              key={cx}
              cx={cx}
              r={5}
              fill={color}
              stroke={stroke}
              strokeWidth={1.5}
            />
          ))}
        </>
      );
    case "curved":
      return (
        <path
          d="M-14 5 Q0 -13 14 5"
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
        />
      );
    case "spiral":
      return (
        <path
          d="M-16 0 q4 -8 8 0 t8 0 t8 0 t8 0"
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
  }
}

// The one window. Cells whose group differs between the two states are drawn
// twice and cross-fade (each after its own short delay, so the mix changes
// gradually while the window slides); the rest stay as they are.
function GutWindow({ pmos }: { pmos: boolean }) {
  return (
    <figure
      className="two-guts-window"
      role="img"
      aria-label={
        pmos
          ? "Illustration: a window into the gut microbiome with PMOS. Bacteroides and Escherichia and Shigella have increased while Lactobacilli and Bifidobacteria, Prevotellaceae and other bacteria have decreased, so the community is less diverse."
          : "Illustration: a window into a healthy gut microbiome, with many different kinds of bacteria mixed together."
      }
    >
      <figcaption className="two-guts-window-label">
        {pmos ? "Gut microbiome with PMOS" : "Normal gut microbiome composition"}
      </figcaption>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="two-guts-lens"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="two-guts-clip">
            <circle cx={CENTER} cy={CENTER} r={LENS_R} />
          </clipPath>
        </defs>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={LENS_R}
          className="two-guts-lens-bg"
        />
        <g clipPath="url(#two-guts-clip)">
          {SLOT_LAYOUT.map((slot, i) => {
            const healthyGroup = GROUPS[slot.groupIndex];
            const pmosGroup = GROUPS[slot.pmosGroupIndex];
            const zoomSource = i === ZOOM_SOURCE_SLOT;
            return (
              <g
                key={i}
                transform={`translate(${slot.x} ${slot.y}) rotate(${slot.rotation})`}
                {...(zoomSource && {
                  "data-pv-zoom-source": "",
                  "data-rotation": slot.rotation,
                  "data-width": CAPSULE_W * CELL_SCALE,
                })}
              >
                <g
                  className={
                    zoomSource
                      ? "two-guts-cell two-guts-cell--still"
                      : "two-guts-cell"
                  }
                  style={
                    {
                      "--dx": `${slot.dx}px`,
                      "--dy": `${slot.dy}px`,
                      "--spin": `${slot.spin}deg`,
                      "--swap-delay": `${(0.15 + seededValue(i + 97) * 0.6).toFixed(2)}s`,
                      animationDuration: `${slot.duration}s`,
                      animationDelay: `${slot.delay}s`,
                    } as CSSProperties
                  }
                >
                  <g transform={`scale(${CELL_SCALE})`}>
                    {healthyGroup === pmosGroup ? (
                      <CellShape
                        shape={healthyGroup.shape}
                        color={healthyGroup.color}
                      />
                    ) : (
                      <>
                        <g className="two-guts-swap two-guts-swap--healthy">
                          <CellShape
                            shape={healthyGroup.shape}
                            color={healthyGroup.color}
                          />
                        </g>
                        <g className="two-guts-swap two-guts-swap--pmos">
                          <CellShape
                            shape={pmosGroup.shape}
                            color={pmosGroup.color}
                          />
                        </g>
                      </>
                    )}
                  </g>
                </g>
              </g>
            );
          })}
        </g>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={LENS_R}
          className="two-guts-lens-rim"
        />
      </svg>
      <CompositionBar pmos={pmos} />
    </figure>
  );
}

// Share of each group among the cells drawn, so the bar always mirrors the
// window above it.
function CompositionBar({ pmos }: { pmos: boolean }) {
  const weights = GROUPS.map(() => 0);
  for (const slot of SLOT_LAYOUT) {
    weights[pmos ? slot.pmosGroupIndex : slot.groupIndex] += 1;
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

export function TwoGutsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pmos = usePinnedStep(wrapperRef, 2) === 1;

  return (
    <div
      className="home-snap-pin"
      ref={wrapperRef}
      style={{ "--snap-steps": 2 } as CSSProperties}
    >
      <SnapSteps steps={2} />
      <div
        className={`two-guts home-snap-stage${pmos ? " two-guts--pmos" : ""}`}
      >
        <div className="two-guts-row">
          <GutWindow pmos={pmos} />
          <div className="two-guts-panel two-guts-panel--healthy" inert={pmos}>
            <h4 className="two-guts-panel-title">
              In a healthy gut, there’s a wide variety of bacteria living in
              balance.
            </h4>
          </div>
          <div className="two-guts-panel two-guts-panel--pmos" inert={!pmos}>
            <h4 className="two-guts-panel-title">
              In case of PMOS, there’s clear dysbiosis, with one species
              standing out a lot!
            </h4>
          </div>
        </div>

        <ul className="two-guts-legend">
          {LEGEND.map((entry) => (
            <li key={entry.name} className="two-guts-legend-item">
              {entry.groupIds.map((id) => (
                <span
                  key={id}
                  className="two-guts-legend-swatch"
                  style={{
                    backgroundColor: GROUPS.find((g) => g.id === id)?.color,
                  }}
                  aria-hidden="true"
                />
              ))}
              <span>{entry.italic ? <em>{entry.name}</em> : entry.name}</span>
            </li>
          ))}
        </ul>

        <p className="two-guts-note">
          Illustration only: the number of cells drawn shows the direction of
          each change, not measured data.
        </p>
      </div>
    </div>
  );
}
