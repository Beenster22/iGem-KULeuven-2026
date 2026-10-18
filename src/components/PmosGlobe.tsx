// Purpose: interactive, spinnable 3D globe — click any country to see the
// PMOS estimate for its continent (figures in pmosContinentStats.ts).
// Country outlines are bundled locally from the `world-atlas` npm package
// (not fetched from a CDN at runtime) to comply with the "everything must be
// served from iGEM infrastructure" asset rule in README.md. The globe itself
// uses a flat brand-colored material instead of a photographic Earth
// texture, so no texture image needs hosting either.
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import Globe, { GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import worldTopo from "world-atlas/countries-110m.json";
import { useReducedMotion } from "framer-motion";
import { useThemeMode } from "../ThemeModeContext";
import { GLOBE_LANDED, globeDropProgress, PMOS_EFFECTS_ID } from "./globeDrop";
import { Continent, COUNTRY_ID_TO_CONTINENT } from "./pmosContinents";
import {
  PMOS_CONTINENT_NOTES,
  PMOS_STATS_BY_CONTINENT,
} from "./pmosContinentStats";

interface CountryProps {
  name: string;
}

const CONTINENT_COLOR: Record<Continent, string> = {
  Africa: "#E8A0BF",
  Asia: "#2FA4A9",
  Europe: "#C9BDE8",
  "North America": "#8C7AE6",
  "South America": "#F0C674",
  Oceania: "#7FC8A9",
};
const UNMAPPED_COLOR = "#888888";

const topology = worldTopo as unknown as Topology;
const countries = (
  feature(
    topology,
    topology.objects.countries as GeometryCollection,
  ) as FeatureCollection<Geometry, CountryProps>
).features;

function continentOf(
  country: Feature<Geometry, CountryProps>,
): Continent | undefined {
  return COUNTRY_ID_TO_CONTINENT[String(country.id)];
}

function colorOf(country: Feature<Geometry, CountryProps>): string {
  const continent = continentOf(country);
  return continent ? CONTINENT_COLOR[continent] : UNMAPPED_COLOR;
}

// Blends a hex color toward white — used to brighten the hovered country so
// hovering reads as an interactive highlight, not just a cursor change.
function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const channel = (shift: number) => {
    const value = (num >> shift) & 0xff;
    return Math.round(value + (255 - value) * amount);
  };
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

// The sphere's share of the canvas width, at the altitude-2.2 view set
// below: globe.gl's camera has a 50° field of view and sits 3.2 globe radii
// from the centre, so the sphere spans tan(asin(1 / 3.2)) / tan(25°) of it.
const SPHERE_FRACTION =
  Math.tan(Math.asin(1 / 3.2)) / Math.tan((25 * Math.PI) / 180);

const EASE_IN_OUT = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18 (team request): as
// the next screen ("PMOS manifests differently in patients") scrolls in, the
// globe falls onto its first circle, shrinking to that circle's size, and
// fades into a plain disc in its colours — the circle itself then takes over
// (see globeDrop.ts). Written straight to the element's style each frame
// rather than through React state, so scrolling doesn't re-render the globe.
function useGlobeDrop(
  stageRef: RefObject<HTMLDivElement | null>,
  flyRef: RefObject<HTMLDivElement | null>,
) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const fly = flyRef.current;
    if (!stage || !fly || prefersReducedMotion) return;
    const wrap = stage.closest<HTMLElement>(".pmos-globe-wrap");
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const progress = globeDropProgress();
      const target = document
        .getElementById(PMOS_EFFECTS_ID)
        ?.querySelector<HTMLElement>(".pmos-effect-art");
      if (!progress || !target) {
        fly.style.transform = "";
        fly.style.removeProperty("--morph");
        wrap?.classList.remove("is-dropping", "is-landed");
        return;
      }
      // The stage itself never moves, so it still marks where the globe
      // would be without the drop.
      const from = stage.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const eased = EASE_IN_OUT(progress);
      const dx =
        (to.left + to.width / 2 - (from.left + from.width / 2)) * eased;
      const dy =
        (to.top + to.height / 2 - (from.top + from.height / 2)) * eased;
      const endScale = to.width / (from.width * SPHERE_FRACTION);
      const scale = 1 + (endScale - 1) * eased;
      fly.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      fly.style.setProperty("--fly-scale", String(scale));
      // The globe turns into the disc over the last stretch of the fall.
      fly.style.setProperty(
        "--morph",
        String(Math.min(1, Math.max(0, (progress - 0.55) / 0.4))),
      );
      wrap?.classList.add("is-dropping");
      wrap?.classList.toggle("is-landed", progress >= GLOBE_LANDED);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [stageRef, flyRef, prefersReducedMotion]);
}

export function PmosGlobe() {
  const { mode } = useThemeMode();
  // Sizes the globe itself — its own stage element, not the outer wrap,
  // which also holds the text beside it.
  const stageRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  // What actually moves during the drop (see useGlobeDrop).
  const flyRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(320);
  const [selected, setSelected] = useState<{
    continent: Continent;
    count: number;
  } | null>(null);
  const [hoveredContinent, setHoveredContinent] = useState<Continent | null>(
    null,
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 320;
      setSize(Math.min(width, 520));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGlobeDrop(stageRef, flyRef);

  useEffect(() => {
    globeRef.current?.pointOfView({ altitude: 2.2 }, 0);
    const controls = globeRef.current?.controls();
    if (!controls) return;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableZoom = false;
    // OrbitControls fires "start" on the pointerdown that begins a manual
    // drag — stop auto-rotating there so the globe doesn't fight the user's
    // own spin.
    const stopAutoRotate = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener("start", stopAutoRotate);
    return () => controls.removeEventListener("start", stopAutoRotate);
  }, []);

  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: mode === "dark" ? "#33283F" : "#221B2B",
      }),
    [mode],
  );

  // three.js parses actual color values, not CSS variable references — read
  // the resolved value the browser has already computed for --color-accent
  // rather than passing the "var(...)" string straight through.
  const atmosphereColor = useMemo(
    () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "#C9BDE8",
    [mode],
  );

  function handleClick(polygon: object) {
    const country = polygon as Feature<Geometry, CountryProps>;
    const continent = continentOf(country);
    if (!continent) {
      setSelected(null);
      return;
    }
    const controls = globeRef.current?.controls();
    if (controls) controls.autoRotate = false;
    setSelected({ continent, count: PMOS_STATS_BY_CONTINENT[continent] });
  }

  // Only countries that map to a continent are meaningfully clickable, so
  // only those get the hover affordance (lift + brighten + pointer cursor) —
  // and the whole continent lifts together, not just the country under the
  // cursor, since that's the unit a click actually selects.
  function handleHover(polygon: object | null) {
    const country = polygon as Feature<Geometry, CountryProps> | null;
    setHoveredContinent(country ? (continentOf(country) ?? null) : null);
  }

  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-05: the globe now always
  // sits on the left with the text beside it — an invitation to explore until
  // a continent is clicked, then that continent's figures in its place.
  return (
    <div className="pmos-globe-wrap">
      <div
        className={`pmos-globe-stage${hoveredContinent ? " is-hovering" : ""}`}
        ref={stageRef}
      >
        <div className="pmos-globe-fly" ref={flyRef}>
          <Globe
            ref={globeRef}
            width={size}
            height={size}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={null}
            globeMaterial={globeMaterial}
            showAtmosphere
            atmosphereColor={atmosphereColor}
            polygonsData={countries}
            polygonCapColor={(d) => {
              const country = d as Feature<Geometry, CountryProps>;
              const base = colorOf(country);
              return continentOf(country) === hoveredContinent
                ? lighten(base, 0.35)
                : base;
            }}
            polygonSideColor={() => "rgba(0,0,0,0.15)"}
            polygonStrokeColor={() => "#221B2B"}
            polygonAltitude={(d) => {
              const country = d as Feature<Geometry, CountryProps>;
              return continentOf(country) === hoveredContinent ? 0.06 : 0.01;
            }}
            // Continent-level only, deliberately not the country name — hovering
            // over an individual country implies it's independently clickable,
            // which would be misleading since every country in a continent maps
            // to the same continent-wide stat.
            polygonLabel={(d) => {
              const country = d as Feature<Geometry, CountryProps>;
              const continent = continentOf(country);
              if (!continent) return "";
              const count = PMOS_STATS_BY_CONTINENT[continent];
              return `<div class="pmos-globe-tooltip"><strong>${continent}</strong><br />${count.toLocaleString()} women affected</div>`;
            }}
            onPolygonHover={handleHover}
            onPolygonClick={handleClick}
          />
          {/* What the globe turns into as it lands: the first circle of the
              next screen, in that circle's colours. */}
          <div
            className="pmos-globe-morph symptom-group--hormonal"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="pmos-globe-info" aria-live="polite">
        {selected ? (
          <div className="pmos-globe-info-panel" key={selected.continent}>
            <span className="pmos-globe-info-continent">
              {selected.continent}
            </span>
            <span className="pmos-globe-info-count">
              {selected.count.toLocaleString()} women affected
            </span>
            {PMOS_CONTINENT_NOTES[selected.continent] && (
              <p className="pmos-globe-info-note">
                {PMOS_CONTINENT_NOTES[selected.continent]}
              </p>
            )}
          </div>
        ) : (
          <div className="pmos-globe-info-panel">
            <h2 className="pmos-globe-prompt">
              See the prevalence by continent
            </h2>
            <span className="pmos-globe-info-hint">
              Click a continent on the globe
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
