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
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { SnapSteps } from "./HomeSnapScroll";
import { usePinnedStep } from "./usePinnedStep";

interface StoryStep {
  id: string;
  // Where the sentence sits on the screen (see .story-step--* in App.css).
  position: "left" | "right" | "center" | "low-left" | "high-right";
  art?: "question" | "clock";
  lines: ReactNode[];
}

const STEPS: StoryStep[] = [
  {
    id: "etiology",
    position: "left",
    art: "question",
    lines: [
      <>So many symptoms…</>,
      <>
        …but no known <strong>etiology</strong>
      </>,
    ],
  },
  {
    id: "therapy",
    position: "high-right",
    lines: [
      <>
        There is currently no actual therapeutic solution that tackles{" "}
        <strong>all of the symptoms at once!</strong>
      </>,
    ],
  },
  {
    id: "diagnosis",
    position: "right",
    art: "clock",
    lines: [
      <>
        <strong>Diagnosis takes quite a while</strong> because PMOS manifests
        differently between each patient…
      </>,
    ],
  },
  {
    id: "passion",
    position: "center",
    lines: [
      <>
        With so much passion about women’s health, we knew we needed to{" "}
        <strong>do something about this!</strong>
      </>,
    ],
  },
  {
    id: "quest",
    position: "low-left",
    lines: [
      <>On a quest to find a new solution…</>,
      <>
        …we looked into the <strong>gut microbiome</strong>…
      </>,
    ],
  },
];

// Three question marks of different sizes, each bobbing on its own beat.
function QuestionArt() {
  return (
    <div className="story-art story-art--question" aria-hidden="true">
      <span>?</span>
      <span>?</span>
      <span>?</span>
    </div>
  );
}

// A clock whose second hand ticks round while the minute hand creeps on.
function ClockArt() {
  return (
    <svg
      className="story-art story-art--clock"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <circle className="story-clock-face" cx={50} cy={50} r={44} />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          className="story-clock-mark"
          x1={50}
          y1={i % 3 === 0 ? 10 : 12}
          x2={50}
          y2={17}
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <line
        className="story-clock-hand story-clock-hand--hour"
        x1={50}
        y1={50}
        x2={50}
        y2={30}
      />
      <line
        className="story-clock-hand story-clock-hand--minute"
        x1={50}
        y1={50}
        x2={50}
        y2={20}
      />
      <line
        className="story-clock-hand story-clock-hand--second"
        x1={50}
        y1={56}
        x2={50}
        y2={16}
      />
      <circle className="story-clock-pin" cx={50} cy={50} r={3} />
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

export function StoryScrollSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const step = usePinnedStep(wrapperRef, STEPS.length);

  return (
    <div
      className={`story-scroll${prefersReducedMotion ? " story-scroll--static" : " home-snap-pin"}`}
      ref={wrapperRef}
      style={{ "--snap-steps": STEPS.length } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={STEPS.length} />}
      <div
        className={`story-stage${prefersReducedMotion ? "" : " home-snap-stage"}`}
      >
        {STEPS.map((entry, i) => {
          const state = prefersReducedMotion
            ? "active"
            : i === step
              ? "active"
              : i < step
                ? "past"
                : "future";
          return (
            <div
              key={entry.id}
              className={`story-step story-step--${entry.position} story-step--${state}`}
              // Only the sentence on screen is read out and reachable.
              inert={state !== "active"}
            >
              <p className="story-text">
                {entry.lines.map((line, lineIndex) => (
                  <span
                    key={lineIndex}
                    className="story-line"
                    style={{ "--line": lineIndex } as CSSProperties}
                  >
                    {line}
                  </span>
                ))}
              </p>
              {entry.art === "question" && <QuestionArt />}
              {entry.art === "clock" && <ClockArt />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
