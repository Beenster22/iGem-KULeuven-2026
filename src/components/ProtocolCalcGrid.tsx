// Generated with Claude Opus 5 (Anthropic), 2026-10-12
// Purpose: the second shape of interactive table in the protocol documents.
// ProtocolCalculator handles the parameter/value/unit lists; this one handles
// the tables that are a grid of like rows — one salt, dilution step or
// antibiotic per row — where every row runs the same formula over its own
// values. Each row is independent: a column's `compute` sees only that row.
//
// As with ProtocolCalculator, the formulas are transcribed from each
// protocol's "Calculations" section and should be checked against the
// written protocol.
import { ReactNode, useMemo, useState } from "react";

type RowValues = Record<string, number | string>;

export interface GridColumn {
  key: string;
  label: ReactNode;
  /** "text" is a fixed label cell, "input" is editable, "computed" is derived. */
  type?: "text" | "input" | "computed";
  /** For a computed column: the formula, over this row's own values. */
  compute?: (row: Record<string, number>) => number;
  /** For a computed column whose result is a verdict rather than a number. */
  computeText?: (row: Record<string, number>) => string;
  decimals?: number;
}

interface ProtocolCalcGridProps {
  number: number;
  title: ReactNode;
  columns: GridColumn[];
  rows: RowValues[];
}

function format(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return String(Number(value.toFixed(decimals)));
}

export function ProtocolCalcGrid({
  number,
  title,
  columns,
  rows,
}: ProtocolCalcGridProps) {
  // Keyed "<rowIndex>:<columnKey>" so one row's edit cannot disturb another.
  const [edits, setEdits] = useState<Record<string, string>>({});

  const computed = useMemo(
    () =>
      rows.map((row, rowIndex) => {
        const values: Record<string, number> = {};
        columns.forEach((column) => {
          if (column.type === "computed") return;
          const edit = edits[`${rowIndex}:${column.key}`];
          const parsed =
            edit === undefined ? Number(row[column.key]) : Number.parseFloat(edit);
          if (Number.isFinite(parsed)) values[column.key] = parsed;
        });

        const display: Record<string, string> = {};
        columns.forEach((column) => {
          if (column.compute) {
            const result = column.compute(values);
            values[column.key] = result;
            display[column.key] = format(result, column.decimals);
          } else if (column.computeText) {
            display[column.key] = column.computeText(values);
          }
        });
        return display;
      }),
    [rows, columns, edits],
  );

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="protocol-calc surface">
      <div className="protocol-calc-caption">
        <strong>Table {number}.</strong> {title}{" "}
        <span className="protocol-calc-hint">
          Values in the boxes can be changed; the shaded cells are calculated.
        </span>
      </div>

      <table className="protocol-calc-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => {
                const isComputed = column.type === "computed";
                const editKey = `${rowIndex}:${column.key}`;
                return (
                  <td
                    key={column.key}
                    className={isComputed ? "protocol-calc-derived" : undefined}
                  >
                    {isComputed ? (
                      <output>{computed[rowIndex][column.key]}</output>
                    ) : column.type === "input" ? (
                      <input
                        type="number"
                        className="protocol-calc-input"
                        step="any"
                        value={edits[editKey] ?? String(row[column.key] ?? "")}
                        onChange={(event) =>
                          setEdits((previous) => ({
                            ...previous,
                            [editKey]: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      row[column.key]
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="protocol-calc-footer">
        {hasEdits && (
          <button
            type="button"
            className="btn-empower btn-empower--sm protocol-calc-reset"
            onClick={() => setEdits({})}
          >
            Reset to the values printed in the protocol
          </button>
        )}
      </p>
    </div>
  );
}
