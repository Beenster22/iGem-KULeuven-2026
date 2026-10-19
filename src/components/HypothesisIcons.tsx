// Generated with Claude Sonnet 5 (Anthropic), 2026-10-19
// Purpose: small line-art icons for the PMOS hypothesis figure (Project
// description page), one per hypothesis in Nisa et al.'s grouping of five.
// Colour comes from the parent wedge via `color: currentColor` (set in
// WheelSelector.tsx), so these only ever specify stroke="currentColor".
import type { SVGProps } from "react";

// 32×32: matches ICON_SIZE in WheelSelector.tsx, which centres these on the
// wedge by half that amount.
const ICON_PROPS = {
  viewBox: "0 0 40 40",
  width: 32,
  height: 32,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Three ascending steps with an arrow: the evolutionary hypothesis (ancestral
// conditions favouring efficient energy storage).
export function EvolutionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M6 33 V25 H14 V33" />
      <path d="M14 33 V18 H22 V33" />
      <path d="M22 33 V10 H30 V33" />
      <path d="M30 10 L36 4M36 4 L31 5M36 4 L35 9" />
    </svg>
  );
}

// A double helix with rungs: the genetic hypothesis.
export function DnaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M13 4c0 0 15 6 15 16s-15 16-15 16" />
      <path d="M27 4c0 0-15 6-15 16s15 16 15 16" />
      <path d="M14.5 10h11M13 16h14M13 24h14M14.5 30h11" />
    </svg>
  );
}

// A droplet with a highlight: the insulin hypothesis.
export function InsulinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M20 5c0 0-10.5 12.3-10.5 20A10.5 10.5 0 0 0 30 25C30 17.3 20 5 20 5Z" />
      <path d="M14.5 24a5.5 5.5 0 0 0 5.5 5.5" />
    </svg>
  );
}

// A globe with latitude lines and a small leaf: the environmental hypothesis.
export function GlobeLeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <circle cx="17" cy="23" r="11.5" />
      <path d="M5.5 23h23" />
      <path d="M17 11.5c-5.5 4.8-5.5 17.2 0 23c5.5-5.8 5.5-18.2 0-23Z" />
      <path d="M25 9.5c3.8-1.6 7-.3 7-.3s-.4 3.6-4 5.4c-2.9 1.4-5.2-.4-4.3-2.6c.4-1 .9-1.9 1.3-2.5Z" />
    </svg>
  );
}

// A brain outline with a central divide: the neuroendocrine hypothesis.
export function BrainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M15.5 7.5c-4.8-.6-7.5 3-6.7 6.8c-3 1.6-3.3 6.3.2 8.3c-.6 3.6 2.8 6.4 6.1 5c1.8 1.8 6 1.8 7.4-.6c4 1 7-2.3 5.6-5.9c2.8-2.3 2.3-7-1.3-8.4c.4-3.8-3.3-6.8-7.5-5.6c-1.4-1.4-2.7-1.4-3.8.4Z" />
      <path d="M20 8v24" />
      <path d="M13.5 13c1.7.8 1.7 3-.3 3.8M26.3 13c-1.7.8-1.7 3 .3 3.8M12 21.5c1.8.1 2.7 1.8 1.6 3.4M28 21.5c-1.8.1-2.7 1.8-1.6 3.4" />
    </svg>
  );
}
