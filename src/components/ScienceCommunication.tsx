// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: the showcase pieces for the Science Communication & Community page — an
// Instagram-style post carousel (screenshots of our real posts), a tabbed showcase for
// documents such as flyers and posters, a phone frame for an embedded page, and a video
// slot. Every piece shows a dashed placeholder until its image / link is supplied, so
// nothing is invented. Styled by the `.ig-*`, `.pub-showcase-*`, `.phone-*` and
// `.video-slot-*` rules in App.css.
import { ReactNode, useRef, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/igemkuleuven/";
const HANDLE = "igemkuleuven";

interface InstagramPostProps {
  /** One screenshot, or several for a swipeable multi-image post. Omit while waiting for the file. */
  images?: string[];
  caption?: ReactNode;
  /** Permalink of the post on Instagram. */
  href?: string;
  /** Shown in the placeholder so the team knows which post belongs here. */
  label?: string;
}

function ActionIcons() {
  return (
    <div className="ig-post-actions" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.3 3.5 5 6.8 5c2 0 3.4 1.1 5.2 3 1.8-1.9 3.2-3 5.2-3 3.3 0 5.4 3.300 4.100 6.800C19.500 16.400 12 21 12 21z" /></svg>
      <svg viewBox="0 0 24 24"><path d="M21 12a8.500 8.500 0 0 1-12.300 7.600L3 21l1.400-5.500A8.500 8.500 0 1 1 21 12z" /></svg>
      <svg viewBox="0 0 24 24"><path d="M22 3 2 10.500l7.500 3L12.500 21 22 3zM9.500 13.500 22 3" /></svg>
      <svg className="ig-post-save" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.500L6 21V3z" /></svg>
    </div>
  );
}

export function InstagramPost({ images = [], caption, href, label }: InstagramPostProps) {
  const [index, setIndex] = useState(0);
  const multi = images.length > 1;
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);
  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <a className="ig-post-handle" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          {HANDLE}
        </a>
        <span className="ig-post-more" aria-hidden="true">•••</span>
      </div>
      <div className="ig-post-media">
        {images.length > 0 ? (
          <>
            <img src={images[index]} alt={label ?? "Instagram post from @igemkuleuven"} loading="lazy" />
            {multi && (
              <>
                <button type="button" className="ig-post-arrow ig-post-arrow--prev" aria-label="Previous image" onClick={() => step(-1)}>‹</button>
                <button type="button" className="ig-post-arrow ig-post-arrow--next" aria-label="Next image" onClick={() => step(1)}>›</button>
                <div className="ig-post-dots">
                  {images.map((_, i) => <span key={i} className={i === index ? "active" : undefined} />)}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="ig-post-placeholder">
            <strong>{label ?? "Instagram post"}</strong>
            <span>Screenshot coming soon</span>
          </div>
        )}
      </div>
      <ActionIcons />
      <p className="ig-post-caption">
        {caption}
        {href && (
          <>
            {caption ? " " : ""}
            <a href={href} target="_blank" rel="noreferrer">View on Instagram</a>
          </>
        )}
      </p>
    </article>
  );
}

export function InstagramCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement | null>(null);
  const scroll = (d: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: d * Math.max(el.clientWidth * 0.8, 280), behavior: "smooth" });
  };
  return (
    <div className="ig-carousel">
      <button type="button" className="ig-carousel-arrow ig-carousel-arrow--prev" aria-label="Scroll posts left" onClick={() => scroll(-1)}>‹</button>
      <div className="ig-carousel-track" ref={track}>{children}</div>
      <button type="button" className="ig-carousel-arrow ig-carousel-arrow--next" aria-label="Scroll posts right" onClick={() => scroll(1)}>›</button>
      <p className="ig-carousel-follow">
        Follow along on Instagram:{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@{HANDLE}</a>
      </p>
    </div>
  );
}

interface ShowcaseItemProps {
  label: string;
  /** Preview image (e.g. the first page of a flyer), uploaded via the iGEM uploads tool. */
  image?: string;
  /** Where the full document lives; the button only appears once this is set. */
  href?: string;
  children?: ReactNode;
}

// Never rendered directly — PublicationShowcase reads its props.
export function ShowcaseItem({ children }: ShowcaseItemProps) {
  return <>{children}</>;
}

export function PublicationShowcase({ children }: { children: ReactNode }) {
  const items = (Array.isArray(children) ? children : [children]).filter(
    (c): c is { props: ShowcaseItemProps } & object => !!c && typeof c === "object" && "props" in c,
  );
  const [active, setActive] = useState(0);
  const item = items[active]?.props;
  if (!item) return null;
  return (
    <div className="pub-showcase">
      <div className="pub-showcase-tabs" role="tablist">
        {items.map(({ props }, i) => (
          <button
            key={props.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`pub-showcase-tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {props.label}
          </button>
        ))}
      </div>
      <div className="pub-showcase-body">
        {item.image ? (
          <a className="pub-showcase-preview" href={item.href} target="_blank" rel="noreferrer">
            <img src={item.image} alt={`${item.label} preview`} loading="lazy" />
          </a>
        ) : (
          <div className="pub-showcase-preview">
            <div className="pub-showcase-placeholder">
              <strong>{item.label}</strong>
              <span>Preview coming soon</span>
            </div>
          </div>
        )}
        <div className="pub-showcase-text">
          {item.children}
          {item.href && (
            <a className="pub-showcase-link" href={item.href} target="_blank" rel="noreferrer">
              Open {item.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface PhoneScreen {
  title: string;
  /** Page to show inside the phone. */
  src?: string;
  /** Screenshot shown instead of a live page. */
  image?: string;
}

export function PhoneShowcase({ screens }: { screens: PhoneScreen[] }) {
  const [i, setI] = useState(0);
  const screen = screens[i];
  if (!screen) return null;
  return (
    <div className="phone-showcase">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          {screen.src ? (
            <iframe src={screen.src} title={screen.title} loading="lazy" />
          ) : screen.image ? (
            <img src={screen.image} alt={screen.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div className="phone-placeholder">
              <strong>{screen.title}</strong>
              <span>Coming soon</span>
            </div>
          )}
        </div>
      </div>
      {screens.length > 1 && (
        <div className="phone-controls">
          <button type="button" aria-label="Previous" onClick={() => setI((i - 1 + screens.length) % screens.length)}>‹</button>
          <span>{screen.title}</span>
          <button type="button" aria-label="Next" onClick={() => setI((i + 1) % screens.length)}>›</button>
        </div>
      )}
    </div>
  );
}

/** A 16:9 slot for a video hosted on the iGEM servers (or an embeddable player). */
export function VideoSlot({ src, title }: { src?: string; title: string }) {
  return (
    <div className="video-slot">
      {src ? (
        <iframe src={src} title={title} allowFullScreen loading="lazy" />
      ) : (
        <div className="video-slot-placeholder">
          <div className="video-slot-play" aria-hidden="true">▶</div>
          <strong>{title}</strong>
          <span>Video coming soon</span>
        </div>
      )}
    </div>
  );
}
