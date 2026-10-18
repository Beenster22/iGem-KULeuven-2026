// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the home page's "globe drop" — while the "PMOS manifests
// differently in patients" screen scrolls in, the globe (PmosGlobe.tsx) falls
// down onto that screen's first circle and turns into it (see
// PmosEffectsSection.tsx). Both components read the same scroll position
// from here, so the globe hands over to the circle on exactly the same frame.

// The id of PmosEffectsSection's tall pinned wrapper.
export const PMOS_EFFECTS_ID = "pmos-effects";

// How far the effects screen has scrolled in: 0 while its top is still at
// the bottom of the screen (or below), 1 once it has reached the top and is
// pinned there. Null when the screen isn't on the page.
export function globeDropProgress(): number | null {
  const wrapper = document.getElementById(PMOS_EFFECTS_ID);
  if (!wrapper) return null;
  const top = wrapper.getBoundingClientRect().top;
  return Math.min(1, Math.max(0, 1 - top / window.innerHeight));
}

// The globe has landed and the circle takes over. A hair short of 1 so
// rounding in getBoundingClientRect can't leave both hidden.
export const GLOBE_LANDED = 0.995;
