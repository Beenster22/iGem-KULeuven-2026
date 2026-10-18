// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the home page's "globe drop" — while the "PMOS manifests
// differently in patients" screen scrolls in, the globe (PmosGlobe.tsx) falls
// down onto that screen's first circle and turns into it (see
// PmosEffectsSection.tsx). Both components read the same scroll position
// from here, so the globe hands over to the circle on exactly the same frame.

import { navBottom } from "./useFallingM";

// The id of PmosEffectsSection's section.
export const PMOS_EFFECTS_ID = "pmos-effects";

// The globe's stage (PmosGlobe.tsx) — it never moves during the drop (only
// the layer inside it does), so it marks where the globe sits at rest.
const GLOBE_STAGE_SELECTOR = ".pmos-globe-stage";
// The sphere's share of the stage's width (SPHERE_FRACTION in PmosGlobe.tsx).
const SPHERE_FRACTION = Math.tan(Math.asin(1 / 3.2)) / Math.tan((25 * Math.PI) / 180);
// The halo ring round the sphere (--halo-w on .pmos-globe-halo).
const HALO_WIDTH = 4;
// How far below the top of the globe (as a share of its diameter) the
// navigation bar has to reach before the drop starts (team request,
// 2026-10-18: "a little bit lower than the top").
const START_BELOW_TOP = 0.15;

// The scroll positions the drop runs between: `start`, where a point just
// below the top of the globe (START_BELOW_TOP) has scrolled up to the
// navigation bar, and `end`, where the effects screen's top reaches the top
// of the window. Null when the screen isn't on the page.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback): it
// used to start as soon as the effects screen's top entered the window;
// now it waits for the top of the globe to reach the navigation bar. Split
// out of globeDropProgress so the auto-scroll (PmosEffectsSection.tsx) can
// glide to exactly these two points.
export function globeDropRange(): { start: number; end: number } | null {
  const wrapper = document.getElementById(PMOS_EFFECTS_ID);
  if (!wrapper) return null;
  const end = wrapper.getBoundingClientRect().top + window.scrollY;
  const stage = document.querySelector(GLOBE_STAGE_SELECTOR);
  let start = end - window.innerHeight;
  if (stage) {
    const box = stage.getBoundingClientRect();
    const diameter = box.width * SPHERE_FRACTION;
    const globeTop = box.top + box.height / 2 - diameter / 2 - HALO_WIDTH;
    const trigger = globeTop + diameter * START_BELOW_TOP;
    const globeStart = trigger + window.scrollY - navBottom();
    // Leave the drop at least a third of a screen to play out in.
    start = Math.min(globeStart, end - window.innerHeight / 3);
  }
  return { start, end };
}

// How far the drop has got: 0 up to `start`, 1 from `end` on.
export function globeDropProgress(): number | null {
  const range = globeDropRange();
  if (!range) return null;
  const { start, end } = range;
  return Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
}

// The globe has landed and the circle takes over. A hair short of 1 so
// rounding in getBoundingClientRect can't leave both hidden.
export const GLOBE_LANDED = 0.995;
