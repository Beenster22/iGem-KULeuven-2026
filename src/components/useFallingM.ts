// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: the home page's "M" hand-off (team request) — the teal M of
// "Metabolic" in the PMOS acrostic (PmosDefinition) drops down into the
// counter section, lands on a little staircase, climbs it and settles as the
// M of "170 Million"; the stairs then fade away. It only ever runs once, so
// it is done imperatively: throwaway elements appended to <body>, positioned
// in page coordinates (so scrolling mid-flight doesn't knock the M off
// course) and moved with the Web Animations API.
import { useEffect, useRef, type RefObject } from "react";

// Put this attribute on the letter the M flies from (see PmosDefinition).
export const FALLING_M_SOURCE_ATTR = "data-falling-m-source";

const STEP_COUNT = 4;
const FALL_MS = 900;
const SQUASH_MS = 160;
const HOP_MS = 380;
const STAIRS_FADE_MS = 450;
const STAIRS_COLOR = "var(--color-header-bg)";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
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

const place = (x: number, y: number, s: number) => `translate(${x}px, ${y}px) scale(${s})`;

export function useFallingM(
  start: boolean,
  slotRef: RefObject<HTMLElement | null>,
  onLanded: () => void,
  skip: boolean,
) {
  // Kept in a ref so a re-render with a new callback doesn't restart the run.
  const onLandedRef = useRef(onLanded);
  onLandedRef.current = onLanded;

  useEffect(() => {
    if (!start) return;
    const slot = slotRef.current;
    if (skip || !slot) {
      onLandedRef.current();
      return;
    }

    const source = document.querySelector<HTMLElement>(`[${FALLING_M_SOURCE_ATTR}]`);
    const slotStyle = getComputedStyle(slot);
    const target = pageBox(slot);
    const targetSize = parseFloat(slotStyle.fontSize);
    const baseline = baselineOffset(slot, target.h);

    // Start: on top of the source letter (same size, vertically centred on
    // it — the two lines have different leading), or a screen above the
    // counter if the acrostic isn't on the page.
    const sourceBox = source ? pageBox(source) : null;
    const startScale = source ? parseFloat(getComputedStyle(source).fontSize) / targetSize : 1;
    const startX = sourceBox ? sourceBox.x : target.x;
    const startY = sourceBox
      ? sourceBox.y + (sourceBox.h - startScale * target.h) / 2
      : target.y - window.innerHeight;
    const startColor = source ? getComputedStyle(source).color : slotStyle.color;

    // Staircase: entirely below the figure's underline (so it never covers
    // the digits), its top tread right under the slot, the rest stepping
    // down to the left (narrowed if the screen has no room for them). The
    // last hop takes the M from that top tread up into the slot.
    const line = slot.parentElement ?? slot;
    const lineBox = pageBox(line);
    const surface0 = lineBox.y + lineBox.h + target.h * 0.08;
    const pad = target.w * 0.08;
    const left0 = target.x - pad;
    const right = target.x + target.w + pad;
    const stepW = Math.max(
      12,
      Math.min(target.w * 0.95, (left0 - window.scrollX - 8) / (STEP_COUNT - 1)),
    );
    const stepH = target.h * 0.26;
    const treadLeft = (k: number) => left0 - k * stepW;
    const surface = (k: number) => surface0 + k * stepH;
    const bottom = surface(STEP_COUNT - 1) + stepH;

    // The M grows from the source size on the bottom step to full size on
    // the top one; on step k it stands centred on its tread (the top tread:
    // straight under the slot). Step -1 is the slot itself.
    const scaleAt = (k: number) =>
      1 + (startScale - 1) * (k / (STEP_COUNT - 1));
    const standAt = (k: number) => {
      if (k < 0) return { x: target.x, y: target.y, s: 1 };
      const s = scaleAt(k);
      const x =
        k === 0
          ? target.x + (target.w * (1 - s)) / 2
          : treadLeft(k) + (stepW - s * target.w) / 2;
      return { x, y: surface(k) - s * baseline, s };
    };

    const points: string[] = [`${right},${surface0}`, `${right},${bottom}`];
    points.push(`${treadLeft(STEP_COUNT - 1)},${bottom}`);
    for (let k = STEP_COUNT - 1; k >= 1; k--) {
      points.push(`${treadLeft(k)},${surface(k)}`, `${treadLeft(k - 1)},${surface(k)}`);
    }
    points.push(`${left0},${surface0}`);
    const minX = treadLeft(STEP_COUNT - 1);
    const svgNs = "http://www.w3.org/2000/svg";
    const stairs = document.createElementNS(svgNs, "svg");
    stairs.setAttribute("aria-hidden", "true");
    stairs.setAttribute("class", "falling-m-stairs");
    stairs.setAttribute("viewBox", `${minX} ${surface0} ${right - minX} ${bottom - surface0}`);
    Object.assign(stairs.style, {
      left: `${minX}px`,
      top: `${surface0}px`,
      width: `${right - minX}px`,
      height: `${bottom - surface0}px`,
    });
    const polygon = document.createElementNS(svgNs, "polygon");
    polygon.setAttribute("points", points.join(" "));
    polygon.setAttribute("fill", STAIRS_COLOR);
    stairs.appendChild(polygon);

    const flyer = document.createElement("span");
    flyer.setAttribute("aria-hidden", "true");
    flyer.className = "falling-m";
    flyer.textContent = slot.textContent;
    Object.assign(flyer.style, {
      fontFamily: slotStyle.fontFamily,
      fontSize: slotStyle.fontSize,
      fontWeight: slotStyle.fontWeight,
      lineHeight: `${target.h}px`,
      color: startColor,
      transform: place(startX, startY, startScale),
    });

    document.body.append(stairs, flyer);
    if (source) source.style.visibility = "hidden";

    let cancelled = false;
    const running: Animation[] = [];
    const run = (el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = el.animate(keyframes, { fill: "forwards", ...options });
      running.push(animation);
      return animation.finished;
    };

    (async () => {
      try {
        await run(stairs, [{ opacity: 0 }, { opacity: 1 }], { duration: STAIRS_FADE_MS });

        // Drop onto the bottom step (accelerating, like a fall), then a
        // small squash on landing, pivoting on the M's feet.
        const low = standAt(STEP_COUNT - 1);
        await run(
          flyer,
          [{ transform: place(startX, startY, startScale) }, { transform: place(low.x, low.y, low.s) }],
          { duration: FALL_MS, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
        );
        const squashY = low.y + low.s * baseline * 0.15;
        await run(
          flyer,
          [
            { transform: place(low.x, low.y, low.s) },
            { transform: `translate(${low.x - low.s * target.w * 0.06}px, ${squashY}px) scale(${low.s * 1.12}, ${low.s * 0.85})` },
            { transform: place(low.x, low.y, low.s) },
          ],
          { duration: SQUASH_MS * 2, easing: "ease-out" },
        );

        // Hop up one step at a time, shifting to the counter's teal on the way.
        run(flyer, [{ color: startColor }, { color: slotStyle.color }], {
          duration: HOP_MS * STEP_COUNT,
        });
        for (let k = STEP_COUNT - 1; k >= 0; k--) {
          const from = standAt(k);
          const to = standAt(k - 1);
          const peakY = Math.min(from.y, to.y) - stepH * 1.1;
          await run(
            flyer,
            [
              { transform: place(from.x, from.y, from.s), easing: "ease-out" },
              { transform: place((from.x + to.x) / 2, peakY, (from.s + to.s) / 2), easing: "ease-in", offset: 0.5 },
              { transform: place(to.x, to.y, to.s) },
            ],
            { duration: HOP_MS },
          );
        }
        if (cancelled) return;

        // In place: hand over to the real letter, then clear the stairs.
        onLandedRef.current();
        flyer.remove();
        if (source) source.style.visibility = "";
        await run(stairs, [{ opacity: 1 }, { opacity: 0 }], { duration: STAIRS_FADE_MS });
        stairs.remove();
      } catch {
        // An animation was cancelled by the cleanup below.
      }
    })();

    return () => {
      cancelled = true;
      running.forEach((animation) => animation.cancel());
      flyer.remove();
      stairs.remove();
      if (source) source.style.visibility = "";
    };
  }, [start, skip, slotRef]);
}
