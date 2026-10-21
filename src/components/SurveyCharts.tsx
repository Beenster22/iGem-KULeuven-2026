// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-21
// Purpose: Figures 1 and 2 of the Public section on the Human Practices page
// (the public LBP / GMO survey, N = 176), redrawn in the site's colours
// instead of as exported PNGs so they follow light/dark mode and show the
// numbers on hover. Figure 1 (SurveyAttitudesChart) is built from the raw
// answer counts per statement; Figure 2 (SurveyWillingnessChart) from the
// per-group percentages printed on the team's original chart, so its bar
// heights are those rounded percentages.

const N = 176;

interface Attitude {
  label: string;
  // Strongly disagree, disagree, neutral, agree, strongly agree.
  counts: [number, number, number, number, number];
}

const ATTITUDES: Attitude[] = [
  { label: "Would consider an LBP if it could effectively treat my disease", counts: [1, 2, 21, 91, 61] },
  { label: "Would accept treatment with a live genetically modified bacterium", counts: [0, 2, 41, 97, 36] },
  { label: "Trust LBPs are tested as safely as conventional medicines", counts: [0, 1, 39, 89, 47] },
  { label: "Potential benefit outweighs my concerns", counts: [0, 9, 62, 80, 25] },
  { label: "Would only consider LBPs if conventional methods did not work", counts: [3, 29, 67, 55, 21] },
  { label: "Concerned about long-term effects of LBPs on my body", counts: [2, 31, 69, 67, 7] },
  { label: "Trust doctors, scientists and health authorities", counts: [0, 3, 20, 106, 47] },
];

const LEVELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

const pct = (count: number) => Math.round((count / N) * 100);

export function SurveyAttitudesChart() {
  return (
    <div className="survey-chart">
      <div className="survey-chart-legend" aria-hidden="true">
        {LEVELS.map((name, i) => (
          <span key={name} className={`survey-key survey-key--lv${i}`}>
            {name}
          </span>
        ))}
      </div>
      <ul className="survey-stack-list" aria-label="Attitudes toward LBP therapy (N = 176)">
        {ATTITUDES.map(({ label, counts }) => {
          const detail = counts.map((c, i) => `${LEVELS[i]}: ${c} (${pct(c)}%)`).join(" · ");
          return (
            <li key={label} className="survey-stack-row">
              <span className="survey-stack-label">{label}</span>
              <span className="survey-stack-bar">
                {counts.map((count, i) =>
                  count === 0 ? null : (
                    <span
                      key={LEVELS[i]}
                      className={`survey-stack-seg survey-stack-seg--lv${i}`}
                      style={{ flexGrow: count }}
                      tabIndex={0}
                      data-tip={`${LEVELS[i]}: ${count} of ${N} (${pct(count)}%)\n${detail}`}
                      aria-label={`${label}. ${LEVELS[i]}: ${count} of ${N} (${pct(count)}%). ${detail}`}
                    >
                      {pct(count) >= 4 ? `${pct(count)}%` : ""}
                    </span>
                  ),
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface WillingnessPanel {
  title: string;
  groups: [string, string];
  stats: string;
  // Percent of each group giving each answer, strongly disagree → strongly agree.
  values: [number[], number[]];
}

const PANELS: WillingnessPanel[] = [
  {
    title: "A. Biological or medical training",
    groups: ["Other background (n = 90)", "Biological/medical background (n = 86)"],
    stats: "χ² = 6.05, p = 0.014 (significant)",
    values: [[0, 1, 31, 54, 13], [0, 1, 15, 56, 28]],
  },
  {
    title: "B. Connection to a chronic condition",
    groups: ["No chronic condition (n = 69)", "Chronic condition (self or someone close) (n = 103)"],
    stats: "χ² = 0.61, p = 0.436 (not significant)",
    values: [[0, 0, 28, 52, 20], [0, 1, 21, 57, 20]],
  },
  {
    title: "C. Concern about the long-term effects of LBPs",
    groups: ["Concerned about long-term effects (n = 74)", "Not concerned or neutral (n = 102)"],
    stats: "χ² = 7.92, p = 0.005 (significant)",
    values: [[0, 3, 32, 50, 15], [0, 0, 17, 59, 25]],
  },
  {
    title: "D. Trust in doctors, scientists and health authorities",
    groups: ["Neutral or does not trust (n = 23)", "Trusts them (n = 153)"],
    stats: "χ² = 5.20, p = 0.023 (significant)",
    values: [[0, 0, 43, 35, 22], [0, 1, 20, 58, 20]],
  },
];

const W = 440;
const H = 270;
const M = { top: 10, right: 8, bottom: 46, left: 44 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;
const Y_MAX = 70;
const TICKS = [0, 20, 40, 60];
const CATEGORIES = [["Strongly", "disagree"], ["Disagree"], ["Neutral"], ["Agree"], ["Strongly", "agree"]];

function Panel({ title, groups, stats, values }: WillingnessPanel) {
  const y = (v: number) => M.top + PLOT_H - (v / Y_MAX) * PLOT_H;
  const groupW = PLOT_W / 5;
  const barW = groupW * 0.34;
  return (
    <figure className="survey-panel">
      <figcaption className="survey-panel-head">
        <strong>{title}</strong>
        <span className="survey-panel-groups" aria-hidden="true">
          <span className="survey-key survey-key--a">{groups[0]}</span>
          <span className="survey-key survey-key--b">{groups[1]}</span>
        </span>
        <em>{stats}</em>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}. ${stats}.`}>
        {TICKS.map((t) => (
          <g key={t}>
            <line className="survey-grid" x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} />
            <text className="survey-tick" x={M.left - 6} y={y(t)} dy="0.32em" textAnchor="end">
              {t}%
            </text>
          </g>
        ))}
        <text className="survey-axis-title" transform={`translate(11 ${M.top + PLOT_H / 2}) rotate(-90)`} textAnchor="middle">
          Percentage of respondents
        </text>
        {CATEGORIES.map((lines, i) => {
          const mid = M.left + i * groupW + groupW / 2;
          return (
            <g key={lines.join(" ")} className="survey-group">
              <rect className="survey-hover" x={mid - groupW / 2} y={M.top} width={groupW} height={PLOT_H} />
              {[0, 1].map((g) => {
                const v = values[g][i];
                const x = g === 0 ? mid - barW - 1 : mid + 1;
                return (
                  <g key={g}>
                    <rect className={`survey-bar survey-bar--${g === 0 ? "a" : "b"}`} x={x} y={y(v)} width={barW} height={y(0) - y(v)} rx={1.5}>
                      <title>{`${groups[g]}: ${v}% answered "${CATEGORIES[i].join(" ").toLowerCase()}"`}</title>
                    </rect>
                    {v > 0 && (
                      <text className="survey-value" x={x + barW / 2} y={y(v) - 4} textAnchor="middle">
                        {v}
                      </text>
                    )}
                  </g>
                );
              })}
              <text className="survey-tick survey-category" x={mid} y={y(0) + 15} textAnchor="middle">
                {lines.map((line, li) => (
                  <tspan key={line} x={mid} dy={li === 0 ? 0 : "1.15em"}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        <line className="survey-baseline" x1={M.left} x2={W - M.right} y1={y(0)} y2={y(0)} />
      </svg>
    </figure>
  );
}

export function SurveyWillingnessChart() {
  return (
    <div className="survey-chart survey-panels">
      {PANELS.map((panel) => (
        <Panel key={panel.title} {...panel} />
      ))}
    </div>
  );
}
