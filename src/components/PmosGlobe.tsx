// Purpose: interactive, spinnable 3D globe — click any country to see the
// (placeholder, see pmosContinentStats.ts) PMOS estimate for its continent.
// Country outlines are bundled locally from the `world-atlas` npm package
// (not fetched from a CDN at runtime) to comply with the "everything must be
// served from iGEM infrastructure" asset rule in README.md. The globe itself
// uses a flat brand-colored material instead of a photographic Earth
// texture, so no texture image needs hosting either.
import { useEffect, useMemo, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import Globe, { GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import worldTopo from "world-atlas/countries-110m.json";
import { useThemeMode } from "../ThemeModeContext";
import { Continent, COUNTRY_ID_TO_CONTINENT } from "./pmosContinents";
import { PMOS_STATS_BY_CONTINENT_PLACEHOLDER } from "./pmosContinentStats";

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
  feature(topology, topology.objects.countries as GeometryCollection) as FeatureCollection<
    Geometry,
    CountryProps
  >
).features;

function continentOf(country: Feature<Geometry, CountryProps>): Continent | undefined {
  return COUNTRY_ID_TO_CONTINENT[String(country.id)];
}

function colorOf(country: Feature<Geometry, CountryProps>): string {
  const continent = continentOf(country);
  return continent ? CONTINENT_COLOR[continent] : UNMAPPED_COLOR;
}

export function PmosGlobe() {
  const { mode } = useThemeMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState(320);
  const [selected, setSelected] = useState<{ continent: Continent; count: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 320;
      setSize(Math.min(width, 520));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    globeRef.current?.pointOfView({ altitude: 2.2 }, 0);
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;
    }
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
    () => getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#C9BDE8",
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
    setSelected({ continent, count: PMOS_STATS_BY_CONTINENT_PLACEHOLDER[continent] });
  }

  return (
    <div className="pmos-globe-wrap" ref={containerRef}>
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
        polygonCapColor={(d) => colorOf(d as Feature<Geometry, CountryProps>)}
        polygonSideColor={() => "rgba(0,0,0,0.15)"}
        polygonStrokeColor={() => "#221B2B"}
        polygonAltitude={0.01}
        polygonLabel={(d) => {
          const country = d as Feature<Geometry, CountryProps>;
          return `<div class="pmos-globe-tooltip">${country.properties?.name ?? ""}</div>`;
        }}
        onPolygonClick={handleClick}
      />
      <div className="pmos-globe-info" aria-live="polite">
        {selected ? (
          <>
            <span className="pmos-globe-info-continent">{selected.continent}</span>
            <span className="pmos-globe-info-count">
              {selected.count.toLocaleString()} women affected
            </span>
          </>
        ) : (
          <span className="pmos-globe-info-hint">Click a country to see its continent's estimate</span>
        )}
      </div>
    </div>
  );
}
