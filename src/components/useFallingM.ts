// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the home page's "M" hand-off (team request). The counter screen
// below the PMOS definition starts blank; as the visitor scrolls down to
// it, the teal M of "Metabolic" (PmosDefinition) falls with the scroll into
// that empty screen while a bar-chart staircase rises out of it. Once the
// screen is (nearly) in place the M climbs the stairs on its own and settles
// as the M of "Million" (onLanded); the stairs then sink away (onDone) and
// PmosOverview reveals the figure and its underline.
// The fall is tied to the scroll position, so scrolling back up puts the M
// back in "Metabolic"; the climb, once started, plays through. It is all
// done imperatively — throwaway elements appended to <body>, moved with the
// Web Animations API — as it only ever plays once.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team feedback): the
// fall is now scroll-linked into a blank screen and the stairs are bars.
// Edited with Claude Opus 5 (Anthropic), 2026-10-19: the stand-in now takes
// over on the source letter's baseline instead of centred on its line box,
// which dropped it 8px the moment it let go of "Metabolic".
import { useEffect, useRef, type RefObject } from "react";

// Put this attribute on the letter the M falls from (see PmosDefinition).
export const FALLING_M_SOURCE_ATTR = "data-falling-m-source";

const STEP_COUNT = 4;
// Scroll progress (0 = the counter screen's top at the bottom of the
// window, 1 = it fills the window) at which the M has landed and climbs.
const CLIMB_AT = 0.9;
const LAND_MS = 200;
const SQUASH_MS = 160;
const HOP_MS = 380;
const PAUSE_MS = 350;
const SINK_MS = 500;
const BAR_GAP = 0.08; // of a step's width

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
    const svgNs = "http://www.w3.org/2000/svg";
    const stairs = document.createElementNS(svgNs, "svg");
    stairs.setAttribute("aria-hidden", "true");
    stairs.setAttribute("class", "falling-m-stairs");
    const bars = Array.from({ length: STEP_COUNT }, () => {
      const bar = document.createElementNS(svgNs, "rect");
      stairs.appendChild(bar);
      return bar;
    });
    const flyer = document.createElement("span");
    flyer.setAttribute("aria-hidden", "true");
    flyer.className = "falling-m";
    flyer.textContent = slot.textContent;
    flyer.style.visibility = "hidden";
    document.body.append(stairs, flyer);

    // Everything below is in page coordinates, measured by measure().
    let sectionTop = 0;
    let startPose: Pose = { x: 0, y: 0, s: 1 };
    let poses: Pose[] = []; // poses[k]: standing on step k; poses[-1] ≈ slot
    let slotPose: Pose = { x: 0, y: 0, s: 1 };
    let startColor = "";
    let endColor = "";
    let stepH = 0;

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

      // The stairs: bars rising to the right like a little bar chart, all
      // below the figure's line, the tallest right under the slot (narrowed
      // if the screen has no room for them).
      const line = slot.closest(".pmos-counter-number") ?? slot;
      const lineBox = pageBox(line);
      stepH = target.h * 0.26;
      const top0 = lineBox.y + lineBox.h + target.h * 0.08;
      const bottom = top0 + STEP_COUNT * stepH;
      const right = target.x + target.w * 1.08;
      const left0 = target.x - target.w * 0.08;
      const stepW = Math.max(
        12,
        Math.min(target.w * 0.95, (left0 - window.scrollX - 8) / (STEP_COUNT - 1)),
      );
      const barLeft = (k: number) => left0 - k * stepW;
      const barRight = (k: number) => (k === 0 ? right : barLeft(k - 1));
      const barTop = (k: number) => top0 + k * stepH;
      const minX = barLeft(STEP_COUNT - 1);

      Object.assign(stairs.style, {
        left: `${minX}px`,
        top: `${top0}px`,
        width: `${right - minX}px`,
        height: `${bottom - top0}px`,
      });
      stairs.setAttribute("viewBox", `${minX} ${top0} ${right - minX} ${bottom - top0}`);
      bars.forEach((bar, k) => {
        const gap = k === 0 ? 0 : stepW * BAR_GAP;
        bar.setAttribute("x", String(barLeft(k) + gap / 2));
        bar.setAttribute("y", String(barTop(k)));
        bar.setAttribute("width", String(barRight(k) - barLeft(k) - gap));
        bar.setAttribute("height", String(bottom - barTop(k)));
        bar.setAttribute("rx", String(Math.min(6, stepW * 0.06)));
      });

      // The M grows from the source size on the lowest bar to full size on
      // the tallest; on each bar it stands centred.
      poses = bars.map((_, k) => {
        const s = 1 + (startScale - 1) * (k / (STEP_COUNT - 1));
        const centre = (barLeft(k) + barRight(k)) / 2;
        return { x: centre - (s * target.w) / 2, y: barTop(k) - s * baseline, s };
      });
    };

    let phase: "falling" | "climbing" = "falling";
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

    const setBars = (p: number) => {
      bars.forEach((bar, k) => {
        // Lowest bar (rightmost index) first, tallest last.
        const order = STEP_COUNT - 1 - k;
        const g = clamp01((p - 0.3 - order * 0.07) / 0.35);
        bar.style.transform = `scaleY(${g})`;
      });
    };

    // While falling the M is position: fixed, so it is placed in window
    // coordinates. Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team
    // feedback): it stays in "Metabolic" until that line has scrolled up to
    // the navigation bar, lets go right there and then falls (accelerating)
    // to the lowest bar, reaching it as the counter screen settles.
    const renderFall = () => {
      if (phase !== "falling") return;
      const p = progress();
      if (p >= CLIMB_AT) {
        climb();
        return;
      }
      setBars(p);
      const navY = navBottom();
      const releaseAt = startPose.y - navY; // scroll where the M meets the nav
      const landAt = sectionTop - window.innerHeight * (1 - CLIMB_AT);
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
      const low = poses[STEP_COUNT - 1];
      const to = { x: low.x - window.scrollX, y: low.y - landAt };
      flyer.style.transform = place({
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
        s: startPose.s,
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

    async function climb() {
      phase = "climbing";
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (source) source.style.visibility = "hidden";
      bars.forEach((bar) => (bar.style.transform = "scaleY(1)"));

      // From here on, page coordinates (position: absolute), so scrolling
      // mid-climb doesn't knock the M off course.
      const low = poses[STEP_COUNT - 1];
      const wasFalling = flyer.style.visibility !== "hidden";
      const r = flyer.getBoundingClientRect();
      const here: Pose = wasFalling
        ? { x: r.left + window.scrollX, y: r.top + window.scrollY, s: low.s }
        : { x: low.x, y: low.y - stepH * 3, s: low.s };
      Object.assign(flyer.style, {
        position: "absolute",
        visibility: "",
        color: startColor,
        transform: place(here),
      });

      try {
        await run(flyer, [{ transform: place(here) }, { transform: place(low) }], {
          duration: LAND_MS,
          easing: "cubic-bezier(0.55, 0, 1, 0.45)",
        });
        // A small squash on landing, pivoting on the M's feet.
        const squash = `translate(${low.x - low.s * flyer.offsetWidth * 0.06}px, ${
          low.y + low.s * flyer.offsetHeight * 0.12
        }px) scale(${low.s * 1.12}, ${low.s * 0.85})`;
        await run(
          flyer,
          [{ transform: place(low) }, { transform: squash }, { transform: place(low) }],
          { duration: SQUASH_MS * 2, easing: "ease-out" },
        );

        // Up the stairs one bar at a time, then up into the slot, shifting
        // to the counter's teal on the way.
        run(flyer, [{ color: startColor }, { color: endColor }], {
          duration: HOP_MS * STEP_COUNT,
        });
        const path = [...poses].reverse().concat(slotPose);
        for (let i = 0; i < path.length - 1; i++) {
          const from = path[i];
          const to = path[i + 1];
          const peak: Pose = {
            x: (from.x + to.x) / 2,
            y: Math.min(from.y, to.y) - stepH * 1.1,
            s: (from.s + to.s) / 2,
          };
          await run(
            flyer,
            [
              { transform: place(from), easing: "ease-out" },
              { transform: place(peak), easing: "ease-in", offset: 0.5 },
              { transform: place(to) },
            ],
            { duration: HOP_MS },
          );
        }
        if (cancelled) return;

        // In place: hand over to the real letter ("illion" appears), let it
        // sit a moment, then sink the bars away and reveal the figure.
        callbacks.current.onLanded();
        flyer.remove();
        if (source) source.style.visibility = "";
        await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
        if (cancelled) return;
        await Promise.all(
          bars.map((bar, k) =>
            run(bar, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], {
              duration: SINK_MS,
              delay: k * 70,
              easing: "cubic-bezier(0.5, 0, 0.75, 0)",
            }),
          ),
        );
        stairs.remove();
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
      stairs.remove();
      if (source) source.style.visibility = "";
    };
  }, [skip, sectionRef, slotRef]);
}
