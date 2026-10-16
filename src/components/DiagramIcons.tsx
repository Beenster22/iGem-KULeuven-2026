// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Purpose: flat, diagram-style icons for the decorative
// MicrobeBackdrop, matching the team's abstract figure (BioRender
// style): P. vulgatus as a double-outlined capsule carrying a BSH enzyme
// pill, generic gut bacteria as plain outlined rods/cocci, and bile acids as
// hexagons (pale yellow = conjugated, red = deconjugated).
// Colours live in App.css
// (.bact-*, .bile-acid-*) so both themes can tune them.
import type { SVGProps } from "react";

export function PVulgatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 64" {...props}>
      <rect className="bact-membrane-outer" x="3" y="3" width="114" height="58" rx="29" />
      <rect className="bact-membrane-inner" x="9" y="9" width="102" height="46" rx="23" />
      <rect className="bact-bsh" x="36" y="20" width="48" height="24" rx="12" />
    </svg>
  );
}

export type OtherBacteriumVariant = "rod" | "short-rod" | "coccus";

export function OtherBacteriumIcon({
  variant = "rod",
  ...props
}: SVGProps<SVGSVGElement> & { variant?: OtherBacteriumVariant }) {
  if (variant === "coccus") {
    return (
      <svg viewBox="0 0 120 64" {...props}>
        <circle className="bact-other" cx="42" cy="32" r="22" />
        <circle className="bact-other" cx="84" cy="32" r="22" />
      </svg>
    );
  }
  const width = variant === "short-rod" ? 80 : 114;
  return (
    <svg viewBox="0 0 120 64" {...props}>
      <rect className="bact-other" x={(120 - width) / 2} y="8" width={width} height="48" rx="24" />
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
