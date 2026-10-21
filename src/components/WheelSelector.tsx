// Generated with Claude Sonnet 5 (Anthropic), 2026-07-14
// Reworked with Claude Opus 5.5 (Anthropic), 2026-10-07
// Purpose: the wet lab wheel. A ring of pastel wedges around a bacterium, one
// per labeled content pane. The selected wedge always sits at the bottom,
// just above its content: selecting another one turns the wheel (the shorter
// way round) until that wedge is at the bottom, while the labels and the
// bacterium stay upright. Design after the team's own drawing of the wheel.
import { ReactNode, useEffect, useId, useMemo, useState } from "react";
import { useEasedAngle } from "./useEasedAngle";
import { extractLabeledChildren } from "../utils/extractLabeledChildren";
import {
  WHEEL_SELECT_EVENT,
  clearPendingWheelSelection,
  takePendingWheelSelection,
  type WheelSelectDetail,
} from "./wheelSelect";

interface WheelSelectorProps {
  children: ReactNode;
  /**
   * "below" (the wet lab wheel): the selected wedge turns to the bottom and
   * its content sits underneath. "side" (added 2026-10-11): a smaller wheel
   * whose selected wedge turns to the right, with its content beside it.
   * "dropdown" (added 2026-10-19, results page): the "side" wheel's size,
   * nothing selected at first; clicking a wedge turns it to the bottom and
   * drops its content down underneath, clicking it again folds it away.
   * "side-dropdown" (added 2026-10-19, PMOS hypothesis figure): the "side"
   * wheel's row layout, but nothing selected at first — clicking a wedge
   * turns it to the right and grows its content out sideways, clicking it
   * again folds it away, so the figure stays compact until it's used.
   */
  layout?: "below" | "side" | "dropdown" | "side-dropdown";
  /** Accessible name for the ring of wedges. */
  label?: string;
  /**
   * Lets something elsewhere on the page turn this wheel to one of its
   * wedges, by dispatching a WHEEL_SELECT_EVENT carrying this id and the
   * wedge's label — see TherapeuticsOverview.tsx, whose step 5 opens the
   * Toolkit wheel on "Conjugation titer testing".
   */
  id?: string;
  /**
   * Added 2026-10-19 (PMOS hypothesis figure, project description page):
   * replaces the hub's bacterium image with this short text, split onto one
   * line per word (e.g. "PMOS Hypothesis"). Leave unset for the wet lab
   * wheel's bacterium.
   */
  hubLabel?: string;
}

const SIZE = 520;
const CENTER = SIZE / 2;
const OUTER_RADIUS = SIZE / 2 - 10;
const INNER_RADIUS = 108;
const LABEL_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2 + 4;
// When a wedge has an icon (PMOS hypothesis figure), it sits near the rim —
// the wedge's widest point — well clear of the label at LABEL_RADIUS, which
// keeps its usual spot rather than being squeezed toward the narrow hub end.
const ICON_RADIUS = OUTER_RADIUS - 26;
const ICON_SIZE = 30;
const LINE_HEIGHT = 20;
// Longest label line, in characters, before it wraps onto the next.
const MAX_LINE = 14;
// Labels that wrap onto more lines than this are drawn smaller so they still
// fit inside their wedge (edited with Claude Opus 5.5, 2026-10-14).
const MAX_FULL_SIZE_LINES = 3;
const SMALL_LABEL_SCALE = 0.8;

// Wedge fill and label colour, going round from the top as in the team's
// drawing; the label colours are darkened a little so they stay readable.
const PALETTE = [
  { fill: "#f0cfdc", ink: "#23468a" },
  { fill: "#f6d6ea", ink: "#55348a" },
  { fill: "#f1dff7", ink: "#84204f" },
  { fill: "#efe9fb", ink: "#a83a37" },
  { fill: "#dcd6f1", ink: "#584b99" },
  { fill: "#e4def5", ink: "#12767a" },
  { fill: "#efd5e3", ink: "#256b64" },
];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

function polarToCartesian(radius: number, degrees: number) {
  return {
    x: CENTER + radius * Math.cos(toRadians(degrees)),
    y: CENTER + radius * Math.sin(toRadians(degrees)),
  };
}

function wedgePath(startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(OUTER_RADIUS, startAngle);
  const outerEnd = polarToCartesian(OUTER_RADIUS, endAngle);
  const innerEnd = polarToCartesian(INNER_RADIUS, endAngle);
  const innerStart = polarToCartesian(INNER_RADIUS, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function wrapLabel(label: string) {
  const lines: string[] = [];
  for (const word of label.split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= MAX_LINE) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}

// Where wedge `index` of `count` points, in degrees clockwise from "east";
// the first wedge starts at the top.
const midAngle = (index: number, count: number) =>
  -90 + ((index + 0.5) * 360) / count;

// Where the selected wedge comes to rest, in degrees clockwise from "east":
// at the bottom of the wheel, or at its right-hand side.
const REST_DEGREES = {
  below: 90,
  side: 0,
  dropdown: 90,
  "side-dropdown": 0,
} as const;

// How far the wheel is turned to bring wedge `index` to its resting place.
const restAngle = (index: number, count: number, rest: number) =>
  rest - midAngle(index, count);

// The team's drawing of the bacterium (143 × 123 px, on the same pale pink
// as the hub), shown in the middle and cut to the hub's circle.
const BACTERIUM = {
  src: "https://static.igem.wiki/teams/6299/wiki/miscellaneous/bacteria.avif",
  width: 186,
  height: 160,
};

// The hub's alternative to the bacterium: a short label split one word per
// line (e.g. ["PMOS", "HYPOTHESIS"]), for figures with no drawing of their
// own (PMOS hypothesis figure, project description page).
function HubText({ text }: { text: string }) {
  const lines = text.toUpperCase().split(" ");
  return (
    <text className="wheel-selector-hub-label" x={CENTER} y={CENTER} textAnchor="middle">
      {lines.map((line, i) => (
        <tspan key={i} x={CENTER} dy={i === 0 ? `${-(lines.length - 1) * 0.6}em` : "1.2em"}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Bacterium() {
  return (
    <>
      <clipPath id="wheel-selector-hub-clip">
        <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS - 2} />
      </clipPath>
      <image
        className="wheel-selector-bacterium"
        href={BACTERIUM.src}
        x={CENTER - BACTERIUM.width / 2}
        y={CENTER - BACTERIUM.height / 2}
        width={BACTERIUM.width}
        height={BACTERIUM.height}
        clipPath="url(#wheel-selector-hub-clip)"
      />
    </>
  );
}

// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request): on a
// phone the side wheels stack their content underneath (see the max-width
// 767.98px rule in App.css), so the selected wedge and pointer face down
// there instead of to the right.
const STACKED_QUERY = "(max-width: 767.98px)";

function useStacked() {
  const [stacked, setStacked] = useState(
    () => typeof window !== "undefined" && window.matchMedia(STACKED_QUERY).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(STACKED_QUERY);
    const update = () => setStacked(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return stacked;
}

export function WheelSelector({
  children,
  layout = "below",
  label = "Wet lab sections",
  hubLabel,
  id,
}: WheelSelectorProps) {
  const items = useMemo(() => extractLabeledChildren(children), [children]);
  const count = items.length;
  const stacked = useStacked();
  const opensToSide = (layout === "side" || layout === "side-dropdown") && !stacked;
  const rest = opensToSide ? REST_DEGREES[layout] : 90;
  const [activeIndex, setActiveIndex] = useState(0);
  // Kept as a running total (not reduced to 0–360) so each turn takes the
  // shorter way round instead of unwinding.
  const [rotation, setRotation] = useState(() => restAngle(0, count, rest));
  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-19: the "dropdown" and
  // "side-dropdown" layouts start with nothing open; the others always show
  // their content.
  const isToggle = layout === "dropdown" || layout === "side-dropdown";
  const [open, setOpen] = useState(!isToggle);
  // Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-21: the angle on screen,
  // eased towards `rotation` (see useEasedAngle.ts for why not a CSS transition).
  const shown = useEasedAngle(rotation, 700, [0.45, 0, 0.2, 1]);
  const panelId = useId();
  // Resting side changed (window resized past the breakpoint): turn to it.
  useEffect(() => {
    setRotation((current) => {
      const delta =
        (((restAngle(activeIndex, count, rest) - current) % 360) + 540) % 360;
      return current + delta - 180;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest]);
  const active = items[activeIndex];
  const step = 360 / count;

  const select = (index: number) => {
    if (isToggle && index === activeIndex && open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    setActiveIndex(index);
    setRotation((current) => {
      const delta =
        (((restAngle(index, count, rest) - current) % 360) + 540) % 360;
      return current + delta - 180;
    });
  };

  // Generated with Claude Opus 5 (Anthropic), 2026-10-19: a wheel given an
  // `id` can be turned to one of its wedges from elsewhere on the page.
  // Always opens the wedge (never folds it away), since the caller is
  // sending the reader here to look at it.
  useEffect(() => {
    if (!id) return;
    const apply = (detail: WheelSelectDetail | null) => {
      if (!detail || detail.wheel !== id) return;
      const index = items.findIndex((item) => item.label === detail.label);
      if (index === -1) return;
      clearPendingWheelSelection();
      setOpen(true);
      setActiveIndex(index);
      setRotation((current) => {
        const delta =
          (((restAngle(index, count, rest) - current) % 360) + 540) % 360;
        return current + delta - 180;
      });
    };
    // Asked for before this wheel was on the page (see wheelSelect.ts).
    apply(takePendingWheelSelection(id));
    const onSelect = (event: Event) =>
      apply((event as CustomEvent<WheelSelectDetail>).detail);
    window.addEventListener(WHEEL_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(WHEEL_SELECT_EVENT, onSelect);
  }, [id, items, count, rest]);

  return (
    <div
      className={`wheel-selector wheel-selector--${layout}${isToggle ? " wheel-selector--toggle" : ""}${open ? " is-open" : ""}`}
      data-wheel={id}
    >
      <svg
        className="wheel-selector-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="tablist"
        aria-label={label}
      >
        <g
          className="wheel-selector-wheel"
          transform={`rotate(${shown} ${CENTER} ${CENTER})`}
        >
          {items.map((item, index) => {
            const startAngle = -90 + index * step;
            const hasIcon = Boolean(item.icon);
            const labelPos = polarToCartesian(LABEL_RADIUS, midAngle(index, count));
            const iconPos = polarToCartesian(ICON_RADIUS, midAngle(index, count));
            const isActive = index === activeIndex && open;
            const colours = PALETTE[index % PALETTE.length];
            const lines = wrapLabel(item.label);
            const scale =
              lines.length > MAX_FULL_SIZE_LINES ? SMALL_LABEL_SCALE : 1;

            return (
              <g
                key={item.label}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                aria-expanded={isToggle ? isActive : undefined}
                aria-controls={isToggle ? panelId : undefined}
                className={`wheel-selector-wedge${isActive ? " active" : ""}`}
                onClick={() => select(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(index);
                  }
                }}
              >
                <path
                  d={wedgePath(startAngle, startAngle + step)}
                  fill={colours.fill}
                />
                {hasIcon && (
                  // Turned back like the label below, so the icon stays
                  // upright all the way round too.
                  <g
                    className="wheel-selector-wedge-icon"
                    style={{ color: colours.ink }}
                    transform={`translate(${iconPos.x} ${iconPos.y}) rotate(${-shown})`}
                  >
                    <g transform={`translate(${-ICON_SIZE / 2} ${-ICON_SIZE / 2})`}>
                      {item.icon}
                    </g>
                  </g>
                )}
                {/* Turned back by as much as the wheel is turned, so the
                    label stays upright all the way round. */}
                <g transform={`translate(${labelPos.x} ${labelPos.y})`}>
                  <text
                    className={`wheel-selector-label${scale === 1 ? "" : " wheel-selector-label--small"}`}
                    transform={`rotate(${-shown})`}
                    fill={colours.ink}
                    textAnchor="middle"
                  >
                    {lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={0}
                        y={(i - (lines.length - 1) / 2) * LINE_HEIGHT * scale}
                        dominantBaseline="middle"
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
        <circle
          className="wheel-selector-hub"
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS}
        />
        {hubLabel ? <HubText text={hubLabel} /> : <Bacterium />}
        {/* The selected wedge is the one at rest: outlined there, with a
            pointer from it towards its content. */}
        <path
          className="wheel-selector-selected"
          d={wedgePath(rest - step / 2, rest + step / 2)}
        />
        <path
          className="wheel-selector-pointer"
          d={
            opensToSide
              ? `M${SIZE - 10},${CENTER - 12} v24 l10,-12 Z`
              : `M${CENTER - 12},${SIZE - 10} h24 l-12,10 Z`
          }
        />
      </svg>
      {isToggle ? (
        // Opens and folds away — down for "dropdown" (.wheel-selector-dropdown
        // in App.css), sideways for "side-dropdown" (.wheel-selector-dropdown--side);
        // keyed on the section so switching sections fades the new one in.
        <div
          id={panelId}
          className={`wheel-selector-dropdown${layout === "side-dropdown" ? " wheel-selector-dropdown--side" : ""}`}
          role="region"
          aria-label={active?.label}
          inert={!open}
        >
          <div className="wheel-selector-dropdown-inner">
            {open && active && (
              <div className="wheel-selector-content" key={activeIndex}>
                {active.content}
              </div>
            )}
          </div>
        </div>
      ) : (
        active && <div className="wheel-selector-content">{active.content}</div>
      )}
    </div>
  );
}
