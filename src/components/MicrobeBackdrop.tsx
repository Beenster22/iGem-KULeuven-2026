// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Purpose: decorative layer of faint, slowly drifting bacteria and bile-acid
// hexagons (the BacteriumIcons.tsx set) kept to the left/right margins of a
// full-bleed home-page band, so wide screens don't look empty beside the
// centred content. Drop it as the first child of any .home-section (or
// .pmos-overview); styles live under MICROBE BACKDROP in App.css.
import {
  BileAcidIcon,
  OtherBacteriumIcon,
  PVulgatusIcon,
  type OtherBacteriumVariant,
} from "./DiagramIcons";

// Deterministic pseudo-random [0,1) so the layout is stable across renders.
function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const OTHER_VARIANTS: OtherBacteriumVariant[] = ["rod", "short-rod", "coccus"];

interface MicrobeBackdropProps {
  // Items per side. Taller bands can take more without looking crowded.
  count?: number;
  // Changes the arrangement so neighbouring bands don't look identical.
  seed?: number;
}

export function MicrobeBackdrop({ count = 5, seed = 1 }: MicrobeBackdropProps) {
  const items = Array.from({ length: count * 2 }, (_, i) => {
    const s = seed * 100 + i;
    const side = i % 2 === 0 ? "left" : "right";
    const row = Math.floor(i / 2);
    // Evenly spaced rows with jitter, so each side is covered top to bottom.
    const top = ((row + 0.2 + seededValue(s + 1) * 0.6) / count) * 100;
    const inset = 1 + seededValue(s + 2) * 9; // % from that side's edge
    const kind = seededValue(s + 3);
    const style = {
      top: `${top}%`,
      [side]: `${inset}%`,
      "--r": `${Math.round(seededValue(s + 4) * 360)}deg`,
      animationDuration: `${14 + seededValue(s + 5) * 10}s`,
      animationDelay: `${-seededValue(s + 6) * 20}s`,
    } as React.CSSProperties;

    if (kind < 0.3) {
      return <PVulgatusIcon key={i} className="microbe-backdrop-item microbe-backdrop-item--pv" style={style} />;
    }
    if (kind < 0.6) {
      return (
        <BileAcidIcon
          key={i}
          className="microbe-backdrop-item microbe-backdrop-item--hex"
          deconjugated={seededValue(s + 7) < 0.5}
          style={style}
        />
      );
    }
    return (
      <OtherBacteriumIcon
        key={i}
        className="microbe-backdrop-item"
        variant={OTHER_VARIANTS[Math.floor(seededValue(s + 8) * OTHER_VARIANTS.length)]}
        style={style}
      />
    );
  });

  return (
    <div className="microbe-backdrop" aria-hidden="true">
      {items}
    </div>
  );
}
