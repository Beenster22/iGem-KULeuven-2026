// Generated with Claude Opus 5 (Anthropic), 2026-10-12
// Purpose: the interactive version of the numbered tables in the wet lab
// protocols. Each protocol document ships tables whose empty cells are meant
// to be worked out in Protocol_Calculators.xlsx; this renders the same table
// on the page with the input cells editable and the empty cells computed
// live, so a visitor can plan a run without opening the workbook.
//
// The formulas come from the "Calculations" section of each protocol
// document — they are transcriptions, not derivations. Check a calculator
// against the workbook tab it names before relying on it at the bench.
import { ReactNode, useMemo, useState } from "react";

export interface CalcRow {
  /** Referenced by other rows' `compute`. Required only if something reads it. */
  key?: string;
  label: string;
  unit?: string;
  /** Starting value for an `input` row, or the fixed value of a constant row. */
  value?: number;
  /** Editable by the visitor. */
  input?: boolean;
  /** Derived cell. Receives the values of every row above it, by key. */
  compute?: (v: Record<string, number>) => number;
  /**
   * Derived cell whose result is a verdict rather than a number — the
   * "volume check" rows that tell you whether a computed volume is still
   * within an allowed maximum.
   */
  computeText?: (v: Record<string, number>) => string;
  /** Decimal places for a computed value. Default 2, trailing zeros trimmed. */
  decimals?: number;
}

interface ProtocolCalculatorProps {
  /** The table number as printed in the protocol, e.g. 2 for "Table 2". */
  number: number;
  /** ReactNode, not string: several captions italicise a species name. */
  title: ReactNode;
  rows: CalcRow[];
  /** Tab name in Protocol_Calculators.xlsx holding the same table. */
  workbookTab?: string;
  /** Column header for the first column. Protocols vary between these. */
  parameterHeader?: string;
}

function format(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  // Trailing zeros read as false precision in a volume table: 500 µL, not
  // 500.00 µL. Kept only where the value genuinely needs them.
  return String(Number(value.toFixed(decimals)));
}

export function ProtocolCalculator({
  number,
  title,
  rows,
  workbookTab,
  parameterHeader = "Parameter",
}: ProtocolCalculatorProps) {
  const [edits, setEdits] = useState<Record<string, string>>({});

  const rowKey = (row: CalcRow, index: number) => row.key ?? `row-${index}`;

  // Rows are evaluated top to bottom so a computed row can read the computed
  // rows above it (several protocols chain one total off another).
  const { values, display } = useMemo(() => {
    const values: Record<string, number> = {};
    const display: Record<string, string> = {};

    rows.forEach((row, index) => {
      const key = rowKey(row, index);
      if (row.compute) {
        const result = row.compute(values);
        values[key] = result;
        display[key] = format(result, row.decimals);
        return;
      }
      if (row.computeText) {
        display[key] = row.computeText(values);
        return;
      }
      const raw = edits[key];
      const parsed = raw === undefined ? row.value : Number.parseFloat(raw);
      if (parsed !== undefined && Number.isFinite(parsed)) values[key] = parsed;
    });

    return { values, display };
  }, [rows, edits]);

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="protocol-calc">
      <div className="protocol-calc-caption">
        <strong>Table {number}.</strong> {title}{" "}
        <span className="protocol-calc-hint">
          Values in the boxes can be changed; the shaded cells are calculated.
        </span>
      </div>

      <table className="protocol-calc-table">
        <thead>
          <tr>
            <th scope="col">{parameterHeader}</th>
            <th scope="col">Value</th>
            <th scope="col">Unit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const key = rowKey(row, index);
            const isComputed = Boolean(row.compute || row.computeText);
            return (
              <tr key={key}>
                <th scope="row">{row.label}</th>
                <td className={isComputed ? "protocol-calc-derived" : undefined}>
                  {isComputed ? (
                    <output>{display[key]}</output>
                  ) : row.input ? (
                    <input
                      type="number"
                      className="protocol-calc-input"
                      value={edits[key] ?? String(row.value ?? "")}
                      step="any"
                      aria-label={`${row.label}${row.unit ? ` in ${row.unit}` : ""}`}
                      onChange={(event) =>
                        setEdits((previous) => ({
                          ...previous,
                          [key]: event.target.value,
                        }))
                      }
                    />
                  ) : (
                    (values[key] ?? "")
                  )}
                </td>
                <td>{row.unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="protocol-calc-footer">
        {hasEdits && (
          <button
            type="button"
            className="protocol-calc-reset"
            onClick={() => setEdits({})}
          >
            Reset to the values printed in the protocol
          </button>
        )}
        {workbookTab && (
          <span className="protocol-calc-workbook">
            Same table in the workbook: tab <strong>“{workbookTab}”</strong> of
            Protocol_Calculators.xlsx.
          </span>
        )}
      </p>
    </div>
  );
}
