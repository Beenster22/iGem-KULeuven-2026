// Generated with Claude Sonnet 5 (Anthropic), 2026-09-01
// Purpose: interactive MIC (minimum inhibitory concentration) chart with a
// toggle between the two cutoffs used to call an MIC value, rendered from
// data/layout JSON exported from the team's R/plotly analysis.
import { useEffect, useRef, useState } from "react";
import type { Config, Data, Layout } from "plotly.js";
import mic90 from "./data/mic-90.json";
import mic85 from "./data/mic-85.json";

type Threshold = "90" | "85";

interface MicDataset {
  data: Data[];
  layout: Partial<Layout>;
}

const DATASETS: Record<Threshold, MicDataset> = {
  "90": mic90 as unknown as MicDataset,
  "85": mic85 as unknown as MicDataset,
};

const CONFIG: Partial<Config> = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ["sendDataToCloud"],
};

// Below this container width the side legend and tick labels from the R
// export start overlapping the (narrow) plot area, so the legend moves
// below the chart and text shrinks instead.
const NARROW_BREAKPOINT = 480;

// Loaded dynamically so the ~1MB plotly bundle only downloads on pages that
// actually render this chart, instead of bloating every route's bundle.
export function MicChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotlyRef = useRef<typeof import("plotly.js") | null>(null);
  const [threshold, setThreshold] = useState<Threshold>("90");
  const [ready, setReady] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("plotly.js-basic-dist-min").then((mod) => {
      if (cancelled) return;
      // The UMD bundle exposes the Plotly object either as the module's
      // default export or as the module namespace itself, depending on how
      // the bundler resolves CJS interop — cover both.
      const resolved = (mod as { default?: unknown }).default ?? mod;
      plotlyRef.current = resolved as typeof import("plotly.js");
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    return () => {
      if (el) plotlyRef.current?.purge(el);
    };
  }, []);

  useEffect(() => {
    const Plotly = plotlyRef.current;
    const el = containerRef.current;
    if (!Plotly || !el) return;

    const { data, layout } = DATASETS[threshold];
    // The R export's side legend needs far more width than this content
    // column ever has: at any container width Plotly's automargin reserves
    // whatever space the longest legend label demands, which crushed the
    // plot itself down to a sliver of its container. A legend below the
    // chart has a bounded height instead (it wraps onto more lines rather
    // than eating plot width), so it's used at every width, not just narrow
    // ones — only the font size/margins scale down further below the
    // breakpoint.
    // The trace colors (e.g. a near-black bar fill for DSM1447) were chosen
    // for a light plot background — pin paper/plot background to white
    // rather than following the site's dark mode, so bars and legend swatches
    // stay visible instead of blending into a dark page background.
    const themedLayout: Partial<Layout> = {
      ...layout,
      title: {
        // Plotly titles don't wrap on their own, and the full sentence is
        // too long to fit on one line at any width this column reaches —
        // break it manually instead of letting it overflow. The narrow
        // layout's font/plot are small enough to need a third line too.
        text: narrow
          ? `Minimal Inhibitory Concentration<br>of <i>P. vulgatus</i> DSM1447 and RC1806<br>to different antibiotics, at a cutoff of ${threshold}%`
          : `Minimal Inhibitory Concentration of <i>P. vulgatus</i> DSM1447 and RC1806<br>to different antibiotics, at a cutoff of ${threshold}%`,
        font: { size: narrow ? 13 : 18 },
        x: 0.5,
        xanchor: "center",
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      font: { color: "#33283f" },
      autosize: true,
      margin: narrow
        ? { l: 45, r: 10, t: 105, b: 150 }
        : { l: 60, r: 20, t: 90, b: 110 },
      legend: {
        orientation: "h",
        x: 0.5,
        xanchor: "center",
        y: narrow ? -0.5 : -0.3,
        font: { size: narrow ? 11 : 14 },
      },
      xaxis: { ...layout.xaxis, tickfont: { size: narrow ? 11 : 18 } },
      yaxis: { ...layout.yaxis, tickfont: { size: narrow ? 11 : 18 } },
    };

    void Plotly.react(el, data, themedLayout, CONFIG);
  }, [ready, threshold, narrow]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setNarrow(width > 0 && width < NARROW_BREAKPOINT);
      if (plotlyRef.current) void plotlyRef.current.Plots.resize(el);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div className="mic-chart">
      <div className="segmented-selector-bar mic-chart-toggle" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={threshold === "90"}
          className={`segmented-selector-segment${threshold === "90" ? " active" : ""}`}
          onClick={() => setThreshold("90")}
        >
          90% cutoff
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={threshold === "85"}
          className={`segmented-selector-segment${threshold === "85" ? " active" : ""}`}
          onClick={() => setThreshold("85")}
        >
          85% cutoff
        </button>
      </div>
      <div className="mic-chart-plot" ref={containerRef}>
        {!ready && <div className="mic-chart-loading">Loading chart…</div>}
      </div>
    </div>
  );
}
