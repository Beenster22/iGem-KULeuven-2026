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

const OTHER_VARIANTS: OtherBacteriumVariant[] = ["rod", "curved", "wavy", "cocci"];

// Edited with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request: the
// bacteria flow on from one band into the next, with no border between):
// every band draws the same field, laid out over the screen rather than
// the band, so where two bands meet their bacteria line up and run on
// across the edge. Hence one fixed count and seed instead of a count and
// seed per band.
// Items per side, spread down one screen. Edited the same day (team
// request: more bacteria and gut metabolites): 9, was 5.
const FIELD_COUNT = 9;
const FIELD_SEED = 3;

export function MicrobeBackdrop() {
  const count = FIELD_COUNT;
  const items = Array.from({ length: count * 2 }, (_, i) => {
    const s = FIELD_SEED * 100 + i;
    const side = i % 2 === 0 ? "left" : "right";
    const row = Math.floor(i / 2);
    // Evenly spaced rows with jitter, so each side is covered top to bottom.
    const top = ((row + 0.2 + seededValue(s + 1) * 0.6) / count) * 100;
    // % from that side's edge.
    const inset = 1.5 + seededValue(s + 2) * 11;
    const kind = seededValue(s + 3);
    // Where it sits and how near it is, on a mover that carries it across
    // the screen as the reader scrolls (team request, 2026-10-20: the
    // passage through the gut; see useBackdropApproach in
    // HomeSnapScroll.tsx). Nearer ones (--depth) travel faster and are
    // larger. The sweep goes on the mover, so it runs down the screen
    // whichever way the item itself is turned. --y0 is where it starts, as
    // a fraction of the screen (see .microbe-backdrop-mover in App.css).
    const place = {
      "--y0": (top / 100).toFixed(4),
      [side]: `${inset}%`,
      "--depth": (0.4 + seededValue(s + 9) * 0.6).toFixed(2),
    } as React.CSSProperties;
    // Its own turn and slow float, on the item itself.
    const style = {
      "--r": `${Math.round(seededValue(s + 4) * 360)}deg`,
      animationDuration: `${14 + seededValue(s + 5) * 10}s`,
      animationDelay: `${-seededValue(s + 6) * 20}s`,
    } as React.CSSProperties;

    // A little over a third are bile acids, the gut metabolites the page
    // is about.
    let icon;
    if (kind < 0.25) {
      icon = <PVulgatusIcon className="microbe-backdrop-item microbe-backdrop-item--pv" style={style} />;
    } else if (kind < 0.62) {
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
