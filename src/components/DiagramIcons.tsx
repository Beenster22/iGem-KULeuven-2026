// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Purpose: flat, diagram-style icons for the decorative
// MicrobeBackdrop, matching the team's abstract figure (BioRender
// style): P. vulgatus, generic gut bacteria as plain outlines, and bile
// acids as hexagons (pale yellow = conjugated, red = deconjugated).
// Colours live in App.css
// (.bact-*, .bile-acid-*) so both themes can tune them.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request, after
// the team's drawing of the common gut bacteria): outlines only, no inner
// detail — a straight rod and a curved one with pili, a wavy one, a chain
// of cocci, and P. vulgatus as a rod with a round end and flagella.
import { useId, type SVGProps } from "react";

export function PVulgatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 64" {...props}>
      <path className="bact-flagellum" d="M28 36 C18 40 12 50 3 52" />
      <path className="bact-flagellum" d="M30 42 C24 52 16 58 6 62" />
      <rect className="bact-membrane-outer" x="24" y="19" width="76" height="26" rx="13" />
      <circle className="bact-membrane-outer" cx="96" cy="32" r="18" />
      <circle className="bact-membrane-inner" cx="96" cy="32" r="8" />
    </svg>
  );
}

export type OtherBacteriumVariant = "rod" | "curved" | "wavy" | "cocci";

// A body drawn along a centre line: its outline is a wide stroke with a
// narrower one cut out of it, so the outline stays even all the way round
// however the body bends.
function Tube({ d, width }: { d: string; width: number }) {
  const id = useId();
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="64">
        <path d={d} fill="none" stroke="white" strokeWidth={width} strokeLinecap="round" />
        <path d={d} fill="none" stroke="black" strokeWidth={width - 8} strokeLinecap="round" />
      </mask>
      <path className="bact-other-body" d={d} strokeWidth={width - 4} />
      <rect className="bact-other-outline" width="120" height="64" mask={`url(#${id})`} />
    </>
  );
}

// Short pili sticking out from a body, each given by where it starts and
// the direction it points.
function Pili({ at }: { at: [number, number, number][] }) {
  return (
    <>
      {at.map(([x, y, deg], i) => {
        const a = (deg * Math.PI) / 180;
        const ex = x + Math.cos(a) * 7;
        const ey = y + Math.sin(a) * 7;
        // A slight curl, alternating sides.
        const k = i % 2 ? 3 : -3;
        const cx = (x + ex) / 2 - Math.sin(a) * k;
        const cy = (y + ey) / 2 + Math.cos(a) * k;
        return (
          <path
            key={i}
            className="bact-hair"
            d={`M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
          />
        );
      })}
    </>
  );
}

// Pili all round the outside of the curved one's arc.
const CURVED_PILI: [number, number, number][] = [200, 225, 250, 275, 300, 325, 345].map(
  (deg) => {
    const a = (deg * Math.PI) / 180;
    return [60 + Math.cos(a) * 49, 60 + Math.sin(a) * 49, deg];
  },
);

export function OtherBacteriumIcon({
  variant = "rod",
  ...props
}: SVGProps<SVGSVGElement> & { variant?: OtherBacteriumVariant }) {
  if (variant === "cocci") {
    return (
      <svg viewBox="0 0 120 64" {...props}>
        <circle className="bact-other" cx="30" cy="32" r="17" />
        <circle className="bact-other" cx="60" cy="32" r="17" />
        <circle className="bact-other" cx="90" cy="32" r="17" />
      </svg>
    );
  }
  if (variant === "curved") {
    return (
      <svg viewBox="0 0 120 64" {...props}>
        <Pili at={CURVED_PILI} />
        <Tube d="M22 52 A40 40 0 0 1 98 52" width={22} />
      </svg>
    );
  }
  if (variant === "wavy") {
    return (
      <svg viewBox="0 0 120 64" {...props}>
        <Tube d="M14 42 C28 12 44 12 60 32 S92 52 106 22" width={18} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 64" {...props}>
      <Pili
        at={[
          [34, 17, -100],
          [52, 17, -80],
          [70, 17, -100],
          [88, 17, -80],
          [34, 47, 100],
          [52, 47, 80],
          [70, 47, 100],
          [88, 47, 80],
          [17, 32, 180],
          [103, 32, 0],
        ]}
      />
      <Tube d="M30 32 H90" width={30} />
    </svg>
  );
}

export function BileAcidIcon({
  deconjugated,
  ...props
}: SVGProps<SVGSVGElement> & { deconjugated: boolean }) {
  return (
    <svg viewBox="0 0 60 60" {...props}>
      <polygon
        className={deconjugated ? "bile-acid-deconjugated" : "bile-acid-conjugated"}
        points="30,4 52.5,17 52.5,43 30,56 7.5,43 7.5,17"
      />
    </svg>
  );
}
