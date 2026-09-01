// Generated with Claude Sonnet 5 (Anthropic), 2026-08-19
// Purpose: timeline of events — hover to preview (bigger photo + one-line summary),
// click (or "Read more") to open a near-full-page detail view, click a photo there
// to view it in a full-screen lightbox.
import {
  Children,
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
}

// Cross-fades through an event's photos on a timer — the "revolving" preview
// shown on the collapsed timeline card.
function ImageRotator({ images, alt }: ImageRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 3500);
    return () => clearInterval(id);
  }, [images.length]);

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

interface LightboxState {
  images: string[];
  index: number;
}

interface EventsTimelineProps {
  children: ReactNode;
}

export function EventsTimeline({ children }: EventsTimelineProps) {
  const events = useMemo(() => extractEvents(children), [children]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

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
      <ol className="events-timeline">
        {events.map((event, index) => (
          <li key={event.title} className="events-timeline-item">
            <span className="events-timeline-marker" />
            <button
              type="button"
              className="events-timeline-card"
              onClick={() => setOpenIndex(index)}
            >
              <span className="events-timeline-card-media">
                <ImageRotator images={event.images} alt={event.title} />
              </span>
              <span className="events-timeline-card-body">
                <span className="events-timeline-date">
                  {event.date}
                  {event.location ? ` · ${event.location}` : ""}
                </span>
                <span className="events-timeline-title">{event.title}</span>
                {event.summary && (
                  <span className="events-timeline-summary-text">{event.summary}</span>
                )}
                <span className="events-timeline-readmore">Read more →</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

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
              <div className="events-modal-gallery">
                {openEvent.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className="events-modal-gallery-item"
                    onClick={() => setLightbox({ images: openEvent.images, index })}
                    aria-label={`View photo ${index + 1} of ${openEvent.title} full size`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
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
