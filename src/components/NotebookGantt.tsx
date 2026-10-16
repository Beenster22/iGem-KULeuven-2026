// Generated with Claude Opus 5.5 (Anthropic), 2026-10-15
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-15: bars are now all solid
// and the status legend is gone; status stays in each row's tooltip.
// Purpose: the timeline at the top of each opened notebook — one row per
// entry, a bar from its start to its end date. The rows
// are read by NotebookDropdown from each entry's own <NotebookEntryMeta>
// (dates + status), so nothing in notebook.mdx has to be written twice and the
// timeline cannot drift from the entries. Clicking a row opens that entry and
// scrolls to it.
//
// Dates are taken as written in the notebooks ("2026-07-08 to 2026-07-24",
// "2026-08-11", or "to 2026-07-17" when the start was not recorded). An entry
// with an unrecorded start is drawn from the left edge of the chart rather
// than given a start date it never had.

const DAY = 24 * 60 * 60 * 1000;
const ISO = /\d{4}-\d{2}-\d{2}/g;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface GanttEntry {
  // Short code shown as the row label, e.g. "STR-01".
  code: string;
  // Full section title, for the tooltip and screen readers.
  title: string;
  dates: string;
  status: string;
  // id of the entry's <NotebookSection>, so the row can open it.
  targetId: string;
}

// UTC throughout, so a visitor's timezone never shifts a bar by a day.
function parseDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function formatDay(t: number) {
  const d = new Date(t);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

interface ParsedRow extends GanttEntry {
  // Inclusive first day; undefined when the notebook does not record it.
  start?: number;
  // Exclusive end (the day after the last day), so a one-day entry has width.
  end: number;
}

function parseRows(entries: GanttEntry[]): ParsedRow[] {
  return entries.flatMap((entry) => {
    const days = entry.dates.match(ISO)?.map(parseDay) ?? [];
    if (days.length === 0) return [];
    const openStart = /^\s*to\b/i.test(entry.dates);
    const last = days[days.length - 1];
    return [
      {
        ...entry,
        start: openStart ? undefined : days[0],
        end: last + DAY,
      },
    ];
  });
}

// Opens a <NotebookSection> by id (it listens for this event) and brings it
// into view once it has rendered its content.
export const OPEN_SECTION_EVENT = "notebook-section-open";

function openSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.dispatchEvent(new Event(OPEN_SECTION_EVENT));
  requestAnimationFrame(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
}

export function NotebookGantt({ entries }: { entries: GanttEntry[] }) {
  const rows = parseRows(entries);
  if (rows.length === 0) return null;

  // The axis runs Monday to Monday around everything recorded, so the
  // gridlines fall on week boundaries.
  const firstDay = Math.min(...rows.map((r) => r.start ?? r.end - DAY));
  const lastEnd = Math.max(...rows.map((r) => r.end));
  const weekday = (new Date(firstDay).getUTCDay() + 6) % 7; // Monday = 0
  const axisStart = firstDay - weekday * DAY;
  const weeks = Math.max(1, Math.ceil((lastEnd - axisStart) / (7 * DAY)));
  const axisEnd = axisStart + weeks * 7 * DAY;
  const span = axisEnd - axisStart;
  const pct = (t: number) => `${((t - axisStart) / span) * 100}%`;

  const ticks = Array.from({ length: weeks }, (_, i) => axisStart + i * 7 * DAY);

  return (
    <figure className="notebook-gantt">
      <figcaption className="notebook-gantt-caption">
        Timeline · {formatDay(firstDay)} – {formatDay(lastEnd - DAY)}{" "}
        {new Date(lastEnd - DAY).getUTCFullYear()}
      </figcaption>

      <div className="notebook-gantt-axis" aria-hidden="true">
        <span />
        <div className="notebook-gantt-track">
          {ticks.map((t, i) => (
            <span
              key={t}
              className={`notebook-gantt-tick${weeks > 6 && i % 2 ? " minor" : ""}`}
              style={{ left: pct(t) }}
            >
              {formatDay(t)}
            </span>
          ))}
        </div>
      </div>

      <ol className="notebook-gantt-rows">
        {rows.map((row) => {
          const left = row.start ?? axisStart;
          return (
            <li key={row.targetId}>
              <button
                type="button"
                className="notebook-gantt-row"
                title={`${row.title}\n${row.dates}\n${row.status}`}
                aria-label={`${row.title}. ${row.dates}. Status: ${row.status}. Open entry.`}
                onClick={() => openSection(row.targetId)}
              >
                <span className="notebook-gantt-code">{row.code}</span>
                <span
                  className="notebook-gantt-track"
                  style={{ backgroundSize: `${100 / weeks}% 100%` }}
                >
                  <span
                    className="notebook-gantt-bar"
                    style={{ left: pct(left), width: pct(axisStart + row.end - left) }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

    </figure>
  );
}
