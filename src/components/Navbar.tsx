import { useEffect, useRef, useState, type SVGProps } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import Pages from "../pages.ts";
import { useThemeMode } from "../ThemeModeContext";
import { folderSlug } from "../utils";
import { renderItalics } from "../utils/renderItalics";
import { SearchButton } from "./Search";

// Generated with Claude Sonnet 5 (Anthropic), 2026-09-08
// Purpose: the stylized "Empower" wordmark, swapped per theme — each image
// already carries its own background block matching that theme's
// --color-page-bg, so it blends into the navbar without a separate badge.
const NAVBAR_BRAND_MARK_BY_MODE = {
  light:
    "https://static.igem.wiki/teams/6299/wiki/icons/empower-stylized-name-light-mode.avif",
  dark: "https://static.igem.wiki/teams/6299/wiki/icons/empower-stylized-name-dark-mode.avif",
} as const;

// The handful of fields a mega-menu tile actually needs — a local shape
// rather than importing pages.ts's own Page class, which isn't exported.
interface MegaMenuEntry {
  name: string | undefined;
  path: string | undefined;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  lead?: string;
  specialPrize?: boolean;
  menuDivider?: boolean;
}

type MegaMenuTile = { subpage: MegaMenuEntry; tileIndex: number };
type MegaMenuGroup =
  | { kind: "row"; tiles: MegaMenuTile[]; centered: boolean; key: string }
  | { kind: "divider"; key: string };

// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
// Purpose: team request — 3 tiles per row, never 4; a folder whose tile
// count isn't a multiple of 3 gets a shorter trailing row of 1 or 2, its
// tiles lined up under the first column(s) above (see
// .mega-menu-row--centered — edited 2026-10-19: it used to centre them),
// not padded with filler content. A menuDivider tile still starts a fresh row
// of its own (see Dry Lab... though nothing uses it right now).
function layoutMegaMenu(folder: MegaMenuEntry[]): MegaMenuGroup[] {
  const groups: MegaMenuGroup[] = [];
  let current: MegaMenuTile[] = [];

  const flushRows = () => {
    for (let i = 0; i < current.length; i += 3) {
      const tiles = current.slice(i, i + 3);
      groups.push({
        kind: "row",
        tiles,
        centered: tiles.length < 3,
        key: `row-${tiles[0].tileIndex}`,
      });
    }
    current = [];
  };

  folder.forEach((subpage, tileIndex) => {
    if (subpage.menuDivider) {
      flushRows();
      groups.push({ kind: "divider", key: `divider-${tileIndex}` });
    }
    current.push({ subpage, tileIndex });
  });
  flushRows();

  return groups;
}

export function Navbar() {
  const { mode, toggleMode } = useThemeMode();
  // Dropdowns open only on click — hovering a topic just highlights it (via
  // CSS :hover) to signal it's interactive, it no longer opens the menu.
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { pathname: currentPath } = useLocation();
  // Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request,
  // phones): the collapsed menu is controlled here so it can close itself
  // once a page is picked, and the bar slides away while reading (down) and
  // returns on the way back up (see .navbar-auto-hide in App.css).
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request:
  // color-code the top-level folders — see Header.tsx's matching data-folder
  // tint). The folder containing the page you're actually on gets a quiet
  // underline in its color even with the mega-menu closed, so "which section
  // am I in" doesn't require opening it.
  const currentFolderIndex = Pages.findIndex(
    (item) =>
      "folder" in item &&
      item.folder?.some((subpage) => subpage.path === currentPath),
  );

  // Generated with Claude Opus 5 (Anthropic), 2026-10-19 (team feedback: a
  // home-page sentence sat right under the navigation bar): --home-nav-h is
  // what every home section leaves clear at the top, and it was a flat 64px
  // (see HOME SNAP SECTIONS in App.css), which is short whenever the bar
  // wraps to two rows on a narrow window. Measured here instead, so those
  // sections always start below the bar as it really is. Taken off the body
  // when the bar goes, leaving the stylesheet's own value.
  useEffect(() => {
    const bar = navRef.current?.querySelector(".navbar-empower");
    if (!bar) return;
    const measure = () =>
      document.body.style.setProperty(
        "--home-nav-h",
        `${Math.round(bar.getBoundingClientRect().height)}px`,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    window.addEventListener("resize", measure);
    // The bar grows a row taller once the logo and the fonts land, which
    // does not always reach the observer — measure again as it settles.
    const timers = [50, 300, 1000].map((ms) => window.setTimeout(measure, ms));
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      timers.forEach(window.clearTimeout);
      document.body.style.removeProperty("--home-nav-h");
    };
  }, []);

  // Closing must also drop keyboard focus from whatever's focused inside the
  // navbar — otherwise the clicked dropdown toggle keeps its CSS :focus
  // highlight (color + underline) after the menu closes, even once the mouse
  // has moved away.
  const closeNow = () => {
    setOpenMenu(null);
    setExpanded(false);
    const active = document.activeElement as HTMLElement | null;
    if (active && navRef.current?.contains(active)) {
      active.blur();
    }
  };

  useEffect(() => {
    setExpanded(false);
  }, [currentPath]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setHidden(y > lastY && y > 80);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // An open (clicked-open) menu only closes when the user clicks somewhere
  // outside the navbar/mega-menu, or clicks another category (handled below).
  useEffect(() => {
    if (openMenu === null) return;
    const onClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeNow();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [openMenu]);

  const activeItem = openMenu !== null ? Pages[openMenu] : undefined;
  const activeFolder =
    activeItem && "folder" in activeItem && activeItem.folder
      ? activeItem.folder
      : undefined;

  const pages = Pages.map((item, pageIndex) => {
    if ("folder" in item && item.folder) {
      return (
        <Nav.Link
          key={`page-${pageIndex}`}
          href="#"
          className={`nav-link-dropdown ${openMenu === pageIndex ? "show" : ""}`}
          data-folder={folderSlug(item.name)}
          data-folder-current={currentFolderIndex === pageIndex ? "true" : undefined}
          aria-expanded={openMenu === pageIndex}
          aria-haspopup="true"
          onClick={(event) => {
            event.preventDefault();
            if (openMenu === pageIndex) {
              closeNow();
            } else {
              setOpenMenu(pageIndex);
            }
          }}
        >
          {item.name}
          {item.folder.some((subpage) => subpage.specialPrize) && (
            <span className="nav-link-prize-star" aria-label="Special prize">
              ★
            </span>
          )}
          <svg
            className="nav-link-caret"
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Nav.Link>
      );
    } else if ("path" in item && item.path) {
      return (
        <Nav.Link
          key={`page-${pageIndex}`}
          as={Link}
          to={item.path}
          onClick={closeNow}
          className={item.glitter ? "nav-link-glitter" : undefined}
        >
          {item.glitter ? (
            <>
              <span className="nav-glitter-text">{item.name}</span>
              <span className="nav-glitter-spark nav-glitter-spark--1" aria-hidden="true">✦</span>
              <span className="nav-glitter-spark nav-glitter-spark--2" aria-hidden="true">✧</span>
              <span className="nav-glitter-spark nav-glitter-spark--3" aria-hidden="true">✦</span>
              <span className="nav-glitter-spark nav-glitter-spark--4" aria-hidden="true">✧</span>
              <span className="nav-glitter-spark nav-glitter-spark--5" aria-hidden="true">✦</span>
              <span className="nav-glitter-spark nav-glitter-spark--6" aria-hidden="true">✧</span>
              <span className="nav-glitter-spark nav-glitter-spark--7" aria-hidden="true">✦</span>
            </>
          ) : (
            item.name
          )}
          {item.specialPrize && (
            <span className="nav-link-prize-star" aria-label="Special prize">
              ★
            </span>
          )}
        </Nav.Link>
      );
    }
  });

  return (
    // Generated with Claude Sonnet 5 (Anthropic), 2026-07-26
    // Purpose: wrapping ref lets the click-outside handler below detect
    // clicks anywhere outside the navbar + mega-menu, regardless of their
    // fixed positioning.
    <div
      ref={navRef}
      className={
        hidden && !expanded && openMenu === null ? "navbar-auto-hide is-hidden" : "navbar-auto-hide"
      }
    >
      <BootstrapNavbar
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        variant={mode === "dark" ? "dark" : "light"}
        className="navbar-empower"
        fixed="top"
      >
        <Container>
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center"
            onClick={closeNow}
          >
            <img
              className="navbar-brand-mark"
              src={NAVBAR_BRAND_MARK_BY_MODE[mode]}
              alt={import.meta.env.VITE_TEAM_NAME}
            />
          </BootstrapNavbar.Brand>
          <SearchButton />
          <button
            type="button"
            className="navbar-theme-toggle"
            onClick={toggleMode}
            aria-label={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {mode === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="5" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="left-aligned">{pages}</Nav>
          </BootstrapNavbar.Collapse>
        </Container>

        {activeFolder && (
          <>
            <div className="mega-menu-bridge" />
            <div className="mega-menu" data-folder={folderSlug(activeItem?.name)}>
              <Container className="mega-menu-content">
                {layoutMegaMenu(activeFolder.filter((subpage) => subpage.path)).map(
                  (group) => {
                    if (group.kind === "divider") {
                      return (
                        <div
                          key={`mega-${openMenu}-${group.key}`}
                          className="mega-menu-divider"
                        />
                      );
                    }
                    return (
                      <div
                        key={`mega-${openMenu}-${group.key}`}
                        className={`mega-menu-row${group.centered ? " mega-menu-row--centered" : ""}`}
                      >
                        {group.tiles.map(({ subpage, tileIndex }) => {
                          const Icon = subpage.icon;
                          return (
                            <Link
                              key={`mega-${openMenu}-${tileIndex}`}
                              to={subpage.path!}
                              className={`mega-menu-link mega-menu-link--${tileIndex % 2 === 0 ? "dark" : "light"}`}
                              onClick={closeNow}
                            >
                              {Icon && (
                                <span className="mega-menu-link-icon" aria-hidden="true">
                                  <Icon />
                                </span>
                              )}
                              <span className="mega-menu-link-text">
                                <span className="mega-menu-link-name">
                                  {subpage.name}
                                  {subpage.specialPrize && (
                                    <span className="mega-menu-link-prize">
                                      <span aria-hidden="true">★</span> Special prize
                                    </span>
                                  )}
                                </span>
                                {subpage.lead && (
                                  <span className="mega-menu-link-lead">
                                    {renderItalics(subpage.lead)}
                                  </span>
                                )}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  },
                )}
              </Container>
            </div>
          </>
        )}
      </BootstrapNavbar>
    </div>
  );
}
