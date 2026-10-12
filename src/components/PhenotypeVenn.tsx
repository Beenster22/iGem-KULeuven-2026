// Generated with Claude Opus 5.5 (Anthropic), 2026-10-12
// Purpose: interactive version of the team's phenotype figure for the project
// description page — three overlapping circles (hyperandrogenism,
// oligo-anovulation, polycystic ovarian morphology) whose overlaps are the
// phenotypes A-D, next to the list of phenotypes and of the criteria sets
// that recognise them. Pointing at or choosing an overlap lights up its row,
// its circles and the criteria sets that include it; choosing a row does the
// same the other way round, and a criteria set lights up all its phenotypes.
// All wording and the phenotype/criteria assignments are copied from the
// team's figure.
import { useState } from "react";

type FeatureId = "HA" | "OA" | "PCOM";
type PhenotypeId = "A" | "B" | "C" | "D";

interface Circle {
  id: FeatureId;
  cx: number;
  cy: number;
  // Label lines and where their block is centred, in the part of the circle
  // no other circle covers.
  lines: string[];
  labelX: number;
  labelY: number;
}

const VB_W = 520;
const VB_H = 470;
const R = 140;

const CIRCLES: Circle[] = [
  {
    id: "HA",
    cx: 175,
    cy: 160,
    lines: ["HYPERANDROGENISM"],
    labelX: 122,
    labelY: 128,
  },
  {
    id: "OA",
    cx: 345,
    cy: 160,
    lines: ["OLIGO-ANOVULATION"],
    labelX: 398,
    labelY: 128,
  },
  {
    id: "PCOM",
    cx: 260,
    cy: 307,
    lines: ["POLYCYSTIC", "OVARIAN", "MORPHOLOGY"],
    labelX: 260,
    labelY: 362,
  },
];

const PHENOTYPES: { id: PhenotypeId; features: FeatureId[]; type: string }[] = [
  { id: "A", features: ["HA", "OA", "PCOM"], type: "Classic" },
  { id: "B", features: ["HA", "OA"], type: "Classic" },
  { id: "C", features: ["HA", "PCOM"], type: "Ovulatory" },
  { id: "D", features: ["OA", "PCOM"], type: "Non-hyperandrogenic" },
];

const CRITERIA: { name: string; phenotypes: PhenotypeId[] }[] = [
  { name: "NIH 1990", phenotypes: ["A", "B"] },
  { name: "Rotterdam 2003", phenotypes: ["A", "B", "C", "D"] },
  { name: "AE-PCOS 2006", phenotypes: ["A", "B", "C"] },
];

type Point = [number, number];

// The two points where circles i and j cross: first the one inside the third
// circle (a corner of the middle region), then the one outside it.
function crossings(i: number, j: number): { inner: Point; outer: Point } {
  const a = CIRCLES[i];
  const b = CIRCLES[j];
  const third = CIRCLES[3 - i - j];
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const d = Math.hypot(dx, dy);
  const h = Math.sqrt(R * R - (d / 2) * (d / 2));
  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2;
  const p: Point = [mx + (h * dy) / d, my - (h * dx) / d];
  const q: Point = [mx - (h * dy) / d, my + (h * dx) / d];
  const pInside = Math.hypot(p[0] - third.cx, p[1] - third.cy) < R;
  return pInside ? { inner: p, outer: q } : { inner: q, outer: p };
}

// A closed outline made of short arcs: each corner is followed by the index
// of the circle whose edge leads on to the next corner.
function outline(corners: [Point, number][]) {
  const fmt = (p: Point) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const arcs = corners.map(([from, circle], k) => {
    const to = corners[(k + 1) % corners.length][0];
    const { cx, cy } = CIRCLES[circle];
    const cross = (from[0] - cx) * (to[1] - cy) - (from[1] - cy) * (to[0] - cx);
    return `A${R},${R} 0 0 ${cross > 0 ? 1 : 0} ${fmt(to)}`;
  });
  return `M${fmt(corners[0][0])} ${arcs.join(" ")} Z`;
}

const HA_OA = crossings(0, 1);
const HA_PCOM = crossings(0, 2);
const OA_PCOM = crossings(1, 2);

const mix = (outer: Point, a: Point, b: Point): Point => [
  outer[0] * 0.5 + (a[0] + b[0]) * 0.25,
  outer[1] * 0.5 + (a[1] + b[1]) * 0.25,
];

// Outline of each phenotype's overlap and where its letter goes.
const REGIONS: Record<PhenotypeId, { d: string; letter: Point }> = {
  A: {
    d: outline([
      [HA_OA.inner, 0],
      [HA_PCOM.inner, 2],
      [OA_PCOM.inner, 1],
    ]),
    letter: [
      (HA_OA.inner[0] + HA_PCOM.inner[0] + OA_PCOM.inner[0]) / 3,
      (HA_OA.inner[1] + HA_PCOM.inner[1] + OA_PCOM.inner[1]) / 3,
    ],
  },
  B: {
    d: outline([
      [HA_OA.outer, 0],
      [HA_PCOM.inner, 2],
      [OA_PCOM.inner, 1],
    ]),
    letter: mix(HA_OA.outer, HA_PCOM.inner, OA_PCOM.inner),
  },
  C: {
    d: outline([
      [HA_PCOM.outer, 0],
      [HA_OA.inner, 1],
      [OA_PCOM.inner, 2],
    ]),
    letter: mix(HA_PCOM.outer, HA_OA.inner, OA_PCOM.inner),
  },
  D: {
    d: outline([
      [OA_PCOM.outer, 1],
      [HA_OA.inner, 0],
      [HA_PCOM.inner, 2],
    ]),
    letter: mix(OA_PCOM.outer, HA_OA.inner, HA_PCOM.inner),
  },
};

type Choice =
  | { kind: "phenotype"; id: PhenotypeId }
  | { kind: "criteria"; name: string };

const sameChoice = (a: Choice | null, b: Choice) =>
  a !== null &&
  ((a.kind === "phenotype" && b.kind === "phenotype" && a.id === b.id) ||
    (a.kind === "criteria" && b.kind === "criteria" && a.name === b.name));

const LABEL_LINE = 17;

export function PhenotypeVenn() {
  // What was chosen stays lit; pointing at something else shows that instead
  // for as long as the pointer is on it.
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [pointed, setPointed] = useState<Choice | null>(null);
  const active = pointed ?? chosen;

  const litPhenotypes = new Set<PhenotypeId>(
    active === null
      ? []
      : active.kind === "phenotype"
        ? [active.id]
        : (CRITERIA.find((c) => c.name === active.name)?.phenotypes ?? []),
  );
  const litFeatures = new Set<FeatureId>(
    PHENOTYPES.filter((p) => litPhenotypes.has(p.id)).flatMap(
      (p) => p.features,
    ),
  );
  const litCriteria = new Set<string>(
    active === null
      ? []
      : active.kind === "criteria"
        ? [active.name]
        : CRITERIA.filter((c) => c.phenotypes.includes(active.id)).map(
            (c) => c.name,
          ),
  );

  const toggle = (choice: Choice) =>
    setChosen((current) => (sameChoice(current, choice) ? null : choice));
  const point = (choice: Choice) => ({
    onPointerEnter: () => setPointed(choice),
    onPointerLeave: () => setPointed(null),
  });
  const lit = (on: boolean) => (on ? " is-lit" : "");

  return (
    <div className="phenotype-venn-frame">
      <div className={`phenotype-venn${active ? " has-active" : ""}`}>
        {/* The buttons beside it carry the same choices for keyboard and screen
          reader users, so the drawing itself is one image. */}
        <svg
          className="phenotype-venn-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-label="Venn diagram of hyperandrogenism (HA), oligo-anovulation (OA) and polycystic ovarian morphology (PCOM). Phenotype A is where all three overlap, B is HA with OA, C is HA with PCOM and D is OA with PCOM."
        >
          {CIRCLES.map((circle) => (
            <circle
              key={circle.id}
              className={`phenotype-venn-circle${lit(litFeatures.has(circle.id))}`}
              cx={circle.cx}
              cy={circle.cy}
              r={R}
            />
          ))}
          {CIRCLES.map((circle) => (
            <text
              key={circle.id}
              className={`phenotype-venn-label${lit(litFeatures.has(circle.id))}`}
              x={circle.labelX}
              y={circle.labelY}
            >
              {circle.lines.map((line, k) => (
                <tspan
                  key={line}
                  x={circle.labelX}
                  dy={k === 0 ? 0 : LABEL_LINE}
                >
                  {line}
                </tspan>
              ))}
              <tspan
                className="phenotype-venn-label-short"
                x={circle.labelX}
                dy={LABEL_LINE * 2}
              >
                ({circle.id})
              </tspan>
            </text>
          ))}

          {PHENOTYPES.map(({ id }) => (
            <path
              key={id}
              className="phenotype-venn-region"
              d={REGIONS[id].d}
              onClick={() => toggle({ kind: "phenotype", id })}
              {...point({ kind: "phenotype", id })}
            />
          ))}
          {/* The lit copy of each overlap, drawn above all of them so a raised
            one is never tucked under its neighbour. */}
          {PHENOTYPES.map(({ id }) => (
            <path
              key={id}
              className={`phenotype-venn-raised${lit(litPhenotypes.has(id))}`}
              d={REGIONS[id].d}
            />
          ))}
          {PHENOTYPES.map(({ id }) => (
            <text
              key={id}
              className={`phenotype-venn-letter${lit(litPhenotypes.has(id))}`}
              x={REGIONS[id].letter[0]}
              y={REGIONS[id].letter[1]}
            >
              {id}
            </text>
          ))}
        </svg>

        <div className="phenotype-venn-panel">
          <div>
            <p className="phenotype-venn-panel-title">Phenotype</p>
            <ul className="phenotype-venn-list">
              {PHENOTYPES.map(({ id, features, type }) => {
                const choice: Choice = { kind: "phenotype", id };
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`phenotype-venn-row${lit(litPhenotypes.has(id))}`}
                      aria-pressed={sameChoice(chosen, choice)}
                      onClick={() => toggle(choice)}
                      onFocus={() => setPointed(choice)}
                      onBlur={() => setPointed(null)}
                      {...point(choice)}
                    >
                      <span className="phenotype-venn-row-letter">{id}</span>
                      <span className="phenotype-venn-row-features">
                        {features.join(" + ")}
                      </span>
                      <span className="phenotype-venn-row-type">{type}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="phenotype-venn-panel-title">Recognized by</p>
            <ul className="phenotype-venn-list">
              {CRITERIA.map(({ name, phenotypes }) => {
                const choice: Choice = { kind: "criteria", name };
                return (
                  <li key={name}>
                    <button
                      type="button"
                      className={`phenotype-venn-row phenotype-venn-row--criteria${lit(litCriteria.has(name))}`}
                      aria-pressed={sameChoice(chosen, choice)}
                      onClick={() => toggle(choice)}
                      onFocus={() => setPointed(choice)}
                      onBlur={() => setPointed(null)}
                      {...point(choice)}
                    >
                      <span className="phenotype-venn-row-name">{name}</span>
                      <span className="phenotype-venn-row-phenotypes">
                        {phenotypes.join(", ")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
