// Generated with Claude Opus 5 (Anthropic), 2026-10-19 (team request)
// Purpose: the bile acids from the BSH screen travel down to the TGR5 one.
// As the reader scrolls on from "Bile salt hydrolases (BSH) are enzymes…",
// the conjugated acids waiting on its left (hexagon with its glycine or
// taurine tag still attached) and the deconjugated ones leaving on its
// right (hexagon alone — the split-off tags stay behind, team request) lift
// off, cross the "But why is this reaction important?" screen, and arrive
// on the TGR5 screen grown to the size of the acids drawn there.
//
// They are drawn on a fixed layer over the page, in the same classes as the
// two diagrams so the colours match, and placed from both diagrams' live
// positions every frame — so the flight follows the scroll, and scrolling
// back up plays it the other way.
//
// Modelled on useLensToGutWindow.ts, which hands the magnifying glass over
// to the circle of bacteria the same way.
import { useEffect, type RefObject } from "react";

/** The screen they arrive on, and the drawing on it they match. */
const TGR5_STAGE = ".tgr5";
const TGR5_SVG = ".tgr5-svg";

// The two diagrams' own coordinate spaces, for turning the sizes below into
// a share of each drawing (see VB_W/HEX_R in the two components).
const BSH_VB_W = 1000;
const BSH_HEX_R = 11;
const TGR5_VB_W = 760;
const TGR5_HEX_R = 12;

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

interface Traveller {
  /** Conjugated ones keep their tag; deconjugated ones are the hexagon alone. */
  conjugated: boolean;
  /** 0 is the upper stream (orange / yellow), 1 the lower (purple). */
  stream: 0 | 1;
  /** Where it sets off, as a share of the BSH drawing. */
  from: [number, number];
  /** Where it lands, as a share of the TGR5 drawing. */
  to: [number, number];
}

// The conjugated ones set off from the left of the BSH drawing, where they
// queue for the enzyme; the deconjugated ones from the right, where they
// leave it. They land spread across the side of the TGR5 drawing the acids
// come in from.
const TRAVELLERS: Traveller[] = [
  { conjugated: true, stream: 0, from: [0.18, 0.23], to: [0.2, 0.28] },
  { conjugated: true, stream: 1, from: [0.18, 0.63], to: [0.23, 0.72] },
  { conjugated: false, stream: 0, from: [0.76, 0.28], to: [0.1, 0.2] },
  { conjugated: false, stream: 0, from: [0.83, 0.37], to: [0.31, 0.44] },
  { conjugated: false, stream: 1, from: [0.76, 0.58], to: [0.12, 0.8] },
  { conjugated: false, stream: 1, from: [0.83, 0.5], to: [0.33, 0.62] },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const NS = "http://www.w3.org/2000/svg";

function buildShape(traveller: Traveller) {
  // The lower stream's colours come from a .bsh-molecule--1 ancestor.
  const group = document.createElementNS(NS, "g");
  group.setAttribute("class", `bsh-molecule--${traveller.stream}`);
  if (traveller.conjugated) {
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
  hex.setAttribute(
    "class",
    `bsh-hex bsh-hex--${traveller.conjugated ? "conjugated" : "deconjugated"}`,
  );
  hex.setAttribute("points", HEX_POINTS);
  group.append(hex);
  return group;
}

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
    const shapes = TRAVELLERS.map((traveller) => {
      const shape = buildShape(traveller);
      overlay.append(shape);
      return shape;
    });
    document.body.append(overlay);

    let frame: number | null = null;

    const rest = () => {
      overlay.style.visibility = "hidden";
    };

    const update = () => {
      frame = null;
      const stage = document.querySelector<HTMLElement>(TGR5_STAGE);
      const target = stage?.querySelector<SVGGraphicsElement>(TGR5_SVG);
      const section = diagram.closest<HTMLElement>(".home-section");
      if (!stage || !target || !section) return rest();

      // From the BSH screen beginning to leave, to the TGR5 screen reaching
      // the top of the window — the stretch that holds "But why is this
      // reaction important?" in between.
      const startAt =
        section.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const pin = stage.closest<HTMLElement>(".home-snap-pin") ?? stage;
      const endAt = pin.getBoundingClientRect().top + window.scrollY;
      if (endAt <= startAt) return rest();
      const q = clamp01((window.scrollY - startAt) / (endAt - startAt));
      if (q <= 0 || q >= 1) return rest();

      const from = diagram.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (!from.width || !to.width) return rest();

      const e = easeInOut(q);
      // Each end's hexagon, as the reader sees it.
      const fromR = BSH_HEX_R * (from.width / BSH_VB_W);
      const toR = TGR5_HEX_R * (to.width / TGR5_VB_W);
      const scale = lerp(fromR, toR, e) / BASE_HEX_R;

      overlay.style.visibility = "visible";
      // Gone by the time they land, so they do not sit on top of the ones
      // the TGR5 drawing animates for itself.
      overlay.style.opacity = String(1 - clamp01((q - 0.88) / 0.12));
      shapes.forEach((shape, i) => {
        const traveller = TRAVELLERS[i];
        const x = lerp(
          from.left + traveller.from[0] * from.width,
          to.left + traveller.to[0] * to.width,
          e,
        );
        const y = lerp(
          from.top + traveller.from[1] * from.height,
          to.top + traveller.to[1] * to.height,
          e,
        );
        shape.setAttribute(
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
      overlay.remove();
    };
  }, [diagramRef, skip]);
}
