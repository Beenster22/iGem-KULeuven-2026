// Generated with Claude Sonnet 5 (Anthropic), 2026-08-19
// Purpose: timeline of events — hover to preview (bigger photo + one-line summary),
// click (or "Read more") to open a near-full-page detail view, click a photo there
// to view it in a full-screen lightbox.
import {
  Children,
  CSSProperties,
  ReactElement,
  ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface EventEntryProps {
  title: string;
  date: string;
  location?: string;
  summary?: string;
  images?: string[];
  children: ReactNode;
}

// A labeled slot for use inside EventsTimeline. Never rendered directly —
// the parent reads its props via extractEvents instead.
export function EventEntry({ children }: EventEntryProps) {
  return <>{children}</>;
}

function extractEvents(children: ReactNode) {
  return Children.toArray(children)
    .filter((child): child is ReactElement<EventEntryProps> => isValidElement(child))
    .map((child) => ({
      title: child.props.title,
      date: child.props.date,
      location: child.props.location,
      summary: child.props.summary,
      images: child.props.images ?? [],
      content: child.props.children,
    }));
}

interface ImageRotatorProps {
  images: string[];
  alt: string;
  seed?: number;
}

// Cross-fades through an event's photos on a timer — the "revolving" preview
// shown on the collapsed timeline card.
function ImageRotator({ images, alt, seed = 0 }: ImageRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Each card gets its own period and start offset so photos don't all swap in unison.
  useEffect(() => {
    if (images.length < 2) return;
    const period = 6000 + ((seed * 613) % 3000);
    const offset = (seed * 977) % period;
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setActiveIndex((index) => (index + 1) % images.length);
      id = setInterval(() => {
        setActiveIndex((index) => (index + 1) % images.length);
      }, period);
    }, offset + 500);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [images.length, seed]);

  if (images.length === 0) {
    return <span className="events-timeline-media events-timeline-media-empty" aria-hidden="true" />;
  }

  return (
    <span className="events-timeline-media">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === activeIndex ? alt : ""}
          className={`events-timeline-media-img${index === activeIndex ? " visible" : ""}`}
        />
      ))}
    </span>
  );
}

// Hand-tuned CSS grid-template-areas layouts, one per photo count. Each
// row string is a set of area letters ("a b", "a a b c", ...) that tiles
// its grid completely — no gaps, no leftover ragged row — so the whole
// collage always reads as a single clean rectangle with varied tile sizes.
const MOSAIC_PATTERNS: Record<number, string[]> = {
  1: ["a"],
  2: ["a b"],
  3: ["a a b", "a a c"],
  4: ["a a b c", "a a b d"],
  5: ["a a b b", "a a c d", "e e c d"],
  6: ["a a b c", "a a d c", "e e d f"],
  7: ["a a b c", "a a d c", "e f d g"],
};
const MOSAIC_MAX = 7;
const AREA_LETTERS = "abcdefg";

function buildMosaic(images: string[]) {
  const hasOverflow = images.length > MOSAIC_MAX;
  const shown = images.slice(0, hasOverflow ? MOSAIC_MAX - 1 : MOSAIC_MAX);
  const overflow = hasOverflow ? images.length - shown.length : 0;
  const patternKey = shown.length + (overflow > 0 ? 1 : 0);
  const rows = MOSAIC_PATTERNS[patternKey] ?? MOSAIC_PATTERNS[MOSAIC_MAX];
  const columns = rows[0].split(" ").length;
  return { shown, overflow, rows, columns };
}

interface EventGalleryProps {
  images: string[];
  onOpen: (index: number) => void;
}

// Renders an event's photos as a mosaic that fills one fixed-size rectangle,
// mixing tile sizes per buildMosaic's pattern rather than a uniform grid.
function EventGallery({ images, onOpen }: EventGalleryProps) {
  const { shown, overflow, rows, columns } = useMemo(() => buildMosaic(images), [images]);

  return (
    <div
      className="events-modal-gallery"
      style={{
        gridTemplateAreas: rows.map((row) => `"${row}"`).join(" "),
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows.length}, 1fr)`,
      }}
    >
      {shown.map((src, index) => (
        <button
          key={src}
          type="button"
          className="events-modal-gallery-item"
          style={{ gridArea: AREA_LETTERS[index] }}
          onClick={() => onOpen(index)}
          aria-label={`View photo ${index + 1} of ${images.length} full size`}
        >
          <img src={src} alt="" />
        </button>
      ))}
      {overflow > 0 && (
        <button
          type="button"
          className="events-modal-gallery-item events-modal-gallery-more"
          style={{ gridArea: AREA_LETTERS[shown.length] }}
          onClick={() => onOpen(shown.length)}
          aria-label={`View all ${images.length} photos`}
        >
          <img src={images[shown.length]} alt="" />
          <span className="events-modal-gallery-more-label">+{overflow}</span>
        </button>
      )}
    </div>
  );
}

// The row's line: a gentle wave that drops into a small loop at each card, the
// loop's lowest point being the card's punch hole (columns are equal width, so
// the holes sit at 1/6, 1/2 and 5/6 of the width). Drawn in real pixels
// (measured) so the loops stay round.
const LINE_HALF_HEIGHT = 40;
const LINE_HEIGHT = 110;
const LOOP_A = 6;
const LOOP_B = 22; // loop depth is 2 * LOOP_B; the card hole sits at that depth

// `slots` are the card centres in column units (0.5 = middle of the first column).
function buildRowPath(width: number, columns: number, slots: number[]) {
  const S = width / columns;
  const markers = slots.map((slot) => S * slot);
  const loopHalf = LOOP_A * Math.PI;
  const pts: string[] = [];
  const add = (x: number, y: number) =>
    pts.push(`${x.toFixed(1)},${(LINE_HALF_HEIGHT + y).toFixed(1)}`);

  function wave(x0: number, x1: number, sign: number) {
    const n = Math.max(8, Math.round((x1 - x0) / 8));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      add(x0 + (x1 - x0) * u, sign * 5 * Math.sin(Math.PI * u));
    }
  }
  // The loop's right-hand half (bottom → back up to the line) is also returned
  // separately: drawn above the card, it's the strand that has come through the hole.
  const front: string[] = [];
  function loop(xm: number) {
    const half: string[] = [];
    for (let i = 0; i <= 64; i++) {
      const th = -Math.PI + (2 * Math.PI * i) / 64;
      const x = xm + LOOP_A * th - LOOP_B * Math.sin(th);
      const y = LOOP_B * (1 + Math.cos(th));
      add(x, y);
      if (th >= 0) half.push(`${x.toFixed(1)},${(LINE_HALF_HEIGHT + y).toFixed(1)}`);
    }
    front.push("M" + half.join(" L"));
  }

  let sign = 1;
  let from = 0;
  markers.forEach((m) => {
    wave(from, m - loopHalf, sign);
    loop(m);
    from = m + loopHalf;
    sign = -sign;
  });
  wave(from, width, sign);
  return { full: "M" + pts.join(" L"), front: front.join(" ") };
}

function RowLine({ columns, count }: { columns: number; count: number }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth || el.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paths = useMemo(() => {
    if (width <= 0) return null;
    // A short last row is centred rather than left-aligned.
    const slots = Array.from({ length: count }, (_, i) => (columns - count) / 2 + i + 0.5);
    return buildRowPath(width, columns, slots);
  }, [width, columns, count]);
  const viewBox = `0 0 ${width || 1} ${LINE_HEIGHT}`;

  return (
    <>
      <svg ref={ref} className="events-row-line" viewBox={viewBox} aria-hidden="true">
        {paths && <path d={paths.full} />}
      </svg>
      <svg
        className="events-row-line events-row-line-front"
        viewBox={viewBox}
        aria-hidden="true"
      >
        {paths && <path d={paths.front} />}
      </svg>
    </>
  );
}

const DEFAULT_EVENTS_PER_ROW = 3;
// Per-card accents from the site palette: marker, tag, card back and offset shadow share a colour,
// and each card sits at a slightly different tilt until hovered.
// Every colour must stand out on the lavender page background (so no lavender); --ev-ink is the text colour on top.
const CARD_COLORS = ["#2fa4a9", "#f1c3d4", "#6e5b9e", "#2f4f86"];
const CARD_INKS = ["#33283f", "#33283f", "#ffffff", "#ffffff"];
const CARD_TILTS = [-2.5, 2, -1.5, 3];

interface LightboxState {
  images: string[];
  index: number;
}

interface EventsTimelineProps {
  children: ReactNode;
  /** Cards per row (default 3). */
  perRow?: number;
}

export function EventsTimeline({ children, perRow = DEFAULT_EVENTS_PER_ROW }: EventsTimelineProps) {
  const events = useMemo(() => extractEvents(children), [children]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  // Touch devices have no hover, so the first tap flips a card and the second opens it.
  const [flipped, setFlipped] = useState<number | null>(null);

  // Snake layout: events are chunked into rows; odd rows run right-to-left (via CSS).
  const rows = useMemo(() => {
    const out: { event: (typeof events)[number]; index: number }[][] = [];
    events.forEach((event, index) => {
      const r = Math.floor(index / perRow);
      (out[r] ??= []).push({ event, index });
    });
    return out;
  }, [events, perRow]);

  function handleCardClick(index: number) {
    const noHover = window.matchMedia("(hover: none)").matches;
    if (noHover && flipped !== index) {
      setFlipped(index);
      return;
    }
    setOpenIndex(index);
  }

  const openEvent = openIndex !== null ? events[openIndex] : null;

  // Lock page scroll while the detail view (or its lightbox) is open.
  useEffect(() => {
    if (openIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [openIndex]);

  // Closing the detail view should always close any lightbox it opened.
  useEffect(() => {
    if (openIndex === null) setLightbox(null);
  }, [openIndex]);

  useEffect(() => {
    if (openIndex !== null) modalRef.current?.focus();
  }, [openIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (lightbox) {
        if (event.key === "Escape") setLightbox(null);
        else if (event.key === "ArrowRight") {
          setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb));
        } else if (event.key === "ArrowLeft") {
          setLightbox((lb) =>
            lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb,
          );
        }
        return;
      }
      if (openIndex !== null && event.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, openIndex]);

  return (
    <>
      <div className="events-timeline">
        {rows.map((row, rowIndex) => (
          <ol
            key={rowIndex}
            className={`events-row${rowIndex % 2 === 1 ? " events-row-rtl" : ""}${
              rowIndex < rows.length - 1 ? " events-row-connected" : ""
            }${rowIndex > 0 ? " events-row-continued" : ""}`}
            style={
              {
                "--ev-cols": perRow,
                // A short last row is centred: double-width tracks let cards sit on half-column offsets.
                ...(row.length < perRow && { gridTemplateColumns: `repeat(${perRow * 2}, 1fr)` }),
              } as CSSProperties
            }
          >
            <RowLine columns={perRow} count={row.length} />
            {rowIndex < rows.length - 1 && (
              <svg
                className="events-row-turn"
                viewBox="0 0 40 420"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0,0 C26,0 38,8 38,30 L38,390 C38,412 26,420 0,420"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
            {row.map(({ event, index }, slot) => (
              <li
                key={event.title}
                className="events-timeline-item"
                style={
                  {
                    "--ev-c": CARD_COLORS[index % CARD_COLORS.length],
                    "--ev-ink": CARD_INKS[index % CARD_INKS.length],
                    "--ev-tilt": `${CARD_TILTS[index % CARD_TILTS.length]}deg`,
                    ...(row.length < perRow && {
                      gridColumn: `${slot * 2 + (perRow - row.length) + 1} / span 2`,
                    }),
                  } as CSSProperties
                }
              >
                <span className="events-timeline-number">
                  <span className="events-timeline-number-date">{event.date}</span>
                </span>
                <button
                  type="button"
                  className={`events-timeline-card${flipped === index ? " is-flipped" : ""}`}
                  onClick={() => handleCardClick(index)}
                >
                  <span className="events-timeline-card-inner">
                    <span className="events-timeline-face events-timeline-front">
                      <span className="events-timeline-card-media">
                        <ImageRotator images={event.images} alt={event.title} seed={index} />
                      </span>
                      <span className="events-timeline-card-body">
                        {event.location && (
                          <span className="events-timeline-tag">{event.location}</span>
                        )}
                        <span className="events-timeline-title">{event.title}</span>
                      </span>
                    </span>
                    <span className="events-timeline-face events-timeline-back">
                      <span className="events-timeline-title">{event.title}</span>
                      <span className="events-timeline-summary-text">{event.summary ?? "Click to read more."}</span>
                      <span className="events-timeline-readmore">Read more →</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ))}
      </div>

      {openEvent && (
        <div className="events-modal-backdrop" onClick={() => setOpenIndex(null)}>
          <div
            className="events-modal"
            role="dialog"
            aria-modal="true"
            aria-label={openEvent.title}
            ref={modalRef}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="events-modal-close"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="events-modal-header">
              <span className="events-modal-date">
                {openEvent.date}
                {openEvent.location ? ` · ${openEvent.location}` : ""}
              </span>
              <h2 className="events-modal-title">{openEvent.title}</h2>
            </div>
            {openEvent.images.length > 0 && (
              <EventGallery
                images={openEvent.images}
                onOpen={(index) => setLightbox({ images: openEvent.images, index })}
              />
            )}
            <div className="events-modal-content">{openEvent.content}</div>
          </div>
        </div>
      )}

      {lightbox && (
        <div className="events-lightbox-backdrop" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="events-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close image"
          >
            &times;
          </button>
          {lightbox.images.length > 1 && (
            <button
              type="button"
              className="events-lightbox-nav events-lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                setLightbox((lb) =>
                  lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb,
                );
              }}
              aria-label="Previous image"
            >
              &#8249;
            </button>
          )}
          <img
            src={lightbox.images[lightbox.index]}
            alt=""
            className="events-lightbox-img"
            onClick={(event) => event.stopPropagation()}
          />
          {lightbox.images.length > 1 && (
            <button
              type="button"
              className="events-lightbox-nav events-lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                setLightbox((lb) =>
                  lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb,
                );
              }}
              aria-label="Next image"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </>
  );
}
