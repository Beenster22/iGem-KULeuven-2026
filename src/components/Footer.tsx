import { stringToSlug } from "../utils";
import { SponsorCarousel, SponsorLogo } from "./SponsorCarousel";

const SOCIAL_LINKS = [
  {
    label: "TikTok",
    handle: "@igem_kuleuven",
    href: "https://www.tiktok.com/@igem_kuleuven",
    icon: (
      <path d="M13.5 3c.4 2.2 2 3.9 4.2 4.2v2.4c-1.5-.1-2.9-.6-4.1-1.4v6.4a5 5 0 1 1-4.3-4.9v2.5a2.5 2.5 0 1 0 1.8 2.4V3h2.4z" />
    ),
  },
  {
    label: "LinkedIn",
    handle: "KU Leuven iGEM",
    href: "https://www.linkedin.com/company/kuleuvenigem/posts/?feedView=all",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8" cy="8.5" r="1.3" />
        <rect x="7" y="11" width="2" height="7" />
        <path d="M12 11h2v1.1c.6-.8 1.6-1.3 2.7-1.3 2 0 3.3 1.3 3.3 3.9V18h-2v-3c0-1.3-.5-2.1-1.7-2.1-1 0-1.6.7-1.9 1.3-.1.2-.1.5-.1.8V18h-2z" />
      </>
    ),
  },
  {
    label: "Instagram",
    handle: "@igemkuleuven",
    href: "https://www.instagram.com/igemkuleuven/",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" />
      </>
    ),
  },
  {
    label: "iGEM Leuven website",
    handle: "igemleuven.be",
    href: "https://igemleuven.be/",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3 12h18M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </>
    ),
  },
];

export function Footer() {
  const teamYear = import.meta.env.VITE_TEAM_YEAR;
  const teamName = import.meta.env.VITE_TEAM_NAME;
  const teamSlug = stringToSlug(teamName);

  return (
    // Layout/typography/hover styling below is inspired by the 2025 Heidelberg
    // iGEM team's wiki footer (https://2025.igem.wiki/heidelberg/), adapted to
    // keep our dark purple background and light text instead of their light theme.
    <footer className="pt-5 pb-5 footer py-5 mt-5 footer-empower">
      <div className="container">
        <div className="row mb-4 footer-top-row align-items-center g-2">
          <div className="col-lg-auto col-12 d-flex justify-content-center justify-content-lg-start footer-logo-container">
            <div className="footer-logo-circle">
              <img
                className="footer-logo-img"
                src="https://static.igem.wiki/teams/6299/wiki/icons/logo-dark-purple-text.avif"
                alt={teamName}
              />
            </div>
          </div>
          <div className="col-lg col-12 mt-4 mt-lg-0">
            <h4>Follow Us</h4>
            <ul className="footer-social-list">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer noopener">
                    <span className="footer-icon-box" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        {social.icon}
                      </svg>
                    </span>
                    <span className="footer-social-handle">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg col-12 mt-4 mt-lg-0">
            <h4 className="mb-3">Contact</h4>
            <p>
              Herestraat 49 Box 1030
              <br />
              Leuven 3000, Belgium
            </p>
            <p>
              <a href="mailto:finance@igemleuven.be">finance@igemleuven.be</a>
            </p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <h4 className="mb-3">Our Sponsors</h4>
            {/* Example usage: copy this SponsorCarousel block and add/remove
                <SponsorLogo> children — it revolves through whatever you put
                inside. Pass a real `src` (uploaded via the iGEM uploads tool)
                and an optional `href` for each sponsor; omit `src` to fall
                back to a text placeholder like the ones below. */}
            <SponsorCarousel>
              <SponsorLogo name="Sponsor One" />
              <SponsorLogo name="Sponsor Two" />
              <SponsorLogo name="Sponsor Three" />
              <SponsorLogo name="Sponsor Four" />
              <SponsorLogo name="Sponsor Five" />
            </SponsorCarousel>
          </div>
        </div>
        <hr />
        {/* The following MUST be on every page: license information and link to the repository on gitlab.igem.org */}
        <div className="row mt-4 justify-content-center text-center footer-bottom-row">
          <div className="col-lg-8 col-12">
            <p className="mb-0">
              <small>
                © {teamYear} - Content on this site is licensed under a{" "}
                <a
                  className="subfoot"
                  href="https://creativecommons.org/licenses/by/4.0/"
                  rel="license"
                >
                  Creative Commons Attribution 4.0 International license
                </a>
                .
              </small>
            </p>
            <p>
              <small>
                The repository used to create this website is available at{" "}
                <a href={`https://gitlab.igem.org/${teamYear}/${teamSlug}`}>
                  gitlab.igem.org/{teamYear}/{teamSlug}
                </a>
                .
              </small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
