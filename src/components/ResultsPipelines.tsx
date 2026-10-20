// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-19
// Purpose: the results page's Toolkit / Therapeutics switch, rebuilt so that
// the choice sits at the top of the page together with an index of the
// sections the chosen pipeline discusses, and so that the pipeline is then
// read one section at a time (Previous / Next at the foot of each), the way
// entrepreneurship.mdx and human-practices.mdx are read with <PhasePager>.
//
//   <ResultsPipelines highlights={<SuccessCards>…</SuccessCards>}>
//     <SectionItem label="Toolkit"> ## Toolkit, <ResultSection>… </SectionItem>
//     <SectionItem label="Therapeutics"> … </SectionItem>
//   </ResultsPipelines>
//
// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-19: dropped the
// `highlights` slot (the headline success-card row that used to sit under
// the index) — team feedback that it duplicated the index below it. Then
// turned the index itself into a zigzag timeline of the chosen pipeline's
// sections.
//
// Re-edited with Claude Sonnet 5.5 (Anthropic), 2026-10-19: dropped that
// timeline in turn — team feedback that it duplicated the page index rail
// on the left (which already lists the open pipeline's sections) — and
// brought the `highlights` slot back to fill its place, since the success
// cards serve a different purpose: headline takeaways, not navigation.
//
// Each pipeline's <ResultSection>s are the "main sections": the index lists
// the "### " heading of every one, and only the open one is shown. The rest
// stay in the DOM (`hidden`) so the left-hand page index still lists them.
// Anything that points at a heading — an index entry, a success card, the
// page index, a #hash — first opens the pipeline and section that hold it.
import {
  Children,
  Fragment,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { extractLabeledChildren } from "../utils/extractLabeledChildren";
import { stringToSlug } from "../utils/stringToSlug";
import { headingSlugs, textOf } from "./useHashPanel";
import { ResultSection } from "./ResultsKit";

interface Section {
  title: ReactNode;
  plainTitle: string;
  slug: string;
  element: ReactElement<{
    children?: ReactNode;
    hidden?: boolean;
    footer?: ReactNode;
  }>;
}

interface Pipeline {
  label: string;
  /** Everything that is not a result section, e.g. the "## Toolkit" heading. */
  preamble: ReactNode[];
  sections: Section[];
  /** Slugs of every heading in the pipeline, sections and preamble alike. */
  slugs: string[];
}

/** The first "### " heading of a result section: its title in the index. */
function firstHeading(node: ReactNode): ReactNode | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = firstHeading(child);
      if (found) return found;
    }
    return null;
  }
  if (!isValidElement(node)) return null;
  const props = node.props as { children?: ReactNode };
  if (node.type === "h3") return props.children;
  return firstHeading(props.children);
}

function readPipeline(item: { label: string; content: ReactNode }): Pipeline {
  const preamble: ReactNode[] = [];
  const sections: Section[] = [];
  Children.toArray(item.content).forEach((child) => {
    if (isValidElement(child) && child.type === ResultSection) {
      const element = child as Section["element"];
      const title = firstHeading(element.props.children);
      const plainTitle = textOf(title);
      sections.push({
        title,
        plainTitle,
        slug: stringToSlug(plainTitle),
        element,
      });
    } else {
      preamble.push(child);
    }
  });
  return {
    label: item.label,
    preamble,
    sections,
    slugs: headingSlugs(item.content),
  };
}

export function ResultsPipelines({
  children,
  highlights,
  nextPage,
}: {
  children: ReactNode;
  /** Shown between the switch and the sections, e.g. the success cards. */
  highlights?: ReactNode;
  // Shown after the last section of the last pipeline, so a reader who
  // works through Toolkit and Therapeutics in turn lands on the next page
  // in the wiki's reading order instead of a dead end (team feedback).
  nextPage?: { to: string; label: string };
}) {
  const pipelines = useMemo(
    () => extractLabeledChildren(children).map(readPipeline),
    [children],
  );
  const [pipelineIndex, setPipelineIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const { hash } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const pipeline = pipelines[pipelineIndex];

  const choosePipeline = useCallback((index: number) => {
    // Switching from deep in one pipeline: the other is shorter, so the
    // browser would clamp the old scroll position to its very bottom. Start
    // it at its first section instead, just under the pinned switch.
    flushSync(() => {
      setPipelineIndex(index);
      setSectionIndex(0);
    });
    // The page reflows for a moment after the switch (the page index, the
    // cards), so measure after it settles rather than straight away.
    const scrollToStart = () => {
      const content = rootRef.current?.querySelector(
        ".segmented-selector-content",
      );
      if (!content) return;
      const barH = barRef.current?.offsetHeight ?? 0;
      const top =
        content.getBoundingClientRect().top + window.scrollY - 5 * 16 - barH;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
    };
    scrollToStart();
    window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToStart));
  }, []);

  /** Opens whichever pipeline and section hold the heading with this slug. */
  const reveal = useCallback(
    (slug: string, sync = true) => {
      const p = pipelines.findIndex((candidate) =>
        candidate.slugs.includes(slug),
      );
      if (p === -1) return;
      const s = pipelines[p].sections.findIndex((section) =>
        headingSlugs(section.element.props.children).includes(slug),
      );
      // Synchronous, so a click handler that scrolls straight afterwards
      // finds the target visible.
      const open = () => {
        setPipelineIndex(p);
        setSectionIndex(Math.max(s, 0));
      };
      // Not from an effect: React cannot flush while it is rendering.
      if (sync) flushSync(open);
      else open();
    },
    [pipelines],
  );

  // A link from elsewhere (or a reload) may name a heading in any pipeline.
  useEffect(() => {
    if (hash) reveal(decodeURIComponent(hash.slice(1)), false);
  }, [hash, reveal]);

  useEffect(() => {
    const onReveal = (event: Event) =>
      reveal((event as CustomEvent<string>).detail);
    const onHashChange = () =>
      reveal(decodeURIComponent(window.location.hash.slice(1)));
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a[href^='#']");
      const id = link?.getAttribute("href")?.slice(1);
      if (id) reveal(decodeURIComponent(id));
    };
    window.addEventListener("reveal-section", onReveal);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("reveal-section", onReveal);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
    };
  }, [reveal]);

  // The page index on the left starts below the switch and the success
  // cards (--results-toc-offset, read by .section-progress in App.css), so
  // it sits next to the sections it lists instead of next to this block.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      // The top block breaks out of the content column to the full width of
      // the screen, so the rail's column does not leave a gap beside it.
      for (const block of [barRef.current, topRef.current]) {
        if (!block) continue;
        block.style.marginLeft = "0";
        block.style.width = "auto";
        const left = block.getBoundingClientRect().left;
        block.style.marginLeft = `${-left}px`;
        block.style.width = `${document.documentElement.clientWidth}px`;
      }
      // The page index sticks below the pinned switch.
      document.documentElement.style.setProperty(
        "--results-bar-h",
        `${barRef.current?.offsetHeight ?? 0}px`,
      );
      const rail = document.querySelector(".section-progress");
      if (!topRef.current || !rail) return;
      // 32px of air between the success cards and the rail.
      const offset =
        topRef.current.getBoundingClientRect().bottom -
        rail.getBoundingClientRect().top +
        32;
      document.documentElement.style.setProperty(
        "--results-toc-offset",
        `${Math.max(offset, 0)}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    // The page index mounts after this block and moves it sideways, and the
    // page keeps growing as figures load, so measure again a few times.
    const shell = document.querySelector(".page-shell");
    if (shell) observer.observe(shell);
    const timers = [50, 300, 1000].map((ms) => window.setTimeout(measure, ms));
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
      window.removeEventListener("resize", measure);
      document.documentElement.style.removeProperty("--results-toc-offset");
      document.documentElement.style.removeProperty("--results-bar-h");
    };
  }, [pipelineIndex]);

  // Sections that were hidden when a chart mounted get their real size now.
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [pipelineIndex, sectionIndex]);

  if (!pipeline) return null;

  function go(index: number) {
    setSectionIndex(index);
    const slug = pipeline.sections[index].slug;
    history.replaceState(null, "", `#${slug}`);
    // The new section is shown once this render commits.
    window.requestAnimationFrame(() => {
      document.getElementById(slug)?.scrollIntoView({ block: "start" });
      window.dispatchEvent(new Event("scroll"));
    });
  }

  const sections = pipeline.sections;
  let sectionCounter = -1;

  return (
    <div
      ref={rootRef}
      className="results-pipelines segmented-selector segmented-selector--pipeline"
      data-active-index={pipelineIndex}
    >
      <div ref={barRef} className="results-bar">
        <div className="segmented-selector-bar" role="tablist">
          {pipelines.map((candidate, index) => (
            <button
              key={candidate.label}
              type="button"
              role="tab"
              aria-selected={index === pipelineIndex}
              className={`segmented-selector-segment segmented-selector-segment--${index}${index === pipelineIndex ? " active" : ""}`}
              onClick={() => choosePipeline(index)}
            >
              {candidate.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={topRef} className="results-top">
        {highlights}
      </div>

      <div className="segmented-selector-content">
        {pipeline.preamble.length > 0 && (
          <Fragment>{pipeline.preamble}</Fragment>
        )}
        {sections.map((section, index) => {
          sectionCounter += 1;
          const footer = (
            <div className="phase-nav">
              {index > 0 ? (
                <button
                  type="button"
                  className="phase-nav-btn"
                  onClick={() => go(index - 1)}
                >
                  <span aria-hidden="true">←</span> Previous:{" "}
                  {sections[index - 1].plainTitle}
                </button>
              ) : (
                <span />
              )}
              {index < sections.length - 1 ? (
                <button
                  type="button"
                  className="phase-nav-btn phase-nav-next"
                  onClick={() => go(index + 1)}
                >
                  Next: {sections[index + 1].plainTitle}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              ) : pipelineIndex < pipelines.length - 1 ? (
                <button
                  type="button"
                  className="phase-nav-btn phase-nav-next"
                  onClick={() => choosePipeline(pipelineIndex + 1)}
                >
                  Next: {pipelines[pipelineIndex + 1].label}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              ) : (
                nextPage && (
                  <Link to={nextPage.to} className="phase-nav-btn phase-nav-next">
                    Next: {nextPage.label} <span aria-hidden="true">→</span>
                  </Link>
                )
              )}
            </div>
          );
          return cloneElement(section.element, {
            key: `${pipeline.label}-${sectionCounter}`,
            hidden: index !== sectionIndex,
            footer,
          });
        })}
      </div>
    </div>
  );
}
