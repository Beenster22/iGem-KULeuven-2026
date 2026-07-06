import { ReactNode } from "react";
import { Inspirations, InspirationLink } from "./Inspirations";

interface PageLayoutProps {
  links?: InspirationLink[];
  children: ReactNode;
}

export function PageLayout({ links, children }: PageLayoutProps) {
  return (
    <div className="row mt-4">
      <div className={links ? "col-lg-8" : "col"}>{children}</div>
      {links && <Inspirations inspirationLinkList={links} />}
    </div>
  );
}
