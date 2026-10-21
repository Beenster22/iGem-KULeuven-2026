// Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
// Purpose: home-page bridge between the symptoms figure and the gut section.
// One pinned full-screen section (see HomeSnapScroll.tsx) with one big
// sentence per scroll step, each in a different place on the screen: the
// previous one drifts away and the next one comes in. Two of the steps carry
// a small animated drawing (question marks, a ticking clock). Wording as
// supplied by the team (home-page notes of 2026-10-06). Under
// prefers-reduced-motion nothing is pinned and the sentences are simply
// listed one under the other.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-06: added StoryStatement,
// a single sentence in the same style for a section of its own (used for
// "But why is this reaction important?" after the BSH diagram).
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-06: the "quest" step is
// split over the screen (first half top left, second half bottom right) with
// a magnifying glass looking over some gut microbes in between.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-06 (team feedback: the text
// was very big and took a lot of scrolling for little information): two
// sentences per screen instead of one, in smaller type, so the same five
// sentences now take three scroll steps instead of five.
// Edited with Claude Opus 5 (Anthropic), 2026-10-09 (team feedback on the
// empty corners): Elle fills the corner the sentences leave empty (see
// `elle` below), the "etiology" question marks are bigger and sit further
// right, and on the "quest" screen the magnifying glass fills the top right
// while the two halves of the sentence move together into the bottom-left
// corner.
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { useReducedMotion } from "framer-motion";
import { SnapSteps } from "./HomeSnapScroll";
import { usePinnedStep } from "./usePinnedStep";
import { useLensToGutWindow } from "./useLensToGutWindow";
import { MicrobeLens } from "./TwoGutsSection";
import { ElleSays, type ElleMood } from "./ElleSays";

interface StoryStep {
  id: string;
  // How the screen is laid out (see .story-step--* in App.css). "pair-left"
  // puts the first sentence top left and the second bottom right;
  // "pair-right" is its mirror image; "presentation" is Elle as a professor
  // pointing at the sentence on a presentation screen; "office" is the GP's
  // office scene on the left with the sentences on the right; "gut" is the
  // first line above the gut, the second below it.
  position:
    | "pair-left"
    | "pair-right"
    | "presentation"
    | "office"
    | "gut";
  art?: "clock";
  // How many of the reader's scroll stops this screen holds for. One
  // unless said otherwise. (The office held for two, so it took two
  // scrolls to get from the doctor and patient on to the gut; back to one
  // on 2026-10-21, team request. Nothing sets this now — it is left here
  // because any screen may want it again.)
  holds?: number;
  lines: ReactNode[];
  // The screen's second sentence (the pair layouts).
  second?: ReactNode[];
  // Elle in the step's free bottom corner, saying something. She is placed
  // out of the column flow (see .story-elle in App.css), so adding her does
  // not move the sentences.
  elle?: {
    says: ReactNode;
    // Which bottom corner she stands in — whichever one the sentences leave
    // empty: bottom left for the pair-left and split layouts, bottom right
    // for pair-right.
    corner: "left" | "right";
    mood?: ElleMood;
    // Milliseconds after the step arrives before she speaks up.
    delay?: number;
    glass?: boolean;
  };
}

const STEPS: StoryStep[] = [
  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request):
  // "So many symptoms… but no known etiology" and its question marks moved
  // to the end of Elle's tour of the body (ElleTour.tsx), and Elle's
  // "Hey, I'm Elle! Want to go on a journey with me?" introduction is
  // removed for now (the team will place it again later). This screen's
  // remaining sentence is now on a presentation screen, with Elle — who
  // arrives here from the tour — in glasses pointing at it.
  {
    id: "therapy",
    position: "presentation",
    lines: [
      <>
        There is currently no actual therapeutic solution that tackles{" "}
        <strong>all of the symptoms at once!</strong>
      </>,
    ],
  },
  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-19 (team request): the
  // team's doctor-and-patient picture with the clock on the wall on the left
  // — the presentation screen's box turns into the box around it (see
  // useStepMorphs; no "GP's office" sign any more) — and the sentences on
  // the right.
  {
    id: "diagnosis",
    position: "office",
    lines: [
      <>
        <strong>Diagnosis takes quite a while</strong> because PMOS manifests
        differently in each patient…
      </>,
    ],
    // "With so much passion about women's health, we knew we needed to do
    // something about this!" and Elle's "Let's find out together!" removed
    // here (team request, 2026-10-19).
  },
  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-19 (team request): the
  // first half of the sentence above the gut, the second below it, and the
  // office clock turns into the magnifying glass going over the gut.
  {
    id: "quest",
    position: "gut",
    lines: [
      <>On a quest to find a new solution…</>,
      <>
        …we looked into the <strong>gut microbiome</strong>…
      </>,
    ],
    // Elle's "Let's have a look together!" removed here (team request,
    // 2026-10-19).
  },
];

// One entry per scroll stop, holding the index of the screen it shows. A
// screen that holds for more than one stop simply appears more than once,
// so the reader scrolls on and nothing changes until its last stop is past.
const STOPS = STEPS.flatMap((entry, i) =>
  Array.from({ length: Math.max(1, entry.holds ?? 1) }, () => i),
);

const MASCOT_BASE = "https://static.igem.wiki/teams/6299/wiki/mascot";

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: Elle as a professor — still with the sad face she arrives with
// from her tour (team request), glasses on (drawn over her eyes, which on
// that artwork sit at 36.3% / 47.4% and 60.6% / 46.5% across / down) and a
// pointer stick from her right-hand ovary to the presentation screen beside
// her. Hidden until
// Elle arrives from her tour of the body: ElleTour.tsx flies her here over
// this element (data-elle-professor) and then adds "is-here", when the
// glasses and stick appear.
function Professor({ here }: { here: boolean }) {
  return (
    <div
      className={`story-professor${here ? " is-here" : ""}`}
      data-elle-professor=""
      aria-hidden="true"
    >
      <img
        className="story-professor-elle"
        src={`${MASCOT_BASE}/uterus-sad.avif`}
        alt=""
      />
      <svg className="story-professor-glasses" viewBox="0 0 100 40">
        <circle cx={21.6} cy={20.8} r={16} />
        <circle cx={78.1} cy={19.2} r={16} />
        <path d="M37.6 19.5 Q49.9 13 62.1 18.5 M5.6 20 L0 15 M94.1 18.5 L100 13.5" />
      </svg>
      <svg
        className="story-professor-stick"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1={0} y1={100} x2={100} y2={0} />
        <line className="story-professor-stick-tip" x1={92} y1={8} x2={100} y2={0} />
      </svg>
    </div>
  );
}

// The team's picture of a patient talking with her doctor (on the dark
// background of the home-page video, which here is the office wall).
const OFFICE_SRC =
  "https://static.igem.wiki/teams/6299/wiki/home-page/doctor-patient-silhouette.avif";

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-19
// Purpose: the "diagnosis" step's GP's office — its sign (which the
// presentation screen's box turns into, see useStepMorphs) above the room,
// with the ticking clock in the wall's top-right corner.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-19 (team request): the
// two women talk — the doctor's head and her hands with the clipboard move
// gently, the patient nods now and then. (Edited 2026-10-20: the doctor's
// hand is now drawn and moves on its own, see DoctorHand.) The picture is one flat image, so
// each moving part is a copy of it cut down to that part (plus a margin of
// plain wall, which covers the still picture underneath as it moves) and
// turned slightly about where it joins the body (see .story-office-part in
// App.css).
const OFFICE_PARTS = ["patient-head", "doctor-head"];

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request):
// the patient wears a white dress. The picture is flat, so the dress is a
// shape laid over her, traced from the picture's own outline (in units of
// a quarter of its pixels, so x 0-500, y 0-470): neckline, back, seat,
// thigh and knee, and a skirt that falls a little past it. Her arm, which
// lies along her side with the hand resting just short of her knee, is
// masked out of it with its outline, so the arm and hand stay in front of
// the dress. The nodding head (patient-head above) is cut off above the
// neckline, so it never covers the dress.
const DRESS_PATH =
  "M89,127.5 Q108,140 128,127 L139,130 143,140 144,150 144,160 143,170 142,180 " +
  "138,190 148,200 165,210 181,220 194,226 201,226.3 208,228 214,231.5 " +
  "218,236 220.3,242 220.5,250 221,262 226,301 Q205,305 188,298 L188,266 " +
  // Her back, measured from the picture and set just outside it, so no
  // strip of skin shows along it (team request, the same day).
  "77.4,263 77.15,260 76.4,250 76.15,245 75.9,235 75.9,220 76.15,210 " +
  "76.4,200 76.9,190 77.9,180 78.9,170 80.1,160 81.9,150 82.9,145 " +
  "84.1,140 85.6,135 88.4,130 Z";
const DRESS_ARM_PATH =
  "M106.5,130 Q108,121 117,121 Q126,121 127.5,130 L130.5,140 132.5,150 " +
  "134.5,160 136.5,170 138.5,180 140,190 149,200 166,210 182,220 " +
  "195,225.5 196,233 191,245.5 184,246 176,244.5 169.5,240 152.5,230 " +
  "136.5,220 119.5,210 115.5,200 114.5,190 112.5,180 110.5,170 108.5,160 " +
  "106.5,150 104.5,140 Z";

function OfficeDress() {
  const maskId = useId();
  return (
    <svg
      className="story-office-dress"
      viewBox="0 0 2000 1878"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width={2000} height={1878} fill="#fff" />
          <path d={DRESS_ARM_PATH} transform="scale(4)" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path
          className="story-office-dress-shape"
          d={DRESS_PATH}
          transform="scale(4)"
        />
      </g>
      {/* The doctor's coat, raised a little round the back of her neck
          into a higher collar (team request, the same day): her moving
          head is cut off just above where the coat starts in the picture,
          and the joint showed there. Same white as the coat, and the same
          rounded top, only higher. */}
      <path
        className="story-office-sleeve"
        d="M1434,480 Q1438,452 1490,447 Q1542,452 1547,480 Z"
      />
      {/* Her hand (team request, the same day): an oval like the doctor's
          at the end of her forearm, as wide as the forearm, resting on her
          thigh in front of the dress. It runs on from the arm, so its edge
          is drawn only where it lies on the dress (the same mask as the
          dress's, which leaves out the arm). */}
      <ellipse
        className="story-office-hand"
        cx={769}
        cy={950}
        rx={62}
        ry={47}
        transform="rotate(25 769 950)"
      />
      <g mask={`url(#${maskId})`}>
        <ellipse
          className="story-office-hand-edge"
          cx={769}
          cy={950}
          rx={62}
          ry={47}
          transform="rotate(25 769 950)"
        />
      </g>
    </svg>
  );
}

// The doctor's hand, drawn larger over the one in the picture so it is
// plainly in front of the clipboard, over its edge (team request, the same
// day). It is the one part of her that gestures: it moves a little along
// her forearm, in and out of the cuff (see .story-office-hand--doctor in
// App.css), while the clipboard and her knee stay still.
function DoctorHand() {
  return (
    <svg
      className="story-office-doctor-hand"
      viewBox="0 0 2000 1878"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Over the picture's own hand (with the sleeve below, wholly), so
          none of it shows round the edge; no outline, like the picture's. */}
      <ellipse
        className="story-office-hand story-office-hand--doctor"
        cx={1238}
        cy={883}
        rx={66}
        ry={50}
      />
      {/* Her coat sleeve, carried on a little way over the clipboard
          (team request, the same day): the sleeve's own edges run on along
          the same lines to a cuff, drawn over the hand so the hand is
          partly tucked into it. */}
      <path
        className="story-office-sleeve"
        d="M1370,779 L1262,829 Q1255,885 1268,941 L1370,892 Z"
      />
      <path
        className="story-office-sleeve-edge"
        d="M1370,779 L1262,829 Q1255,885 1268,941 L1370,892"
      />
    </svg>
  );
}

// And the doctor wears white trousers under her coat (team request, the
// same day). A traced shape never quite sat on her legs, so instead her
// legs themselves are recoloured: this filter turns the picture's lavender
// skin white, but only inside the boxes round her thigh and shin (in
// fractions of the picture), which leave out the hand on her clipboard.
// It goes on the picture and on the moving copy of her hands, which
// reaches down over her thigh, so the trousers move with it. Only pixels
// close to the skin colour in all three channels change, so the coat's
// pale lines and the clipboard keep their colours.
const TROUSERS_FILTER_ID = "story-office-trousers";
const TROUSER_BOXES = [
  // Thigh, left of the clipboard hand; under it; right of it, up to the
  // coat; then the shin down to the ankle.
  [0.515, 0.4633, 0.0875, 0.1225],
  [0.6025, 0.4909, 0.0525, 0.0948],
  [0.655, 0.4633, 0.075, 0.1225],
  [0.53, 0.5857, 0.0775, 0.3067],
];
// 1 near the skin's value in a channel, 0 elsewhere (at steps of 1/40).
function band(ones: number[]) {
  return Array.from({ length: 41 }, (_, k) => (ones.includes(k) ? 1 : 0)).join(" ");
}

function TrousersFilter() {
  return (
    <svg className="story-office-filters" aria-hidden="true" focusable="false">
      <filter
        id={TROUSERS_FILTER_ID}
        x={0}
        y={0}
        width={1}
        height={1}
        primitiveUnits="objectBoundingBox"
        colorInterpolationFilters="sRGB"
      >
        {/* The skin is rgb(199, 191, 232). */}
        <feComponentTransfer in="SourceGraphic" result="skin">
          <feFuncR type="table" tableValues={band([31, 32])} />
          <feFuncG type="table" tableValues={band([29, 30, 31])} />
          <feFuncB type="table" tableValues={band([36, 37])} />
        </feComponentTransfer>
        {/* Opaque only where all three match; painted the dress's white. */}
        <feColorMatrix
          in="skin"
          type="matrix"
          values="0 0 0 0 0.969  0 0 0 0 0.957  0 0 0 0 0.988  1 1 1 0 -2"
          result="white"
        />
        {TROUSER_BOXES.map(([x, y, w, h], i) => (
          <feFlood
            key={i}
            floodColor="#000"
            x={x}
            y={y}
            width={w}
            height={h}
            result={`box${i}`}
          />
        ))}
        <feMerge result="legs">
          {TROUSER_BOXES.map((_, i) => (
            <feMergeNode key={i} in={`box${i}`} />
          ))}
        </feMerge>
        <feComposite in="white" in2="legs" operator="in" result="trousers" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="trousers" />
        </feMerge>
      </filter>
    </svg>
  );
}

function OfficeArt() {
  return (
    <div className="story-office">
      <div className="story-office-room">
        <TrousersFilter />
        <img
          className="story-office-picture"
          src={OFFICE_SRC}
          alt="A patient in a white dress talking with her doctor, who wears a white coat and trousers"
          width={2000}
          height={1878}
        />
        {OFFICE_PARTS.map((part) => (
          <img
            key={part}
            className={`story-office-part story-office-part--${part}`}
            src={OFFICE_SRC}
            alt=""
            aria-hidden="true"
            width={2000}
            height={1878}
          />
        ))}
        <OfficeDress />
        <DoctorHand />
        <ClockArt />
      </div>
    </div>
  );
}

// A wall clock — teal rim, light face, dark hands — whose second hand sweeps
// round while the minute hand creeps on.
function ClockArt() {
  return (
    <svg
      className="story-art story-art--clock"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <circle className="story-clock-face" cx={50} cy={50} r={45} />
      <circle className="story-clock-ring" cx={50} cy={50} r={45} />
      {Array.from({ length: 12 }, (_, i) =>
        i % 3 === 0 ? (
          <line
            key={i}
            className="story-clock-mark"
            x1={50}
            y1={13}
            x2={50}
            y2={21}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ) : (
          <circle
            key={i}
            className="story-clock-dot"
            cx={50}
            cy={16.5}
            r={1.6}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ),
      )}
      <line
        className="story-clock-hand story-clock-hand--hour"
        x1={50}
        y1={54}
        x2={50}
        y2={29}
      />
      <line
        className="story-clock-hand story-clock-hand--minute"
        x1={50}
        y1={56}
        x2={50}
        y2={19}
      />
      <line
        className="story-clock-hand story-clock-hand--second"
        x1={50}
        y1={62}
        x2={50}
        y2={15}
      />
      <circle className="story-clock-pin" cx={50} cy={50} r={4} />
      <circle className="story-clock-pin-core" cx={50} cy={50} r={1.5} />
    </svg>
  );
}

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-19 (team request)
// Purpose: the "quest" step's gut — the team's intestines illustration,
// framed, with a magnifying glass (which the office clock turns into, see
// useStepMorphs) touring five spots on it. Its lens shows the inside: the
// team's microbes picture, close up — a different part of it, turned a
// different way, at each spot — with the bacteria drifting and wobbling
// about. All CSS animation (see .quest-* in App.css).
const GUT_SRC = "https://static.igem.wiki/teams/6299/wiki/home-page/intestines-hq.avif";

// Generated with Claude Opus 5 (Anthropic), 2026-10-19 (team request: take
// the background off the gut): the drawing is uploaded on a pale backing
// colour rather than on transparency, which shows as a light rectangle on
// this dark band. So it is drawn to a canvas with that backing taken out —
// only the backing that reaches the edge of the picture, so pale parts
// inside the drawing itself are left alone, and with a soft edge so the
// outline does not come out jagged. If anything stops that (an image that
// cannot be read pixel by pixel, say), the picture is shown as it is.
//
// Replace this with a plain <img> once the drawing is re-uploaded with a
// transparent background.
const GUT_BACKING_CLEAR = 12; // fully transparent within this of the backing
const GUT_BACKING_EDGE = 48; // fully opaque beyond it

function GutPicture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = GUT_SRC;
    image
      .decode()
      .then(() => {
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        const w = image.naturalWidth;
        const h = image.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        const context = canvas.getContext("2d", { willReadFrequently: false });
        if (!context) throw new Error("no 2d context");
        context.drawImage(image, 0, 0);
        const picture = context.getImageData(0, 0, w, h);
        const pixels = picture.data;
        // The backing colour, read off a corner.
        const [br, bg, bb] = [pixels[0], pixels[1], pixels[2]];
        const seen = new Uint8Array(w * h);
        const queue: number[] = [];
        for (let x = 0; x < w; x++) queue.push(x, (h - 1) * w + x);
        for (let y = 0; y < h; y++) queue.push(y * w, y * w + w - 1);
        while (queue.length) {
          const cell = queue.pop() as number;
          if (seen[cell]) continue;
          const at = cell * 4;
          const away = Math.hypot(
            pixels[at] - br,
            pixels[at + 1] - bg,
            pixels[at + 2] - bb,
          );
          if (away >= GUT_BACKING_EDGE) continue;
          seen[cell] = 1;
          pixels[at + 3] =
            away <= GUT_BACKING_CLEAR
              ? 0
              : Math.round(
                  (255 * (away - GUT_BACKING_CLEAR)) /
                    (GUT_BACKING_EDGE - GUT_BACKING_CLEAR),
                );
          const y = (cell / w) | 0;
          const x = cell % w;
          if (x > 0) queue.push(cell - 1);
          if (x < w - 1) queue.push(cell + 1);
          if (y > 0) queue.push(cell - w);
          if (y < h - 1) queue.push(cell + w);
        }
        context.putImageData(picture, 0, 0);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <img
        className="quest-gut-picture"
        src={GUT_SRC}
        alt="The human intestines"
        width={976}
        height={1192}
      />
    );
  }
  return (
    <canvas
      ref={canvasRef}
      className="quest-gut-picture"
      role="img"
      aria-label="The human intestines"
    />
  );
}

function GutArt() {
  const prefersReducedMotion = useReducedMotion();
  const lensRef = useRef<HTMLDivElement>(null);
  // What the glass is showing becomes the circle of bacteria on the screen
  // below (useLensToGutWindow.ts).
  useLensToGutWindow({ lensRef, skip: !!prefersReducedMotion });

  return (
    <div className="quest-gut">
      <GutPicture />
      <div className="quest-lens" aria-hidden="true">
        {/* Edited with Claude Opus 5 (Anthropic), 2026-10-19 (team
            request: a quicker hand-over): the glass carries the very
            circle of bacteria it is about to become on the screen below,
            so that hand-over is pure movement with nothing to cross-fade.
            Edited 2026-10-20 (team request): it carries that circle the
            whole way round the gut now, rather than a photograph of
            microbes that swapped to it at the last stop — coming back up
            showed the circle and going down showed the photograph, which
            read as two different glasses. */}
        <div className="quest-lens-glass" ref={lensRef}>
          <div className="quest-lens-circle">
            <MicrobeLens />
          </div>
        </div>
        <svg className="quest-lens-handle" viewBox="0 0 10 10">
          <line x1={0} y1={0} x2={10} y2={10} />
        </svg>
      </div>
    </div>
  );
}

// One sentence in the same style on an ordinary full-screen section (the
// band in home.mdx is the snap stop): it comes in when the section does.
export function StoryStatement({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSeen(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`story-step story-step--center story-step--single story-step--${seen || prefersReducedMotion ? "active" : "future"}`}
    >
      <div className="story-text">
        <div className="story-line" style={{ "--line": 0 } as CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-19 (team request)
// Purpose: one thing on a step turning into another on the next step (and
// back, scrolling up): a stand-in goes from the one to where the other comes
// to rest, its look fading from the first into the second on the way, while
// the real two are hidden. The steps themselves keep their usual fade.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-19 (team request): was
// only the presentation screen → GP's office sign; now also the office's
// clock → the magnifying glass over the gut.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request: a
// smoother clock → magnifying glass): a little slower (was 750), the two
// looks now cross-fade with an overlap instead of one fading out before the
// other fades in (which left an empty ring half way), the clock turns as it
// goes, and the glass's handle fades in after it rather than popping up.
const MORPH_MS = 1100;
// The clock's face and the magnifying glass's own dark glass, which the
// stand-in's disc goes between (.story-clock-face and .quest-lens-glass in
// App.css — keep in step with them).
const CLOCK_FACE = "#eaf4f5";
const LENS_GLASS = "#221b2b";

interface StepMorph {
  from: StoryStep["position"];
  to: StoryStep["position"];
  // The element on the `from` step, and the one on the `to` step.
  a: string;
  b: string;
  // "label": a box whose text changes; "lens": a round one whose picture
  // changes.
  kind: "label" | "lens";
}

const STEP_MORPHS: StepMorph[] = [
  {
    from: "presentation",
    to: "office",
    a: ".story-screen",
    b: ".story-office-room",
    kind: "label",
  },
  {
    from: "office",
    to: "gut",
    a: ".story-office-room .story-art--clock",
    b: ".quest-lens-glass",
    kind: "lens",
  },
];

function useStepMorphs(
  stageRef: RefObject<HTMLElement | null>,
  step: number,
  enabled: boolean,
) {
  const previous = useRef(step);

  useEffect(() => {
    const from = previous.current;
    previous.current = step;
    const stage = stageRef.current;
    if (!enabled || !stage || from === step) return;
    const fromPos = STEPS[from]?.position;
    const toPos = STEPS[step]?.position;
    const morph = STEP_MORPHS.find(
      (m) =>
        (m.from === fromPos && m.to === toPos) ||
        (m.to === fromPos && m.from === toPos),
    );
    if (!morph) return;
    const forwards = morph.from === fromPos;
    const steps = stage.querySelectorAll<HTMLElement>(":scope > .story-step");
    const inFrom = steps[from]?.querySelector<HTMLElement>(forwards ? morph.a : morph.b);
    const inTo = steps[step]?.querySelector<HTMLElement>(forwards ? morph.b : morph.a);
    if (!inFrom || !inTo) return;

    // Where an element is now, and where it comes to rest once its step has
    // slid into place (the steps arrive with a translate, see .story-step).
    const rest = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const stepEl = el.closest(".story-step");
      const parts = stepEl ? getComputedStyle(stepEl).translate.split(" ") : [];
      const dy = parts.length > 1 ? parseFloat(parts[1]) || 0 : 0;
      return { left: r.left, top: r.top - dy, width: r.width, height: r.height };
    };
    const start = rest(inFrom);
    const end = rest(inTo);

    const ghost = document.createElement("div");
    ghost.className = `story-morph story-morph--${morph.kind}`;
    ghost.setAttribute("aria-hidden", "true");
    // What each end looks like inside the stand-in.
    const look = (el: HTMLElement) => {
      let part: HTMLElement;
      if (el.matches(".story-office-room")) {
        // The doctor-and-patient box: the dark wall the picture sits on.
        part = document.createElement("div");
        part.className = "story-morph-room";
      } else if (morph.kind === "label") {
        const source = el.querySelector<HTMLElement>(".story-text") ?? el;
        const style = getComputedStyle(source);
        part = document.createElement("div");
        part.className = "story-morph-text";
        part.textContent = source.textContent;
        Object.assign(part.style, {
          width: `${source.getBoundingClientRect().width}px`,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textAlign: style.textAlign,
        });
      } else if (el.matches(".quest-lens-glass")) {
        // Whatever the glass is carrying, so the two are the same thing.
        part = document.createElement("div");
        part.className = "story-morph-lens";
        part.innerHTML =
          el.querySelector(".quest-lens-circle")?.innerHTML ?? "";
      } else {
        part = el.cloneNode(true) as HTMLElement;
        part.removeAttribute("style");
        part.classList.add("story-morph-clock");
      }
      ghost.appendChild(part);
      return part;
    };
    const fading = look(inFrom);
    const arriving = look(inTo);
    const px = (r: typeof start) => ({
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    Object.assign(ghost.style, px(start));
    // The clock's face and the lens's glass are the same disc seen at two
    // moments, so the stand-in starts as whichever it is leaving and
    // darkens (or lightens) into the other as it goes. Set before it is
    // shown, or its first frame would be the colour it is heading for.
    if (morph.kind === "lens") {
      ghost.style.backgroundColor = forwards ? CLOCK_FACE : LENS_GLASS;
    }
    document.body.appendChild(ghost);
    // The magnifying glass is hidden whole, handle and all.
    const hidden = [inFrom, inTo].map(
      (el) => el.closest<HTMLElement>(".quest-lens") ?? el,
    );
    hidden.forEach((el) => (el.style.visibility = "hidden"));

    const easing = "cubic-bezier(0.65, 0, 0.35, 1)";
    const moving = ghost.animate([px(start), px(end)], {
      duration: MORPH_MS,
      easing,
      fill: "forwards",
    });
    fading.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: MORPH_MS * 0.6,
      delay: MORPH_MS * 0.1,
      easing: "ease-in-out",
      fill: "both",
    });
    arriving.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: MORPH_MS * 0.6,
      delay: MORPH_MS * 0.3,
      easing: "ease-in-out",
      fill: "both",
    });
    if (morph.kind === "lens") {
      // Edited 2026-10-21 (team request: it should actually be turning
      // into it). Three things carry through now instead of one look
      // swapping for another: the rim, which is the stand-in's own border
      // and never goes anywhere; the disc inside it, which darkens from
      // the clock's face into the glass; and the hands, which are all
      // that is left of the clock once its own ring and face stand down
      // (see .story-morph-clock in App.css), sweeping round as they fade
      // the way they would if the hours were rushing by.
      ghost.animate(
        [
          { backgroundColor: forwards ? CLOCK_FACE : LENS_GLASS },
          { backgroundColor: forwards ? LENS_GLASS : CLOCK_FACE },
        ],
        { duration: MORPH_MS, easing, fill: "forwards" },
      );
      const hands = forwards ? fading : arriving;
      hands.animate(
        [
          { rotate: forwards ? "0deg" : "180deg" },
          { rotate: forwards ? "180deg" : "0deg" },
        ],
        { duration: MORPH_MS, easing, fill: "forwards" },
      );
    }

    const finish = () => {
      hidden.forEach((el) => (el.style.visibility = ""));
      ghost.remove();
      // The glass's handle was hidden with it; bring it in gently.
      hidden
        .filter((el) => el.matches(".quest-lens"))
        .forEach((lens) =>
          lens
            .querySelector(".quest-lens-handle")
            ?.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 400,
              easing: "ease-out",
            }),
        );
    };
    moving.finished.then(finish, finish);
    return () => {
      moving.cancel();
      finish();
    };
  }, [stageRef, step, enabled]);
}

export function StoryScrollSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stop = usePinnedStep(wrapperRef, STOPS.length);
  const step = STOPS[stop] ?? 0;
  useStepMorphs(stageRef, step, !prefersReducedMotion);

  return (
    <div
      className={`story-scroll${prefersReducedMotion ? " story-scroll--static" : " home-snap-pin"}`}
      ref={wrapperRef}
      style={{ "--snap-steps": STOPS.length } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={STOPS.length} />}
      <div
        className={`story-stage${prefersReducedMotion ? "" : " home-snap-stage"}`}
        ref={stageRef}
      >
        {/* A border passing as each screen gives way to the next (team
            request, 2026-10-20: a border between every section). */}
        {STEPS.map((entry, i) => {
          const state = prefersReducedMotion
            ? "active"
            : i === step
              ? "active"
              : i < step
                ? "past"
                : "future";
          // `offset` keeps the second sentence's lines coming in after the
          // first sentence's.
          const text = (lines: ReactNode[], offset: number, extra = "") => (
            <p className={`story-text${extra}`}>
              {lines.map((line, lineIndex) => (
                <span
                  key={lineIndex}
                  className="story-line"
                  style={{ "--line": offset + lineIndex } as CSSProperties}
                >
                  {line}
                </span>
              ))}
            </p>
          );
          const art = (
            <>
              {entry.art === "clock" && <ClockArt />}
            </>
          );
          const elle = entry.elle && (
            <div className={`story-elle story-elle--${entry.elle.corner}`}>
              <ElleSays
                size="lg"
                // She faces in from her corner, so the bubble sits towards
                // the middle of the screen rather than off the edge.
                side={entry.elle.corner}
                mood={entry.elle.mood}
                glass={entry.elle.glass}
                delay={entry.elle.delay}
                // Counted from the step arriving, not from scroll: every step
                // is stacked on the same spot, so they are all "in view".
                active={state === "active"}
              >
                {entry.elle.says}
              </ElleSays>
            </div>
          );
          return (
            <div
              key={entry.id}
              className={`story-step story-step--${entry.position} story-step--${state}`}
              // Only the sentences on screen are read out and reachable.
              inert={state !== "active"}
            >
              {entry.position === "presentation" ? (
                <>
                  <Professor here={!!prefersReducedMotion} />
                  <div className="story-screen">{text(entry.lines, 0)}</div>
                </>
              ) : entry.position === "gut" ? (
                <>
                  {text(entry.lines.slice(0, 1), 0)}
                  <GutArt />
                  {text(entry.lines.slice(1), 1)}
                </>
              ) : entry.position === "office" ? (
                <>
                  <OfficeArt />
                  <div className="story-office-words">
                    {text(entry.lines, 0)}
                    {entry.second &&
                      text(entry.second, entry.lines.length, " story-text--second")}
                  </div>
                  {elle}
                </>
              ) : entry.second ? (
                <>
                  <div className="story-row">
                    {text(entry.lines, 0)}
                    {art}
                  </div>
                  {text(
                    entry.second,
                    entry.lines.length,
                    " story-text--second",
                  )}
                  {elle}
                </>
              ) : (
                <>
                  {text(entry.lines, 0)}
                  {art}
                  {elle}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
