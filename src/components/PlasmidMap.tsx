// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-17
// Purpose: the pBSH-Cas9 plasmid map on the results page ("The construct",
// CRISPR construct design), rebuilt from the team's higher-resolution map as
// an interactive ring, after the team's own sketch of the page: a feature
// highlights itself and its name/role appear in the panel beside the ring,
// cycling to the next feature every few seconds, except while a feature is
// hovered or focused (or, on touch, tapped), which pauses the cycle on it.
// Data lives in data/plasmidMap.ts, with each feature's colour sampled from
// the team's map and reused to shade the component table underneath.
import { useEffect, useMemo, useState } from "react";
import {
  PLASMID_FEATURES,
  PLASMID_NAME,
  type PlasmidFeature,
} from "./data/plasmidMap";

const SIZE = 420;
const CENTER = SIZE / 2;
const OUTER_RADIUS = SIZE / 2 - 18;
const RING_WIDTH = 50;
const INNER_RADIUS = OUTER_RADIUS - RING_WIDTH;
const GAP_DEGREES = 2.4;
const ARROW_NOTCH_DEGREES = 3.5;
const INTERVAL_MS = 3200;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

// 0 degrees is the top of the ring, increasing clockwise — a plasmid map's
// usual convention, and the way the team's own map is drawn.
function polar(radius: number, degrees: number) {
  const rad = toRadians(degrees);
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

function blockPath(startDeg: number, endDeg: number) {
  const outerStart = polar(OUTER_RADIUS, startDeg);
  const outerEnd = polar(OUTER_RADIUS, endDeg);
  const innerEnd = polar(INNER_RADIUS, endDeg);
  const innerStart = polar(INNER_RADIUS, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

// Coding sequences and selection markers taper to a point, the way the
// team's map draws them, instead of the plain block other features get.
function arrowPath(startDeg: number, endDeg: number) {
  const notch = Math.min(ARROW_NOTCH_DEGREES, (endDeg - startDeg) * 0.4);
  const shaftEnd = endDeg - notch;
  const outerStart = polar(OUTER_RADIUS, startDeg);
  const outerShaftEnd = polar(OUTER_RADIUS, shaftEnd);
  const tip = polar((OUTER_RADIUS + INNER_RADIUS) / 2, endDeg);
  const innerShaftEnd = polar(INNER_RADIUS, shaftEnd);
  const innerStart = polar(INNER_RADIUS, startDeg);
  const largeArc = shaftEnd - startDeg > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${outerShaftEnd.x} ${outerShaftEnd.y}`,
    `L ${tip.x} ${tip.y}`,
    `L ${innerShaftEnd.x} ${innerShaftEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

interface Segment extends PlasmidFeature {
  start: number;
  end: number;
}

function layoutSegments(features: PlasmidFeature[]): Segment[] {
  const gapTotal = GAP_DEGREES * features.length;
  const weightTotal = features.reduce((sum, f) => sum + f.weight, 0);
  const span = 360 - gapTotal;

  let cursor = 0;
  return features.map((feature) => {
    const sweep = (feature.weight / weightTotal) * span;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end + GAP_DEGREES;
    return { ...feature, start, end };
  });
}

export function PlasmidMap() {
  const segments = useMemo(() => layoutSegments(PLASMID_FEATURES), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const paused = hoverId !== null || pinnedId !== null;
  const shownId = hoverId ?? pinnedId ?? segments[activeIndex]?.id;
  const shown =
    segments.find((segment) => segment.id === shownId) ?? segments[0];

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % segments.length);
    }, INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, segments.length]);

  return (
    <div className="plasmid-map">
      <svg
        className="plasmid-map-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="group"
        aria-label={`${PLASMID_NAME} plasmid map`}
      >
        {segments.map((segment) => (
          <path
            key={segment.id}
            className={`plasmid-map-feature${segment.id === shownId ? " active" : ""}`}
            d={
              segment.arrow
                ? arrowPath(segment.start, segment.end)
                : blockPath(segment.start, segment.end)
            }
            fill={segment.color}
            tabIndex={0}
            role="button"
            aria-label={`${segment.label}: ${segment.role}`}
            onMouseEnter={() => setHoverId(segment.id)}
            onMouseLeave={() => setHoverId(null)}
            onFocus={() => setHoverId(segment.id)}
            onBlur={() => setHoverId(null)}
            onClick={() =>
              setPinnedId((current) =>
                current === segment.id ? null : segment.id,
              )
            }
          />
        ))}
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="middle"
          className="plasmid-map-name"
        >
          {PLASMID_NAME}
        </text>
      </svg>

      <div className="plasmid-map-panel" aria-live="polite">
        <span className="plasmid-map-panel-name">{shown.label}</span>
        <span className="plasmid-map-panel-role">{shown.role}</span>
        <span className="plasmid-map-panel-progress">
          <span
            key={`${shown.id}-${paused}`}
            className={`plasmid-map-panel-progress-fill${paused ? " paused" : ""}`}
            style={
              paused
                ? undefined
                : ({
                    "--plasmid-map-interval": `${INTERVAL_MS}ms`,
                  } as React.CSSProperties)
            }
          />
        </span>
      </div>
    </div>
  );
}
