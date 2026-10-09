// Generated with Claude Opus 5.5 (Anthropic), 2026-10-09
// Purpose: Human Practices "Feedback cycle" section. <FeedbackCycle> lays the
// text out beside a Listen → Analyse → Implement wheel that stays pinned on
// the right while the section is read, and turns so the step being read
// sits at the top. Each step is a <FeedbackStep step="...">; the Analyse
// step's three outcomes are <FeedbackOutcome> squircles, and a line drawn
// as you scroll leads from the "active" outcome down to the Implement step.
// <ResourceDownload> is a card linking to a file uploaded to static.igem.wiki.
import {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/* ---------- Steps ---------- */

type StepName = "listen" | "analyse" | "implement";

interface StepInfo {
  name: StepName;
  label: string;
  /** Where the middle of this step's arrow sits on the wheel, in degrees
   *  clockwise from the top (matches the team's cycle drawing). */
  angle: number;
}

const STEPS: StepInfo[] = [
  { name: "listen", label: "Listen", angle: -60 },
  { name: "analyse", label: "Analyse", angle: 60 },
  { name: "implement", label: "Implement", angle: 180 },
];

/* ---------- Wheel ---------- */

const C = 200; // centre of the 400 x 400 viewBox
const R_IN = 114;
const R_OUT = 182;
const R_MID = (R_IN + R_OUT) / 2;
const HEAD = 16; // how far the arrowhead flares past the band

function polar(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return `${(C + r * Math.sin(rad)).toFixed(2)} ${(C - r * Math.cos(rad)).toFixed(2)}`;
}

// One curved arrow: notched tail at `start`, band running clockwise to
// `end`, arrowhead tip at `tip`.
function arrowPath(centre: number) {
  const start = centre - 52;
  const end = centre + 40;
  const tip = centre + 54;
  const notch = start + 12;
  return [
    `M ${polar(start, R_OUT)}`,
    `A ${R_OUT} ${R_OUT} 0 0 1 ${polar(end, R_OUT)}`,
    `L ${polar(end, R_OUT + HEAD)}`,
    `L ${polar(tip, R_MID)}`,
    `L ${polar(end, R_IN - HEAD)}`,
    `L ${polar(end, R_IN)}`,
    `A ${R_IN} ${R_IN} 0 0 0 ${polar(start, R_IN)}`,
    `L ${polar(notch, R_MID)}`,
    "Z",
  ].join(" ");
}

// Arc along the middle of an arrow for its word to follow. On the lower half
// of the wheel the arc runs anticlockwise, so the word still reads upright.
function labelPath(centre: number, upright: boolean) {
  const from = centre - 50;
  const to = centre + 38;
  return upright
    ? `M ${polar(from, R_MID)} A ${R_MID} ${R_MID} 0 0 1 ${polar(to, R_MID)}`
    : `M ${polar(to, R_MID)} A ${R_MID} ${R_MID} 0 0 0 ${polar(from, R_MID)}`;
}

function CycleWheel({ active }: { active: number }) {
  const idPrefix = `feedback-wheel-${useId().replace(/:/g, "")}`;
  // Turn the wheel so the active step's arrow sits at the top.
  const rotation = -STEPS[active].angle;

  return (
    <svg
      className="feedback-wheel"
      viewBox="0 0 400 400"
      role="img"
      aria-label={`Feedback cycle: Listen, Analyse, Implement. Currently at ${STEPS[active].label}.`}
    >
      <g
        className="feedback-wheel-rotor"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {STEPS.map((step, index) => {
          // Where this arrow ends up once the wheel has turned
          const shown = (((step.angle + rotation) % 360) + 360) % 360;
          const upright = shown < 90 || shown > 270;
          const pathId = `${idPrefix}-${step.name}`;
          return (
            <g
              key={step.name}
              className={`feedback-wheel-step${index === active ? " is-active" : ""}`}
            >
              <path
                d={arrowPath(step.angle)}
                className="feedback-wheel-arrow"
              />
              <path
                id={pathId}
                d={labelPath(step.angle, upright)}
                fill="none"
              />
              {/* Keyed on the step so it re-mounts and fades back in after each
                  turn, rather than showing words upside down mid-rotation */}
              <text
                key={active}
                className="feedback-wheel-label"
                dominantBaseline="central"
              >
                <textPath
                  href={`#${pathId}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {step.label}
                </textPath>
              </text>
            </g>
          );
        })}
      </g>
      <text
        x={C}
        y={C - 10}
        className="feedback-wheel-count"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {active + 1}
      </text>
      <text
        x={C}
        y={C + 30}
        className="feedback-wheel-of"
        textAnchor="middle"
        dominantBaseline="central"
      >
        of {STEPS.length}
      </text>
    </svg>
  );
}

/* ---------- Section wrapper ---------- */

// A step becomes the current one once its heading passes this fraction of
// the viewport height.
const READING_LINE = 0.45;

export function FeedbackCycle({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const steps = contentRef.current?.querySelectorAll<HTMLElement>(
        "[data-feedback-step]",
      );
      if (!steps) return;
      const line = window.innerHeight * READING_LINE;
      let current = 0;
      steps.forEach((step) => {
        const index = STEPS.findIndex(
          (s) => s.name === step.dataset.feedbackStep,
        );
        if (index >= 0 && step.getBoundingClientRect().top <= line)
          current = index;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="feedback-cycle">
      <div className="feedback-cycle-content" ref={contentRef}>
        {children}
        <ImplementArrow />
      </div>
      <aside className="feedback-cycle-aside">
        <CycleWheel active={active} />
      </aside>
    </div>
  );
}

interface FeedbackStepProps {
  step: StepName;
  children: ReactNode;
}

export function FeedbackStep({ step, children }: FeedbackStepProps) {
  const index = STEPS.findIndex((s) => s.name === step);
  return (
    <section
      className={`feedback-step feedback-step--${step}`}
      data-feedback-step={step}
    >
      {/* The number sits outside the h3 so the page index lists just the name */}
      <header
        className="feedback-step-header"
        data-feedback-arrow-to={step === "implement" ? "" : undefined}
      >
        <span className="feedback-step-number" aria-hidden="true">
          {index + 1}
        </span>
        <h3 className="feedback-step-title">{STEPS[index].label}</h3>
      </header>
      {children}
    </section>
  );
}

/* ---------- Analyse outcomes ---------- */

type OutcomeKind = "active" | "passive" | "none";

interface FeedbackOutcomeProps {
  kind: OutcomeKind;
  title: string;
  children: ReactNode;
}

export function FeedbackOutcome({
  kind,
  title,
  children,
}: FeedbackOutcomeProps) {
  return (
    <article
      className={`feedback-outcome feedback-outcome--${kind}`}
      data-feedback-arrow-from={kind === "active" ? "" : undefined}
    >
      <h4 className="feedback-outcome-title">{title}</h4>
      <div className="feedback-outcome-body">{children}</div>
    </article>
  );
}

export function FeedbackOutcomes({ children }: { children: ReactNode }) {
  return <div className="feedback-outcomes">{children}</div>;
}

/* ---------- Arrow: active implementation → Implement ---------- */

interface ArrowGeometry {
  d: string;
  width: number;
  height: number;
}

// Measures against its own parent (the content column) rather than a ref
// passed down: the parent's ref isn't attached yet when this child's layout
// effect first runs.
function ImplementArrow() {
  const [geometry, setGeometry] = useState<ArrowGeometry | null>(null);
  const [progress, setProgress] = useState(0);
  const markerId = `feedback-arrow-${useId().replace(/:/g, "")}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const measure = useCallback(() => {
    const container = svgRef.current?.parentElement;
    const from = container?.querySelector<HTMLElement>(
      "[data-feedback-arrow-from]",
    );
    const to = container?.querySelector<HTMLElement>(
      "[data-feedback-arrow-to] .feedback-step-number",
    );
    if (!container || !from || !to) {
      setGeometry(null);
      return;
    }
    const box = container.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const x1 = a.left + a.width / 2 - box.left;
    const y1 = a.bottom - box.top + 6;
    const x2 = b.left + b.width / 2 - box.left;
    const y2 = b.top - box.top - 10;
    const bend = Math.max(30, (y2 - y1) * 0.55);
    setGeometry({
      d: `M ${x1} ${y1} C ${x1} ${y1 + bend}, ${x2} ${y2 - bend}, ${x2} ${y2}`,
      width: box.width,
      height: box.height,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Draw the line as the reader scrolls from the outcome card down to the
  // Implement heading.
  useEffect(() => {
    if (!geometry) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const path = pathRef.current;
      if (!path) return;
      const rect = path.getBoundingClientRect();
      const line = window.innerHeight * 0.7;
      const span = Math.max(1, rect.height);
      setProgress(Math.min(1, Math.max(0, (line - rect.top) / span)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [geometry]);

  return (
    <svg
      ref={svgRef}
      className="feedback-implement-arrow"
      width={geometry?.width ?? 0}
      height={geometry?.height ?? 0}
      viewBox={
        geometry ? `0 0 ${geometry.width} ${geometry.height}` : undefined
      }
      aria-hidden="true"
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10z" className="feedback-implement-arrowhead" />
        </marker>
      </defs>
      {geometry && (
        <path
          ref={pathRef}
          d={geometry.d}
          pathLength={1}
          className="feedback-implement-arrow-line"
          style={{ strokeDashoffset: 1 - progress }}
          markerEnd={progress > 0.97 ? `url(#${markerId})` : undefined}
        />
      )}
    </svg>
  );
}

/* ---------- File download card ---------- */

interface ResourceDownloadProps {
  href: string;
  title: string;
  /** File type shown on the badge, e.g. "PDF" or "XLSX". */
  type: string;
  children?: ReactNode;
}

export function ResourceDownload({
  href,
  title,
  type,
  children,
}: ResourceDownloadProps) {
  return (
    <a
      className="resource-download"
      href={href}
      target="_blank"
      rel="noreferrer"
      download
    >
      <span className="resource-download-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M12 11v6M9 14.5l3 3 3-3" />
        </svg>
      </span>
      <span className="resource-download-text">
        <span className="resource-download-title">{title}</span>
        {children && (
          <span className="resource-download-description">{children}</span>
        )}
      </span>
      <span className="resource-download-type">{type}</span>
    </a>
  );
}
