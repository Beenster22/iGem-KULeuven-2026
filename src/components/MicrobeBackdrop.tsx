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
    // Where it sits and how near it is, on a mover that carries it across
    // the screen as the reader scrolls (team request, 2026-10-20: the
    // passage through the gut; see useBackdropApproach in
    // HomeSnapScroll.tsx). Nearer ones (--depth) travel further and are
    // larger. The sweep and its whoosh go on the mover, so they run left
    // to right on the screen whichever way the item itself is turned.
    const place = {
      top: `${top}%`,
      [side]: `${inset}%`,
      "--depth": (0.4 + seededValue(s + 9) * 0.6).toFixed(2),
    } as React.CSSProperties;
    // Its own turn and slow float, on the item itself.
    const style = {
      "--r": `${Math.round(seededValue(s + 4) * 360)}deg`,
      animationDuration: `${14 + seededValue(s + 5) * 10}s`,
      animationDelay: `${-seededValue(s + 6) * 20}s`,
    } as React.CSSProperties;

    let icon;
    if (kind < 0.3) {
      icon = <PVulgatusIcon className="microbe-backdrop-item microbe-backdrop-item--pv" style={style} />;
    } else if (kind < 0.6) {
      icon = (
        <BileAcidIcon
          className="microbe-backdrop-item microbe-backdrop-item--hex"
          deconjugated={seededValue(s + 7) < 0.5}
          style={style}
        />
      );
    } else {
      icon = (
        <OtherBacteriumIcon
          className="microbe-backdrop-item"
          variant={OTHER_VARIANTS[Math.floor(seededValue(s + 8) * OTHER_VARIANTS.length)]}
          style={style}
        />
      );
    }
    return (
      <span key={i} className="microbe-backdrop-mover" style={place}>
        {icon}
      </span>
    );
  });

  return (
    <div className="microbe-backdrop" aria-hidden="true">
      {items}
    </div>
  );
}
