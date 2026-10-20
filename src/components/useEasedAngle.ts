// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-21
// Purpose: the angle of a turning SVG wheel, eased from where it is to a new
// target over `ms`. The wheels (WheelSelector, DBTLCycles, FeedbackCycle) set
// it as an SVG `rotate(angle cx cy)` attribute rather than a CSS transform
// with a transition: Safari does not place a CSS transform-origin on an SVG
// group the way Chrome does, so the wheels swung off-centre as they turned.
// The attribute means the same in every browser.
import { useEffect, useRef, useState } from "react";

type Bezier = readonly [number, number, number, number];

// CSS-style cubic-bezier(x1, y1, x2, y2) easing: progress in, progress out.
function bezier([x1, y1, x2, y2]: Bezier, t: number) {
  const at = (a: number, b: number, u: number) =>
    3 * a * (1 - u) * (1 - u) * u + 3 * b * (1 - u) * u * u + u * u * u;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (at(x1, x2, mid) < t) lo = mid;
    else hi = mid;
  }
  return at(y1, y2, (lo + hi) / 2);
}

export function useEasedAngle(target: number, ms: number, curve: Bezier) {
  const [angle, setAngle] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setAngle(target);
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / ms);
      current.current = from + (target - from) * bezier(curve, t);
      setAngle(current.current);
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms]);

  return angle;
}
