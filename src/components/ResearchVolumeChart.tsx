// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21
// Purpose: Figures 1 and 2 of the Legislators & Advocates section on the
// Human Practices page — grouped bars of PubMed papers on PMOS and SLE per
// country, redrawn in the site's colours from the team's spreadsheet (see
// data/pmosSlePubmed.ts) instead of the Excel export. `includeUs` adds the
// United States as the last group (Figure 1); without it the chart is
// Europe only (Figure 2). Hovering a country shows its two counts.
import { EUROPE_PAPER_COUNTS, US_PAPER_COUNT } from "./data/pmosSlePubmed";

interface ResearchVolumeChartProps {
  includeUs?: boolean;
}

const WIDTH = 900;
const HEIGHT = 460;
const MARGIN = { top: 16, right: 8, bottom: 148, left: 64 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

// A round tick step giving about five gridlines: 1, 2, 2.5 or 5 × 10^k.
function tickStep(max: number) {
  const raw = max / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / magnitude;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * magnitude;
}

export function ResearchVolumeChart({ includeUs = false }: ResearchVolumeChartProps) {
  const rows = includeUs ? [...EUROPE_PAPER_COUNTS, US_PAPER_COUNT] : EUROPE_PAPER_COUNTS;
  const dataMax = Math.max(...rows.map((row) => Math.max(row.pmos, row.sle)));
  const step = tickStep(dataMax);
  const yMax = Math.ceil(dataMax / step) * step;
  const ticks = Array.from({ length: yMax / step + 1 }, (_, i) => i * step);

  const groupW = PLOT_W / rows.length;
  const barW = groupW * 0.34;
  const y = (value: number) => MARGIN.top + PLOT_H - (value / yMax) * PLOT_H;
  const label = includeUs ? "Europe and the United States" : "Europe";

  return (
    <div className="research-volume">
      <div className="research-volume-legend" aria-hidden="true">
        <span className="research-volume-key research-volume-key--pmos">PMOS</span>
        <span className="research-volume-key research-volume-key--sle">SLE</span>
      </div>
      <div className="research-volume-scroll">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Bar chart of PubMed papers on PMOS and SLE per country across ${label}.`}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line className="research-volume-grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} />
              <text className="research-volume-tick" x={MARGIN.left - 8} y={y(tick)} dy="0.32em" textAnchor="end">
                {tick.toLocaleString("en-US")}
              </text>
            </g>
          ))}

          <text
            className="research-volume-axis-title"
            transform={`translate(16 ${MARGIN.top + PLOT_H / 2}) rotate(-90)`}
            textAnchor="middle"
          >
            Research papers
          </text>

          {rows.map((row, i) => {
            const x0 = MARGIN.left + i * groupW;
            const mid = x0 + groupW / 2;
            return (
              <g key={row.country} className="research-volume-group">
                <title>{`${row.country}: ${row.pmos.toLocaleString("en-US")} PMOS, ${row.sle.toLocaleString("en-US")} SLE papers`}</title>
                <rect className="research-volume-hover" x={x0} y={MARGIN.top} width={groupW} height={PLOT_H} />
                <rect className="research-volume-bar research-volume-bar--pmos" x={mid - barW} y={y(row.pmos)} width={barW} height={y(0) - y(row.pmos)} rx={1.5} />
                <rect className="research-volume-bar research-volume-bar--sle" x={mid} y={y(row.sle)} width={barW} height={y(0) - y(row.sle)} rx={1.5} />
                <text className="research-volume-country" transform={`translate(${mid + 3} ${y(0) + 10}) rotate(-60)`} textAnchor="end">
                  {row.country}
                </text>
              </g>
            );
          })}

          <line className="research-volume-baseline" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(0)} y2={y(0)} />
        </svg>
      </div>
    </div>
  );
}
