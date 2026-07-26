// Generated with Claude Sonnet 5 (Anthropic), 2026-07-13
// Purpose: floating dot rail tracking scroll position through page sections.
import { MouseEvent, RefObject, useEffect, useState } from "react";
import { HeadingEntry } from "../utils/extractHeadings";

interface SectionProgressProps {
  headings: HeadingEntry[];
  containerRef: RefObject<HTMLElement | null>;
}

// A floating left-hand rail of dots, one per section. Collapsed to dots with
// the current section highlighted; hovering the rail reveals every label.
export function SectionProgress({ headings, containerRef }: SectionProgressProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || headings.length === 0) return;

    const elements = Array.from(container.querySelectorAll("h2, h3")).slice(0, headings.length);
    elements.forEach((element, index) => {
      element.id = headings[index].id;
    });
    if (elements[0]) setActiveId(elements[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [containerRef, headings]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  return (
    <nav className="section-progress" aria-label="Page sections">
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className={activeId === heading.id ? "active" : undefined}>
            <a href={`#${heading.id}`} onClick={(event) => handleClick(event, heading.id)}>
              <span className="section-progress-dot" />
              <span className="section-progress-label">{heading.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
