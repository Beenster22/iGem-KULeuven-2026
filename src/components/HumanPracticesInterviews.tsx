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
  /** Optional second person for a joint interview: their name, role and
   * photo. The pair is shown as one wide double photo in the spotlight,
   * carousel and list, and as two stacked photos in the popup. */
  name2?: string;
  role2?: string;
  image2?: string;
  /** When the interview took place, free text, e.g. "12 March 2026". */
  date?: string;
  /** Where the interviewee works from, e.g. "Leuven, Belgium". */
  basedIn?: string;
  /** One- or two-sentence blurb shown next to the person while they're
   * featured. Falls back to a clipped excerpt of the full write-up. */
  summary?: string;
  /** The interview write-up, shown in the modal under "Interview Summary". */
  children: ReactNode;
}

// A labeled slot for use inside HPSection. Never rendered directly — the
// parent reads its props via extractSections instead.
export function Interviewee(_props: IntervieweeProps) {
  return null;
}

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-16
// Purpose: optional introduction for a stakeholder group — what we wanted to
// learn from them / what we already knew — shown at the top of the section
// card, above the interviews. A labeled slot like Interviewee: never rendered
// directly, the parent reads its children via extractSections.
interface HPIntroProps {
  /** Small label above the text; defaults to "Introduction". */
  label?: string;
  children: ReactNode;
}

export function HPIntro(_props: HPIntroProps) {
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
  name2?: string;
  role2?: string;
  image2?: string;
  date?: string;
  basedIn?: string;
  summary?: string;
  content: ReactNode;
}

interface Section {
  title: string;
  intro?: { label?: string; content: ReactNode };
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
      let intro: Section["intro"];
      Children.forEach(sectionChild.props.children, (child) => {
        if (isValidElement<HPIntroProps>(child) && child.type === HPIntro) {
          intro = { label: child.props.label, content: child.props.children };
        } else if (isValidElement<IntervieweeProps>(child) && child.type === Interviewee) {
          interviewees.push({
            globalIndex: counter++,
            name: child.props.name,
            role: child.props.role,
            // Blank values (e.g. image=" ") count as no photo → initials
            image: child.props.image?.trim() || undefined,
            name2: child.props.name2,
            role2: child.props.role2,
            image2: child.props.image2?.trim() || undefined,
            date: child.props.date,
            basedIn: child.props.basedIn,
            summary: child.props.summary,
            content: child.props.children,
          });
        } else {
          context.push(child);
        }
      });
      return { title: sectionChild.props.title, intro, interviewees, context };
    });
}

// Titles like "Prof." / "Dr." (any word ending in a dot) are skipped, so
// "Prof. Dr. Shari Mackens" gives "SM" rather than "PD".
function initials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  const named = words.filter((word) => !word.endsWith("."));
  return (named.length > 0 ? named : words)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Joint interviews (name2 set) show both names, and both roles when they differ.
function displayName(person: FlatInterviewee) {
  return person.name2 ? `${person.name} & ${person.name2}` : person.name;
}

function displayRole(person: FlatInterviewee) {
  const roles = [person.role, person.role2].filter((role): role is string => Boolean(role));
  return [...new Set(roles)].join(" · ");
}

// The photo(s) for one interview: a single photo, or — for a joint interview —
// both photos side by side, which the parent's "is-pair" class turns into one
// wide 2:1 image. Missing photos fall back to the person's initials.
function PersonPhotos({ person, placeholderClass }: { person: FlatInterviewee; placeholderClass: string }) {
  const people = [{ name: person.name, image: person.image }];
  if (person.name2) people.push({ name: person.name2, image: person.image2 });
  return (
    <>
      {people.map((p) =>
        p.image ? (
          <img key={p.name} src={p.image} alt="" />
        ) : (
          <span key={p.name} className={placeholderClass} aria-hidden="true">
            {initials(p.name)}
          </span>
        ),
      )}
    </>
  );
}

const pairClass = (person: FlatInterviewee) => (person.name2 ? " is-pair" : "");

// Seconds per tile for the auto-scroll — matches SponsorCarousel's ~4s/tile
// pace at its default speed (150px logo + 32px gap over 25s ÷ ~5 tiles),
// clamped so a section with only one or two people doesn't whirl by.
const SECONDS_PER_TILE = 4;
const MIN_CAROUSEL_SECONDS = 14;

function carouselPhoto(person: FlatInterviewee) {
  return <PersonPhotos person={person} placeholderClass="hp-carousel-photo-placeholder" />;
}

interface HPCarouselProps {
  title: string;
  interviewees: FlatInterviewee[];
  featuredIndex: number;
  onOpen: (index: number) => void;
}

// Infinite-scrolling row of interviewee tiles — same duplicate-the-track
// technique as SponsorCarousel.tsx, but tiles stay real <button>s (not
// links) so clicking one still opens that person's modal.
function HPCarousel({ title, interviewees, featuredIndex, onOpen }: HPCarouselProps) {
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
            className={`hp-carousel-item${pairClass(person)}${person.globalIndex === featuredIndex ? " is-featured" : ""}`}
            onClick={() => onOpen(person.globalIndex)}
          >
            <span className={`hp-carousel-photo${pairClass(person)}`}>{carouselPhoto(person)}</span>
            <span className="hp-carousel-name">{displayName(person)}</span>
          </button>
        ))}
        {interviewees.map((person) => (
          // The loop's second copy: hidden from screen readers and the tab
          // order (the first copy already covers them), but still clickable —
          // about half the time the tile under the mouse is one of these.
          <button
            key={`${person.globalIndex}-dup`}
            type="button"
            tabIndex={-1}
            className={`hp-carousel-item${pairClass(person)}${person.globalIndex === featuredIndex ? " is-featured" : ""}`}
            aria-hidden="true"
            onClick={() => onOpen(person.globalIndex)}
          >
            <span className={`hp-carousel-photo${pairClass(person)}`}>{carouselPhoto(person)}</span>
            <span className="hp-carousel-name">{displayName(person)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


// Generated with Claude Opus 5.5 (Anthropic), 2026-10-14
// Purpose: spotlight one interviewee per section — large photo with a short
// summary beside it — rotating to the next person every FEATURE_SECONDS.
// Rotation pauses while the spotlight is hovered/focused or a modal is open,
// and is off entirely under prefers-reduced-motion (the dots still work).
const FEATURE_SECONDS = 8;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

interface HPFeaturedProps {
  interviewees: FlatInterviewee[];
  position: number;
  paused: boolean;
  onSelect: (position: number) => void;
  onOpen: (index: number) => void;
}

function HPFeatured({ interviewees, position, paused, onSelect, onOpen }: HPFeaturedProps) {
  const [hovered, setHovered] = useState(false);
  const person = interviewees[position];
  const rotating = interviewees.length > 1 && !paused && !hovered && !prefersReducedMotion();

  // Restarting the timeout whenever `position` changes means a manual pick
  // via the dots gets a full FEATURE_SECONDS before the next switch.
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => onSelect((position + 1) % interviewees.length), FEATURE_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [rotating, position, interviewees.length, onSelect]);

  if (!person) return null;

  return (
    <div
      className="hp-featured"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ "--hp-feature-duration": `${FEATURE_SECONDS}s` } as React.CSSProperties}
    >
      {/* Keyed on the person so each switch remounts and replays the fade-in. */}
      <div key={person.globalIndex} className={`hp-featured-body${pairClass(person)}`} aria-live="polite">
        <button
          type="button"
          className={`hp-featured-photo${pairClass(person)}`}
          onClick={() => onOpen(person.globalIndex)}
          aria-label={`Read the full interview with ${displayName(person)}`}
        >
          <PersonPhotos person={person} placeholderClass="hp-featured-photo-placeholder" />
        </button>
        <div className="hp-featured-text">
          <h3 className="hp-featured-name">{displayName(person)}</h3>
          {displayRole(person) && <p className="hp-featured-role">{displayRole(person)}</p>}
          {/* Clicking the excerpt opens the full interview too; the button
              below stays the keyboard-accessible way in. */}
          <div
            className={`hp-featured-summary is-clickable${person.summary ? "" : " is-excerpt"}`}
            onClick={() => onOpen(person.globalIndex)}
          >
            {person.summary ? <p>{person.summary}</p> : person.content}
          </div>
          <button type="button" className="hp-featured-more" onClick={() => onOpen(person.globalIndex)}>
            Read full interview &rarr;
          </button>
        </div>
      </div>

      {interviewees.length > 1 && (
        <div className="hp-featured-dots" role="tablist" aria-label="Featured interviewee">
          {interviewees.map((p, i) => (
            <button
              key={p.globalIndex}
              type="button"
              role="tab"
              aria-selected={i === position}
              aria-label={displayName(p)}
              className={`hp-featured-dot${i === position ? " is-active" : ""}${i === position && rotating ? " is-running" : ""}`}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-15
// Purpose: plain, motion-free alternative to the spotlight + carousel — every
// interviewee in a section as a stacked row (thumbnail, name, role, summary),
// still opening the shared modal for the full write-up.
type HPView = "carousel" | "list";
const VIEW_STORAGE_KEY = "hp-interviews-view";

function readStoredView(): HPView {
  try {
    return window.localStorage.getItem(VIEW_STORAGE_KEY) === "list" ? "list" : "carousel";
  } catch {
    return "carousel";
  }
}

interface HPListProps {
  interviewees: FlatInterviewee[];
  onOpen: (index: number) => void;
}

function HPList({ interviewees, onOpen }: HPListProps) {
  return (
    <ul className="hp-list">
      {interviewees.map((person) => (
        <li key={person.globalIndex} className={`hp-list-item${pairClass(person)}`}>
          <button
            type="button"
            className={`hp-list-photo${pairClass(person)}`}
            onClick={() => onOpen(person.globalIndex)}
            aria-label={`Read the full interview with ${displayName(person)}`}
          >
            {carouselPhoto(person)}
          </button>
          <div className="hp-list-text">
            <h3 className="hp-list-name">{displayName(person)}</h3>
            {displayRole(person) && <p className="hp-list-role">{displayRole(person)}</p>}
            <div className={`hp-list-summary${person.summary ? "" : " is-excerpt"}`}>
              {person.summary ? <p>{person.summary}</p> : person.content}
            </div>
            <button type="button" className="hp-featured-more" onClick={() => onOpen(person.globalIndex)}>
              Read full interview &rarr;
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function HPIntroBlock({ intro }: { intro: Section["intro"] }) {
  if (!intro) return null;
  return (
    <div className="hp-section-intro">
      <p className="hp-section-intro-label">{intro.label ?? "Introduction"}</p>
      {intro.content}
    </div>
  );
}

interface HPSectionCardProps {
  section: Section;
  view: HPView;
  paused: boolean;
  onOpen: (index: number) => void;
}

function HPSectionCard({ section, view, paused, onOpen }: HPSectionCardProps) {
  const [position, setPosition] = useState(0);
  const featured = section.interviewees[position];

  if (view === "list") {
    return (
      <div className="hp-section-card">
        <HPList interviewees={section.interviewees} onOpen={onOpen} />
      </div>
    );
  }

  return (
    <div className="hp-section-card">
      <HPFeatured
        interviewees={section.interviewees}
        position={position}
        paused={paused}
        onSelect={setPosition}
        onOpen={onOpen}
      />
      {section.interviewees.length > 1 && (
        <HPCarousel
          title={section.title}
          interviewees={section.interviewees}
          featuredIndex={featured?.globalIndex ?? -1}
          onOpen={onOpen}
        />
      )}
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
  const [view, setView] = useState<HPView>(readStoredView);
  const modalRef = useRef<HTMLDivElement | null>(null);

  function changeView(next: HPView) {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode etc.) — the toggle still works for this visit.
    }
  }

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
      <div className="segmented-selector-bar hp-view-toggle" role="group" aria-label="Interview layout">
        {(["carousel", "list"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={view === option}
            className={`segmented-selector-segment${view === option ? " active" : ""}`}
            onClick={() => changeView(option)}
          >
            {option === "carousel" ? "Carousel" : "List"}
          </button>
        ))}
      </div>

      {sections.map((section) =>
        section.interviewees.length > 0 ? (
          <section key={section.title} className="hp-section">
            <h2 className="hp-section-title">{section.title}</h2>
            <HPIntroBlock intro={section.intro} />
            <HPSectionCard section={section} view={view} paused={openIndex !== null} onOpen={setOpenIndex} />

            {section.context.length > 0 && <div className="hp-section-context">{section.context}</div>}
          </section>
        ) : (
          // Text-only section (e.g. Patients, General Public): same layout, but
          // the write-up goes inside the card instead of a carousel.
          <section key={section.title} className="hp-section">
            <h2 className="hp-section-title">{section.title}</h2>
            <HPIntroBlock intro={section.intro} />
            {section.context.length > 0 && (
              <div className="hp-section-card hp-section-card--text">
                <div className="hp-section-text">{section.context}</div>
              </div>
            )}
          </section>
        ),
      )}

      {openPerson && (
        <div className="hp-modal-backdrop" onClick={() => setOpenIndex(null)}>
          <div
            className="hp-modal"
            role="dialog"
            aria-modal="true"
            aria-label={displayName(openPerson)}
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
                {openPerson.name2 && (
                  <>
                    <div className="hp-modal-photo hp-modal-photo--second">
                      {openPerson.image2 ? (
                        <img src={openPerson.image2} alt="" />
                      ) : (
                        <span className="hp-modal-photo-placeholder" aria-hidden="true">
                          {initials(openPerson.name2)}
                        </span>
                      )}
                    </div>
                    <div className="hp-modal-caption">
                      <strong>{openPerson.name2}</strong>
                      {openPerson.role2 && <span>{openPerson.role2}</span>}
                    </div>
                  </>
                )}
                {(openPerson.date || openPerson.basedIn) && (
                  <dl className="hp-modal-meta">
                    {openPerson.date && (
                      <div>
                        <dt>Date</dt>
                        <dd>{openPerson.date}</dd>
                      </div>
                    )}
                    {openPerson.basedIn && (
                      <div>
                        <dt>Based in</dt>
                        <dd>{openPerson.basedIn}</dd>
                      </div>
                    )}
                  </dl>
                )}
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
