// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the curve the home page's glides follow (the wheel's glide from screen
// to screen in HomeSnapScroll.tsx and the tour's flights), so a page that
// is already being scrolled carries on at its own speed and eases to a stop
// instead of stopping dead and starting again.

// 0 → 1 over t = 0 … 1, leaving 0 at slope `startRate` and arriving at 1
// at rest (a cubic Hermite curve).
export const GLIDE = (t: number, startRate: number) =>
  startRate * (t ** 3 - 2 * t ** 2 + t) + (3 * t ** 2 - 2 * t ** 3);

// Above 3 the curve would overshoot the target before settling back.
export const MAX_START_RATE = 3;

// The slope to start a glide over `distance` px in `duration` ms with, for a
// page currently moving at `velocity` px/ms (0 unless it is already heading
// the right way).
export function glideStartRate(velocity: number, distance: number, duration: number) {
  if (distance === 0 || Math.sign(velocity) !== Math.sign(distance)) return 0;
  return Math.min(MAX_START_RATE, (velocity * duration) / distance);
}

// (Edited 2026-10-21: the "page busy" marker that held the wheel back while
// one of these glides ran is gone — team request: nobody is ever locked in
// an animation.)
