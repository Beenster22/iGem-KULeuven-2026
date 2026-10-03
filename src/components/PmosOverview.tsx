// Purpose: homepage section directly below the intro hero — a headline
// count-up stat, then the interactive globe (PmosGlobe.tsx) underneath it.
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
      const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1);
      setValue(Math.round(target * EASE_OUT_CUBIC(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, prefersReducedMotion]);

  return value;
}

// The text under the counter and under the globe is written in home.mdx
// (as this component's children) rather than here, so its [^n] citations go
// through the same footnote pipeline as the rest of the wiki and end up in
// the page's References panel. The first paragraph sits under the counter;
// any further paragraphs become the caption under the globe.
export function PmosOverview({ children }: { children?: ReactNode }) {
  const [sub, ...caption] = Children.toArray(children).filter(isValidElement);
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

  const count = useCountUp(PMOS_TOTAL, inView);

  return (
    <section className="pmos-overview home-section--wave-top">
      <MicrobeBackdrop count={4} seed={1} />
      <div className="pmos-counter" ref={headingRef}>
        <h2 className="pmos-counter-heading">
          <span className="pmos-counter-number">{count.toLocaleString()}</span>{" "}
          women are affected by PMOS during their reproductive years alone
        </h2>
        <div className="pmos-counter-sub">{sub}</div>
      </div>
      <Suspense
        fallback={<div className="pmos-globe-loading">Loading globe…</div>}
      >
        <PmosGlobe />
      </Suspense>
      {caption.length > 0 && (
        <div className="pmos-overview-source">{caption}</div>
      )}
    </section>
  );
}
