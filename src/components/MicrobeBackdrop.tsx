// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Purpose: decorative layer of faint, slowly drifting bacteria and bile-acid
// hexagons (the DiagramIcons.tsx set) behind the home page's story.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-21 (team requests: a
// smooth background layer of bacteria all over, not just down the sides,
// and smoother scrolling): one layer fixed to the screen behind every band,
// instead of a copy in each band, with the bacteria spread across the whole
// width and the swooshes on it too. It only ever moves by transforms and
// opacity, worked out from two numbers set on it alone (--sweep and
// --whoosh, by useBackdropApproach in HomeSnapScroll.tsx), so scrolling
// never makes the browser restyle or repaint the rest of the page. Rendered
// once, by HomeSnapScroll; styles under MICROBE BACKDROP in App.css.
import { createPortal } from "react-dom";
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

// Laid out on a loose grid over one screen, a cell each with a little
// jitter, so they cover it evenly without lining up.
const COLUMNS = 6;
const ROWS = 5;
const FIELD_SEED = 3;

// The swooshes: three sheets of streaks, each scrolling at its own speed
// (see .microbe-backdrop-swoosh--* in App.css).
const SWOOSHES = ["a", "b", "c"];

export function MicrobeBackdrop() {
  const items = Array.from({ length: COLUMNS * ROWS }, (_, i) => {
    const s = FIELD_SEED * 100 + i;
    const column = i % COLUMNS;
    const row = Math.floor(i / COLUMNS);
    const left = ((column + 0.1 + seededValue(s + 2) * 0.8) / COLUMNS) * 96 + 1;
    const top = (row + 0.1 + seededValue(s + 1) * 0.8) / ROWS;
    const kind = seededValue(s + 3);
    // Where it starts (--y0, a share of the screen's height) and how near
    // it is: nearer ones (--depth) travel faster and are larger. The sweep
    // goes on the mover, so it runs down the screen whichever way the item
    // itself is turned.
    const place = {
      "--y0": top.toFixed(4),
      left: `${left.toFixed(2)}%`,
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

  return createPortal(
    <div className="microbe-backdrop" aria-hidden="true">
      <div className="microbe-backdrop-swooshes">
        {SWOOSHES.map((name) => (
          <div
            key={name}
            className={`microbe-backdrop-swoosh microbe-backdrop-swoosh--${name}`}
          />
        ))}
      </div>
      {items}
    </div>,
    document.body,
  );
}
