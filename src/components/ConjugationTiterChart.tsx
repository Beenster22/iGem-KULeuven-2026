// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-21
// Purpose: interactive version of the conjugation-titer figure (CFU/mL per
// P. vulgatus strain, log axis, ± standard deviation), replacing the static
// image. Data and layout are transcribed from the team's R/plotly export
// ("Conjugation titers.html").
import { useEffect, useRef, useState } from "react";
import type { Config, Data, Layout } from "plotly.js";

const STRAINS = [
  "DSM1447 (first conjugation)",
  "DSM1447",
  "RCC1806",
  "DSM108222",
  "DSM108234",
  "DSM108228",
  "DSM3289",
];
const TITERS = [4110000000, 52000000, 490000000, 2190000, 2950, 14300000, 83500];
const SDS = [7830000000, 17000000, 552000000, 21200, 70.7, 4510000, 4950];

const CONFIG: Partial<Config> = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ["sendDataToCloud"],
};

const NARROW_BREAKPOINT = 480;

// Loaded dynamically so the ~1MB plotly bundle only downloads on pages that
// actually render this chart.
export function ConjugationTiterChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotlyRef = useRef<typeof import("plotly.js") | null>(null);
  const [ready, setReady] = useState(false);
  const [narrow, setNarrow] = useState(false);
  // Sections the page is not showing are kept `hidden`, where the chart has
  // no size to lay out in, so it is only drawn once it has a width.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("plotly.js-basic-dist-min").then((mod) => {
      if (cancelled) return;
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
    if (!Plotly || !el || !visible) return;

    const fontSize = narrow ? 11 : 16;
    const data: Data[] = [
      {
        type: "scatter",
        mode: "markers",
        x: STRAINS,
        y: TITERS,
        marker: { color: "#33283f", size: 9 },
        error_y: {
          type: "data",
          array: SDS,
          color: "#33283f",
          thickness: 1.5,
          width: 5,
        },
        customdata: SDS,
        hovertemplate:
          "<b>%{x}</b><br>%{y:.3s} CFU/mL<br>SD ± %{customdata:.3s}<extra></extra>",
      },
    ];

    const layout: Partial<Layout> = {
      autosize: true,
      height: narrow ? 420 : 560,
      margin: narrow ? { l: 50, r: 10, t: 50, b: 40 } : { l: 70, r: 15, t: 60, b: 40 },
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      font: { color: "#33283f" },
      showlegend: false,
      hovermode: "closest",
      title: {
        text: "Conjugation titers of different <i>P. vulgatus</i> strains",
        font: { size: narrow ? 14 : 20 },
        x: 0.5,
        xanchor: "center",
      },
      xaxis: {
        type: "category",
        categoryorder: "array",
        categoryarray: [
          "DSM108222",
          "DSM108228",
          "DSM108234",
          "DSM1447",
          "DSM1447 (first conjugation)",
          "DSM3289",
          "RCC1806",
        ],
        title: { text: "<i>P. vulgatus</i> strain", font: { size: narrow ? 12 : 18 } },
        tickfont: { size: fontSize },
        tickangle: narrow ? -45 : undefined,
        automargin: true,
        showgrid: false,
      },
      yaxis: {
        type: "log",
        range: [-0.1, 11.2],
        title: {
          text: narrow
            ? "CFU/mL"
            : "Concentration of conjugated <i>P. vulgatus</i> (CFU/mL)",
          font: { size: narrow ? 12 : 18 },
        },
        tickfont: { size: fontSize },
        tickmode: "array",
        tickvals: Array.from({ length: 11 }, (_, i) => 10 ** i),
        ticktext: ["1", ...Array.from({ length: 10 }, (_, i) => `10<sup>${i + 1}</sup>`)],
        automargin: true,
      },
    };

    void Plotly.react(el, data, layout, CONFIG);
  }, [ready, narrow, visible]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = (width: number) => {
      setVisible(width > 0);
      setNarrow(width > 0 && width < NARROW_BREAKPOINT);
      if (plotlyRef.current) void plotlyRef.current.Plots.resize(el);
    };
    update(el.clientWidth);
    const observer = new ResizeObserver((entries) => update(entries[0]?.contentRect.width ?? 0));
    observer.observe(el);
    // ResultsPipelines dispatches a resize when it shows a section.
    const onResize = () => update(el.clientWidth);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

  return (
    <div className="conjugation-titer-chart" ref={containerRef}>
      {!ready && <div className="mic-chart-loading">Loading chart…</div>}
    </div>
  );
}
