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
// data-circles until then, so the first one is never drawn twice; the
// moment it arrives the rest pop in one after another, quickly, with no
// more scrolling.
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
// The cross-fade, as shares of the way across. The nought itself fades out
// while the ring fades in over it, and the drawing inside only begins once
// the ring is nearly there — so it reads as the figure turning into the
// circle rather than a circle laid over the figure (team request).
const DIGIT_OUT = [0.12, 0.52];
const DISC_IN = [0.08, 0.6];
const ART_IN = [0.58, 1];

/** How far through `span` `e` has come, as 0..1. */
const across = (e: number, span: readonly number[]) =>
  clamp01((e - span[0]) / (span[1] - span[0]));

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

    // The stand-in holds both ends at once: the nought it sets off as, and
    // the circle it becomes, one fading into the other as it travels.
    const ghost = document.createElement("div");
    ghost.className = "zero-circle-flight";
    ghost.setAttribute("aria-hidden", "true");
    const digit = document.createElement("span");
    digit.className = "zero-circle-flight-digit";
    const disc = document.createElement("div");
    disc.className = "zero-circle-flight-disc";
    const art = document.createElement("div");
    art.className = "zero-circle-flight-art";
    disc.append(art);
    ghost.append(digit, disc);
    document.body.append(ghost);

    let copied = false;
    // The nought's own type size as a share of its box, so the stand-in's
    // figure grows with the box instead of staying the size it started.
    let digitRatio = 1;
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
        section.dataset.circles = "waiting";
        zero.style.visibility = "";
        return rest();
      }
      if (window.scrollY >= endAt) {
        // Arrived: the circles take over, the first one on this very spot.
        section.dataset.circles = "in";
        zero.style.visibility = "";
        return rest();
      }

      const from = zero.getBoundingClientRect();
      const to = first.getBoundingClientRect();
      if (!from.width || !to.width) return rest();

      // Both ends' own looks, taken once from the real things, so what sets
      // off is the figure the reader was just reading and what arrives is
      // the circle they are about to see.
      if (!copied) {
        const circleStyle = getComputedStyle(first);
        disc.style.borderColor = circleStyle.borderColor;
        disc.style.backgroundColor = circleStyle.backgroundColor;
        const svg = first.querySelector("svg");
        if (svg) art.innerHTML = svg.outerHTML;

        const zeroStyle = getComputedStyle(zero);
        digit.textContent = zero.textContent;
        digit.style.fontFamily = zeroStyle.fontFamily;
        digit.style.fontWeight = zeroStyle.fontWeight;
        digit.style.color = zeroStyle.color;
        const zeroSize = parseFloat(zeroStyle.fontSize);
        const zeroBox = zero.getBoundingClientRect().height;
        digitRatio = zeroBox ? zeroSize / zeroBox : 1;
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
      section.dataset.circles = "waiting";
      Object.assign(ghost.style, {
        visibility: "visible",
        width: `${size.toFixed(1)}px`,
        height: `${size.toFixed(1)}px`,
        left: `${(left - size / 2).toFixed(1)}px`,
        top: `${(top - size / 2).toFixed(1)}px`,
      });
      // The figure fades out as the ring draws itself in over it, and the
      // drawing inside comes last of all.
      digit.style.fontSize = `${(size * digitRatio).toFixed(1)}px`;
      digit.style.opacity = String(1 - across(e, DIGIT_OUT));
      const ring = across(e, DISC_IN);
      disc.style.opacity = String(ring);
      disc.style.borderWidth = `${(4 * ring).toFixed(2)}px`;
      art.style.opacity = String(across(e, ART_IN));
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
      delete section.dataset.circles;
      document
        .querySelector<HTMLElement>(ZERO)
        ?.style.removeProperty("visibility");
      ghost.remove();
    };
  }, [sectionRef, skip]);
}
