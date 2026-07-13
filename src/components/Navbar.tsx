import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Pages from "../pages.ts";

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const cancelClose = () => clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const closeNow = () => {
    cancelClose();
    setOpenMenu(null);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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
            cancelClose();
            setOpenMenu(pageIndex);
          }}
          onClick={(event) => {
            event.preventDefault();
            setOpenMenu(openMenu === pageIndex ? null : pageIndex);
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
          onMouseEnter={closeNow}
          onClick={closeNow}
        >
          {item.name}
        </Nav.Link>
      );
    }
  });

  return (
    <BootstrapNavbar
      expand="lg"
      className="navbar-empower"
      fixed="top"
      onMouseLeave={scheduleClose}
    >
      <Container>
        <BootstrapNavbar.Brand className="d-flex align-items-center gap-2">
          <img
            className="navbar-logo"
            src="https://static.igem.wiki/teams/6299/wiki/logo-wo-the-background-3.avif"
            alt={import.meta.env.VITE_TEAM_NAME}
          />
          <h1 className="navbar-brand-text">Empower</h1>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="left-aligned">{pages}</Nav>
        </BootstrapNavbar.Collapse>
      </Container>

      {activeFolder && (
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
      )}
    </BootstrapNavbar>
  );
}
