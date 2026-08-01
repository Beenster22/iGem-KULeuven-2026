import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { getPathMapping, stringToSlug } from "../../utils";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Header } from "../../components/Header";
import { HomeHero } from "../../components/HomeHero";
import { NotFound } from "../../components/NotFound";
import { Footer } from "../../components/Footer";
import { PageShell } from "../../components/PageShell";
import { ThemeModeProvider } from "../../ThemeModeContext";

const HOME_PATH = "/";

const App = () => {
  const pathMapping = getPathMapping();
  const currentPath =
    location.pathname
      .split(`${stringToSlug(import.meta.env.VITE_TEAM_NAME)}`)
      .pop() || "/";
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

  // Set Page Title
  const title =
    currentPath in pathMapping ? pathMapping[currentPath].title : "Not Found";

  useEffect(() => {
    document.title = `${title || ""} | ${import.meta.env.VITE_TEAM_NAME} - iGEM ${import.meta.env.VITE_TEAM_YEAR}`;
  }, [title]);

  return (
    <ThemeModeProvider>
      {/* Navigation */}
      {(!isHome || navRevealed) && <Navbar />}
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
          ([path, { title, lead, component: Component }]) =>
            path === HOME_PATH ? (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <HomeHero />
                    <main className="page-body">
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
                    <Header title={title || ""} lead={lead || ""} />
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
    </ThemeModeProvider>
  );
};

export default App;
