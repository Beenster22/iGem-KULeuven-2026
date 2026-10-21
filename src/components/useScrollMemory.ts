// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21 (team request: the
// back button, on a phone and on a laptop, should land the reader where they
// were reading)
// Purpose: remembers how far down each visit to a page the reader got, and
// puts them back there when they return to it with the browser's back (or
// forward) button. The browser cannot do this by itself on this site: pages
// are loaded on demand and drawn by React after the navigation, and the
// long pages show one section at a time (PhasePager), so the place the
// reader left often does not exist yet, or is in a hidden section, at the
// moment the browser would restore it.
//
// Each visit is one history entry, told apart by the router's location key;
// for each, the scroll position and the open PhasePager section (its h2's
// id) are kept in sessionStorage, so they last for the tab's life, reloads
// included. On a return the section is reopened and the scroll position put
// back, again and again as the page finishes loading (figures arrive and
// push the text down), until it holds or the reader scrolls themselves.
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORE = "empower-scroll-memory";
// How long a return keeps putting the reader back while the page settles.
const RESTORE_FOR_MS = 4000;
const RESTORE_EVERY_MS = 100;
// Readings that count as "there": within a couple of pixels, a few times in
// a row (one could be a moment before a late image pushes the page down).
const NEAR_PX = 2;
const SETTLED_CHECKS = 4;
// Visits remembered; the oldest go first.
const MAX_ENTRIES = 60;

interface Place {
  y: number;
  /** id of the open PhasePager section's heading, on paged pages. */
  phase?: string;
  at: number;
}

// While a return is putting the reader back, other code that would scroll
// the page on its own (PhasePager's jump to a #hash) holds off.
export const RESTORING_ATTR = "data-restoring-scroll";

function readStore(): Record<string, Place> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? "{}") as Record<string, Place>;
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, Place>) {
  try {
    const keys = Object.keys(store);
    if (keys.length > MAX_ENTRIES) {
      keys
        .sort((a, b) => store[a].at - store[b].at)
        .slice(0, keys.length - MAX_ENTRIES)
        .forEach((key) => delete store[key]);
    }
    sessionStorage.setItem(STORE, JSON.stringify(store));
  } catch {
    // Storage full or blocked: the back button simply behaves as before.
  }
}

function openPhase(): string | undefined {
  if (!document.querySelector("[data-phase-pager]")) return undefined;
  const heading = document.querySelector<HTMLElement>("section.content-section:not([hidden]) h2[id]");
  return heading?.id || undefined;
}

export function useScrollMemory() {
  const location = useLocation();
  const navigationType = useNavigationType();
  // The first page opened in a tab has the router's shared key "default",
  // so that one is told apart by its address as well.
  const key = location.key === "default" ? `default:${location.pathname}` : location.key;

  // Remember this visit's place as the reader moves, and at the moment they
  // follow a link away (a click, before the next page replaces this one).
  useEffect(() => {
    let timer = 0;
    const save = () => {
      window.clearTimeout(timer);
      if (document.documentElement.hasAttribute(RESTORING_ATTR)) return;
      const store = readStore();
      store[key] = { y: Math.round(window.scrollY), phase: openPhase(), at: Date.now() };
      writeStore(store);
    };
    const saveSoon = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(save, 150);
    };
    window.addEventListener("scroll", saveSoon, { passive: true });
    document.addEventListener("click", save, true);
    window.addEventListener("pagehide", save);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", saveSoon);
      document.removeEventListener("click", save, true);
      window.removeEventListener("pagehide", save);
    };
  }, [key]);

  // Coming back to a visit with back/forward: put the reader where they were.
  useEffect(() => {
    if (navigationType !== "POP") return;
    const place = readStore()[key];
    if (!place) return;

    const root = document.documentElement;
    root.setAttribute(RESTORING_ATTR, "");
    if (place.phase) {
      window.dispatchEvent(new CustomEvent("reveal-section", { detail: place.phase }));
    }

    let timer = 0;
    let settled = 0;
    const started = performance.now();
    const stop = () => {
      window.clearTimeout(timer);
      root.removeAttribute(RESTORING_ATTR);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("mousedown", stop);
    };
    const putBack = () => {
      if (place.phase && document.getElementById(place.phase)?.closest("section[hidden]")) {
        window.dispatchEvent(new CustomEvent("reveal-section", { detail: place.phase }));
      }
      window.scrollTo({ top: place.y, left: 0, behavior: "instant" });
      settled = Math.abs(window.scrollY - place.y) <= NEAR_PX ? settled + 1 : 0;
      if (settled >= SETTLED_CHECKS || performance.now() - started > RESTORE_FOR_MS) {
        stop();
        return;
      }
      timer = window.setTimeout(putBack, RESTORE_EVERY_MS);
    };
    // The reader taking over (scrolling, tapping, a key) ends it at once, so
    // the page never fights them.
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    window.addEventListener("mousedown", stop);
    putBack();
    return stop;
    // Only when arriving at a visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

// The browser's own restoring would fight the one above (and jump to the old
// spot on a page that is not there yet), so it is turned off.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
