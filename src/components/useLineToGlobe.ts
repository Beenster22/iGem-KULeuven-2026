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
import { navBottom } from "./useFallingM";

// The sphere's share of the globe canvas — same as SPHERE_FRACTION in
// PmosGlobe.tsx (globe.gl's 50° camera at altitude 2.2).
const SPHERE_FRACTION = Math.tan(Math.asin(1 / 3.2)) / Math.tan((25 * Math.PI) / 180);
// Scroll progress (0 = the globe screen's top at the bottom of the window,
// 1 = it fills the window) by which the ring has closed around the globe.
const CLOSED_AT = 0.85;
const POINTS = 96;

// The halo's ring width in px (--halo-w on .pmos-globe-halo), which the line
// thins down to as it closes, so the two match at the hand-over.
function haloWidth(stage: HTMLElement) {
  const halo = stage.querySelector(".pmos-globe-halo");
  const width = halo ? parseFloat(getComputedStyle(halo).borderTopWidth) : NaN;
  return Number.isFinite(width) && width > 0 ? width : 4;
}

const clamp01 =(v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// 0 → 1 over t = 0 … 1, leaving 0 at slope `startRate` and arriving at 1
// flat (a cubic Hermite curve); always rising for startRate ≥ 0.
const settle = (t: number, startRate: number) =>
  startRate * (t ** 3 - 2 * t ** 2 + t) + (3 * t ** 2 - 2 * t ** 3);

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

    // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback):
    // the line now stays under "170 Million" until that line has scrolled up
    // to the navigation bar, and only then drops onto the globe, closing
    // round it as the globe screen settles. Once closed it stays on as the
    // globe's halo (.pmos-globe-halo in PmosGlobe.tsx, drawn in exactly the
    // same place, so the hand-over is invisible) instead of fading away.
    const show = (globe: number, halo: number) => {
      if (!stage) return;
      stage.style.opacity = globe >= 1 ? "" : String(globe);
      stage.style.setProperty("--halo", String(halo));
    };

    const update = () => {
      frame = null;
      // The globe is lazy-loaded; until its canvas exists there is nothing
      // to curl onto.
      stage = section.querySelector<HTMLElement>(".pmos-globe-stage");
      const canvas = stage?.querySelector("canvas");
      if (!stage || !canvas) {
        overlay.style.visibility = "hidden";
        line.classList.remove("is-detached");
        return;
      }

      // Scroll positions where the line lets go (its "170 Million" reaches
      // the nav bar) and where the ring has closed round the globe.
      const lineBox = line.getBoundingClientRect();
      const releaseAt = lineBox.top + window.scrollY - navBottom();
      const closedAt =
        section.getBoundingClientRect().top + window.scrollY -
        window.innerHeight * (1 - CLOSED_AT);
      const q =
        closedAt > releaseAt
          ? (window.scrollY - releaseAt) / (closedAt - releaseAt)
          : window.scrollY >= releaseAt ? 1 : 0;

      if (q <= 0) {
        // Still in place under the figure; the globe waits for it.
        overlay.style.visibility = "hidden";
        line.classList.remove("is-detached");
        show(0, 0);
        return;
      }
      if (q >= 1) {
        // Closed: the globe's own halo takes over.
        overlay.style.visibility = "hidden";
        line.classList.add("is-detached");
        show(1, 1);
        return;
      }

      // From: the underline where it let go (a bar along the bottom of the
      // figure's line, see .pmos-counter-number::after), held at the nav bar.
      const shift = window.scrollY - releaseAt;
      const fromThickness = parseFloat(getComputedStyle(line).fontSize) * 0.07;
      const fromX = lineBox.left + lineBox.width / 2;
      const fromY = lineBox.bottom + shift - fromThickness / 2;
      // To: the globe's sphere, centred in its canvas.
      const to = canvas.getBoundingClientRect();
      // The closed ring is the halo exactly: its stroke centred half a ring
      // width outside the sphere's edge (see .pmos-globe-halo).
      const toThickness = haloWidth(stage);
      const radius = (to.width * SPHERE_FRACTION) / 2 + toThickness / 2;

      // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback:
      // it dipped, then jumped to line up): the ring's position is now
      // measured from the globe (which keeps scrolling up meanwhile), not
      // aimed at it. Its offset from the globe shrinks along a curve that
      // starts at just the speed that holds the ring still where it let go
      // and ends at zero, so it settles onto the globe moving with it —
      // no sudden turn or snap at either end.
      const gx = to.left + to.width / 2;
      const gy = to.top + to.height / 2 + radius;
      const gy0 = gy + shift; // where the globe was when the line let go
      const gap0 = gy0 - fromY;
      const startRate = gap0 > 0 ? Math.min(1.5, (closedAt - releaseAt) / gap0) : 0;
      const e = settle(q, startRate);
      const mx = gx + (fromX - gx) * (1 - e);
      const my = gy + (fromY - gy0) * (1 - e);
      const length = lerp(lineBox.width, 2 * Math.PI * radius, e);
      path.setAttribute("d", arcPath(mx, my, length, 2 * Math.PI * e));
      path.setAttribute("stroke-width", String(lerp(fromThickness, toThickness, e)));
      // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request):
      // takes on the globe's atmosphere colour and glow as it closes round it.
      // Edited again 2026-10-18 (team feedback): the shift starts the moment
      // the line lets go and runs the whole way, ending on the halo's colour.
      path.style.setProperty("--tint", String(clamp01(e)));

      overlay.style.visibility = "";
      line.classList.add("is-detached");
      // The globe fills in inside the ring as it closes.
      show(clamp01((q - 0.6) / 0.4), 0);
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
      line.classList.remove("is-detached");
      if (stage) {
        stage.style.opacity = "";
        stage.style.removeProperty("--halo");
      }
      overlay.remove();
    };
  }, [lineRef, globeSectionRef, active, skip]);
}
