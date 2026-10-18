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
import { Link } from "react-router-dom";
import { PMOS_TOTAL } from "./pmosContinentStats";
import { MicrobeBackdrop } from "./MicrobeBackdrop";
import { ElleSays } from "./ElleSays";
import { useFallingM } from "./useFallingM";
import { useLineToGlobe } from "./useLineToGlobe";

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

  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request): this
  // screen starts blank. The M of "Million" falls in from the PMOS acrostic
  // above as it is scrolled to and climbs a bar-chart staircase
  // (useFallingM.ts); "illion" appears once it has landed ("landed"), and
  // once the stairs are gone the figure counts up with its underline and
  // the sentence ("revealed").
  const sectionRef = useRef<HTMLElement>(null);
  const mSlotRef = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState<"blank" | "landed" | "revealed">("blank");
  const prefersReducedMotion = useReducedMotion();
  useFallingM({
    sectionRef,
    slotRef: mSlotRef,
    onLanded: () => setStage((s) => (s === "blank" ? "landed" : s)),
    onDone: () => setStage("revealed"),
    skip: !!prefersReducedMotion,
  });

  const totalMillions = PMOS_TOTAL / 1_000_000;
  const millions = useCountUp(totalMillions, stage === "revealed");

  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request): the
  // counter's underline then curls up into the globe on the next screen
  // (useLineToGlobe.ts).
  const lineRef = useRef<HTMLSpanElement>(null);
  const globeSectionRef = useRef<HTMLElement>(null);
  useLineToGlobe({
    lineRef,
    globeSectionRef,
    active: stage === "revealed",
    skip: !!prefersReducedMotion,
  });

  return (
    <>
      <section
        ref={sectionRef}
        className="pmos-overview home-snap-screen home-section--wave-top"
        data-snap=""
      >
        <MicrobeBackdrop count={4} seed={1} />
        <div
          className={
            "pmos-counter" +
            (stage !== "blank" ? " pmos-counter--landed" : "") +
            (stage === "revealed" ? " pmos-counter--revealed" : "")
          }
        >
          {/* Wording as asked for by the team; the figure (PMOS_TOTAL, in
              millions) counts up, on its own line and much larger than the
              words under it. */}
          <h2
            className="pmos-counter-heading"
            aria-label={`${totalMillions} Million women affected during their reproductive years`}
          >
            <span ref={lineRef} className="pmos-counter-number" aria-hidden="true">
              {/* Fixed width for the final figure, so the line (and the
                  M's landing spot) doesn't shift while it counts up. */}
              <span
                className="pmos-counter-figure"
                style={{ minWidth: `${String(totalMillions).length}ch` }}
              >
                {millions}
              </span>{" "}
              <span ref={mSlotRef} className="pmos-counter-m">
                M
              </span>
              <span className="pmos-counter-illion">illion</span>
            </span>{" "}
            <span className="pmos-counter-rest" aria-hidden="true">
              women affected during their reproductive years
            </span>
          </h2>
        </div>
      </section>
      <section
        ref={globeSectionRef}
        className="pmos-overview home-section--body home-snap-screen home-section--wave-top"
        data-snap=""
      >
        <MicrobeBackdrop count={4} seed={6} />
        <div className="pmos-prevalence-elle">
          <ElleSays size="lg" side="right">
            To find out more how we got these numbers click{" "}
            <Link to="/description#how-many-people-live-with-pmos">HERE</Link>.
          </ElleSays>
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
    </>
  );
}
