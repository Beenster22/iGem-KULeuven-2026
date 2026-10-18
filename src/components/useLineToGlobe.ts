// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the home page's line-to-globe hand-off (team request). As the
// globe screen scrolls in below the "170 Million" counter, the counter's
// underline lifts off, curls up (its two ends rising until they meet) into a
// ring, and travels onto the globe, which fades in inside it; the ring then
// fades away. Tied to the scroll position, so scrolling back up uncurls it
// back into the line. Drawn on a fixed, full-window SVG overlay and written
// straight to the DOM each frame (like useGlobeDrop in PmosGlobe.tsx), so
// scrolling doesn't re-render anything.
import { useEffect, type RefObject } from "react";

// The sphere's share of the globe canvas — same as SPHERE_FRACTION in
// PmosGlobe.tsx (globe.gl's 50° camera at altitude 2.2).
const SPHERE_FRACTION = Math.tan(Math.asin(1 / 3.2)) / Math.tan((25 * Math.PI) / 180);
// Scroll progress (0 = the globe screen's top at the bottom of the window,
// 1 = it fills the window) by which the ring has closed around the globe.
const CLOSED_AT = 0.85;
const POINTS = 96;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// An arc of the given length bent through `angle` radians, its middle at
// (mx, my) and bulging downwards — a straight line at angle 0, a closed
// ring sitting on (mx, my) at 2π.
function arcPath(mx: number, my: number, length: number, angle: number) {
  const points: string[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const u = i / POINTS - 0.5; // -0.5 … 0.5 along the arc
    let x: number;
    let y: number;
    if (angle < 1e-4) {
      x = mx + u * length;
      y = my;
    } else {
      const r = length / angle;
      const phi = u * angle;
      x = mx + r * Math.sin(phi);
      y = my - r * (1 - Math.cos(phi));
    }
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

export function useLineToGlobe({
  lineRef,
  globeSectionRef,
  active,
  skip,
}: {
  // The element carrying the underline (.pmos-counter-number).
  lineRef: RefObject<HTMLElement | null>;
  globeSectionRef: RefObject<HTMLElement | null>;
  // Only once the counter (and so its line) has been revealed.
  active: boolean;
  skip: boolean;
}) {
  useEffect(() => {
    const line = lineRef.current;
    const section = globeSectionRef.current;
    if (!line || !section || !active || skip) return;

    const svgNs = "http://www.w3.org/2000/svg";
    const overlay = document.createElementNS(svgNs, "svg");
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("class", "line-to-globe");
    const path = document.createElementNS(svgNs, "path");
    overlay.appendChild(path);
    document.body.appendChild(overlay);

    let stage: HTMLElement | null = null;
    let frame: number | null = null;

    const reset = () => {
      overlay.style.visibility = "hidden";
      line.classList.remove("is-detached");
      if (stage) stage.style.opacity = "";
    };

    const update = () => {
      frame = null;
      // The globe is lazy-loaded; until its canvas exists there is nothing
      // to curl onto.
      stage = section.querySelector<HTMLElement>(".pmos-globe-stage");
      const canvas = stage?.querySelector("canvas");
      const g = clamp01(1 - section.getBoundingClientRect().top / window.innerHeight);
      if (!stage || !canvas || g <= 0) {
        reset();
        return;
      }

      // From: the underline as it sits now (a bar along the bottom of the
      // figure's line, see .pmos-counter-number::after).
      const from = line.getBoundingClientRect();
      const fromThickness = parseFloat(getComputedStyle(line).fontSize) * 0.07;
      // To: the globe's sphere, centred in its canvas.
      const to = canvas.getBoundingClientRect();
      const radius = (to.width * SPHERE_FRACTION) / 2;
      const toThickness = Math.max(3, fromThickness * 0.6);

      const e = easeInOut(clamp01(g / CLOSED_AT));
      const mx = lerp(from.left + from.width / 2, to.left + to.width / 2, e);
      const my = lerp(
        from.bottom - fromThickness / 2,
        to.top + to.height / 2 + radius,
        e,
      );
      const length = lerp(from.width, 2 * Math.PI * radius, e);
      path.setAttribute("d", arcPath(mx, my, length, 2 * Math.PI * e));
      path.setAttribute("stroke-width", String(lerp(fromThickness, toThickness, e)));
      // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request):
      // takes on the globe's atmosphere colour and glow as it closes round it.
      path.style.setProperty("--tint", String(clamp01((e - 0.35) / 0.65)));

      overlay.style.visibility = "";
      overlay.style.opacity = String(1 - clamp01((g - CLOSED_AT) / (1 - CLOSED_AT)));
      line.classList.add("is-detached");
      // The globe fills in inside the ring as it closes.
      stage.style.opacity = String(clamp01((g - 0.6) / (CLOSED_AT - 0.6)));
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      reset();
      overlay.remove();
    };
  }, [lineRef, globeSectionRef, active, skip]);
}
