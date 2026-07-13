import { ReactNode, useMemo, useRef } from "react";
import { Inspirations, InspirationLink } from "./Inspirations";
import { SectionProgress } from "./SectionProgress";
import { extractHeadings } from "../utils/extractHeadings";

interface PageLayoutProps {
  links?: InspirationLink[];
  /** Opt in to the floating section-progress dots on this page. */
  sectionNav?: boolean;
  children: ReactNode;
}

export function PageLayout({ links, sectionNav, children }: PageLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const headings = useMemo(
    () => (sectionNav ? extractHeadings(children) : []),
    [sectionNav, children],
  );
  const showProgress = sectionNav && headings.length >= 2;

  return (
    <div className="row mt-4">
      {showProgress && <SectionProgress headings={headings} containerRef={contentRef} />}
      <div ref={contentRef} className={links ? "col-lg-8" : "col"}>
        {children}
      </div>
      {links && <Inspirations inspirationLinkList={links} />}
    </div>
  );
}
