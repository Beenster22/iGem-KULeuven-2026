import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { getPathMapping } from "../../utils";
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Header } from "../../components/Header";
import { HomeHero } from "../../components/HomeHero";
import { NotFound } from "../../components/NotFound";
import { Footer } from "../../components/Footer";
import { PageShell } from "../../components/PageShell";
import { ReadingProgressBar } from "../../components/ReadingProgressBar";
import { BackToTop } from "../../components/BackToTop";
import { ThemeModeProvider } from "../../ThemeModeContext";
import { ElleSays } from "../../components/ElleSays";

const HOME_PATH = "/";

// Generated with Claude Opus 5 (Anthropic), 2026-10-17
// Purpose: per-page decorations for the header box's right side (Header's
// `aside` prop). Keyed by path rather than threaded through pages.ts, which
// is plain data (.ts, not .tsx) and cannot hold JSX. Only the results page
// uses this today — Elle's greeting, moved here from the top of the page
// body so she sits beside the title instead of above the content.
const HEADER_ASIDE: Record<string, ReactNode> = {
  "/results": (
    <ElleSays mood="excited" size="sm" side="right">
      Here you can find all our results! Isn&rsquo;t it exciting?!
    </ElleSays>
  ),
};

const App = () => {
  const pathMapping = getPathMapping();
  // Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-19: read from the
  // router, which has already removed the base path, instead of splitting the
  // URL on the team slug — that missed on GitHub Pages (base
  // /iGem-KULeuven-2026/), so the home tab read "Not Found | EMPOWER".
  const currentPath = useLocation().pathname.replace(/(.)\/+$/, "$1") || "/";
  const isHome = currentPath === HOME_PATH;

  // The home page starts as a full-screen hero with no chrome; the navbar
  // only appears once the visitor asks for it via the reveal button. Every
  // other page always shows the navbar.
  const [navRevealed, setNavRevealed] = useState(false);
  useEffect(() => {
    if (isHome) setNavRevealed(false);
  }, [isHome]);
  useEffect(() => {
    document.body.classList.toggle("home-fullscreen", isHome && !navRevealed);
    return () => document.body.classList.remove("home-fullscreen");
  }, [isHome, navRevealed]);

  // Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-19: links to other
  // sites open in a new tab instead of replacing the wiki. Done once here, on
  // click, so it covers markdown links, JSX links and component links alike.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element).closest?.("a[href]");
      if (!link || link.hasAttribute("download") || link.hasAttribute("target")) {
        return;
      }
      let url: URL;
      try {
        url = new URL((link as HTMLAnchorElement).href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol) || url.origin === window.location.origin) {
        return;
      }
      event.preventDefault();
      window.open(url.href, "_blank", "noopener,noreferrer");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Set Page Title
  const title =
    currentPath in pathMapping ? pathMapping[currentPath].title : "Not Found";

  useEffect(() => {
    document.title = title ? `${title} | EMPOWER` : "EMPOWER";
  }, [title]);

  return (
    <ThemeModeProvider>
      {/* Navigation */}
      {(!isHome || navRevealed) && <Navbar />}
      {!isHome && <ReadingProgressBar />}
      {isHome && !navRevealed && (
        <button
          type="button"
          className="home-nav-reveal-btn"
          onClick={() => setNavRevealed(true)}
          aria-label="Show navigation menu"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Header and PageContent */}
      <Routes>
        {Object.entries(pathMapping).map(
          ([
            path,
            { title, lead, icon, specialPrize, folder, component: Component },
          ]) =>
            path === HOME_PATH ? (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <HomeHero />
                    <main className="page-body page-body--home">
                      <PageShell hideIndex>
                        <Component />
                      </PageShell>
                    </main>
                  </>
                }
              />
            ) : (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <Header
                      title={title || ""}
                      lead={lead || ""}
                      icon={icon}
                      aside={HEADER_ASIDE[path]}
                      specialPrize={specialPrize}
                      folder={folder}
                    />
                    <main className="page-body">
                      <PageShell>
                        <Component />
                      </PageShell>
                    </main>
                  </>
                }
              />
            ),
        )}
        <Route
          path="*"
          element={
            <>
              <Header
                title="Not Found"
                lead="The requested URL was not found on this server."
              />
              <main className="page-body">
                <NotFound />
              </main>
            </>
          }
        />
      </Routes>

      {/* Footer */}
      {/* MUST mention license AND have a link to team wiki's repository on gitlab.igem.org */}
      <Footer />
      <BackToTop />
    </ThemeModeProvider>
  );
};

export default App;
