// Generated with Claude Opus 5.5 (Anthropic), 2026-10-07
// Purpose: the BSH homolog x bile salt docking heatmap on the Dry Lab page,
// rebuilt from the team's static plot as an interactive grid — clicking a
// cell shows the docking pose image for that protein-ligand pair underneath.
// Data lives in data/dockingAffinities.ts.
import { useMemo, useState } from "react";
import { BILE_SALTS, DOCKING_AFFINITIES } from "./data/dockingAffinities";

// matplotlib's RdBu, sampled every 0.1 from red (0) to blue (1). The plot
// uses it reversed — blue for the strong (negative) affinities — which is
// what cellColor does below.
const RD_BU: [number, number, number][] = [
  [103, 0, 31],
  [178, 24, 43],
  [214, 96, 77],
  [244, 165, 130],
  [253, 219, 199],
  [247, 247, 247],
  [209, 229, 240],
  [146, 197, 222],
  [67, 147, 195],
  [33, 102, 172],
  [5, 48, 97],
];

function sampleRdBu(position: number): [number, number, number] {
  const clamped = Math.min(Math.max(position, 0), 1);
  const scaled = clamped * (RD_BU.length - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(lower + 1, RD_BU.length - 1);
  const t = scaled - lower;
  return [0, 1, 2].map((channel) =>
    Math.round(
      RD_BU[lower][channel] +
        (RD_BU[upper][channel] - RD_BU[lower][channel]) * t,
    ),
  ) as [number, number, number];
}

// Diverging scale centred on 0, so the same distance either side of zero is
// the same colour intensity — matching the original figure's symmetric bar.
function cellColor(value: number, limit: number) {
  const [r, g, b] = sampleRdBu((limit - value) / (2 * limit));
  // Relative luminance, to keep the number readable on dark blues and reds.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return {
    background: `rgb(${r}, ${g}, ${b})`,
    color: luminance > 0.55 ? "#1b1b1b" : "#ffffff",
  };
}

interface Selection {
  homolog: string;
  salt: string;
  value: number;
}

interface DockingHeatmapProps {
  // Folder the per-pair pose images live in on static.igem.wiki, without a
  // trailing slash. Each image is expected to be named
  // `<homolog>-<bile salt>.<imageExtension>`, e.g. "bgal-taurocholic.png".
  // Leave it out until the images are uploaded — the panel below the grid
  // then says so instead of showing a broken image.
  imageBaseUrl?: string;
  imageExtension?: string;
}

export function DockingHeatmap({
  imageBaseUrl,
  imageExtension = "png",
}: DockingHeatmapProps) {
  const [selected, setSelected] = useState<Selection | null>(null);

  const limit = useMemo(
    () =>
      Math.max(
        ...DOCKING_AFFINITIES.flatMap((row) =>
          row.affinities.map((value) => Math.abs(value)),
        ),
      ),
    [],
  );

  const imageUrl =
    imageBaseUrl && selected
      ? `${imageBaseUrl}/${selected.homolog}-${selected.salt}.${imageExtension}`
      : null;

  return (
    <div className="docking-heatmap">
      <div className="docking-heatmap-scroll">
        <table className="docking-heatmap-grid">
          <caption className="docking-heatmap-caption">
            Binding affinity (kcal/mol); more negative means stronger predicted
            binding. Select a cell to see its docking pose.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="docking-heatmap-corner">
                BSH homolog
              </th>
              {BILE_SALTS.map((salt) => (
                <th scope="col" key={salt} className="docking-heatmap-col-head">
                  <span>{salt}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCKING_AFFINITIES.map((row) => (
              <tr key={row.homolog}>
                <th scope="row" className="docking-heatmap-row-head">
                  {row.homolog}
                </th>
                {row.affinities.map((value, index) => {
                  const salt = BILE_SALTS[index];
                  const isSelected =
                    selected?.homolog === row.homolog &&
                    selected?.salt === salt;
                  return (
                    <td key={salt} className="docking-heatmap-cell-wrap">
                      <button
                        type="button"
                        className={`docking-heatmap-cell${isSelected ? " selected" : ""}`}
                        style={cellColor(value, limit)}
                        aria-pressed={isSelected}
                        aria-label={`${row.homolog} with ${salt}: ${value.toFixed(1)} kcal per mol`}
                        onClick={() =>
                          setSelected(
                            isSelected
                              ? null
                              : { homolog: row.homolog, salt, value },
                          )
                        }
                      >
                        {value.toFixed(1)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="docking-heatmap-legend" aria-hidden="true">
        <span>{(-limit).toFixed(1)}</span>
        <span
          className="docking-heatmap-legend-bar"
          style={{
            backgroundImage: `linear-gradient(to right, ${[
              0, 0.25, 0.5, 0.75, 1,
            ]
              .map((stop) => {
                const [r, g, b] = sampleRdBu(1 - stop);
                return `rgb(${r}, ${g}, ${b})`;
              })
              .join(", ")})`,
          }}
        />
        <span>+{limit.toFixed(1)}</span>
        <span className="docking-heatmap-legend-label">
          Binding affinity (kcal/mol)
        </span>
      </div>

      <div className="docking-heatmap-detail" aria-live="polite">
        {selected ? (
          <>
            <p className="docking-heatmap-detail-head">
              <strong>
                {selected.homolog} &times; {selected.salt}
              </strong>{" "}
              — {selected.value.toFixed(1)} kcal/mol
            </p>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Docking pose of ${selected.homolog} with ${selected.salt}`}
                className="img-fluid rounded"
              />
            ) : (
              <p className="docking-heatmap-detail-placeholder">
                Docking pose image not yet uploaded.
              </p>
            )}
          </>
        ) : (
          <p className="docking-heatmap-detail-placeholder">
            Select a cell above to see the docking pose for that pair.
          </p>
        )}
      </div>
    </div>
  );
}
