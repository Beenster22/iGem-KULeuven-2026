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
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { useReducedMotion } from "framer-motion";
import { SnapSteps } from "./HomeSnapScroll";
import { usePinnedStep } from "./usePinnedStep";
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
        There currently is no actual therapeutic solution that tackles{" "}
        <strong>all of the symptoms at once!</strong>
      </>,
    ],
  },
  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-19 (team request): a
  // GP's office on the left — the presentation screen's box turns into its
  // sign (see useStepMorphs), over the team's doctor-and-patient picture
  // with the clock on the wall — and the sentences on the right.
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
// gently, the patient nods now and then. The picture is one flat image, so
// each moving part is a copy of it cut down to that part (plus a margin of
// plain wall, which covers the still picture underneath as it moves) and
// turned slightly about where it joins the body (see .story-office-part in
// App.css).
const OFFICE_PARTS = ["patient-head", "doctor-hands", "doctor-head"];

function OfficeArt() {
  return (
    <div className="story-office">
      <p className="story-office-sign">GP’s office</p>
      <div className="story-office-room">
        <img
          src={OFFICE_SRC}
          alt="A patient talking with her doctor"
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
const MICROBES_SRC = "https://static.igem.wiki/teams/6299/wiki/home-page/microbes-hq.avif";

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
  return (
    <div className="quest-gut">
      <GutPicture />
      <div className="quest-lens" aria-hidden="true">
        <div className="quest-lens-glass">
          <div className="quest-lens-drift">
            <div className="quest-lens-spin">
              <img className="quest-lens-view" src={MICROBES_SRC} alt="" />
            </div>
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
const MORPH_MS = 750;

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
    b: ".story-office-sign",
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
      if (morph.kind === "label") {
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
        part = document.createElement("img");
        part.className = "story-morph-lens";
        (part as HTMLImageElement).src = MICROBES_SRC;
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
      duration: MORPH_MS * 0.4,
      fill: "forwards",
    });
    arriving.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: MORPH_MS * 0.4,
      delay: MORPH_MS * 0.6,
      fill: "both",
    });

    const finish = () => {
      hidden.forEach((el) => (el.style.visibility = ""));
      ghost.remove();
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
  const step = usePinnedStep(wrapperRef, STEPS.length);
  useStepMorphs(stageRef, step, !prefersReducedMotion);

  return (
    <div
      className={`story-scroll${prefersReducedMotion ? " story-scroll--static" : " home-snap-pin"}`}
      ref={wrapperRef}
      style={{ "--snap-steps": STEPS.length } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={STEPS.length} />}
      <div
        className={`story-stage${prefersReducedMotion ? "" : " home-snap-stage"}`}
        ref={stageRef}
      >
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
