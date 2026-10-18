// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
// Purpose: Engineering success page. <DBTLCycles> shows one pill per
// Design-Build-Test-Learn cycle; picking a pill shows that cycle's title,
// a four-arrow wheel and the text of the selected stage beside it. Use in
// .mdx as <DBTLCycles><DBTLCycle label="Cycle 1" title="…"><DBTLStage
// stage="design">…</DBTLStage>…</DBTLCycle></DBTLCycles>.
import { Children, ReactElement, ReactNode, isValidElement, useId, useState } from "react";

type StageName = "design" | "build" | "test" | "learn";

// Each stage is the same curved arrow (the "Rotate Arrow Bottom to Right"
// glyph) turned a quarter further round the wheel's centre, so the four chase
// each other clockwise. `angle` is where the middle of that arrow sits, in
// degrees clockwise from the top; its word is laid along the arrow there.
const STAGES: { name: StageName; label: string; turn: number; angle: number }[] = [
  { name: "design", label: "Design", turn: 0, angle: -49.4 },
  { name: "build", label: "Build", turn: 90, angle: 40.6 },
  { name: "test", label: "Test", turn: 180, angle: 130.6 },
  { name: "learn", label: "Learn", turn: 270, angle: 220.6 },
];

interface DBTLStageProps {
  stage: StageName;
  children?: ReactNode;
}

// Slot only: DBTLCycles reads the props instead of rendering it.
export function DBTLStage({ children }: DBTLStageProps) {
  return <>{children}</>;
}

interface DBTLCycleProps {
  label: string;
  title?: string;
  children?: ReactNode;
}

// Slot only, as above.
export function DBTLCycle({ children }: DBTLCycleProps) {
  return <>{children}</>;
}

const CENTRE_X = 227;
const CENTRE_Y = 285;
const LABEL_RADIUS = 188; // a bit inside the band middle (204) so the word curves slightly more
const LABEL_ARC = 65; // degrees either side of the arrow's middle

// Arc the word is set along, centred on `angle`, clockwise.
function labelArc(angle: number) {
  const at = (a: number) => {
    const rad = (a * Math.PI) / 180;
    return `${CENTRE_X + LABEL_RADIUS * Math.sin(rad)} ${CENTRE_Y - LABEL_RADIUS * Math.cos(rad)}`;
  };
  return `M ${at(angle - LABEL_ARC)} A ${LABEL_RADIUS} ${LABEL_RADIUS} 0 0 1 ${at(angle + LABEL_ARC)}`;
}

// The arrow's curved shaft and its triangular head, as separate subpaths so
// the shaft's end sits under the head's base.
const ARROW_SHAFT =
  "M161.9 54.22C69.75 75.49 0.89 157.61 -0.02 255.99H71.29C72.11 197.31 109.61 147.54 161.89 128.47Z";
const ARROW_HEAD = "M154.62 183.32L255.97 93.6L154.47 -0.02Z";

function Wheel({
  active,
  onPick,
}: {
  active: StageName;
  onPick: (s: StageName) => void;
}) {
  // The wheel turns to bring the picked arrow to the top, the short way round.
  const [spin, setSpin] = useState(49.4);
  const arcId = useId().replace(/:/g, "");

  const pick = (stage: StageName) => {
    const target = -(STAGES.find((s) => s.name === stage)?.angle ?? 0);
    const delta = ((((target - spin) % 360) + 540) % 360) - 180;
    setSpin(spin + delta);
    onPick(stage);
  };

  return (
    <svg viewBox="-60 -2 574 574" className="dbtl-wheel" role="group" aria-label="Design, Build, Test, Learn cycle">
      <g
        className="dbtl-wheel-spinner"
        style={{ transform: `rotate(${spin}deg)`, transformOrigin: `${CENTRE_X}px ${CENTRE_Y}px` }}
      >
        {STAGES.map((s) => {
          const on = s.name === active;
          return (
            <g
              key={s.name}
              className={`dbtl-wheel-stage dbtl-wheel-${s.name}${on ? " active" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={s.label}
              onClick={() => pick(s.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick(s.name);
                }
              }}
            >
              <g className="dbtl-wheel-shape" transform={`rotate(${s.turn} ${CENTRE_X} ${CENTRE_Y})`}>
                <path d={ARROW_SHAFT} className="dbtl-wheel-arrow" />
                <path d={ARROW_HEAD} className="dbtl-wheel-arrow" />
              </g>
              <path id={`${arcId}-${s.name}`} d={labelArc(s.angle)} fill="none" />
              <text className="dbtl-wheel-label" textAnchor="middle" dy="-0.1em">
                <textPath href={`#${arcId}-${s.name}`} startOffset="50%">
                  {s.label}
                </textPath>
              </text>
            </g>
          );
        })}
      </g>
      <text x={CENTRE_X} y={CENTRE_Y} className="dbtl-wheel-centre" textAnchor="middle" dy="0.35em">
        DBTL cycle
      </text>
    </svg>
  );
}

export function DBTLCycles({ children }: { children: ReactNode }) {
  const cycles = Children.toArray(children).filter(
    (c): c is ReactElement<DBTLCycleProps> => isValidElement(c),
  );
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<StageName>("design");
  const cycle = cycles[index];
  if (!cycle) return null;

  const stages = Children.toArray(cycle.props.children).filter(
    (c): c is ReactElement<DBTLStageProps> => isValidElement(c),
  );
  const current = stages.find((s) => s.props.stage === stage);
  const label = STAGES.find((s) => s.name === stage)?.label;

  return (
    <div className="dbtl">
      <div className="dbtl-pills" role="tablist">
        {cycles.map((c, i) => (
          <button
            key={c.props.label}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`dbtl-pill dbtl-pill-${(i % 4) + 1}${i === index ? " active" : ""}`}
            onClick={() => setIndex(i)}
          >
            {c.props.label}
          </button>
        ))}
      </div>
      {cycle.props.title && <h4 className="dbtl-title">{cycle.props.title}</h4>}
      <div className="dbtl-body">
        <Wheel active={stage} onPick={setStage} />
        {/* A fixed-height box that scrolls inside itself (keyed so it starts at the top for each stage), so a stage with many
            figures never pushes the page around or moves the wheel. */}
        <div key={`${index}-${stage}`} className="dbtl-box" tabIndex={0} role="region" aria-label={`${label} stage`}>
          <div className="dbtl-box-label">{label}:</div>
          <div className="dbtl-box-text">{current?.props.children}</div>
        </div>
      </div>
    </div>
  );
}
