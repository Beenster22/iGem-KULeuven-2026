// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: the interactive prevalence globe (PmosGlobe.tsx) as used in the
// Project description appendix (it used to be a full-screen home-page band).
import { lazy, Suspense } from "react";

// three.js + globe.gl add ~700KB (gzipped) to the bundle — lazy-loaded so
// that weight is only fetched once the page that shows the globe is opened.
const PmosGlobe = lazy(() =>
  import("./PmosGlobe").then((m) => ({ default: m.PmosGlobe })),
);

export function PmosGlobeSection() {
  return (
    <div className="pmos-globe-section">
      <Suspense
        fallback={<div className="pmos-globe-loading">Loading globe…</div>}
      >
        <PmosGlobe />
      </Suspense>
    </div>
  );
}
