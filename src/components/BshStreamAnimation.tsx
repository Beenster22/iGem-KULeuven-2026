// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Purpose: home-page section between "What is PMOS?" and the inflammation
// slider — an animated version of the team's abstract figure (panel A):
// conjugated bile acids (pale hexagon + attached glycine/taurine group)
// stream in from the left, disappear into P. vulgatus where BSH acts, and
// leave on the right as a red deconjugated bile acid with the amino-acid
// group split off and drifting away separately — so the deconjugation step
// itself is what the motion shows. Each molecule runs one synced SMIL
// lifecycle (enter -> inside -> split and exit) with zero JS per frame;
// layout variation comes from a deterministic seededValue so it's stable
// across renders. Labels are HTML (not SVG text) so they stay readable when
// the diagram scales down on phones.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-04: scroll-linked hand-over
// from the gut-microbiome section above — one Bacteroides cell is lifted out
// of the "With PMOS" window (marked there with data-pv-zoom-source, see
// TwoGutsSection.tsx), travels down the page while growing and turning into
// the P. vulgatus drawn here, and the bile acids and labels fade in once it
// has landed (see usePvZoom). Off under prefers-reduced-motion.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-06 (team request): now a
// pinned section of two scroll steps (see HomeSnapScroll.tsx). First only the
// cell, enlarged on the left, with "Meet Phocaeicola vulgatus" beside it; then
// the cell moves to the middle and the reaction plays around it under the
// team's new title. Under prefers-reduced-motion both are shown, unpinned.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-06 (team review): the cell
// now carries fimbriae/pili around its outline and a tangled loop of DNA
// inside, as the team asked. The blue BSH capsule was being read as the
// genome, so it is smaller, sits beside the DNA and only appears, with its
// label, once the reaction is shown. Wording changes from the same review:
// "intriguing", the plural title, capitalised captions.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-15 (team request): the DNA
// loop is gone from the cell, BSH is drawn as a static "pac-man" (the usual
// way to draw an enzyme), open and facing right, with its label beside it,
// and the reaction step says what BSH are. The molecules now run in two
// mostly separate streams (upper and lower half), each in its own colours,
// and the GDCA/TUDCA and product labels are gone (team request).
import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useBileAcidFlight } from "./useBileAcidFlight";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SnapSteps } from "./HomeSnapScroll";
import { usePinnedStep } from "./usePinnedStep";

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const VB_W = 1000;
const VB_H = 300;

// Bacterium: horizontal double-membrane capsule like the abstract figure.
const BAC_X = 380;
const BAC_Y = 72;
const BAC_W = 240;
const BAC_H = 116;
const BAC_MID_Y = BAC_Y + BAC_H / 2;
const BAC_LEFT = BAC_X;
const BAC_RIGHT = BAC_X + BAC_W;

const ARROW_Y = 228;
// Per stream; there are two (see buildMolecules).
const MOLECULES_PER_STREAM = 5;
const HEX_R = 11;
const TAG_R = 6;

const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return `${(HEX_R * Math.cos(angle)).toFixed(2)},${(HEX_R * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

// Fractions of each molecule's loop: travelling in, hidden inside the cell
// (BSH acting), then the two products leaving.
const IN_END = 0.42;
const OUT_START = 0.56;

function bezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curve: number,
) {
  const c1x = x1 + (x2 - x1) * 0.35;
  const c2x = x1 + (x2 - x1) * 0.7;
  return `M${x1},${y1} C${c1x},${y1 + curve} ${c2x},${y2 + curve * 0.4} ${x2},${y2}`;
}

interface Molecule {
  id: number;
  stream: 0 | 1;
  duration: number;
  delay: number;
  inPath: string;
  hexOutPath: string;
  tagOutPath: string;
  // Resting positions for the reduced-motion (static) version.
  staticIn: [number, number];
  staticHexOut: [number, number];
  staticTagOut: [number, number];
}

// Two streams: 0 runs through the upper half of the diagram, 1 through the
// lower half (mirrored about the cell's middle), so they stay mostly apart.
function buildMolecules(): Molecule[] {
  return Array.from({ length: MOLECULES_PER_STREAM * 2 }, (_, i) => {
    const r = (k: number) => seededValue(i * 11 + k);
    const stream = (i % 2) as 0 | 1;
    const side = stream === 0 ? -1 : 1;
    const slot = Math.floor(i / 2);
    const duration = 6.5 + r(1) * 2.5;
    // Evenly staggered around the loop (plus jitter) so each stream is steady.
    const delay = -((slot + r(2) * 0.5) / MOLECULES_PER_STREAM) * duration;
    const y = (offset: number) => BAC_MID_Y + side * offset;

    const startX = 150 + r(3) * 60;
    const startY = y(18 + r(4) * 80);
    const entryY = y(8 + r(5) * 16);
    // Bows away from the other stream.
    const curve = side * (10 + r(7) * 16);

    const exitY = y(8 + r(8) * 16);
    const hexEnd: [number, number] = [760 + r(9) * 40, y(20 + r(10) * 50)];
    // Glycine/taurine peels away further out from the middle.
    const tagEnd: [number, number] = [
      720 + r(12) * 50,
      hexEnd[1] + side * (30 + r(13) * 20),
    ];

    return {
      id: i,
      stream,
      duration,
      delay,
      inPath: bezierPath(startX, startY, BAC_LEFT + 30, entryY, curve),
      hexOutPath: bezierPath(
        BAC_RIGHT - 30,
        exitY,
        hexEnd[0],
        hexEnd[1],
        curve * 0.6,
      ),
      tagOutPath: bezierPath(
        BAC_RIGHT - 30,
        exitY,
        tagEnd[0],
        tagEnd[1],
        curve * 0.8,
      ),
      staticIn: [startX + 40, startY],
      staticHexOut: hexEnd,
      staticTagOut: tagEnd,
    };
  });
}

interface PhaseProps {
  path: string;
  duration: number;
  delay: number;
  phase: "in" | "out";
}

// Moves the parent element along `path` during its phase of the shared loop
// and keeps it invisible the rest of the time.
function PhaseMotion({ path, duration, delay, phase }: PhaseProps) {
  const dur = `${duration}s`;
  const begin = `${delay}s`;
  const motion =
    phase === "in"
      ? { keyTimes: `0;${IN_END};1`, keyPoints: "0;1;1" }
      : { keyTimes: `0;${OUT_START};1`, keyPoints: "0;0;1" };
  const opacity =
    phase === "in"
      ? { values: "0;1;1;0;0", keyTimes: `0;0.06;${IN_END - 0.04};${IN_END};1` }
      : {
          values: "0;0;1;1;0",
          keyTimes: `0;${OUT_START};${OUT_START + 0.05};0.9;1`,
        };
  return (
    <>
      <animateMotion
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
        calcMode="linear"
        path={path}
        {...motion}
      />
      <animate
        attributeName="opacity"
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
        {...opacity}
      />
    </>
  );
}

function ConjugatedMolecule() {
  return (
    <>
      <line className="bsh-bond" x1={HEX_R - 1} y1={0} x2={HEX_R + 8} y2={0} />
      <circle className="bsh-tag" cx={HEX_R + 8 + TAG_R} cy={0} r={TAG_R} />
      <polygon className="bsh-hex bsh-hex--conjugated" points={HEX_POINTS} />
    </>
  );
}

function Molecules({ animate }: { animate: boolean }) {
  const molecules = useMemo(buildMolecules, []);

  if (!animate) {
    return (
      <>
        {molecules.map((m) => (
          <g key={m.id} className={`bsh-molecule--${m.stream}`}>
            <g transform={`translate(${m.staticIn[0]},${m.staticIn[1]})`}>
              <ConjugatedMolecule />
            </g>
            <polygon
              className="bsh-hex bsh-hex--deconjugated"
              points={HEX_POINTS}
              transform={`translate(${m.staticHexOut[0]},${m.staticHexOut[1]})`}
            />
            <circle
              className="bsh-tag"
              cx={m.staticTagOut[0]}
              cy={m.staticTagOut[1]}
              r={TAG_R}
            />
          </g>
        ))}
      </>
    );
  }

  return (
    <>
      {molecules.map((m) => (
        <g key={m.id} className={`bsh-molecule--${m.stream}`}>
          <g opacity={0}>
            <ConjugatedMolecule />
            <PhaseMotion
              path={m.inPath}
              duration={m.duration}
              delay={m.delay}
              phase="in"
            />
          </g>
          <polygon
            className="bsh-hex bsh-hex--deconjugated"
            points={HEX_POINTS}
            opacity={0}
          >
            <PhaseMotion
              path={m.hexOutPath}
              duration={m.duration}
              delay={m.delay}
              phase="out"
            />
          </polygon>
          <circle className="bsh-tag" r={TAG_R} opacity={0}>
            <PhaseMotion
              path={m.tagOutPath}
              duration={m.duration}
              delay={m.delay}
              phase="out"
            />
          </circle>
        </g>
      ))}
    </>
  );
}

// The travelling cell is its own fixed-position SVG, drawn at the diagram's
// viewBox size and then scaled, so it can cross from one section to the next.
const TRAVELLER_PAD = 8;
const TRAVELLER_W = BAC_W + TRAVELLER_PAD * 2;
const TRAVELLER_H = BAC_H + TRAVELLER_PAD * 2;

// Once the cell has landed the diagram stays complete: the labels and bile
// acids come in on their own (progress runs on to SETTLED without any more
// scrolling) and nothing is undone until the page has been scrolled back up
// to RELEASE_AT — so the diagram can be read anywhere near the middle of the
// screen, and a small scroll back up does not take it apart again.
const SETTLED = 1.2;
const RELEASE_AT = 0.55;

// The gut window the cell leaves: the one showing the dysbiosis, under
// "In case of PMOS, there's a clear dysbiosis…" (team request). The window
// is drawn by a component used in several places on this page — the
// magnifying glass's circle of microbes is another — and each marks a cell
// of its own, so the mark has to be looked for inside this one or the
// first on the page wins, which is the glass's.
const SOURCE = ".two-guts [data-pv-zoom-source]";

// How long after the gut window stops being held still the cell sets off,
// as a share of the window. Edited with Claude Opus 5 (Anthropic),
// 2026-10-20 (team request: the transition could not be seen happening).
// It used to begin when this section's band reached the foot of the
// screen, long after that window had gone, so the cell flew in from
// somewhere the reader could not see.
const DEPARTS_AFTER = 0.15;

// The cell follows the scroll position through a soft spring instead of
// rigidly, so a quick flick of the wheel still plays out as a glide.
const FOLLOW_SPRING = { stiffness: 45, damping: 18, restDelta: 0.0005 };

// Look of the source cell in the gut window (TwoGutsSection.tsx: the
// Bacteroides colour, its outline, and that outline's width at this scale).
const SOURCE_FILL = "#d9779b";
const SOURCE_STROKE = "#9c5670";
const SOURCE_STROKE_WIDTH = 10.6;

interface PvZoom {
  // 0 = cell still in the gut window, 1 = landed in this diagram; runs on
  // past 1 so the labels can fade in after the landing. Not clamped.
  progress: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
}

function usePvZoom(
  diagramRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
): PvZoom {
  // 2 = everything in its final state (no source cell, or reduced motion).
  // `scrolled` is where the scroll position says the hand-over should be;
  // `progress` is what is shown, trailing it on the spring.
  const scrolled = useMotionValue(2);
  const progress = useSpring(scrolled, FOLLOW_SPRING);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);

  useEffect(() => {
    const source = document.querySelector<SVGGElement>(SOURCE);
    const lens = source?.ownerSVGElement;
    const diagram = diagramRef.current;
    // Edited with Claude Opus 5.5 (Anthropic), 2026-10-05: the gut window is
    // now pinned to the screen until the page moves on to this section, so
    // the hand-over follows that move: it starts when this section's band
    // (a `data-snap` stop, see HomeSnapScroll.tsx) comes in at the bottom of
    // the screen and is complete when the band fills it.
    // Edited 2026-10-06: this section is itself pinned now, so the "band" is
    // its tall .home-snap-pin wrapper.
    const band = diagram?.closest<HTMLElement>(".home-snap-pin");
    if (!enabled || !source || !lens || !diagram || !band) {
      scrolled.jump(2);
      progress.jump(2);
      return;
    }
    // A capsule looks the same turned by 180deg, so take the short way round.
    const turn = Number(source.dataset.rotation) % 180;
    const startRotation = turn > 90 ? turn - 180 : turn;
    const sourceWidth = Number(source.dataset.width);

    const measure = () => {
      const lensRect = lens.getBoundingClientRect();
      const lensUnit =
        Math.min(lensRect.width, lensRect.height) / lens.viewBox.baseVal.width;
      const sourceRect = source.getBoundingClientRect();
      const fromX = sourceRect.left + sourceRect.width / 2;
      const fromY = sourceRect.top + sourceRect.height / 2;
      const fromW = sourceWidth * lensUnit;

      const diagramRect = diagram.getBoundingClientRect();
      const unit = diagramRect.width / VB_W;
      const toX = diagramRect.left + (BAC_X + BAC_W / 2) * unit;
      const toY = diagramRect.top + BAC_MID_Y * unit;
      const toW = BAC_W * unit;

      // From just after the gut window stops being held still — the cell is
      // on the screen there, under the dysbiosis sentence — to this
      // section's band filling the window. The window rides a sticky stage,
      // so its own top plus the scroll moves while it is held; the scroll
      // at which it comes to rest at the foot of its wrapper does not.
      const srcStage = source.closest<HTMLElement>(".home-snap-stage");
      const srcPin = source.closest<HTMLElement>(".home-snap-pin");
      const held =
        srcStage && srcPin
          ? srcPin.getBoundingClientRect().bottom +
            window.scrollY -
            srcStage.getBoundingClientRect().height
          : sourceRect.top + window.scrollY - window.innerHeight / 2;
      const departs = held + window.innerHeight * DEPARTS_AFTER;
      const arrives = band.getBoundingClientRect().top + window.scrollY;
      const target =
        arrives > departs
          ? (window.scrollY - departs) / (arrives - departs)
          : 1;
      return { fromX, fromY, fromW, toX, toY, toW, target };
    };

    // Puts the travelling cell where the shown progress says it is, between
    // wherever the two ends are on screen right now.
    const place = () => {
      const { fromX, fromY, fromW, toX, toY, toW } = measure();
      const p = progress.get();
      // The cell has left the window for good once the hand-over starts.
      source.style.opacity = p > 0 ? "0" : "";

      const t = Math.min(1, Math.max(0, p));
      const eased = t * t * (3 - 2 * t);
      // Grows late, so it is still small while it passes the legend.
      const width = fromW + (toW - fromW) * Math.pow(eased, 1.6);
      x.set(fromX + (toX - fromX) * eased - TRAVELLER_W / 2);
      y.set(fromY + (toY - fromY) * eased - TRAVELLER_H / 2);
      scale.set(width / BAC_W);
      rotate.set(startRotation * (1 - eased));
    };

    let landed = false;
    const held = (target: number) => {
      if (target >= 1) landed = true;
      else if (target < RELEASE_AT) landed = false;
      return landed ? SETTLED : target;
    };

    const update = () => {
      scrolled.set(held(measure().target));
      place();
    };

    // No glide on load: start wherever the page already is.
    const initial = held(measure().target);
    scrolled.jump(initial);
    progress.jump(initial);
    place();
    const stopFollowing = progress.on("change", place);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      stopFollowing();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      source.style.opacity = "";
    };
  }, [enabled, diagramRef, scrolled, progress, x, y, scale, rotate]);

  return { progress, x, y, scale, rotate };
}

// Fimbriae/pili: short hairs standing out from the cell's outline, evenly
// spread round the capsule with a little variation in length and lean.
const PILI_COUNT = 40;
const PILI_PATHS = (() => {
  const r = BAC_H / 2;
  const straight = BAC_W - BAC_H;
  const perimeter = 2 * straight + 2 * Math.PI * r;
  const leftX = BAC_X + r;
  const rightX = BAC_RIGHT - r;
  return Array.from({ length: PILI_COUNT }, (_, i) => {
    // A point on the outline and the outward direction there, going
    // clockwise from the left end of the top edge.
    let d = ((i + 0.5) / PILI_COUNT) * perimeter;
    let x: number;
    let y: number;
    let angle: number;
    if (d < straight) {
      x = leftX + d;
      y = BAC_Y;
      angle = -Math.PI / 2;
    } else if ((d -= straight) < Math.PI * r) {
      angle = -Math.PI / 2 + d / r;
      x = rightX + r * Math.cos(angle);
      y = BAC_MID_Y + r * Math.sin(angle);
    } else if ((d -= Math.PI * r) < straight) {
      x = rightX - d;
      y = BAC_Y + BAC_H;
      angle = Math.PI / 2;
    } else {
      angle = Math.PI / 2 + (d - straight) / r;
      x = leftX + r * Math.cos(angle);
      y = BAC_MID_Y + r * Math.sin(angle);
    }
    const length = 9 + seededValue(i * 7 + 301) * 8;
    const lean = (seededValue(i * 7 + 302) - 0.5) * 0.7;
    const tipX = x + length * Math.cos(angle + lean);
    const tipY = y + length * Math.sin(angle + lean);
    // Bends slightly on the way out, so the hairs do not look ruled.
    const midX = x + length * 0.55 * Math.cos(angle - lean * 0.6);
    const midY = y + length * 0.55 * Math.sin(angle - lean * 0.6);
    return `M${x.toFixed(1)},${y.toFixed(1)} Q${midX.toFixed(1)},${midY.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`;
  }).join(" ");
})();

// BSH as a static pac-man, mouth open to the right, in the right half of
// the cell; its "BSH" label sits beside it in the left half.
const ENZYME = { cx: BAC_X + BAC_W / 2 + 28, r: 34 };
const MOUTH_ANGLE = 38; // degrees either side of the right-pointing axis

const PACMAN_PATH = (() => {
  const a = (MOUTH_ANGLE * Math.PI) / 180;
  const x = (ENZYME.cx + ENZYME.r * Math.cos(a)).toFixed(2);
  const dy = ENZYME.r * Math.sin(a);
  return `M${ENZYME.cx},${BAC_MID_Y} L${x},${(BAC_MID_Y + dy).toFixed(2)} A${ENZYME.r},${ENZYME.r} 0 1 1 ${x},${(BAC_MID_Y - dy).toFixed(2)} Z`;
})();
const ENZYME_LABEL_X = ENZYME.cx - ENZYME.r - 36;

function BacteriumShapes() {
  return (
    <>
      <path className="bsh-pili" d={PILI_PATHS} />
      <rect
        className="bsh-membrane-outer"
        x={BAC_X}
        y={BAC_Y}
        width={BAC_W}
        height={BAC_H}
        rx={BAC_H / 2}
      />
      <rect
        className="bsh-membrane-inner"
        x={BAC_X + 8}
        y={BAC_Y + 8}
        width={BAC_W - 16}
        height={BAC_H - 16}
        rx={(BAC_H - 16) / 2}
      />
      {/* Only with the reaction, where its "BSH" label is shown too. */}
      <g className="bsh-stream-reaction">
        <path className="bsh-enzyme" d={PACMAN_PATH} />
      </g>
    </>
  );
}

// The cell on its way from the gut window to this diagram: starts as a plain
// pink capsule like the ones in the window and picks up the colours, inner
// membrane and pili of P. vulgatus on the way.
function TravellingBacterium({ zoom }: { zoom: PvZoom }) {
  const { progress } = zoom;
  const opacity = useTransform(progress, (p) => (p > 0 && p < 1 ? 1 : 0));
  // Stays pink for the first stretch, so it still reads as the cell that left.
  const fill = useTransform(progress, [0.3, 0.9], [SOURCE_FILL, "#f3eef9"]);
  const stroke = useTransform(progress, [0.3, 0.9], [SOURCE_STROKE, "#6e5b9e"]);
  const strokeWidth = useTransform(progress, [0, 1], [SOURCE_STROKE_WIDTH, 4]);
  const innerOpacity = useTransform(progress, [0.15, 0.6], [0, 1]);
  const detailOpacity = useTransform(progress, [0.35, 0.8], [0, 1]);

  return createPortal(
    <motion.svg
      className="bsh-zoom-traveller"
      aria-hidden="true"
      width={TRAVELLER_W}
      height={TRAVELLER_H}
      viewBox={`${BAC_X - TRAVELLER_PAD} ${BAC_Y - TRAVELLER_PAD} ${TRAVELLER_W} ${TRAVELLER_H}`}
      style={{
        x: zoom.x,
        y: zoom.y,
        scale: zoom.scale,
        rotate: zoom.rotate,
        opacity,
      }}
    >
      <motion.path
        className="bsh-pili"
        d={PILI_PATHS}
        style={{ opacity: detailOpacity }}
      />
      {/* No .bsh-membrane-outer class here: its CSS fill/stroke would win
          over the animated ones, which are set as SVG attributes. */}
      <motion.rect
        x={BAC_X}
        y={BAC_Y}
        width={BAC_W}
        height={BAC_H}
        rx={BAC_H / 2}
        style={{ fill, stroke, strokeWidth }}
      />
      <motion.rect
        className="bsh-membrane-inner"
        x={BAC_X + 8}
        y={BAC_Y + 8}
        width={BAC_W - 16}
        height={BAC_H - 16}
        rx={(BAC_H - 16) / 2}
        style={{ opacity: innerOpacity }}
      />
    </motion.svg>,
    document.body,
  );
}

// Percent position of a viewBox point, for placing the HTML labels.
const pctX = (x: number) => `${(x / VB_W) * 100}%`;
const pctY = (y: number) => `${(y / VB_H) * 100}%`;

export function BshStreamAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const zoom = usePvZoom(diagramRef, !prefersReducedMotion);
  // The bile acids carry on down to the TGR5 screen (useBileAcidFlight.ts).
  useBileAcidFlight({ diagramRef, skip: !!prefersReducedMotion });
  // Two scroll steps: the cell on its own with its introduction beside it,
  // then the reaction around it. Without the pin both are simply shown.
  const step = usePinnedStep(wrapperRef, 2);
  const state = prefersReducedMotion
    ? "static"
    : step === 0
      ? "meet"
      : "reaction";
  // The drawn cell takes over from the travelling one as it lands, and its
  // introduction follows the landing.
  const cellOpacity = useTransform(zoom.progress, (p) => (p >= 1 ? 1 : 0));
  const meetOpacity = useTransform(zoom.progress, [1, 1.1], [0, 1]);

  return (
    <div
      className={prefersReducedMotion ? undefined : "home-snap-pin"}
      ref={wrapperRef}
      style={{ "--snap-steps": 2 } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={2} />}
      <div
        className={`bsh-stream bsh-stream--${state}${prefersReducedMotion ? "" : " home-snap-stage"}`}
      >
        {!prefersReducedMotion && <TravellingBacterium zoom={zoom} />}
        <motion.div
          className="bsh-stream-meet"
          style={{ opacity: meetOpacity }}
          inert={state === "reaction"}
        >
          <div className="bsh-stream-meet-text">
            <h3 className="bsh-stream-meet-title">
              Meet <em>Phocaeicola vulgatus</em>
            </h3>
            <p>
              An intriguing microorganism involved in digestion and bile acid metabolism.
            </p>
          </div>
        </motion.div>
        <h3 className="bsh-stream-heading bsh-stream-reaction">
          Bile salt hydrolases (BSH) are enzymes responsible for bile acid modification.
        </h3>
        
        <div
          className="bsh-stream-diagram"
          ref={diagramRef}
          style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
        >
          <svg
            className="bsh-stream-svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Animated diagram: Phocaeicola vulgatus uses the enzyme BSH to convert the conjugated bile acids GDCA and TUDCA into the deconjugated bile acids DCA and UDCA, splitting off glycine and taurine."
          >
            <defs>
              <marker
                id="bsh-arrowhead"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 Z" className="bsh-arrow-head" />
              </marker>
            </defs>

            <g className="bsh-stream-reaction">
              <line
                className="bsh-arrow"
                x1={330}
                y1={ARROW_Y}
                x2={680}
                y2={ARROW_Y}
                markerEnd="url(#bsh-arrowhead)"
              />
              <Molecules animate={!prefersReducedMotion} />
            </g>
            <motion.g
              className="bsh-bacterium"
              style={{ opacity: cellOpacity }}
            >
              <BacteriumShapes />
            </motion.g>
          </svg>

          <div className="bsh-stream-layer bsh-stream-reaction">
            <span
              className="bsh-stream-caption bsh-stream-caption--species"
              style={{ left: "50%", top: pctY(40) }}
            >
              <em>Phocaeicola vulgatus</em>
            </span>
            <span
              className="bsh-stream-enzyme-label"
              style={{ left: pctX(ENZYME_LABEL_X), top: pctY(BAC_MID_Y) }}
            >
              BSH
            </span>
          </div>

          <div className="bsh-stream-layer bsh-stream-reaction">
            <span
              className="bsh-stream-caption"
              style={{ left: pctX(180), top: pctY(275) }}
            >
              Conjugated bile acids
            </span>

            <span
              className="bsh-stream-caption"
              style={{ left: pctX(820), top: pctY(275) }}
            >
              Deconjugated bile acids
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
