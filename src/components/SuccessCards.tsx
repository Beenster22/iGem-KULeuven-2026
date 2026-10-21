// Generated with Claude Opus 5 (Anthropic), 2026-10-16
// Restored with Claude Sonnet 5.5 (Anthropic), 2026-10-19, in place of the
// per-pipeline section timeline (team feedback: the timeline duplicated the
// page index rail on the left; these headline cards don't).
// Purpose: the headline "success" shortcuts at the top of the results page.
// Each is a shortcut: clicking it scrolls to the section of the page that
// carries the data behind that success, so a reader can start from the result
// rather than from the method.
//
// Redesigned with Claude Sonnet 5.5 (Anthropic), 2026-10-21 (team's compact
// "Main key takeaways" design): one lavender box with a Toolkit / Therapeutics
// pill switch and, under it, a numbered chip per success. A <SuccessCard>
// with a `group` ("Toolkit", "Therapeutics") shows under that tab; without
// any groups the chips simply sit in one row. On the results page the tabs
// are the page's Toolkit / Therapeutics switch (see ResultsPipelines, which
// gives them the pipelines through PipelineContext); elsewhere they only
// choose which chips are shown.
//
// The chips link by heading slug (the same slugs SectionProgress assigns to
// the headings of a page, see utils/stringToSlug), so a chip's `to` is just
// the slugified heading text of its target section — no extra markup is
// needed at the destination.
import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { PipelineContext } from "./pipelineContext";

interface SuccessCardProps {
  /** Slug of the heading to jump to, without the leading "#". */
  to: string;
  /** The tab the chip sits under, e.g. "Toolkit"; read by SuccessCards. */
  group?: string;
  /** Set by SuccessCards: the chip's position in the whole list. */
  number?: number;
  children: ReactNode;
}

export function SuccessCard({ to, number, children }: SuccessCardProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(to);
    event.preventDefault();
    // No target yet: the result sits inside a dropdown that is not open (see
    // ExpandableText), which opens itself when it hears the hash change. The
    // heading appears once it has rendered, so the jump is retried briefly.
    if (!target) {
      history.replaceState(null, "", `#${to}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      let tries = 0;
      const jump = () => {
        const el = document.getElementById(to);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (tries++ < 20) window.setTimeout(jump, 100);
      };
      jump();
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${to}`);
  }

  return (
    <a className="success-card" href={`#${to}`} onClick={handleClick}>
      {number !== undefined && <span className="success-card-number">{number}</span>}
      <span className="success-card-label">{children}</span>
      <svg className="success-card-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </a>
  );
}

export function SuccessCards({ children }: { children: ReactNode }) {
  const cards = Children.toArray(children).filter((child): child is ReactElement<SuccessCardProps> =>
    isValidElement(child),
  );
  const pipelines = useContext(PipelineContext);
  const groups: string[] = pipelines ? [...pipelines.labels] : [];
  cards.forEach((card) => {
    const group = card.props.group ?? "";
    if (!groups.includes(group)) groups.push(group);
  });
  const [localActive, setLocalActive] = useState(0);
  // Inside ResultsPipelines the tabs are the page's Toolkit / Therapeutics
  // switch; on their own they only choose which chips show.
  const active = pipelines ? pipelines.index : localActive;
  const setActive = (index: number) => (pipelines ? pipelines.choose(index) : setLocalActive(index));
  const tabbed = groups.length > 1;

  return (
    <nav className="success-cards" aria-label="Our results at a glance">
      <div className="success-cards-head">Main key takeaways</div>
      {tabbed && (
        <div
          className="success-cards-tabs"
          role="tablist"
          data-active={active}
          style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}
        >
          <span
            className="success-cards-pill"
            aria-hidden="true"
            style={{
              width: `calc(${100 / groups.length}% - ${8 / groups.length}px)`,
              transform: `translateX(${active * 100}%)`,
            }}
          />
          {groups.map((group, index) => (
            <button
              key={group}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
            >
              {group}
            </button>
          ))}
        </div>
      )}
      {groups.map((group, groupIndex) => (
        <div className="success-cards-grid" key={group} hidden={tabbed && groupIndex !== active}>
          {cards.map((card, index) =>
            (card.props.group ?? "") === group
              ? cloneElement(card, { number: index + 1, key: card.props.to })
              : null,
          )}
        </div>
      ))}
    </nav>
  );
}
