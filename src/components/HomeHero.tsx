// Purpose: the intro video at the top of the home page, embedded from iGEM
// Video Universe, which hands over to a still of its final frame (the team
// logo) once it has finished playing.
import { useCallback, useEffect, useRef, useState } from "react";

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-12
// Purpose: the home page hero video, embedded from iGEM Video Universe (per
// README.md's asset rules, video must be served from iGEM infrastructure).
// Plays once, muted and without player chrome, as a full-bleed background.
// api=1 turns on the PeerTube embed's postMessage API, which is how the end
// of playback is detected below.
// Edited with Claude Sonnet 5 (Anthropic), 2026-10-19: re-exported on a wide
// 2560x1080 (~2.37:1) canvas instead of 16:9, so a wide/short browser window
// no longer has to crop into the subject to fill edge-to-edge — see
// App.css's .home-hero-embed (HOME_HERO_ASPECT there must match this
// video's and FINAL_FRAME_SRC's actual pixel dimensions).
const HERO_VIDEO_ORIGIN = "https://video.igem.org";
const HERO_VIDEO_EMBED_SRC =
  `${HERO_VIDEO_ORIGIN}/videos/embed/6YDMnnzDgLhNPGTqnq4dag` +
  "?autoplay=1&muted=1&loop=0&controls=0&controlBar=0&title=0&warningTitle=0&peertubeLink=0&p2p=0&api=1";

// The frame the intro video ends on (logo + banner) — once the video
// finishes playing, it's swapped for this static image instead of looping
// or sitting idle as a paused player, since a plain <img> is cheaper to
// leave on screen indefinitely and guarantees a crisp result regardless of
// how the video's own last frame compresses. Must be an actual frame-grab
// of the video's real ending (same framing/zoom as its last frame, and same
// 2560x1080 canvas) — an unrelated banner graphic here, or a mismatched
// canvas, causes a visible jump at the handoff (2026-10-18 team feedback).
const FINAL_FRAME_SRC =
  "https://static.igem.wiki/teams/6299/wiki/home-page/empower-logo-still-wide.avif";

// The PeerTube embed talks to its parent page over jschannel: JSON strings
// with a "peertube::<method>" name. It queues its notifications until the
// parent answers its "__ready" ping, so that handshake has to be completed
// before "playbackStatusChange" (playing/paused/ended) starts arriving.
function useEmbedEnded(iframeRef: React.RefObject<HTMLIFrameElement | null>, onEnded: () => void) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const player = iframeRef.current?.contentWindow;
      if (!player || event.source !== player || event.origin !== HERO_VIDEO_ORIGIN) return;
      if (typeof event.data !== "string") return;

      let message: { method?: string; params?: { type?: string } | string };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (
        message.method === "peertube::__ready" &&
        typeof message.params === "object" &&
        message.params.type === "publish-request"
      ) {
        player.postMessage(
          JSON.stringify({ method: "peertube::__ready", params: { type: "publish-reply", publish: [] } }),
          HERO_VIDEO_ORIGIN,
        );
      } else if (message.method === "peertube::playbackStatusChange" && message.params === "ended") {
        onEnded();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeRef, onEnded]);
}

export function HomeHero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handleEnded = useCallback(() => setVideoEnded(true), []);
  useEmbedEnded(iframeRef, handleEnded);


  return (
    <div className="home-hero">
      <iframe
        ref={iframeRef}
        className="home-hero-embed"
        title="KULeuven: KU Leuven home page video (2026)"
        src={HERO_VIDEO_EMBED_SRC}
        allow="autoplay; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
      {/* Laid over the embed (same box, see App.css .home-hero-video)
          and shown instantly when the video ends, so it simply holds the
          last frame — no dissolve or resize after the logo appears
          (2026-10-18 team feedback). */}
      <img
        className={`home-hero-video${videoEnded ? " home-hero-video--shown" : ""}`}
        src={FINAL_FRAME_SRC}
        alt={`${import.meta.env.VITE_TEAM_NAME} logo`}
      />
    </div>
  );
}
