// Generated with Claude Sonnet 5 (Anthropic), 2026-07-24
// Purpose: expandable timeline of dated events with a cross-fading photo preview.
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

interface EventsTimelineProps {
  children: ReactNode;
}

export function EventsTimeline({ children }: EventsTimelineProps) {
  const events = useMemo(() => extractEvents(children), [children]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (expandedIndex === null) return;
    itemRefs.current[expandedIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expandedIndex]);

  return (
    <ol className={`events-timeline${expandedIndex !== null ? " has-expanded" : ""}`}>
      {events.map((event, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <li
            key={event.title}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`events-timeline-item${isExpanded ? " expanded" : ""}`}
          >
            <span className="events-timeline-marker" />
            <div className="events-timeline-card">
              <button
                type="button"
                className="events-timeline-summary"
                aria-expanded={isExpanded}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <ImageRotator images={event.images} alt={event.title} />
                <span className="events-timeline-meta">
                  <span className="events-timeline-date">
                    {event.date}
                    {event.location ? ` · ${event.location}` : ""}
                  </span>
                  <span className="events-timeline-title">{event.title}</span>
                </span>
              </button>
              {isExpanded && (
                <div className="events-timeline-detail">
                  {event.images.length > 1 && (
                    <div className="events-timeline-detail-gallery">
                      {event.images.map((src) => (
                        <img key={src} src={src} alt={event.title} />
                      ))}
                    </div>
                  )}
                  <div className="events-timeline-detail-content">{event.content}</div>
                  <button
                    type="button"
                    className="events-timeline-collapse"
                    onClick={() => setExpandedIndex(null)}
                  >
                    Show less
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
