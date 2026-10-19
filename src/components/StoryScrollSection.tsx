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
import { ElleSays, type ElleMood } from "./ElleSays";

interface StoryStep {
  id: string;
  // How the screen is laid out (see .story-step--* in App.css). "pair-left"
  // puts the first sentence top left and the second bottom right;
  // "pair-right" is its mirror image; "presentation" is Elle as a professor
  // pointing at the sentence on a presentation screen; "office" is the GP's
  // office scene on the left with the sentences on the right.
  position: "pair-left" | "pair-right" | "split" | "presentation" | "office";
  art?: "clock" | "microbiome";
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
  // sign (see useScreenToSign), over the team's doctor-and-patient picture
  // with the clock on the wall — and the sentences on the right.
  {
    id: "diagnosis",
    position: "office",
    lines: [
      <>
        <strong>Diagnosis takes quite a while</strong> because PMOS manifests
        differently between each patient…
      </>,
    ],
    // "With so much passion about women's health, we knew we needed to do
    // something about this!" removed here (team request, 2026-10-19).
    elle: {
      says: <>Let’s find out together!</>,
      corner: "right",
      mood: "smile",
      delay: 2600,
    },
  },
  {
    id: "quest",
    position: "split",
    art: "microbiome",
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
// presentation screen's box turns into, see useScreenToSign) above the room,
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

// The gut microbes of MicrobiomeArt, drawn once faintly on the page and once
// more, enlarged, inside the lens. Each one wriggles on its own beat.
function Microbes() {
  const beat = (delay: number): CSSProperties => ({
    animationDelay: `${delay}s`,
  });
  return (
    <>
      <g transform="rotate(-20 41 49.5)">
        <rect
          className="story-microbe"
          style={beat(0)}
          x={28}
          y={44}
          width={26}
          height={11}
          rx={5.5}
        />
      </g>
      <circle
        className="story-microbe story-microbe--teal"
        style={beat(-0.6)}
        cx={78}
        cy={62}
        r={7}
      />
      <g className="story-microbe" style={beat(-1.3)}>
        <circle cx={112} cy={38} r={5.5} />
        <circle cx={122} cy={41} r={5.5} />
      </g>
      <path
        className="story-microbe story-microbe--curved story-microbe--teal"
        style={beat(-0.3)}
        d="M132 78 q10 -12 22 -2"
      />
      <g transform="rotate(15 54 97)">
        <rect
          className="story-microbe story-microbe--teal"
          style={beat(-1.8)}
          x={42}
          y={92}
          width={24}
          height={10}
          rx={5}
        />
      </g>
      <circle
        className="story-microbe"
        style={beat(-1)}
        cx={100}
        cy={98}
        r={6}
      />
      <g transform="rotate(-10 162 109)">
        <rect
          className="story-microbe"
          style={beat(-2.2)}
          x={150}
          y={104}
          width={24}
          height={10}
          rx={5}
        />
      </g>
      <path
        className="story-microbe story-microbe--curved"
        style={beat(-1.5)}
        d="M150 40 q12 8 22 -3"
      />
    </>
  );
}

// A magnifying glass wandering over the gut microbes: under the lens they
// show enlarged and in full colour. The enlarged copy moves against the lens
// (see story-lens-view in App.css) so that it stays a true close-up of
// whatever the lens is over.
function MicrobiomeArt() {
  const id = useId();
  return (
    <svg
      className="story-art story-art--microbiome"
      viewBox="0 0 200 150"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`${id}-lens`}>
          <circle cx={70} cy={65} r={30} />
        </clipPath>
        <mask
          id={`${id}-outside`}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={200}
          height={150}
        >
          <rect width={200} height={150} fill="#fff" />
          <circle className="story-lens" cx={70} cy={65} r={31} fill="#000" />
        </mask>
      </defs>
      <g className="story-microbes-far" mask={`url(#${id}-outside)`}>
        <Microbes />
      </g>
      <g className="story-lens">
        <g clipPath={`url(#${id}-lens)`}>
          <g className="story-lens-view">
            <g transform="translate(-56 -52) scale(1.8)">
              <Microbes />
            </g>
          </g>
        </g>
        <line className="story-lens-handle" x1={94} y1={89} x2={113} y2={108} />
        <circle className="story-lens-rim" cx={70} cy={65} r={32} />
        <path className="story-lens-shine" d="M50 55 a22 22 0 0 1 12 -11" />
      </g>
    </svg>
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
// Purpose: between the "presentation" step and the "office" step after it,
// the presentation screen's box turns into the GP's office sign (and back,
// scrolling up): a stand-in box goes from the one to where the other comes
// to rest, its sentence fading into "GP's office" on the way, while the
// real two are hidden. The steps themselves keep their usual fade.
const MORPH_MS = 750;

function useScreenToSign(
  stageRef: RefObject<HTMLElement | null>,
  step: number,
  enabled: boolean,
) {
  const previous = useRef(step);

  useEffect(() => {
    const from = previous.current;
    previous.current = step;
    const stage = stageRef.current;
    const screenIndex = STEPS.findIndex((s) => s.position === "presentation");
    const officeIndex = STEPS.findIndex((s) => s.position === "office");
    const forwards = from === screenIndex && step === officeIndex;
    const backwards = from === officeIndex && step === screenIndex;
    if (!enabled || !stage || !(forwards || backwards)) return;
    const screen = stage.querySelector<HTMLElement>(".story-screen");
    const sign = stage.querySelector<HTMLElement>(".story-office-sign");
    const screenText = screen?.querySelector<HTMLElement>(".story-text");
    if (!screen || !sign || !screenText) return;
    const [box, target] = forwards ? [screen, sign] : [sign, screen];
    const [oldText, newText] = forwards ? [screenText, sign] : [sign, screenText];

    // Where an element is now, and where it comes to rest once its step has
    // slid into place (the steps arrive with a translate, see .story-step).
    const rest = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const stepEl = el.closest(".story-step");
      const parts = stepEl ? getComputedStyle(stepEl).translate.split(" ") : [];
      const dy = parts.length > 1 ? parseFloat(parts[1]) || 0 : 0;
      return { left: r.left, top: r.top - dy, width: r.width, height: r.height };
    };
    const start = rest(box);
    const end = rest(target);

    const ghost = document.createElement("div");
    ghost.className = "story-morph";
    ghost.setAttribute("aria-hidden", "true");
    const label = (source: HTMLElement) => {
      const el = document.createElement("div");
      const style = getComputedStyle(source);
      el.className = "story-morph-text";
      el.textContent = source.textContent;
      Object.assign(el.style, {
        width: `${source.getBoundingClientRect().width}px`,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        textAlign: style.textAlign,
      });
      ghost.appendChild(el);
      return el;
    };
    const fading = label(oldText);
    const arriving = label(newText);
    const px = (r: typeof start) => ({
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    Object.assign(ghost.style, px(start));
    document.body.appendChild(ghost);
    box.style.visibility = "hidden";
    target.style.visibility = "hidden";

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
      box.style.visibility = "";
      target.style.visibility = "";
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
  useScreenToSign(stageRef, step, !prefersReducedMotion);

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
              {entry.art === "microbiome" && <MicrobiomeArt />}
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
