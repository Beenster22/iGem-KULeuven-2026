// Generated with Claude Sonnet 5 (Anthropic), 2026-09-18
// Purpose: Integrated Human Practices page — interviews grouped into named
// sections (e.g. "Students & Researchers", "Clinicians"), each rendered as
// its own bordered card (title + carousel) so sections read as clearly
// separate blocks, with a context/overview blurb below the card. The
// carousel auto-scrolls continuously, same infinite-marquee technique as the
// footer's SponsorCarousel (duplicate the tiles, animate the track by
// exactly -50%, pause on hover so a moving target can still be clicked).
// Clicking a person opens a shared modal with their photo/role on the left
// and the full interview write-up on the right (same click-to-open-modal
// convention as TeamMembers.tsx and EventsTimeline.tsx elsewhere in this
// site). Any plain text/markdown written inside <HPSection> alongside the
// <Interviewee> entries is treated as that section's context/overview blurb,
// in its original relative order.
import { Children, ReactElement, ReactNode, isValidElement, useEffect, useMemo, useRef, useState } from "react";

interface IntervieweeProps {
  name: string;
  /** Free text, e.g. "PhD Candidate, KU Leuven" or "Patient advocate". */
  role?: string;
  image?: string;
  /** The interview write-up, shown in the modal under "Interview Summary". */
  children: ReactNode;
}

// A labeled slot for use inside HPSection. Never rendered directly — the
// parent reads its props via extractSections instead.
export function Interviewee(_props: IntervieweeProps) {
  return null;
}

interface HPSectionProps {
  title: string;
  children: ReactNode;
}

// A labeled slot for use inside HumanPracticesInterviews. Never rendered
// directly — the parent reads its props via extractSections instead.
export function HPSection(_props: HPSectionProps) {
  return null;
}

interface FlatInterviewee {
  globalIndex: number;
  name: string;
  role?: string;
  image?: string;
  content: ReactNode;
}

interface Section {
  title: string;
  interviewees: FlatInterviewee[];
  context: ReactNode[];
}

// Interviewees across every section share one flat, page-wide index so a
// single modal instance (rendered once, at the end) can serve all of them —
// same reasoning as EventsTimeline's shared lightbox.
function extractSections(children: ReactNode): Section[] {
  let counter = 0;
  return Children.toArray(children)
    .filter((child): child is ReactElement<HPSectionProps> => isValidElement(child) && child.type === HPSection)
    .map((sectionChild) => {
      const interviewees: FlatInterviewee[] = [];
      const context: ReactNode[] = [];
      Children.forEach(sectionChild.props.children, (child) => {
        if (isValidElement<IntervieweeProps>(child) && child.type === Interviewee) {
          interviewees.push({
            globalIndex: counter++,
            name: child.props.name,
            role: child.props.role,
            image: child.props.image,
            content: child.props.children,
          });
        } else {
          context.push(child);
        }
      });
      return { title: sectionChild.props.title, interviewees, context };
    });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Seconds per tile for the auto-scroll — matches SponsorCarousel's ~4s/tile
// pace at its default speed (150px logo + 32px gap over 25s ÷ ~5 tiles),
// clamped so a section with only one or two people doesn't whirl by.
const SECONDS_PER_TILE = 4;
const MIN_CAROUSEL_SECONDS = 14;

function carouselPhoto(person: FlatInterviewee) {
  return person.image ? (
    <img src={person.image} alt="" />
  ) : (
    <span className="hp-carousel-photo-placeholder" aria-hidden="true">
      {initials(person.name)}
    </span>
  );
}

interface HPCarouselProps {
  title: string;
  interviewees: FlatInterviewee[];
  onOpen: (index: number) => void;
}

// Infinite-scrolling row of interviewee tiles — same duplicate-the-track
// technique as SponsorCarousel.tsx, but tiles stay real <button>s (not
// links) so clicking one still opens that person's modal.
function HPCarousel({ title, interviewees, onOpen }: HPCarouselProps) {
  const duration = Math.max(MIN_CAROUSEL_SECONDS, interviewees.length * SECONDS_PER_TILE);

  return (
    <div
      className="hp-carousel"
      style={{ "--hp-carousel-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className="hp-carousel-track" role="list" aria-label={`${title} — people interviewed`}>
        {interviewees.map((person) => (
          <button
            key={person.globalIndex}
            type="button"
            role="listitem"
            className="hp-carousel-item"
            onClick={() => onOpen(person.globalIndex)}
          >
            <span className="hp-carousel-photo">{carouselPhoto(person)}</span>
            <span className="hp-carousel-name">{person.name}</span>
          </button>
        ))}
        {interviewees.map((person) => (
          <div key={`${person.globalIndex}-dup`} className="hp-carousel-item" aria-hidden="true">
            <span className="hp-carousel-photo">{carouselPhoto(person)}</span>
            <span className="hp-carousel-name">{person.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HumanPracticesInterviewsProps {
  children: ReactNode;
}

export function HumanPracticesInterviews({ children }: HumanPracticesInterviewsProps) {
  const sections = useMemo(() => extractSections(children), [children]);
  const flat = useMemo(() => sections.flatMap((section) => section.interviewees), [sections]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const openPerson = openIndex !== null ? flat[openIndex] : null;

  useEffect(() => {
    if (openIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [openIndex]);

  useEffect(() => {
    if (openIndex !== null) modalRef.current?.focus();
  }, [openIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (openIndex !== null && event.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex]);

  return (
    <>
      {sections.map((section) => (
        <section key={section.title} className="hp-section">
          <div className="hp-section-card">
            <h2 className="hp-section-title">{section.title}</h2>
            <HPCarousel
              title={section.title}
              interviewees={section.interviewees}
              onOpen={setOpenIndex}
            />
          </div>

          {section.context.length > 0 && <div className="hp-section-context">{section.context}</div>}
        </section>
      ))}

      {openPerson && (
        <div className="hp-modal-backdrop" onClick={() => setOpenIndex(null)}>
          <div
            className="hp-modal"
            role="dialog"
            aria-modal="true"
            aria-label={openPerson.name}
            ref={modalRef}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="hp-modal-close" onClick={() => setOpenIndex(null)} aria-label="Close">
              &times;
            </button>
            <div className="hp-modal-body">
              <div className="hp-modal-photo-col">
                <div className="hp-modal-photo">
                  {openPerson.image ? (
                    <img src={openPerson.image} alt="" />
                  ) : (
                    <span className="hp-modal-photo-placeholder" aria-hidden="true">
                      {initials(openPerson.name)}
                    </span>
                  )}
                </div>
                <div className="hp-modal-caption">
                  <strong>{openPerson.name}</strong>
                  {openPerson.role && <span>{openPerson.role}</span>}
                </div>
              </div>
              <div className="hp-modal-summary-col">
                <p className="hp-modal-summary-label">Interview Summary</p>
                <div className="hp-modal-summary-content">{openPerson.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
