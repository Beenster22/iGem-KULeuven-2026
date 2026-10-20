// Generated with Claude Opus 5 (Anthropic), 2026-10-20 (team request)
// Purpose: the TGR5 receptor on the binding screen becomes the one in the
// close-up below it. A copy of the receptor flies from where it stands on
// the gut wall in that diagram to where it stands in the close-up, growing
// as it goes, so the reader sees the same receptor zoomed into rather than
// two drawings of one.
//
// Both ends are read live every frame from the real drawings' own
// placements, so the copy sits exactly on the one it leaves and exactly on
// the one it becomes, whatever either diagram is doing. The close-up's own
// receptor waits behind --receptor-in until it arrives, so it is never
// drawn twice.
//
// Modelled on useBileAcidFlight.ts, which hands the bile acids over the
// same way.
import { useEffect, type RefObject } from "react";
import { navBottom } from "./useFallingM";

// How much of a window's scrolling the flight takes, ending as the close-up
// settles under the navigation bar.
const FLIGHT = 0.8;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const NS = "http://www.w3.org/2000/svg";

export function useReceptorZoom({
  stageRef,
  from,
  to,
  skip,
}: {
  /** The screen it arrives on, which holds the receptor it becomes. */
  stageRef: RefObject<HTMLElement | null>;
  /** The receptor it leaves, anywhere on the page. */
  from: string;
  /** The receptor it becomes, looked for inside that screen. */
  to: string;
  skip: boolean;
}) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || skip) return;

    const overlay = document.createElementNS(NS, "svg");
    overlay.setAttribute("class", "receptor-zoom-flight");
    overlay.setAttribute("aria-hidden", "true");
    const group = document.createElementNS(NS, "g");
    overlay.append(group);
    document.body.append(overlay);

    let copied = false;
    let frame: number | null = null;

    const rest = () => {
      overlay.style.visibility = "hidden";
    };

    const update = () => {
      frame = null;
      const sources = document.querySelectorAll<SVGGraphicsElement>(from);
      // A drawing may hold more than one — the binding diagram has one on
      // the immune cell and one on the gut wall — and it is the last that
      // the screen below is of.
      const source = sources[sources.length - 1];
      const target = stage.querySelector<SVGGraphicsElement>(to);
      const pin = stage.closest<HTMLElement>(".home-snap-pin") ?? stage;
      if (!source || !target) return rest();

      // Ending as the close-up comes to rest under the navigation bar.
      const endAt = pin.getBoundingClientRect().top + window.scrollY - navBottom();
      const startAt = endAt - window.innerHeight * FLIGHT;
      if (endAt <= startAt) return rest();

      if (window.scrollY <= startAt) {
        stage.style.setProperty("--receptor-in", "0");
        source.style.removeProperty("visibility");
        return rest();
      }
      if (window.scrollY >= endAt) {
        // Arrived: the close-up's own receptor takes over, on this spot.
        stage.style.setProperty("--receptor-in", "1");
        source.style.removeProperty("visibility");
        return rest();
      }

      const leaves = source.getScreenCTM();
      const becomes = target.getScreenCTM();
      if (!leaves || !becomes) return rest();

      // The helices themselves, copied once from the real drawing so the
      // thing in flight is the thing it came from.
      if (!copied) {
        group.innerHTML = source.innerHTML;
        group.setAttribute("class", source.getAttribute("class") ?? "");
        copied = true;
      }

      const e = easeInOut(clamp01((window.scrollY - startAt) / (endAt - startAt)));
      // Each end's own placement: where it is drawn and how large.
      const fromScale = Math.hypot(leaves.a, leaves.b);
      const toScale = Math.hypot(becomes.a, becomes.b);
      const x = lerp(leaves.e, becomes.e, e);
      const y = lerp(leaves.f, becomes.f, e);
      const scale = lerp(fromScale, toScale, e);
      // The drawing's own turn, which the copy has to carry too: its
      // helices are drawn lying down and stood up by the group they are in.
      const turn = (Math.atan2(becomes.b, becomes.a) * 180) / Math.PI;

      overlay.style.visibility = "visible";
      stage.style.setProperty("--receptor-in", "0");
      source.style.visibility = "hidden";
      group.setAttribute(
        "transform",
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${turn.toFixed(
          1,
        )}) scale(${scale.toFixed(4)})`,
      );
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
  }, [stageRef, from, to, skip]);
}
