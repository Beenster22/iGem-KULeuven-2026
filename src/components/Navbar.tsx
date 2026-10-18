import { useEffect, useRef, useState, type SVGProps } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Pages from "../pages.ts";
import { useThemeMode } from "../ThemeModeContext";
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

// Same artwork as the page index and Elle's other appearances (ElleSays,
// SectionProgress) — a plain, silent mascot image here, not the speech
// bubble those use.
const MASCOT_FILLER_SRC =
  "https://static.igem.wiki/teams/6299/wiki/mascot/uterus-happy.avif";

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

type MegaMenuRow =
  | { kind: "tile"; subpage: MegaMenuEntry; tileIndex: number }
  | { kind: "divider"; key: string }
  | { kind: "filler"; key: string };

// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
// Purpose: team request — the mega-menu grid is a fixed 3 columns (see
// .mega-menu-content), so a folder whose tile count isn't a multiple of 3
// leaves empty cells in its last row. Rather than a row of 1 or 2 tiles
// trailing off, those empty cells get Elle. Only the first run of tiles
// (before any menuDivider) is padded this way — a divider already sets its
// own tiles apart deliberately (see Dry Lab in the Lab folder), so padding
// that run too would undo the separation.
function layoutMegaMenu(folder: MegaMenuEntry[]): MegaMenuRow[] {
  const rows: MegaMenuRow[] = [];
  let firstRunLength = 0;
  let firstRunClosed = false;

  const padFirstRun = () => {
    const remainder = firstRunLength % 3;
    const fillerCount = remainder === 0 ? 0 : 3 - remainder;
    for (let i = 0; i < fillerCount; i++) {
      rows.push({ kind: "filler", key: `filler-${i}` });
    }
    firstRunClosed = true;
  };

  folder.forEach((subpage, tileIndex) => {
    if (subpage.menuDivider) {
      if (!firstRunClosed) padFirstRun();
      rows.push({ kind: "divider", key: `divider-${tileIndex}` });
    } else if (!firstRunClosed) {
      firstRunLength++;
    }
    rows.push({ kind: "tile", subpage, tileIndex });
  });
  if (!firstRunClosed) padFirstRun();

  return rows;
}

export function Navbar() {
  const { mode, toggleMode } = useThemeMode();
  // Dropdowns open only on click — hovering a topic just highlights it (via
  // CSS :hover) to signal it's interactive, it no longer opens the menu.
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Closing must also drop keyboard focus from whatever's focused inside the
  // navbar — otherwise the clicked dropdown toggle keeps its CSS :focus
  // highlight (color + underline) after the menu closes, even once the mouse
  // has moved away.
  const closeNow = () => {
    setOpenMenu(null);
    const active = document.activeElement as HTMLElement | null;
    if (active && navRef.current?.contains(active)) {
      active.blur();
    }
  };

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
        >
          {item.name}
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
    <div ref={navRef}>
      <BootstrapNavbar
        expand="lg"
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
            <div className="mega-menu">
              <Container className="mega-menu-content">
                {layoutMegaMenu(activeFolder.filter((subpage) => subpage.path)).map(
                  (row) => {
                    if (row.kind === "divider") {
                      return (
                        <div
                          key={`mega-${openMenu}-${row.key}`}
                          className="mega-menu-divider"
                        />
                      );
                    }
                    if (row.kind === "filler") {
                      return (
                        <div
                          key={`mega-${openMenu}-${row.key}`}
                          className="mega-menu-filler"
                          aria-hidden="true"
                        >
                          <img src={MASCOT_FILLER_SRC} alt="" />
                        </div>
                      );
                    }
                    const { subpage, tileIndex } = row;
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
