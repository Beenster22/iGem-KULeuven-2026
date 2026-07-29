import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Pages from "../pages.ts";
import { useThemeMode } from "../ThemeModeContext";

// Generated with Claude Sonnet 5 (Anthropic), 2026-07-26
// Purpose: the icon-only logo mark, swapped per theme so its ink color
// always contrasts with the light/dark logo-circle badge behind it.
const NAVBAR_LOGO_BY_MODE = {
  light:
    "https://static.igem.wiki/teams/6299/wiki/icons/logo-dark-purple-no-text.avif",
  dark: "https://static.igem.wiki/teams/6299/wiki/icons/logo-light-purple-no-text.avif",
} as const;

export function Navbar() {
  const { mode, toggleMode } = useThemeMode();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  // True once a folder was opened by a click rather than hover — pinned menus
  // ignore mouse-leave entirely and only close via an explicit click.
  const [pinned, setPinned] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navRef = useRef<HTMLDivElement>(null);

  const cancelClose = () => clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    if (pinned) return;
    closeTimer.current = setTimeout(() => setOpenMenu(null), 250);
  };
  const closeNow = () => {
    cancelClose();
    setOpenMenu(null);
    setPinned(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // A pinned (clicked-open) menu only closes when the user clicks somewhere
  // outside the navbar/mega-menu, or clicks another category (handled below).
  useEffect(() => {
    if (!pinned) return;
    const onClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeNow();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [pinned]);

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
          className={openMenu === pageIndex ? "show" : ""}
          aria-expanded={openMenu === pageIndex}
          aria-haspopup="true"
          onMouseEnter={() => {
            if (pinned) return;
            cancelClose();
            setOpenMenu(pageIndex);
          }}
          onClick={(event) => {
            event.preventDefault();
            cancelClose();
            if (pinned && openMenu === pageIndex) {
              setOpenMenu(null);
              setPinned(false);
            } else {
              setOpenMenu(pageIndex);
              setPinned(true);
            }
          }}
        >
          {item.name}
        </Nav.Link>
      );
    } else if ("path" in item && item.path) {
      return (
        <Nav.Link
          key={`page-${pageIndex}`}
          as={Link}
          to={item.path}
          onMouseEnter={() => {
            if (!pinned) closeNow();
          }}
          onClick={closeNow}
        >
          {item.name}
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
        onMouseLeave={scheduleClose}
      >
        <Container>
          <BootstrapNavbar.Brand className="d-flex align-items-center gap-2">
            <span className="navbar-logo-circle">
              <img
                className="navbar-logo-img"
                src={NAVBAR_LOGO_BY_MODE[mode]}
                alt={import.meta.env.VITE_TEAM_NAME}
              />
            </span>
            <h1 className="navbar-brand-text">Empower</h1>
          </BootstrapNavbar.Brand>
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
            {/* Generated with Claude Sonnet 5 (Anthropic), 2026-07-26
                Purpose: invisible strip bridging the visual gap between the
                navbar and the mega-menu, so hovering across that gap never
                triggers a close (previously the sole mouseleave/timeout race
                made the menu disappear if the cursor lingered in the gap). */}
            <div
              className="mega-menu-bridge"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            />
            <div
              className="mega-menu"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <Container className="mega-menu-content">
                {activeFolder.map((subpage, subpageIndex) =>
                  subpage.path ? (
                    <Link
                      key={`mega-${openMenu}-${subpageIndex}`}
                      to={subpage.path}
                      className="mega-menu-link"
                      onClick={closeNow}
                    >
                      <span className="mega-menu-link-name">{subpage.name}</span>
                      {subpage.lead && (
                        <span className="mega-menu-link-lead">
                          {subpage.lead}
                        </span>
                      )}
                    </Link>
                  ) : null,
                )}
              </Container>
            </div>
          </>
        )}
      </BootstrapNavbar>
    </div>
  );
}
