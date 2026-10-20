// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the home page's "M" hand-off (team request). The counter screen
// below the PMOS definition starts blank; as the visitor scrolls down to
// it, the teal M of "Metabolic" (PmosDefinition) falls with the scroll into
// that empty screen, and settles straight into the M of "Million"
// (onLanded); PmosOverview then reveals the figure (onDone).
// The fall is tied to the scroll position, so scrolling back up puts the M
// back in "Metabolic"; the climb, once started, plays through. It is all
// done imperatively — throwaway elements appended to <body>, moved with the
// Web Animations API — as it only ever plays once.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback): the
// fall is now scroll-linked into a blank screen.
// Edited with Claude Opus 5 (Anthropic), 2026-10-19: the stand-in now takes
// over on the source letter's baseline instead of centred on its line box,
// which dropped it 8px the moment it let go of "Metabolic".
// Edited with Claude Opus 5 (Anthropic), 2026-10-20 (team request): the
// bar-chart staircase is gone. The M used to drop onto the lowest bar and
// hop up four of them into the slot; it now falls the whole way to the
// slot, growing to size as it goes, and only lands.
import { useEffect, useRef, type RefObject } from "react";

// Put this attribute on the letter the M falls from (see PmosDefinition).
export const FALLING_M_SOURCE_ATTR = "data-falling-m-source";

// Scroll progress (0 = the counter screen's top at the bottom of the
// window, 1 = it fills the window) at which the M has arrived.
const LAND_AT = 0.9;
const LAND_MS = 200;
const SQUASH_MS = 160;
const PAUSE_MS = 350;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Pose {
  x: number;
  y: number;
  s: number;
}

function pageBox(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}

// Distance from the top of `el`'s inline-block box down to its baseline:
// the font's content area is centred in the line box (half-leading), and the
// baseline sits fontBoundingBoxAscent below the content area's top.
function baselineOffset(el: HTMLElement, boxHeight: number) {
  const style = getComputedStyle(el);
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return boxHeight * 0.8;
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const m = ctx.measureText("M");
  const ascent = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent;
  const descent = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
  return (boxHeight - (ascent + descent)) / 2 + ascent;
}

// Bottom edge of the navigation bar in the window. On the home page the bar
// is hidden until opened (see App.tsx), so fall back to its usual height.
const NAV_HEIGHT_FALLBACK = 64;
export function navBottom() {
  const nav = document.querySelector(".navbar-empower");
  const bottom = nav ? nav.getBoundingClientRect().bottom : 0;
  return bottom > 0 ? bottom : NAV_HEIGHT_FALLBACK;
}

const place = ({ x, y, s }: Pose) => `translate(${x}px, ${y}px) scale(${s})`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function useFallingM({
  sectionRef,
  slotRef,
  onLanded,
  onDone,
  skip,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  slotRef: RefObject<HTMLElement | null>;
  onLanded: () => void;
  onDone: () => void;
  skip: boolean;
}) {
  // Kept in refs so a re-render with new callbacks doesn't restart the run.
  const callbacks = useRef({ onLanded, onDone });
  callbacks.current = { onLanded, onDone };

  useEffect(() => {
    const section = sectionRef.current;
    const slot = slotRef.current;
    if (!section || !slot) return;
    if (skip) {
      callbacks.current.onLanded();
      callbacks.current.onDone();
      return;
    }

    const source = document.querySelector<HTMLElement>(`[${FALLING_M_SOURCE_ATTR}]`);
    const flyer = document.createElement("span");
    flyer.setAttribute("aria-hidden", "true");
    flyer.className = "falling-m";
    flyer.textContent = slot.textContent;
    flyer.style.visibility = "hidden";
    document.body.append(flyer);

    // Everything below is in page coordinates, measured by measure().
    let sectionTop = 0;
    let startPose: Pose = { x: 0, y: 0, s: 1 };
    let slotPose: Pose = { x: 0, y: 0, s: 1 };
    let startColor = "";
    let endColor = "";
    // The size it is drawn at right now, so a landing that starts early
    // picks up where the fall left off.
    let fallScale = 1;

    const measure = () => {
      const slotStyle = getComputedStyle(slot);
      const target = pageBox(slot);
      const targetSize = parseFloat(slotStyle.fontSize);
      const baseline = baselineOffset(slot, target.h);
      sectionTop = pageBox(section).y;
      slotPose = { x: target.x, y: target.y, s: 1 };
      endColor = slotStyle.color;

      Object.assign(flyer.style, {
        fontFamily: slotStyle.fontFamily,
        fontSize: slotStyle.fontSize,
        fontWeight: slotStyle.fontWeight,
        lineHeight: `${target.h}px`,
      });

      // Start: on top of the source letter (same size, sitting on the same
      // baseline), or a screen above. The two lines have different leading,
      // so the stand-in's box is not the source's box: lining the boxes up
      // (or centring one in the other) drops the letter off its own word's
      // baseline. Its baseline sits `baseline` below its box's top, scaled
      // down with it; the source's sits baselineOffset() below its own.
      const sourceBox = source ? pageBox(source) : null;
      const startScale = source
        ? parseFloat(getComputedStyle(source).fontSize) / targetSize
        : 1;
      startPose =
        source && sourceBox
          ? {
              x: sourceBox.x,
              y:
                sourceBox.y +
                baselineOffset(source, sourceBox.h) -
                startScale * baseline,
              s: startScale,
            }
          : { x: target.x, y: target.y - window.innerHeight, s: startScale };
      startColor = source ? getComputedStyle(source).color : endColor;

    };

    let phase: "falling" | "landing" = "falling";
    let cancelled = false;
    const running: Animation[] = [];
    const run = (el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = el.animate(keyframes, { fill: "forwards", ...options });
      running.push(animation);
      return animation.finished;
    };

    // 0 when the counter screen's top is at the bottom of the window, 1 once
    // it fills the window.
    const progress = () =>
      clamp01(1 - section.getBoundingClientRect().top / window.innerHeight);

    // While falling the M is position: fixed, so it is placed in window
    // coordinates. Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team
    // feedback): it stays in "Metabolic" until that line has scrolled up to
    // the navigation bar, lets go right there and then falls (accelerating)
    // to the slot itself, reaching it as the counter screen settles.
    const renderFall = () => {
      if (phase !== "falling") return;
      const p = progress();
      if (p >= LAND_AT) {
        land();
        return;
      }
      const navY = navBottom();
      const releaseAt = startPose.y - navY; // scroll where the M meets the nav
      const landAt = sectionTop - window.innerHeight * (1 - LAND_AT);
      const q = (window.scrollY - releaseAt) / (landAt - releaseAt);
      if (!(q > 0) || landAt <= releaseAt) {
        flyer.style.visibility = "hidden";
        if (source) source.style.visibility = "";
        return;
      }
      if (source) source.style.visibility = "hidden";
      flyer.style.visibility = "";
      flyer.style.position = "fixed";
      flyer.style.color = startColor;
      const t = q ** 2;
      const from = { x: startPose.x - window.scrollX, y: navY };
      // Straight to the slot now, growing to its size on the way, so it
      // arrives as the M of "Million" rather than on a bar below it.
      const to = { x: slotPose.x - window.scrollX, y: slotPose.y - landAt };
      fallScale = startPose.s + (1 - startPose.s) * t;
      flyer.style.transform = place({
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
        s: fallScale,
      });
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(renderFall);
    };
    const onResize = () => {
      if (phase !== "falling") return;
      measure();
      onScroll();
    };

    // It has arrived: the last of the drop onto the slot, a small squash
    // as it lands, and the counter's teal taken on along the way.
    // Scrolling no longer moves it from here.
    async function land() {
      phase = "landing";
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (source) source.style.visibility = "hidden";

      // From here on, page coordinates (position: absolute), so scrolling
      // mid-landing doesn't knock the M off course.
      const wasFalling = flyer.style.visibility !== "hidden";
      const r = flyer.getBoundingClientRect();
      const here: Pose = wasFalling
        ? { x: r.left + window.scrollX, y: r.top + window.scrollY, s: fallScale }
        : {
            x: slotPose.x,
            y: slotPose.y - window.innerHeight * 0.25,
            s: fallScale,
          };
      Object.assign(flyer.style, {
        position: "absolute",
        visibility: "",
        color: startColor,
        transform: place(here),
      });

      try {
        run(flyer, [{ color: startColor }, { color: endColor }], {
          duration: LAND_MS + SQUASH_MS,
        });
        await run(
          flyer,
          [{ transform: place(here) }, { transform: place(slotPose) }],
          { duration: LAND_MS, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
        );
        // A small squash on landing, pivoting on the M's feet.
        const squash =
          "translate(" +
          (slotPose.x - slotPose.s * flyer.offsetWidth * 0.06) +
          "px, " +
          (slotPose.y + slotPose.s * flyer.offsetHeight * 0.12) +
          "px) scale(" +
          slotPose.s * 1.12 +
          ", " +
          slotPose.s * 0.85 +
          ")";
        await run(
          flyer,
          [
            { transform: place(slotPose) },
            { transform: squash },
            { transform: place(slotPose) },
          ],
          { duration: SQUASH_MS * 2, easing: "ease-out" },
        );
        if (cancelled) return;

        // In place: hand over to the real letter ("illion" appears), let it
        // sit a moment, then reveal the figure.
        callbacks.current.onLanded();
        flyer.remove();
        if (source) source.style.visibility = "";
        await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
        if (cancelled) return;
        callbacks.current.onDone();
      } catch {
        // An animation was cancelled by the cleanup below.
      }
    }

    let started = true;
    document.fonts.ready.then(() => {
      if (!started) return;
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      renderFall();
    });

    return () => {
      started = false;
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      running.forEach((animation) => animation.cancel());
      flyer.remove();
      if (source) source.style.visibility = "";
    };
  }, [skip, sectionRef, slotRef]);
}
