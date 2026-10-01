// Purpose: homepage section directly below the intro hero — a headline
// count-up stat, then the interactive globe (PmosGlobe.tsx) underneath it.
import { lazy, Suspense, useEffect, useRef, useState } from "react";
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
    <section className="pmos-overview home-section--wave-top">
      <MicrobeBackdrop count={4} seed={1} />
      <div className="pmos-counter" ref={headingRef}>
        <h2 className="pmos-counter-heading">
          <span className="pmos-counter-number">{count.toLocaleString()}</span>{" "}
          women are affected by PMOS during their reproductive years alone
        </h2>
        <p className="pmos-counter-sub">
          Diagnosis is often delayed: up to <strong>70%</strong> of affected
          individuals remain undiagnosed.
        </p>
      </div>
      <Suspense
        fallback={<div className="pmos-globe-loading">Loading globe…</div>}
      >
        <PmosGlobe />
      </Suspense>
      {/* Edited with Claude Opus 5.5 (Anthropic), 2026-10-01 — citations as
          supplied by the team in "Text for HOME PAGE".
          TODO(team): link the wiki page explaining the IHME GBD method once
          it exists. */}
      <p className="pmos-overview-source">
        Sources: Prevalence of polycystic ovary syndrome: a global and regional
        systematic review and meta-analysis, <em>Hum Reprod Update</em>, 2026,{" "}
        <a href="https://doi.org/10.1093/humupd/dmaf030">
          doi:10.1093/humupd/dmaf030
        </a>
        ; The prevalence of polycystic ovary syndrome in a community sample
        assessed under contrasting diagnostic criteria, <em>Hum Reprod</em>,
        2010; 25:544-551. Continent figures: IHME Global Burden of Disease data;
        see also{" "}
        <a href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(26)00717-8/fulltext">
          The Lancet (2026)
        </a>{" "}
        and{" "}
        <a href="https://link.springer.com/article/10.1186/s12978-025-02016-y">
          Springer (2025)
        </a>
        .
      </p>
    </section>
  );
}
