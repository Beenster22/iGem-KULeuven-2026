import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { getPathMapping, stringToSlug } from "../../utils";
import { useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Header } from "../../components/Header";
import { NotFound } from "../../components/NotFound";
import { Footer } from "../../components/Footer";
import { ScrollProgressDna } from "../../components/ScrollProgressDna";
import { applyTheme, readStoredTheme } from "../../theme";

const App = () => {
  const pathMapping = getPathMapping();
  const currentPath =
    location.pathname
      .split(`${stringToSlug(import.meta.env.VITE_TEAM_NAME)}`)
      .pop() || "/";

  // Set Page Title
  const title =
    currentPath in pathMapping ? pathMapping[currentPath].title : "Not Found";

  useEffect(() => {
    document.title = `${title || ""} | ${import.meta.env.VITE_TEAM_NAME} - iGEM ${import.meta.env.VITE_TEAM_YEAR}`;
  }, [title]);

  // Reapply any saved theme preview (see ThemeCustomizer) on every page load,
  // since it's only ever rendered on the Home page.
  useEffect(() => {
    applyTheme(readStoredTheme());
  }, []);

  return (
    <>
      {/* Navigation */}
      <Navbar />
      {/* Generated with Claude Sonnet 5 (Anthropic), 2026-07-26 */}
      {/* Purpose: DNA-styled scroll progress rail replacing the native scrollbar. */}
      <ScrollProgressDna />

      {/* Header and PageContent */}
      <Routes>
        {Object.entries(pathMapping).map(
          ([path, { title, lead, component: Component }]) => (
            <Route
              key={path}
              path={path}
              element={
                <>
                  <Header title={title || ""} lead={lead || ""} />
                  <main className="page-body">
                    <div className="container">
                      <Component />
                    </div>
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
    </>
  );
};

export default App;
