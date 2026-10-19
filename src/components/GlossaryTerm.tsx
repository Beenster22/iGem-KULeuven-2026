// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-19 (team request)
// Purpose: a word on the page with a dotted underline that, when clicked, opens
// a small speech bubble — Elle, the team mascot, explaining what it means.
// Used for the funding bodies and investors in the funding roadmap table
// (Entrepreneurship, 3.4.2): <GlossaryTerm definition="…">VLAIO</GlossaryTerm>.
// The bubble is drawn on <body> and placed with position: fixed next to the
// word, because a table's scroll container would otherwise clip it. It closes
// on a click elsewhere, on Escape, or on a second click on the word.
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MASCOT_BASE = "https://static.igem.wiki/teams/6299/wiki/mascot";
const WIDTH = 320;
const MARGIN = 12;

interface GlossaryTermProps {
  /** What Elle says when the word is clicked. */
  definition: string;
  children: ReactNode;
}

interface Placement {
  top: number;
  left: number;
  width: number;
  above: boolean;
}

export function GlossaryTerm({ definition, children }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const place = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(WIDTH, window.innerWidth - 2 * MARGIN);
    const left = Math.min(Math.max(MARGIN, rect.left), window.innerWidth - width - MARGIN);
    // Open upwards when there is no room underneath the word.
    const above = rect.bottom + 150 > window.innerHeight && rect.top > 150;
    setPlacement({ top: above ? rect.top - 8 : rect.bottom + 8, left, width, above });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || bubbleRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="glossary-term"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {children}
      </button>
      {open &&
        placement &&
        createPortal(
          <div
            ref={bubbleRef}
            role="dialog"
            className={`glossary-pop${placement.above ? " glossary-pop--above" : ""}`}
            style={{ top: placement.top, left: placement.left, width: placement.width }}
          >
            <img src={`${MASCOT_BASE}/uterus-smile.avif`} alt="" className="glossary-pop-elle" />
            <p>{definition}</p>
          </div>,
          document.body,
        )}
    </>
  );
}
