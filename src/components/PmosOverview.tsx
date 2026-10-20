// Purpose: the homepage section directly below the intro hero — a headline
// count-up stat. (The interactive globe now lives in the appendix of the
// Project description page, see PmosGlobeSection.tsx.)
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { PMOS_TOTAL } from "./pmosContinentStats";
import { MicrobeBackdrop } from "./MicrobeBackdrop";
import { useFallingM } from "./useFallingM";

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

// Edited with Claude Opus 5.5 (Anthropic), 2026-10-05: split into two
// full-screen sections (each a `data-snap` stop, see HomeSnapScroll.tsx) —
// the headline figure on its own, then the globe.
// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request): the
// globe moved to the Project description appendix; only the figure remains.
export function PmosOverview() {
  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request): this
  // screen starts blank. The M of "Million" falls in from the PMOS acrostic
  // above as it is scrolled to and climbs a bar-chart staircase
  // (useFallingM.ts); "illion" appears once it has landed ("landed"), and
  // the figure then counts up with its underline and the sentence
  // ("revealed"). Edited 2026-10-20 (team request): the M falls straight
  // into place, with no staircase to climb, and the nought it lands beside
  // flies on to the first symptom circle (see useZeroToCircle.ts).
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

  return (
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
          <span className="pmos-counter-number" aria-hidden="true">
            {/* Fixed width for the final figure, so the line (and the
                M's landing spot) doesn't shift while it counts up. */}
            <span
              className="pmos-counter-figure"
              style={{ minWidth: `${String(totalMillions).length}ch` }}
            >
              {/* The last digit on its own: it flies down and becomes the
                  first symptom circle once the figure is complete (see
                  useZeroToCircle.ts). */}
              {millions === totalMillions ? (
                <>
                  {String(millions).slice(0, -1)}
                  <span className="pmos-counter-zero">
                    {String(millions).slice(-1)}
                  </span>
                </>
              ) : (
                millions
              )}
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
  );
}
