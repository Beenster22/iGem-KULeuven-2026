// Generated with Claude Sonnet 5 (Anthropic), 2026-07-14
// Reworked with Claude Opus 5.5 (Anthropic), 2026-10-07
// Purpose: the wet lab wheel. A ring of pastel wedges around a bacterium, one
// per labeled content pane. The selected wedge always sits at the bottom,
// just above its content: selecting another one turns the wheel (the shorter
// way round) until that wedge is at the bottom, while the labels and the
// bacterium stay upright. Design after the team's own drawing of the wheel.
import { ReactNode, useMemo, useState } from "react";
import { extractLabeledChildren } from "../utils/extractLabeledChildren";

interface WheelSelectorProps {
  children: ReactNode;
}

const SIZE = 520;
const CENTER = SIZE / 2;
const OUTER_RADIUS = SIZE / 2 - 10;
const INNER_RADIUS = 108;
const LABEL_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2 + 4;
const LINE_HEIGHT = 20;
// Longest label line, in characters, before it wraps onto the next.
const MAX_LINE = 14;

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

// How far the wheel is turned to bring wedge `index` to the bottom.
const restAngle = (index: number, count: number) => 90 - midAngle(index, count);

// The team's drawing of the bacterium (143 × 123 px, on the same pale pink
// as the hub), shown in the middle and cut to the hub's circle.
const BACTERIUM = {
  src: "https://static.igem.wiki/teams/6299/wiki/miscellaneous/bacteria.avif",
  width: 186,
  height: 160,
};

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

export function WheelSelector({ children }: WheelSelectorProps) {
  const items = useMemo(() => extractLabeledChildren(children), [children]);
  const count = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  // Kept as a running total (not reduced to 0–360) so each turn takes the
  // shorter way round instead of unwinding.
  const [rotation, setRotation] = useState(() => restAngle(0, count));
  const active = items[activeIndex];
  const step = 360 / count;

  const select = (index: number) => {
    setActiveIndex(index);
    setRotation((current) => {
      const delta = (((restAngle(index, count) - current) % 360) + 540) % 360;
      return current + delta - 180;
    });
  };

  return (
    <div className="wheel-selector">
      <svg
        className="wheel-selector-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="tablist"
        aria-label="Wet lab sections"
      >
        <g
          className="wheel-selector-wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${CENTER}px ${CENTER}px`,
          }}
        >
          {items.map((item, index) => {
            const startAngle = -90 + index * step;
            const labelPos = polarToCartesian(
              LABEL_RADIUS,
              midAngle(index, count),
            );
            const isActive = index === activeIndex;
            const colours = PALETTE[index % PALETTE.length];
            const lines = wrapLabel(item.label);

            return (
              <g
                key={item.label}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
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
                {/* Turned back by as much as the wheel is turned, so the
                    label stays upright all the way round. */}
                <g transform={`translate(${labelPos.x} ${labelPos.y})`}>
                  <text
                    className="wheel-selector-label"
                    style={{ transform: `rotate(${-rotation}deg)` }}
                    fill={colours.ink}
                    textAnchor="middle"
                  >
                    {lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={0}
                        y={(i - (lines.length - 1) / 2) * LINE_HEIGHT}
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
        <Bacterium />
        {/* The selected wedge is the one at the bottom: outlined there, with
            a pointer down to its content. */}
        <path
          className="wheel-selector-selected"
          d={wedgePath(90 - step / 2, 90 + step / 2)}
        />
        <path
          className="wheel-selector-pointer"
          d={`M${CENTER - 12},${SIZE - 10} h24 l-12,10 Z`}
        />
      </svg>
      {active && <div className="wheel-selector-content">{active.content}</div>}
    </div>
  );
}
