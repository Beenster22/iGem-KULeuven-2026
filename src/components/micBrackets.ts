// Generated with Claude Sonnet 5 (Anthropic), 2026-09-19
// Purpose: lay out the significance brackets of the exported MIC charts.
// The R export places every bracket a few percent above the previous one, which
// at this chart's height is ~8px apart: the stars collide with the lines. This
// re-stacks the bracket rows with a fixed pixel gap (extending the y-axis if the
// stack needs the room) and anchors each star just above its own line.
import type { Annotations, Data, Layout, PlotData } from "plotly.js";

// Vertical distance between two stacked bracket rows, and the space kept
// above the top row for its stars. A row's stars sit in the band between its
// own line and the next row's line, so the gap has to be taller than the
// star text (16px font, ~22px box) for the stars never to touch a line or
// the stars of another row.
const ROW_GAP_PX = 32;
const HEADROOM_PX = 30;
const STAR_SHIFT_PX = 3;

type Trace = Partial<PlotData>;

const isBracketLine = (trace: Data): trace is Trace =>
  trace.type === "scatter" && (trace as Trace).mode === "lines";

// Annotation positions on a log axis are given in log10 units.
const logKey = (log: number) => Math.round(log * 1e6);

export function spaceBrackets(
  data: Data[],
  layout: Partial<Layout>,
  plotHeightPx: number,
): { data: Data[]; layout: Partial<Layout> } {
  const range = layout.yaxis?.range as [number, number] | undefined;
  const rows = [
    ...new Set(
      data
        .filter(isBracketLine)
        .map((t) => t.y as number[])
        // The horizontal bar of a bracket has both ends at the same height;
        // the short end ticks are handled below via that bar's row.
        .filter((y) => y[0] === y[1])
        .map((y) => Math.log10(y[0])),
    ),
  ].sort((a, b) => a - b);
  if (!range || rows.length === 0) return { data, layout };

  const [rangeMin, rangeMax] = range;
  // Each row moves at least ROW_GAP_PX above the one below it. The gap in axis
  // units depends on the final axis span, which grows if the stack overflows
  // the exported range, so settle it by iterating (converges in a few steps).
  let max = rangeMax;
  let placed: number[] = [];
  for (let i = 0; i < 8; i++) {
    const decadesPerPx = (max - rangeMin) / plotHeightPx;
    placed = [];
    rows.forEach((row, index) => {
      placed.push(
        index === 0
          ? row
          : Math.max(row, placed[index - 1] + ROW_GAP_PX * decadesPerPx),
      );
    });
    max = Math.max(
      rangeMax,
      placed[placed.length - 1] + HEADROOM_PX * decadesPerPx,
    );
  }
  const newLog = new Map(
    rows.map((row, index) => [logKey(row), placed[index]]),
  );

  const spaced = data.map((trace) => {
    if (!isBracketLine(trace)) return trace;
    const y = trace.y as number[];
    const isBar = y[0] === y[1];
    const level = Math.max(...y);
    const target = newLog.get(logKey(Math.log10(level)));
    if (target === undefined) return trace;
    const top = 10 ** target;
    // End ticks keep their exported length relative to the bar they hang from.
    return {
      ...trace,
      y: isBar
        ? [top, top]
        : y.map((v) => (v === level ? top : (top * v) / level)),
    };
  });

  const annotations = (
    layout.annotations as Partial<Annotations>[] | undefined
  )?.map((annotation) => {
    const target = newLog.get(logKey(annotation.y as number));
    return target === undefined
      ? annotation
      : {
          ...annotation,
          y: target,
          yanchor: "bottom" as const,
          yshift: STAR_SHIFT_PX,
        };
  });

  return {
    data: spaced,
    layout: {
      ...layout,
      annotations,
      yaxis: { ...layout.yaxis, range: [rangeMin, max] },
    },
  };
}
