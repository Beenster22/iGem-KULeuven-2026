import type { SVGProps } from "react";
import pages from "../pages.ts";
import type { PageComponent } from "../contents";

export const getPathMapping = () => {
  return pages.reduce<{
    [key: string]: {
      name: string | undefined;
      title: string | undefined;
      component: PageComponent;
      lead: string | undefined;
      icon: React.FC<SVGProps<SVGSVGElement>> | undefined;
      specialPrize: boolean | undefined;
      // The top-level nav folder this page belongs to (e.g. "Project",
      // "Lab"), undefined for a page that isn't inside one (Home,
      // Entrepreneurship, Awards). Lets Header tint its band per folder —
      // see getFolderSlug in Header.tsx — without threading pages.ts's own
      // Folder class through, which isn't exported.
      folder: string | undefined;
    };
  }>((map, item) => {
    if ("path" in item && item.path && item.component) {
      map[item.path] = {
        name: item.name,
        title: item.title,
        component: item.component,
        lead: item.lead,
        icon: item.icon,
        specialPrize: item.specialPrize,
        folder: undefined,
      };
    } else if ("folder" in item && item.folder) {
      item.folder.forEach((page) => {
        if (page.path && page.component) {
          map[page.path] = {
            name: page.name,
            title: page.title,
            component: page.component,
            lead: page.lead,
            icon: page.icon,
            specialPrize: page.specialPrize,
            folder: item.name,
          };
        }
      });
    }
    return map;
  }, {});
};
