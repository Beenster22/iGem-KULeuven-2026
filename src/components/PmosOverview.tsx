// Purpose: the two homepage sections directly below the intro hero — a
// headline count-up stat, then the interactive globe (PmosGlobe.tsx).
import {
  Children,
  isValidElement,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { PMOS_TOTAL } from "./pmosContinentStats";
import { MicrobeBackdrop } from "./MicrobeBackdrop";

// three.js + globe.gl add ~700KB (gzipped) to the bundle — lazy-loaded so
// that weight is only fetched once a visitor actually scrolls this far,
// instead of blocking the initial page/hero load for everyone.
const PmosGlobe = lazy(() =>
  import("./PmosGlobe").then((m) => ({ default: m.PmosGlobe })),
);

const COUNT_DURATION_MS = 2000;
const EASE_OUT_CUBIC = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
    let frame: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      // Clamped at 0 too: the first frame's timestamp can predate startTime.
      const progress = Math.min(
        Math.max((now - startTime) / COUNT_DURATION_MS, 0),
        1,
      );
      setValue(Math.round(target * EASE_OUT_CUBIC(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, prefersReducedMotion]);

  return value;
}

// The caption under the globe is written in home.mdx (as this component's
// children) rather than here, so its [^n] citations go through the same
// footnote pipeline as the rest of the wiki and end up in the page's
// References panel.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-05: split into two
// full-screen sections (each a `data-snap` stop, see HomeSnapScroll.tsx) —
// the headline figure on its own, then the globe.
export function PmosOverview({ children }: { children?: ReactNode }) {
  const caption = Children.toArray(children).filter(isValidElement);
  const headingRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const millions = useCountUp(PMOS_TOTAL / 1_000_000, inView);

  return (
    <>
      <section
        className="pmos-overview home-snap-screen home-section--wave-top"
        data-snap=""
      >
        <MicrobeBackdrop count={4} seed={1} />
        <div className="pmos-counter" ref={headingRef}>
          {/* Wording as asked for by the team; the figure (PMOS_TOTAL, in
              millions) counts up, on its own line and much larger than the
              words under it. */}
          <h2 className="pmos-counter-heading">
            <span className="pmos-counter-number">{millions} million</span>{" "}
            <span className="pmos-counter-rest">
              women affected during their reproductive years
            </span>
          </h2>
        </div>
      </section>
      <section
        className="pmos-overview home-section--body home-snap-screen home-section--wave-top"
        data-snap=""
      >
        <MicrobeBackdrop count={4} seed={6} />
        <Suspense
          fallback={<div className="pmos-globe-loading">Loading globe…</div>}
        >
          <PmosGlobe />
        </Suspense>
        {caption.length > 0 && (
          <div className="pmos-overview-source">{caption}</div>
        )}
      </section>
    </>
  );
}
