// Purpose: homepage section directly below the intro hero — a headline
// count-up stat, then the interactive globe (PmosGlobe.tsx) underneath it.
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { PMOS_TOTAL } from "./pmosContinentStats";

// three.js + globe.gl add ~700KB (gzipped) to the bundle — lazy-loaded so
// that weight is only fetched once a visitor actually scrolls this far,
// instead of blocking the initial page/hero load for everyone.
const PmosGlobe = lazy(() => import("./PmosGlobe").then((m) => ({ default: m.PmosGlobe })));

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

export function PmosOverview() {
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
    <section className="pmos-overview">
      <div className="pmos-counter" ref={headingRef}>
        <h2 className="pmos-counter-heading">
          <span className="pmos-counter-number">{count.toLocaleString()}</span> people are affected
          by PMOS
        </h2>
      </div>
      <Suspense fallback={<div className="pmos-globe-loading">Loading globe…</div>}>
        <PmosGlobe />
      </Suspense>
    </section>
  );
}
