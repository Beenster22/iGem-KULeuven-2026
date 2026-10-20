// Generated with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request)
// Purpose: the engineered P. vulgatus on the balance screen turns into the
// caped one on the screen below it. As the reader scrolls on, a copy of the
// engineered cell flies from where it lies to where the caped one stands,
// turning upright on the way, and a copy of the caped one turns up out of
// it and fades in over it, so the one becomes the other in flight.
//
// Both ends are read live every frame, so the copies sit exactly on the
// cell they leave and exactly on the one they become. The caped one waits
// behind --receptor-in on its screen (the name the TGR5 receptor's
// hand-over uses, which this one first borrowed) until it arrives, so it is
// never drawn twice.
//
// Modelled on useReceptorZoom.ts, which hands the TGR5 receptor down the
// page the same way.
import { useEffect, type RefObject } from "react";
import { navBottom } from "./useFallingM";

// How much of a window's scrolling the flight takes, ending as the screen
// settles under the navigation bar.
const FLIGHT = 0.85;
// The cross-fade from the one to the other, as shares of the way across.
const FADE = [0.3, 0.75];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const turnOf = (m: DOMMatrix) => (Math.atan2(m.b, m.a) * 180) / Math.PI;

const NS = "http://www.w3.org/2000/svg";

export function useCellToHero({
  stageRef,
  from,
  to,
  lengthRatio,
  skip,
}: {
  /** The screen it arrives on, which holds the caped one. */
  stageRef: RefObject<HTMLElement | null>;
  /** The engineered cell, lying on its side, anywhere on the page. */
  from: string;
  /** The caped one, standing, looked for inside that screen. */
  to: string;
  /** The caped one's height over the engineered cell's length, so the
   *  two bodies are the same size wherever they are in the flight. */
  lengthRatio: number;
  skip: boolean;
}) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || skip) return;

    const overlay = document.createElementNS(NS, "svg");
    overlay.setAttribute("class", "receptor-zoom-flight");
    overlay.setAttribute("aria-hidden", "true");
    const cell = document.createElementNS(NS, "g");
    const hero = document.createElementNS(NS, "g");
    overlay.append(cell, hero);
    document.body.append(overlay);

    let copied = false;
    let frame: number | null = null;

    const rest = () => {
      overlay.style.visibility = "hidden";
    };

    const update = () => {
      frame = null;
      const sources = document.querySelectorAll<SVGGraphicsElement>(from);
      const source = sources[sources.length - 1];
      const target = stage.querySelector<SVGGraphicsElement>(to);
      const pin = stage.closest<HTMLElement>(".home-snap-pin") ?? stage;
      if (!source || !target) return rest();

      const endAt = pin.getBoundingClientRect().top + window.scrollY - navBottom();
      const startAt = endAt - window.innerHeight * FLIGHT;

      if (window.scrollY <= startAt) {
        stage.style.setProperty("--receptor-in", "0");
        source.style.removeProperty("visibility");
        return rest();
      }
      if (window.scrollY >= endAt) {
        stage.style.setProperty("--receptor-in", "1");
        source.style.removeProperty("visibility");
        return rest();
      }

      const leaves = source.getScreenCTM();
      const becomes = target.getScreenCTM();
      if (!leaves || !becomes) return rest();

      if (!copied) {
        cell.innerHTML = source.innerHTML;
        cell.setAttribute("class", source.getAttribute("class") ?? "");
        hero.innerHTML = target.innerHTML;
        hero.setAttribute("class", target.getAttribute("class") ?? "");
        copied = true;
      }

      const e = easeInOut(clamp01((window.scrollY - startAt) / (endAt - startAt)));
      const fromScale = Math.hypot(leaves.a, leaves.b);
      const toScale = Math.hypot(becomes.a, becomes.b);
      const fromTurn = turnOf(leaves);
      const toTurn = turnOf(becomes);
      const x = lerp(leaves.e, becomes.e, e);
      const y = lerp(leaves.f, becomes.f, e);
      // The cell turns a quarter turn to stand up, shrinking to the caped
      // one's height; the caped one starts lying the way the cell lies, at
      // the cell's length, and stands up with it.
      const cellScale = lerp(fromScale, toScale * lengthRatio, e);
      const heroScale = lerp(fromScale / lengthRatio, toScale, e);
      const cellTurn = lerp(fromTurn, toTurn - 90, e);
      const heroTurn = lerp(fromTurn + 90, toTurn, e);
      const fade = clamp01((e - FADE[0]) / (FADE[1] - FADE[0]));

      overlay.style.visibility = "visible";
      stage.style.setProperty("--receptor-in", "0");
      source.style.visibility = "hidden";
      const place = (turn: number, scale: number) =>
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${turn.toFixed(1)}) scale(${scale.toFixed(4)})`;
      cell.setAttribute("transform", place(cellTurn, cellScale));
      cell.setAttribute("opacity", (1 - fade).toFixed(3));
      hero.setAttribute("transform", place(heroTurn, heroScale));
      hero.setAttribute("opacity", fade.toFixed(3));
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
      stage.style.removeProperty("--receptor-in");
      document
        .querySelectorAll<SVGGraphicsElement>(from)
        .forEach((el) => el.style.removeProperty("visibility"));
      overlay.remove();
    };
  }, [stageRef, from, to, lengthRatio, skip]);
}
