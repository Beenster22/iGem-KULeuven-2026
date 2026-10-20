// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request)
// Purpose: the brand identity checklist on the Contribution page — a table of
// items whose "Done?" box fills with a tick when the reader clicks the row,
// with a "Clear" button underneath that empties every box again. The ticks
// live only in the page while it is open (nothing is stored), because the list
// is a template for a reader's own team rather than our own progress.
import { useState } from "react";

interface ChecklistProps {
  items: string[];
}

export function Checklist({ items }: ChecklistProps) {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  const anyDone = done.some(Boolean);

  const toggle = (index: number) =>
    setDone((current) => current.map((value, i) => (i === index ? !value : value)));

  return (
    <>
      <div className="table-responsive table-responsive-rounded table-compact table-cols-even table-head-purple my-3">
        <table className="table table-bordered align-middle checklist-table">
          <colgroup>
            <col style={{ width: "86%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Item</th>
              <th>Done?</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item}
                className={done[index] ? "checklist-row checklist-row--done" : "checklist-row"}
                onClick={() => toggle(index)}
              >
                <td>{item}</td>
                <td>
                  <button
                    type="button"
                    className="checklist-box"
                    role="checkbox"
                    aria-checked={done[index]}
                    aria-label={item}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggle(index);
                    }}
                  >
                    {done[index] ? "✓" : ""}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="btn-empower checklist-clear"
        disabled={!anyDone}
        onClick={() => setDone(items.map(() => false))}
      >
        Clear
      </button>
    </>
  );
}
