import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const TILE_HEIGHT = 40;
const TRACK_HEIGHT = 400;

function measure() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  return scrollable > 0 ? Math.min(1, Math.max(0, doc.scrollTop / scrollable)) : 0;
}

// A fixed right-hand rail styled as a double helix that fills in as the
// reader scrolls down the page, in place of a plain native scrollbar.
export function ScrollProgressDna() {
  const [percent, setPercent] = useState(measure);
  const frame = useRef<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setPercent(measure());
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  // Page height changes on navigation, so re-measure once new content settles.
  useEffect(() => {
    const id = requestAnimationFrame(() => setPercent(measure()));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div className="dna-scroll-progress" aria-hidden="true">
      <svg
        className="dna-scroll-progress-svg"
        viewBox={`0 0 24 ${TRACK_HEIGHT}`}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="dna-tile-track"
            patternUnits="userSpaceOnUse"
            width="24"
            height={TILE_HEIGHT}
          >
            <DnaTile className="dna-tile-track-shape" />
          </pattern>
          <pattern
            id="dna-tile-active"
            patternUnits="userSpaceOnUse"
            width="24"
            height={TILE_HEIGHT}
          >
            <DnaTile className="dna-tile-active-shape" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="24" height={TRACK_HEIGHT} fill="url(#dna-tile-track)" />
        <rect x="0" y="0" width="24" height={TRACK_HEIGHT * percent} fill="url(#dna-tile-active)" />
      </svg>
    </div>
  );
}

function DnaTile({ className }: { className: string }) {
  return (
    <g className={className}>
      <path d="M4,0 C4,10 20,10 20,20 C20,30 4,30 4,40" />
      <path d="M20,0 C20,10 4,10 4,20 C4,30 20,30 20,40" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="16" y1="30" x2="8" y2="30" />
      <circle cx="8" cy="10" r="1.6" />
      <circle cx="16" cy="10" r="1.6" />
      <circle cx="16" cy="30" r="1.6" />
      <circle cx="8" cy="30" r="1.6" />
    </g>
  );
}
