// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21
// Purpose: the auto-moving carousels (the Human Practices interview strips
// and the footer's sponsor band) as real scrollers instead of a CSS
// animation, so a reader can move them by hand (team request). The strip
// drifts on its own; hovering it stops the drift and lets the reader scroll
// left and right with the mouse wheel, a trackpad or by dragging (a swipe on
// touch screens), and leaving it starts the drift again from wherever they
// left it.
//
// The container must scroll horizontally (overflow-x: auto, scrollbar hidden)
// and hold the tiles `copies` times over (at least 3) in one row. The hook
// keeps the scroll position inside one copy's width, jumping by exactly one
// copy whenever it runs off either end, so the loop never shows a seam.
import { RefObject, useEffect, useRef } from "react";

interface ScrollMarqueeOptions {
  /** Seconds the drift takes to pass one full copy of the tiles. */
  secondsPerLoop: number;
  /** How many times the tiles are repeated inside the track. */
  copies: number;
  /** Extra reason to hold still, e.g. a popup is open over the strip. */
  paused?: boolean;
}

// After a swipe on a touch screen, wait this long before drifting again.
const TOUCH_RESUME_MS = 2500;
// A mouse press that moves further than this is a drag, not a click.
const DRAG_THRESHOLD_PX = 5;

export function useScrollMarquee(
  scrollerRef: RefObject<HTMLElement | null>,
  { secondsPerLoop, copies, paused = false }: ScrollMarqueeOptions,
) {
  // Read through a ref so pausing does not restart the strip from the start.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovered = false;
    let focused = false;
    let touchHoldUntil = 0;
    let frame = 0;
    let last = 0;
    // The drift adds fractions of a pixel per frame, which scrollLeft would
    // round away, so the exact position is kept here.
    let position = 0;

    // Width of one copy: from the first tile to the same tile in the next copy.
    const period = () => {
      const tiles = track.children;
      const perCopy = tiles.length / copies;
      if (!Number.isInteger(perCopy) || perCopy === 0) return 0;
      return (tiles[perCopy] as HTMLElement).offsetLeft - (tiles[0] as HTMLElement).offsetLeft;
    };

    // The window the position is kept in: [start, start + period). It starts
    // part-way in, so there is room to scroll left before the jump, and ends
    // before the scroller's far edge, so there is room to scroll right.
    const range = () => {
      const p = period();
      const max = scroller.scrollWidth - scroller.clientWidth;
      const start = Math.max(0, Math.min(p / 2, max - p));
      return { p, start };
    };

    const wrap = (value: number) => {
      const { p, start } = range();
      if (p <= 0) return value;
      while (value < start) value += p;
      while (value >= start + p) value -= p;
      return value;
    };

    const setPosition = (value: number) => {
      position = wrap(value);
      scroller.scrollLeft = position;
    };

    const holding = () => pausedRef.current || reducedMotion || hovered || focused || performance.now() < touchHoldUntil;

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      const p = period();
      if (!holding() && p > 0 && !document.hidden) {
        setPosition(position + (p / secondsPerLoop) * (dt / 1000));
      }
      frame = requestAnimationFrame(tick);
    };

    // Native scrolling (touch swipes, keyboard) moves scrollLeft directly;
    // follow it, and wrap it once it runs past the window.
    const onScroll = () => {
      const current = scroller.scrollLeft;
      if (Math.abs(current - position) < 1) return;
      const wrapped = wrap(current);
      position = wrapped;
      if (wrapped !== current) scroller.scrollLeft = wrapped;
    };

    // While hovered, the wheel scrolls the strip sideways: horizontal
    // trackpad swipes as they are, and vertical mouse-wheel turns turned
    // sideways, so a plain mouse can move it too.
    const onWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientWidth : 1;
      setPosition(position + delta * scale);
    };

    // Mouse drag. Touch keeps the browser's own swipe scrolling.
    let dragStartX = 0;
    let dragStartPosition = 0;
    let dragging = false;
    let dragged = false;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      dragged = false;
      dragStartX = event.clientX;
      dragStartPosition = position;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - dragStartX;
      if (!dragged && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      if (!dragged) {
        dragged = true;
        scroller.setPointerCapture(event.pointerId);
        scroller.classList.add("is-dragging");
      }
      setPosition(dragStartPosition - dx);
    };
    const onPointerUp = () => {
      dragging = false;
      scroller.classList.remove("is-dragging");
    };
    // A drag ends with a click on whatever tile is under the mouse; swallow
    // it so dragging never opens a popup or follows a link.
    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = true;
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = false;
      last = 0;
    };
    const onTouch = () => {
      touchHoldUntil = performance.now() + TOUCH_RESUME_MS;
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!scroller.contains(event.relatedTarget as Node | null)) focused = false;
    };

    setPosition(range().start);
    frame = requestAnimationFrame(tick);

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("pointerdown", onPointerDown);
    scroller.addEventListener("pointermove", onPointerMove);
    scroller.addEventListener("pointerup", onPointerUp);
    scroller.addEventListener("pointercancel", onPointerUp);
    scroller.addEventListener("click", onClickCapture, true);
    scroller.addEventListener("pointerenter", onPointerEnter);
    scroller.addEventListener("pointerleave", onPointerLeave);
    scroller.addEventListener("touchstart", onTouch, { passive: true });
    scroller.addEventListener("touchmove", onTouch, { passive: true });
    scroller.addEventListener("touchend", onTouch, { passive: true });
    scroller.addEventListener("focusin", onFocusIn);
    scroller.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("pointerdown", onPointerDown);
      scroller.removeEventListener("pointermove", onPointerMove);
      scroller.removeEventListener("pointerup", onPointerUp);
      scroller.removeEventListener("pointercancel", onPointerUp);
      scroller.removeEventListener("click", onClickCapture, true);
      scroller.removeEventListener("pointerenter", onPointerEnter);
      scroller.removeEventListener("pointerleave", onPointerLeave);
      scroller.removeEventListener("touchstart", onTouch);
      scroller.removeEventListener("touchmove", onTouch);
      scroller.removeEventListener("touchend", onTouch);
      scroller.removeEventListener("focusin", onFocusIn);
      scroller.removeEventListener("focusout", onFocusOut);
    };
  }, [scrollerRef, secondsPerLoop, copies]);
}
