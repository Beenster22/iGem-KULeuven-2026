// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the home page's "globe drop" — while the "PMOS manifests
// differently in patients" screen scrolls in, the globe (PmosGlobe.tsx) falls
// down onto that screen's first circle and turns into it (see
// PmosEffectsSection.tsx). Both components read the same scroll position
// from here, so the globe hands over to the circle on exactly the same frame.

import { navBottom } from "./useFallingM";

// The id of PmosEffectsSection's section.
export const PMOS_EFFECTS_ID = "pmos-effects";

// The "HERE" link in Elle's speech bubble beside the globe (PmosOverview).
export const GLOBE_DROP_START_SELECTOR = ".pmos-prevalence-here";

// How far the drop has got: 0 until the "HERE" link in Elle's bubble has
// scrolled up to the navigation bar, 1 once the effects screen's top has
// reached the top of the window (and from then on). Null when the screen
// isn't on the page.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback): it
// used to start as soon as the effects screen's top entered the window;
// now it waits for "HERE" to reach the navigation bar, so the globe (and
// its halo, see useLineToGlobe.ts) has finished settling first.
export function globeDropProgress(): number | null {
  const wrapper = document.getElementById(PMOS_EFFECTS_ID);
  if (!wrapper) return null;
  const end = wrapper.getBoundingClientRect().top + window.scrollY;
  const here = document.querySelector(GLOBE_DROP_START_SELECTOR);
  let start = end - window.innerHeight;
  if (here) {
    const hereStart = here.getBoundingClientRect().top + window.scrollY - navBottom();
    // Leave the drop at least a third of a screen to play out in.
    start = Math.min(hereStart, end - window.innerHeight / 3);
  }
  return Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
}

// The globe has landed and the circle takes over. A hair short of 1 so
// rounding in getBoundingClientRect can't leave both hidden.
export const GLOBE_LANDED = 0.995;
