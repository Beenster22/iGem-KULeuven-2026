// Generated with Claude Opus 5 (Anthropic), 2026-10-19 (team request)
// Purpose: the bile acids from the BSH screen travel down to the TGR5 one.
// As the reader scrolls on from "Bile salt hydrolases (BSH) are enzymes…",
// the conjugated acids waiting on its left (hexagon with its glycine or
// taurine tag still attached) and the deconjugated ones leaving on its
// right (hexagon alone — the split-off tags stay behind, team request) lift
// off, cross the "But why is this reaction important?" screen, and arrive
// on the TGR5 screen.
//
// Edited with Claude Opus 5 (Anthropic), 2026-10-19 (team request: they
// must not fade away but become the acids already there): there is now one
// traveller per acid on the TGR5 screen, matched in kind, and each one
// flies to where its own counterpart is at that moment — read live, since
// those are animated — so when it lands the two are on the same spot and
// the hand-over is a straight swap. The TGR5 acids wait their turn until
// then (--acids-in). The lower stream's purple shifts to that screen's
// orange and yellow along the way, rather than changing at the last step.
//
// Edited with Claude Opus 5 (Anthropic), 2026-10-19 (team request: the
// positions were not right): the BSH drawing rides a sticky stage, so while
// that stage is pinned the bacterium is held still part way down the window
// and the navigation bar never comes down to it. The mark is therefore
// measured from where the stage comes to rest at the foot of its wrapper,
// which is the one moment the bar does reach the bacterium's underside.
// The drift across the next screen now has a stretch of scroll where the
// acids simply hold their places, and the size they have reached, so they
// read as floating on that page, before the fall sets off.
//
// Modelled on useLensToGutWindow.ts, which hands the magnifying glass over
// to the circle of bacteria the same way.
import { useEffect, type RefObject } from "react";
import { navBottom } from "./useFallingM";

/** The screen they arrive on, and the acids already drawn there. */
const TGR5_STAGE = ".tgr5";
const TGR5_SVG = ".tgr5-svg";
const TGR5_ACID = ".tgr5-pool-acid";

// The two diagrams' own coordinate spaces, for turning the sizes below into
// a share of each drawing (see VB_W/HEX_R in the two components).
const BSH_VB_W = 1000;
const BSH_HEX_R = 11;
// The binding diagram's own space (OV_W in Tgr5Story.tsx), and the radius
// its acids end up drawn at there: a 12-unit hexagon scaled by ACID_SCALE.
const TGR5_VB_W = 1000;
const TGR5_HEX_R = 12 * 1.6;

// The shapes are drawn at this radius and then scaled, so one set of points
// serves both ends of the journey.
const BASE_HEX_R = 12;
const BASE_TAG_R = 6;
const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return `${(BASE_HEX_R * Math.cos(angle)).toFixed(2)},${(
    BASE_HEX_R * Math.sin(angle)
  ).toFixed(2)}`;
}).join(" ");

// Where one sets off, as a share of the BSH drawing: the conjugated ones
// from the left, where they queue for the enzyme, and the deconjugated ones
// from the right, where they leave it, each stream on its own side of the
// bacterium. `n` of `total` spreads the ones alike along that edge.
function anchorFor(conjugated: boolean, stream: number, n: number, total: number) {
  const along = total > 1 ? n / (total - 1) : 0.5;
  const x = conjugated ? 0.13 + along * 0.1 : 0.73 + along * 0.19;
  const y = (stream === 0 ? 0.3 : 0.62) + (along - 0.5) * 0.16;
  return [x, y] as [number, number];
}

// The bottom of the bacterium in the BSH drawing: the acids only start to
// fall once the navigation bar has come down to it (team request). The
// team pointed at the fimbriae hanging below the cell, not the capsule's
// own edge, so this is read off the drawn hairs rather than worked out
// from BAC_Y + BAC_H, which would sit about a fifth of the cell's height
// too high. The figure below is that fallback, for when they are not
// drawn (BAC_Y + BAC_H over VB_H in BshStreamAnimation.tsx).
const BACTERIUM = ".bsh-pili";
const BACTERIUM_BOTTOM = (72 + 116) / 300;

// The screen they drift across on the way, and where they drift to on it,
// as shares of the window. Two loose bands, across the full width and clear
// of the sentence in the middle, so they read as floating on the page
// rather than ringing the words (team request).
const STATEMENT = ".story-step--single";
// How much of the way to their final size they reach before the hold, and
// how far above the TGR5 screen the fall sets off, as a share of the window.
const FLOAT_SCALE = 0.45;
const FALL_LEAD = 0.5;
function floatSpot(n: number, total: number) {
  const half = Math.ceil(total / 2);
  const lower = n >= half;
  const col = lower ? n - half : n;
  const across = half > 1 ? col / (half - 1) : 0.5;
  // A settled, repeatable scatter rather than a straight row.
  const jitter = ((n * 37) % 11) / 11 - 0.5;
  return [
    0.08 + across * 0.84,
    (lower ? 0.72 : 0.16) + jitter * 0.13,
  ] as [number, number];
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const NS = "http://www.w3.org/2000/svg";

export function useBileAcidFlight({
  diagramRef,
  skip,
}: {
  /** The BSH drawing they set off from (.bsh-stream-diagram). */
  diagramRef: RefObject<HTMLElement | null>;
  skip: boolean;
}) {
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram || skip) return;

    const overlay = document.createElementNS(NS, "svg");
    overlay.setAttribute("class", "bile-acid-flight");
    overlay.setAttribute("aria-hidden", "true");
    document.body.append(overlay);

    // Built once the TGR5 acids are known, so there is one of each, matched
    // in kind. Streams alternate within each kind, so both the upper
    // stream's orange and the lower one's purple make the journey.
    let shapes: {
      group: SVGGElement;
      from: [number, number];
      float: [number, number];
    }[] = [];

    const build = (targets: NodeListOf<SVGGraphicsElement>) => {
      overlay.replaceChildren();
      // Each traveller copies its counterpart: the same kind, and the same
      // stream colours (bsh-molecule--0/1), so nothing has to change on the
      // way and the two are identical when they meet.
      const all = Array.from(targets, (target) => ({
        target,
        conjugated: Boolean(target.querySelector(".bsh-hex--conjugated")),
        stream: target.classList.contains("bsh-molecule--1") ? 1 : 0,
      }));
      const seen = new Map<string, number>();
      const totals = new Map<string, number>();
      all.forEach(({ conjugated, stream }) => {
        const key = `${conjugated}-${stream}`;
        totals.set(key, (totals.get(key) ?? 0) + 1);
      });
      shapes = all.map(({ conjugated, stream }) => {
        const key = `${conjugated}-${stream}`;
        const n = seen.get(key) ?? 0;
        seen.set(key, n + 1);
        const kind = conjugated ? "conjugated" : "deconjugated";
        const group = document.createElementNS(NS, "g");
        group.setAttribute("class", `bsh-molecule--${stream}`);
        if (conjugated) {
          const bond = document.createElementNS(NS, "line");
          bond.setAttribute("class", "bsh-bond");
          bond.setAttribute("x1", String(BASE_HEX_R - 1));
          bond.setAttribute("y1", "0");
          bond.setAttribute("x2", String(BASE_HEX_R + 8));
          bond.setAttribute("y2", "0");
          const tag = document.createElementNS(NS, "circle");
          tag.setAttribute("class", "bsh-tag");
          tag.setAttribute("cx", String(BASE_HEX_R + 8 + BASE_TAG_R));
          tag.setAttribute("cy", "0");
          tag.setAttribute("r", String(BASE_TAG_R));
          group.append(bond, tag);
        }
        const hex = document.createElementNS(NS, "polygon");
        hex.setAttribute("class", `bsh-hex bsh-hex--${kind}`);
        hex.setAttribute("points", HEX_POINTS);
        group.append(hex);
        overlay.append(group);
        return {
          group,
          from: anchorFor(conjugated, stream, n, totals.get(key) ?? 1),
          // Filled in below, once the whole set is known.
          float: [0.5, 0.5] as [number, number],
        };
      });
      // Spread over the page in the order they are drawn, so the scatter is
      // even rather than grouped by kind.
      shapes.forEach((shape, i) => {
        shape.float = floatSpot(i, shapes.length);
      });
    };

    let frame: number | null = null;

    const rest = () => {
      overlay.style.visibility = "hidden";
    };

    const update = () => {
      frame = null;
      const stage = document.querySelector<HTMLElement>(TGR5_STAGE);
      const target = stage?.querySelector<SVGGraphicsElement>(TGR5_SVG);
      const acids = stage?.querySelectorAll<SVGGraphicsElement>(TGR5_ACID);
      const section = diagram.closest<HTMLElement>(".home-section");
      if (!stage || !target || !acids?.length || !section) return rest();
      if (shapes.length !== acids.length) build(acids);

      // Four marks, so the journey reads as one move, a pause, then
      // another: they leave once the navigation bar comes down to the
      // bottom of the bacterium, drift out over the page, hold there while
      // "But why is this reaction important?" has the screen, and only
      // then fall onto the pool.
      const diagramBox = diagram.getBoundingClientRect();
      // The BSH drawing rides a sticky stage, so for most of its wrapper it
      // is held still and the bar cannot reach it. Measure the bacterium's
      // place inside the stage and add where the stage ends up at the foot
      // of the wrapper — the one position from which the bar does come down
      // to it — so the mark is both right and the same at every scroll.
      const bshStage = diagram.closest<HTMLElement>(".home-snap-stage");
      const bshPin = diagram.closest<HTMLElement>(".home-snap-pin") ?? section;
      const bshPinBox = bshPin.getBoundingClientRect();
      const insideStage = bshStage
        ? diagramBox.top - bshStage.getBoundingClientRect().top
        : 0;
      const stageRests =
        bshPinBox.bottom +
        window.scrollY -
        (bshStage?.getBoundingClientRect().height ?? bshPinBox.height);
      // How far down the drawing the bacterium's underside falls, hairs
      // and all, as the reader sees it.
      const hairs = diagram.querySelector<SVGGraphicsElement>(BACTERIUM);
      const hairsBox = hairs?.getBoundingClientRect();
      const underside =
        hairsBox?.height && diagramBox.height
          ? (hairsBox.bottom - diagramBox.top) / diagramBox.height
          : BACTERIUM_BOTTOM;
      const startAt =
        stageRests + insideStage + underside * diagramBox.height - navBottom();
      const pin = stage.closest<HTMLElement>(".home-snap-pin") ?? stage;
      const endAt =
        pin.getBoundingClientRect().top + window.scrollY - navBottom();
      // The screen in between, taken as its whole band rather than the line
      // of text on it: they are in place by the time it reaches the bar, and
      // set off again half a window before the TGR5 screen.
      const band = document
        .querySelector<HTMLElement>(STATEMENT)
        ?.closest<HTMLElement>(".home-section");
      const span = endAt - startAt;
      const floatAt = band
        ? band.getBoundingClientRect().top + window.scrollY - navBottom()
        : startAt + span * 0.4;
      const fallAt = band
        ? endAt + navBottom() - window.innerHeight * FALL_LEAD
        : startAt + span * 0.75;
      if (!(startAt < floatAt && floatAt < fallAt && fallAt < endAt))
        return rest();
      if (window.scrollY <= startAt) {
        stage.style.removeProperty("--acids-in");
        return rest();
      }
      if (window.scrollY >= endAt) {
        // Landed: the acids already there take over, on the same spots.
        stage.style.setProperty("--acids-in", "1");
        return rest();
      }

      const from = diagramBox;
      const to = target.getBoundingClientRect();
      if (!from.width || !to.width) return rest();
      // Which stretch of the journey this is, and how far along it.
      const falling = window.scrollY >= fallAt;
      const leg = easeInOut(
        falling
          ? clamp01((window.scrollY - fallAt) / (endAt - fallAt))
          : clamp01((window.scrollY - startAt) / (floatAt - startAt)),
      );

      // Each end's hexagon, as the reader sees it. They grow most of the
      // way on the move out, keep that size while they hold, and finish
      // growing on the fall.
      const fromR = BSH_HEX_R * (from.width / BSH_VB_W);
      const toR = TGR5_HEX_R * (to.width / TGR5_VB_W);
      const midR = lerp(fromR, toR, FLOAT_SCALE);
      const scale =
        (falling ? lerp(midR, toR, leg) : lerp(fromR, midR, leg)) / BASE_HEX_R;

      overlay.style.visibility = "visible";
      stage.style.setProperty("--acids-in", "0");
      shapes.forEach((shape, i) => {
        // Its counterpart's own spot, read live — the pool drifts about.
        const seat = acids[i].getBoundingClientRect();
        // Where it drifts out to in between, held in the window so it stays
        // where it is on the page while that screen does.
        const floatX = shape.float[0] * window.innerWidth;
        const floatY = shape.float[1] * window.innerHeight;
        const x = falling
          ? lerp(floatX, seat.left + seat.width / 2, leg)
          : lerp(from.left + shape.from[0] * from.width, floatX, leg);
        const y = falling
          ? lerp(floatY, seat.top + seat.height / 2, leg)
          : lerp(from.top + shape.from[1] * from.height, floatY, leg);
        shape.group.setAttribute(
          "transform",
          `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(3)})`,
        );
      });
    };

    // Replaces any frame still waiting rather than skipping: a frame asked
    // for while the tab was in the background never runs, and skipping on
    // that would leave the flight stuck once the reader came back.
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
      document
        .querySelector<HTMLElement>(TGR5_STAGE)
        ?.style.removeProperty("--acids-in");
      overlay.remove();
    };
  }, [diagramRef, skip]);
}
