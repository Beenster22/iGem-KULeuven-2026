// Generated with Claude Opus 5 (Anthropic), 2026-10-17
// Purpose: Table 1 of BSA-07 — the LC-MS peak areas — with the red/yellow
// highlighting the original workbook used.
//
// Team report (AL): the workbook colours the two log columns, but a plain
// markdown table on the wiki cannot carry that, so the caption described a
// highlighting that was not on the page. The bands are computed from the log
// value in the cell rather than stored per row, so the shading cannot drift
// from the number it sits on. The U/T and U/G columns stay unshaded, as in
// the workbook.
//
// The bands are the ones the caption names:
//   high  log > 0          ratio above 1, more free UDCA than conjugate left
//   mid   -0.8 <= log <= 0 ratio roughly 0.2 to 1, partial conversion
//   none  log < -0.8       little or no conversion
//
// Samples 49 and 50 are left unshaded whatever their logs say, because the
// workbook leaves them so: its conditional formatting covers the plate
// samples (17 to 48) and stops before the two trailing samples, which have no
// recorded well or construct. It matters for sample 49, whose logs (-0.421
// and -0.602) would otherwise land in the middle band on peak areas of 11,
// 29 and 44 — three orders of magnitude below every other row, so that ratio
// is noise rather than partial conversion.
//
// Colour is not the only cue: a shaded cell also carries a left edge and a
// title the screen reader reads out, so the table still says what it means in
// print, in greyscale, and to anyone who cannot separate the two fills.
import { BSA07_LCMS } from "./data/bsa07Lcms";

type Band = "high" | "mid" | "none";

function band(log: number): Band {
  if (log > 0) return "high";
  if (log >= -0.8) return "mid";
  return "none";
}

const BAND_TITLE: Record<Band, string | undefined> = {
  high: "Ratio above 1 (log > 0): more free UDCA than conjugated substrate left",
  mid: "Ratio roughly 0.2 to 1 (log between −0.8 and 0): partial conversion",
  none: undefined,
};

/** Peak areas are reported to one decimal, ratios and logs to three. */
const area = (value: number) => value.toFixed(1);
const ratio = (value: number) => value.toFixed(3);

function Pair({
  value,
  log,
  shaded,
}: {
  value: number;
  log: number;
  shaded: boolean;
}) {
  const tone = shaded ? band(log) : "none";
  return (
    <>
      {/* The ratio itself is left plain, as in the workbook — the band is
          carried by the log column next to it. */}
      <td className="bsr-num">{ratio(value)}</td>
      <td className="bsr-num" data-band={tone} title={BAND_TITLE[tone]}>
        {ratio(log)}
      </td>
    </>
  );
}

export function BileSaltRatioTable() {
  return (
    <div className="bsr">
      <div className="bsr-legend">
        <span className="bsr-legend-item">
          <span className="bsr-swatch" data-band="high" aria-hidden="true" />
          ratio above 1 (log &gt; 0) — more free UDCA than conjugate
        </span>
        <span className="bsr-legend-item">
          <span className="bsr-swatch" data-band="mid" aria-hidden="true" />
          ratio roughly 0.2–1 (log between −0.8 and 0) — partial conversion
        </span>
      </div>

      {/* No scroll box of its own: at ten columns the rules for wide tables
          in a dropdown (see App.css) already shrink it and give it one. */}
      <table className="bsr-table">
        <thead>
          <tr>
            <th scope="col">Sample</th>
            <th scope="col">Well</th>
            <th scope="col">Construct</th>
            <th scope="col">UDCA</th>
            <th scope="col">TUDCA</th>
            <th scope="col">GUDCA</th>
            <th scope="col">U/T</th>
            <th scope="col">log(U/T)</th>
            <th scope="col">U/G</th>
            <th scope="col">log(U/G)</th>
          </tr>
        </thead>
        <tbody>
          {BSA07_LCMS.map((row) => {
            // Samples 49 and 50 came in without a well or construct, and are
            // the two the workbook's formatting does not reach (see above).
            const onPlate = row.construct !== null;
            return (
              <tr key={row.sample}>
                <th scope="row">{row.sample}</th>
                <td>{row.well ?? "—"}</td>
                <td>{row.construct ?? "—"}</td>
                <td className="bsr-num">{area(row.udca)}</td>
                <td className="bsr-num">{area(row.tudca)}</td>
                <td className="bsr-num">{area(row.gudca)}</td>
                <Pair value={row.ut} log={row.logUt} shaded={onPlate} />
                <Pair value={row.ug} log={row.logUg} shaded={onPlate} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
