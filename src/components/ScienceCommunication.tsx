// Generated with Claude Opus 5.5 (Anthropic), 2026-10-20
// Purpose: the showcase pieces of the Science Communication & Outreach page
// (science-communication.mdx): an Instagram-style carousel of our posts, a
// tabbed card for the articles we published, a phone mockup for the app, and
// a slot for each collaboration video. Every piece renders a clearly marked
// placeholder until its images / links / embed are filled in, so the page
// can go up before all the material has been uploaded.
import {
  Children,
  MouseEvent,
  ReactElement,
  ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { stringToSlug } from "../utils";

// Reads the props straight off slot children such as <InstagramPost> or
// <Publication>, the same way extractLabeledChildren does for TabSection.
function slotProps<P>(children: ReactNode): P[] {
  return Children.toArray(children)
    .filter((child): child is ReactElement<P> => isValidElement(child))
    .map((child) => child.props);
}

const INSTAGRAM_HANDLE = "igemkuleuven";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
// The iGEM KU Leuven logo, as on our Instagram profile.
const AVATAR_SRC = "https://static.igem.wiki/teams/6299/wiki/home-page/igem-logo.avif";

// The uploaded logo has a grey-and-white "transparency" checkerboard baked
// into its pixels. This clears every light, colourless pixel connected to the
// image border (a flood fill, so the white lettering inside the logo stays)
// and returns the result as a PNG data URL. Computed once and shared by every
// post card; falls back to the original image if anything goes wrong.
let cutoutPromise: Promise<string> | null = null;

function loadAvatarCutout(): Promise<string> {
  cutoutPromise ??= new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => resolve(AVATAR_SRC);
    img.onload = () => {
      try {
        const { naturalWidth: w, naturalHeight: h } = img;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(AVATAR_SRC);
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, w, h);
        const px = data.data;
        const isBackground = (i: number) => {
          const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
          return Math.min(r, g, b) >= 220 && Math.max(r, g, b) - Math.min(r, g, b) <= 16;
        };
        const seen = new Uint8Array(w * h);
        const stack: number[] = [];
        for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
        for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
        while (stack.length) {
          const p = stack.pop()!;
          if (seen[p] || !isBackground(p * 4)) continue;
          seen[p] = 1;
          px[p * 4 + 3] = 0;
          const x = p % w;
          if (x > 0) stack.push(p - 1);
          if (x < w - 1) stack.push(p + 1);
          if (p >= w) stack.push(p - w);
          if (p < w * (h - 1)) stack.push(p + w);
        }
        ctx.putImageData(data, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(AVATAR_SRC);
      }
    };
    img.src = AVATAR_SRC;
  });
  return cutoutPromise;
}

function useAvatarCutout() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    loadAvatarCutout().then((url) => live && setSrc(url));
    return () => {
      live = false;
    };
  }, []);
  return src;
}

/* ------------------------------------------------------------------ */
/* Instagram posts                                                     */
/* ------------------------------------------------------------------ */

interface InstagramPostProps {
  /** Short name of the post, shown on the placeholder and used as alt text. */
  title: string;
  /** One URL per slide of the post (uploaded via the iGEM uploads tool). */
  images?: string[];
  /** The post's caption, shown under the action row. */
  caption?: string;
  /** Link to the post itself on Instagram. */
  href?: string;
  /** A reel (video): the image is its cover, with a play badge that opens
   * the reel on Instagram (videos on the wiki itself must come from iGEM
   * Video Universe). */
  reel?: boolean;
}

// A labeled slot read by InstagramCarousel; never rendered on its own.
export function InstagramPost(_props: InstagramPostProps) {
  return null;
}

// On a large screen the embed player fills a whole browser tab and blows the
// vertical reel up to the full width; open it in a phone-sized window instead.
// On a phone (or if the window is blocked) the link opens normally.
function openReelWindow(event: MouseEvent<HTMLAnchorElement>) {
  if (window.innerWidth < 768) return;
  const width = 400;
  const height = Math.min(760, window.screen.availHeight - 80);
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
  const opened = window.open(
    event.currentTarget.href,
    "igem-reel",
    `popup,width=${width},height=${height},left=${left},top=${top}`,
  );
  if (opened) {
    opened.opener = null;
    event.preventDefault();
  }
}

function PostCard({ title, images = [], caption, href, reel }: InstagramPostProps) {
  const avatar = useAvatarCutout();
  const [slide, setSlide] = useState(0);
  const [captionOpen, setCaptionOpen] = useState(false);
  const count = images.length;
  // Both arrows are always there on a multi-slide post and wrap around, so a
  // reader can always step back or forward.
  const step = (direction: 1 | -1) => setSlide((slide + direction + count) % count);

  return (
    <article className="ig-post" id={stringToSlug(title)}>
      <header className="ig-post-header">
        {avatar ? (
          <img className="ig-post-avatar" src={avatar} alt="" />
        ) : (
          <span className="ig-post-avatar" aria-hidden="true" />
        )}
        <a
          className="ig-post-handle"
          href={href ?? INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {INSTAGRAM_HANDLE}
        </a>
        <span className="ig-post-more" aria-hidden="true">
          •••
        </span>
      </header>

      <div className="ig-post-media">
        {count > 0 ? (
          <img
            src={images[slide]}
            alt={`${title} — slide ${slide + 1} of ${count}`}
            loading="lazy"
          />
        ) : (
          <div className="ig-post-placeholder">
            <strong>{title}</strong>
            <span>{reel ? "Reel cover coming soon" : "Post screenshots coming soon"}</span>
          </div>
        )}
        {reel && href && (
          // Covers the whole picture, so a click anywhere on it plays the
          // reel. It opens Instagram's embed player, which plays for anyone,
          // while the normal reel page asks visitors without an account to
          // log in first.
          <a
            className="ig-post-reel"
            href={`${href.replace(/\/?$/, "/")}embed/`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch the reel “${title}”`}
            onClick={openReelWindow}
          >
            <span aria-hidden="true">▶</span>
          </a>
        )}
        {count > 1 && (
          <>
            <button
              type="button"
              className="ig-post-arrow ig-post-arrow--prev"
              aria-label="Previous slide"
              onClick={() => step(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="ig-post-arrow ig-post-arrow--next"
              aria-label="Next slide"
              onClick={() => step(1)}
            >
              ›
            </button>
          </>
        )}
        {count > 1 && (
          <div className="ig-post-dots" aria-hidden="true">
            {images.map((_, i) => (
              <span key={i} className={i === slide ? "active" : ""} />
            ))}
          </div>
        )}
      </div>

      <div className="ig-post-actions" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 21s-7.5-4.6-9.5-9.4C1.2 8.4 3.3 5 6.7 5c2 0 3.5 1.1 4.3 2.6h2C13.8 6.1 15.3 5 17.3 5c3.4 0 5.5 3.4 4.2 6.6C19.5 16.4 12 21 12 21Z" />
        </svg>
        <svg viewBox="0 0 24 24">
          <path d="M20.5 12a8.5 8.5 0 1 1-3.4-6.8A8.4 8.4 0 0 1 20.5 12Zm0 0 1 8-5-2.5" />
        </svg>
        <svg viewBox="0 0 24 24">
          <path d="M22 3 9.5 10.5M22 3l-7 18-3.5-8.5L3 9Z" />
        </svg>
        <svg viewBox="0 0 24 24" className="ig-post-save">
          <path d="M19 21l-7-5-7 5V3h14Z" />
        </svg>
      </div>

      {caption && (
        <div className="ig-post-caption">
          <p className={captionOpen ? "" : "ig-post-caption--clamped"}>
            <strong>{INSTAGRAM_HANDLE}</strong> {caption}
          </p>
          <button type="button" onClick={() => setCaptionOpen(!captionOpen)}>
            {captionOpen ? "less" : "more"}
          </button>
        </div>
      )}
    </article>
  );
}

interface InstagramCarouselProps {
  children: ReactNode;
}

// A horizontally scrolling row of Instagram-style post cards, with arrow
// buttons to page through them; each card pages through its own slides.
export function InstagramCarousel({ children }: InstagramCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posts = useMemo(() => slotProps<InstagramPostProps>(children), [children]);

  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".ig-post");
    const step = card ? card.offsetWidth + 24 : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className="ig-carousel">
      <button
        type="button"
        className="ig-carousel-arrow ig-carousel-arrow--prev"
        aria-label="Previous post"
        onClick={() => page(-1)}
      >
        ‹
      </button>
      <div className="ig-carousel-track" ref={trackRef}>
        {posts.map((post) => (
          <PostCard key={post.title} {...post} />
        ))}
      </div>
      <button
        type="button"
        className="ig-carousel-arrow ig-carousel-arrow--next"
        aria-label="Next post"
        onClick={() => page(1)}
      >
        ›
      </button>
      <p className="ig-carousel-follow">
        Follow along on{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram @{INSTAGRAM_HANDLE}
        </a>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Publications                                                        */
/* ------------------------------------------------------------------ */

interface PublicationProps {
  /** Tab label, e.g. the outlet's name. */
  label: string;
  /** Screenshot of the article (uploaded via the iGEM uploads tool). */
  image?: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
}

// A labeled slot read by PublicationShowcase; never rendered on its own.
export function Publication(_props: PublicationProps) {
  return null;
}

// One card with a tab per article: the article's preview on the left, our
// description and a link to read it on the right.
export function PublicationShowcase({ children }: { children: ReactNode }) {
  const items = useMemo(() => slotProps<PublicationProps>(children), [children]);
  const [active, setActive] = useState(0);
  const pub = items[active];

  return (
    <div className="pub-showcase">
      <div className="pub-showcase-tabs" role="tablist">
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`pub-showcase-tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {pub && (
        <div className="pub-showcase-body">
          <a
            className="pub-showcase-preview"
            href={pub.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pub.image ? (
              <img src={pub.image} alt={`${pub.label} article`} loading="lazy" />
            ) : (
              <span className="pub-showcase-placeholder">
                <strong>{pub.label}</strong>
                Article screenshot coming soon
              </span>
            )}
          </a>
          <div className="pub-showcase-text">
            {pub.children}
            <a
              className="pub-showcase-link"
              href={pub.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pub.linkLabel} ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App phone mockup                                                    */
/* ------------------------------------------------------------------ */

interface PhoneShowcaseProps {
  /** A web build of the app to embed live inside the phone. */
  src?: string;
  /** Otherwise: screenshots of the app's screens, tapped through in order. */
  screens?: string[];
  title?: string;
}

// A phone frame showing the app: live (src), as tap-through screenshots
// (screens), or a placeholder until either is available.
export function PhoneShowcase({ src, screens = [], title = "Our app" }: PhoneShowcaseProps) {
  const [screen, setScreen] = useState(0);
  const count = screens.length;

  return (
    <div className="phone-showcase">
      <div className="phone-frame">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-screen">
          {src ? (
            <iframe src={src} title={title} />
          ) : count > 0 ? (
            <button
              type="button"
              className="phone-screen-tap"
              onClick={() => setScreen((screen + 1) % count)}
              aria-label="Next screen"
            >
              <img src={screens[screen]} alt={`${title} — screen ${screen + 1} of ${count}`} />
            </button>
          ) : (
            <div className="phone-placeholder">
              <strong>{title}</strong>
              <span>App preview coming soon</span>
            </div>
          )}
        </div>
      </div>
      {!src && count > 1 && (
        <div className="phone-controls">
          <button
            type="button"
            onClick={() => setScreen((screen - 1 + count) % count)}
            aria-label="Previous screen"
          >
            ‹
          </button>
          <span>
            {screen + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => setScreen((screen + 1) % count)}
            aria-label="Next screen"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Collaboration videos                                                */
/* ------------------------------------------------------------------ */

interface VideoSlotProps {
  title: string;
  /** A video.igem.org embed URL — iGEM requires videos to be hosted there. */
  embedSrc?: string;
  /** Cover image shown until the reader presses play (uploaded via the iGEM
   * uploads tool). Shown whole at its own proportions, never stretched. */
  poster?: string;
}

export function VideoSlot({ title, embedSrc, poster }: VideoSlotProps) {
  const [playing, setPlaying] = useState(false);

  if (embedSrc && poster && !playing) {
    return (
      <div className="video-slot">
        <button
          type="button"
          className="video-slot-cover"
          aria-label={`Play ${title}`}
          onClick={() => setPlaying(true)}
        >
          {/* A blurred copy fills the 16:9 box behind the cover, the way the
              video player itself pads a portrait video. */}
          <img className="video-slot-cover-backdrop" src={poster} alt="" />
          <img className="video-slot-cover-image" src={poster} alt="" />
          <span className="video-slot-play" aria-hidden="true">
            ▶
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="video-slot">
      {embedSrc ? (
        <iframe
          src={playing ? `${embedSrc}${embedSrc.includes("?") ? "&" : "?"}autoplay=1` : embedSrc}
          allow="autoplay; fullscreen"
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      ) : (
        <div className="video-slot-placeholder">
          <span className="video-slot-play" aria-hidden="true">
            ▶
          </span>
          <strong>{title}</strong>
          <span>Video coming soon</span>
        </div>
      )}
    </div>
  );
}
