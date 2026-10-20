// Generated with Claude Opus 5 (Anthropic), 2026-10-20 (team request)
// Purpose: the "0" of "170 Million" becomes the first of the symptom
// circles below it. As the reader scrolls on from the counter, a disc flies
// from the nought down to where the first circle sits and grows into it;
// the moment it arrives the rest of the circles appear, all together,
// without the reader having to scroll any further.
//
// Both ends are read live every frame, so the disc sits exactly on the
// nought at the start and exactly on the circle at the end however the two
// screens happen to be placed. The circles themselves wait behind
// --circles-in until then, so the first one is never drawn twice.
//
// Modelled on useBileAcidFlight.ts, which hands the bile acids over to the
// TGR5 screen the same way.
import { useEffect, type RefObject } from "react";
import { navBottom } from "./useFallingM";

/** The nought it sets off from (see PmosOverview). */
const ZERO = ".pmos-counter-zero";
/** The disc of the first symptom circle, and the circles that wait. */
const ART = ".pmos-effect-art";

// Where the circles' band has to have reached, as a share of the window
// down from its top, before the nought starts to go anywhere (team
// request: it holds its place until that border is arriving, rather than
// setting off the moment the reader scrolls). It finishes as that border
// meets the navigation bar.
const BORDER_AT = 0.7;
// When the drawing inside the disc starts to show, as a share of the way.
const ART_FROM = 0.45;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function useZeroToCircle({
  sectionRef,
  skip,
}: {
  /** The symptom circles' section (.pmos-effects). */
  sectionRef: RefObject<HTMLElement | null>;
  skip: boolean;
}) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || skip) return;

    const ghost = document.createElement("div");
    ghost.className = "zero-circle-flight";
    ghost.setAttribute("aria-hidden", "true");
    const art = document.createElement("div");
    art.className = "zero-circle-flight-art";
    ghost.append(art);
    document.body.append(ghost);

    let copied = false;
    let frame: number | null = null;

    const rest = () => {
      ghost.style.visibility = "hidden";
    };

    const update = () => {
      frame = null;
      const zero = document.querySelector<HTMLElement>(ZERO);
      const first = section.querySelector<HTMLElement>(ART);
      if (!zero || !first) return rest();

      // From the band's border coming up the screen to it meeting the
      // navigation bar.
      const bandTop = section.getBoundingClientRect().top + window.scrollY;
      const endAt = bandTop - navBottom();
      const startAt = bandTop - window.innerHeight * BORDER_AT;
      if (endAt <= startAt) return rest();

      if (window.scrollY <= startAt) {
        // Not yet: the nought is still just a nought, and the circles wait.
        section.style.setProperty("--circles-in", "0");
        zero.style.visibility = "";
        return rest();
      }
      if (window.scrollY >= endAt) {
        // Arrived: the circles take over, the first one on this very spot.
        section.style.setProperty("--circles-in", "1");
        zero.style.visibility = "";
        return rest();
      }

      const from = zero.getBoundingClientRect();
      const to = first.getBoundingClientRect();
      if (!from.width || !to.width) return rest();

      // The circle's own look, taken once from the real thing so the disc
      // that arrives is the one the reader then sees.
      if (!copied) {
        const style = getComputedStyle(first);
        ghost.style.borderColor = style.borderColor;
        ghost.style.backgroundColor = style.backgroundColor;
        const svg = first.querySelector("svg");
        if (svg) art.innerHTML = svg.outerHTML;
        copied = true;
      }

      const e = easeInOut(
        clamp01((window.scrollY - startAt) / (endAt - startAt)),
      );
      // Square at both ends: the nought is taken at its own height, so the
      // disc starts the size of the figure rather than its narrower box.
      const size = lerp(from.height, to.height, e);
      const left = lerp(from.left + from.width / 2, to.left + to.width / 2, e);
      const top = lerp(from.top + from.height / 2, to.top + to.height / 2, e);

      zero.style.visibility = "hidden";
      section.style.setProperty("--circles-in", "0");
      Object.assign(ghost.style, {
        visibility: "visible",
        width: `${size.toFixed(1)}px`,
        height: `${size.toFixed(1)}px`,
        left: `${(left - size / 2).toFixed(1)}px`,
        top: `${(top - size / 2).toFixed(1)}px`,
        borderWidth: `${lerp(size * 0.07, 4, e).toFixed(2)}px`,
      });
      art.style.opacity = String(clamp01((e - ART_FROM) / (1 - ART_FROM)));
    };

    const onScroll = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      section.style.removeProperty("--circles-in");
      document
        .querySelector<HTMLElement>(ZERO)
        ?.style.removeProperty("visibility");
      ghost.remove();
    };
  }, [sectionRef, skip]);
}
