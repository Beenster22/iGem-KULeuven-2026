// Generated with Claude Opus 5 (Anthropic), 2026-10-19
// Purpose: lets something elsewhere on a page turn a <WheelSelector> to one
// of its wedges — the results page's therapeutics figure
// (TherapeuticsOverview.tsx) sends the reader to the conjugation wedge of
// the Toolkit wheel this way. Its own file so the two sides share these
// without importing each other (and so WheelSelector.tsx keeps exporting
// only its component, which is what fast refresh wants).

/** Dispatched on `window`; a wheel with a matching `id` turns to `label`. */
export const WHEEL_SELECT_EVENT = "select-wheel-item";

export interface WheelSelectDetail {
  /** The `id` given to the <WheelSelector>. */
  wheel: string;
  /** The label of the <SectionItem> to turn to, spelled exactly. */
  label: string;
}

// The wheel asked for may not be on the page yet — on the results page only
// the open pipeline is rendered, so the Toolkit wheel mounts with the switch
// to it and starts listening a moment later. The request is therefore left
// here as well as dispatched, and a wheel claims it as it mounts.
let pending: WheelSelectDetail | null = null;

export function selectWheelItem(detail: WheelSelectDetail) {
  pending = detail;
  window.dispatchEvent(
    new CustomEvent<WheelSelectDetail>(WHEEL_SELECT_EVENT, { detail }),
  );
}

/** The request waiting for this wheel, if any; taking it clears it. */
export function takePendingWheelSelection(wheel: string) {
  if (pending?.wheel !== wheel) return null;
  const detail = pending;
  pending = null;
  return detail;
}

export function clearPendingWheelSelection() {
  pending = null;
}

/** The id of the Toolkit pipeline's wheel on the results page. */
export const TOOLKIT_WHEEL_ID = "toolkit-sections";
