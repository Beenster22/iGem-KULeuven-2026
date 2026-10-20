// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request)
// Purpose: a thin bar pinned under the navbar that fills as the reader
// scrolls down the page — a page-level "how much is left", separate from
// SectionProgress's left-hand index (which tracks which section you're in,
// not how far through the whole page you are). Useful mainly on the long
// content pages; not rendered on the home page (its own full-screen snap
// sections aren't "a page you scroll through" in this sense).
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, next)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="reading-progress-track" aria-hidden="true">
      <div
        className="reading-progress-fill"
        style={{
          width: `${progress}%`,
          transition: reducedMotion ? "none" : undefined,
        }}
      />
    </div>
  );
}
