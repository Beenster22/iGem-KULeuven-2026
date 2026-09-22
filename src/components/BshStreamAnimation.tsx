// Purpose: home-page section between "What is PMOS?" and the inflammation
// slider — a continuous-stream diagram of bile salt hydrolase (BSH) in
// engineered P. vulgatis: yellow conjugated-bile-acid particles (GDCA,
// TUDCA) flow in from varied points on the left, pass through the
// bacterium, and red deconjugated-acid particles (DCA/Glycine,
// UDCA/Taurine) flow back out on the right. Each particle follows its own
// SVG <animateMotion> bezier path so the whole thing loops with zero JS
// animation-frame work; the "somewhat random" look comes from the same
// deterministic-pseudo-random technique InflammationSliderSection.tsx uses
// for its microbiome lens scatter (seededValue below) — reproducible on
// every render instead of reshuffling via Math.random().
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { PVulgatisIcon } from "./BacteriumIcons";

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const VB_W = 900;
const VB_H = 280;
const BAC_W = 120;
const BAC_H = 168;
const BAC_MID_Y = VB_H / 2;
const BAC_LEFT = VB_W / 2 - BAC_W / 2;
const BAC_RIGHT = VB_W / 2 + BAC_W / 2;

const PARTICLES_PER_SIDE = 6;
const HEX_RADIUS = 9;

// Flat-top regular hexagon, centered on its own origin — animateMotion then
// translates that origin along the particle's bezier path below.
const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return `${(HEX_RADIUS * Math.cos(angle)).toFixed(2)},${(HEX_RADIUS * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

function bezierPath(startX: number, startY: number, endX: number, endY: number, curve: number) {
  const c1x = startX + (endX - startX) * 0.35;
  const c1y = startY + curve;
  const c2x = startX + (endX - startX) * 0.7;
  const c2y = endY + curve * 0.4;
  return `M${startX},${startY} C${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`;
}

interface StreamParticle {
  id: string;
  path: string;
  duration: number;
  delay: number;
  staticX: number;
  staticY: number;
}

function buildStream(variant: "in" | "out"): StreamParticle[] {
  const seedBase = variant === "in" ? 0 : 1000;
  return Array.from({ length: PARTICLES_PER_SIDE }, (_, i) => {
    const seed = seedBase + i;
    const spreadY = 25 + seededValue(seed * 7 + 1) * (VB_H - 50);
    const curveMagnitude = 15 + seededValue(seed * 7 + 2) * 25;
    const curveSign = seededValue(seed * 7 + 3) > 0.5 ? 1 : -1;
    const duration = 4.5 + seededValue(seed * 7 + 4) * 3;
    const delay = -seededValue(seed * 7 + 5) * duration;

    const [startX, startY, endX, endY]: [number, number, number, number] =
      variant === "in"
        ? [15, spreadY, BAC_LEFT - 6, BAC_MID_Y]
        : [BAC_RIGHT + 6, BAC_MID_Y, VB_W - 15, spreadY];

    return {
      id: `${variant}-${i}`,
      path: bezierPath(startX, startY, endX, endY, curveMagnitude * curveSign),
      duration,
      delay,
      staticX: variant === "in" ? startX : endX,
      staticY: variant === "in" ? startY : endY,
    };
  });
}

interface StreamParticlesProps {
  particles: StreamParticle[];
  variant: "in" | "out";
  animate: boolean;
}

function StreamParticles({ particles, variant, animate }: StreamParticlesProps) {
  return (
    <>
      {particles.map((particle) => (
        <polygon
          key={particle.id}
          points={HEX_POINTS}
          className={`bsh-particle bsh-particle--${variant}`}
          transform={animate ? undefined : `translate(${particle.staticX},${particle.staticY})`}
        >
          {animate && (
            <>
              <animateMotion
                dur={`${particle.duration}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
                path={particle.path}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.88;1"
                dur={`${particle.duration}s`}
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />
            </>
          )}
        </polygon>
      ))}
    </>
  );
}

export function BshStreamAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const incoming = useMemo(() => buildStream("in"), []);
  const outgoing = useMemo(() => buildStream("out"), []);

  return (
    <div className="bsh-stream">
      <h3 className="bsh-stream-heading">Bile salt hydrolase breaks down conjugated bile acids</h3>
      <div className="bsh-stream-diagram" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg
          className="bsh-stream-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Diagram of Phocaeicola vulgatus using the enzyme BSH to convert the conjugated bile acids GDCA and TUDCA into the deconjugated bile acids DCA and UDCA, releasing glycine and taurine."
        >
          <StreamParticles particles={incoming} variant="in" animate={!prefersReducedMotion} />

          <PVulgatisIcon
            className="bsh-stream-bacterium"
            x={BAC_LEFT}
            y={BAC_MID_Y - BAC_H / 2}
            width={BAC_W}
            height={BAC_H}
          />

          <StreamParticles particles={outgoing} variant="out" animate={!prefersReducedMotion} />
        </svg>

        <span className="bsh-stream-caption bsh-stream-caption--species" style={{ left: "50%", top: "5%" }}>
          Phocaeicola vulgatus
        </span>
        <span className="bsh-stream-badge bsh-stream-badge--bsh" style={{ left: "50%", top: "50%" }}>
          BSH
        </span>

        <span className="bsh-stream-badge" style={{ left: "6%", top: "30%" }}>
          GDCA
        </span>
        <span className="bsh-stream-badge" style={{ left: "6%", top: "64%" }}>
          TUDCA
        </span>
        <span className="bsh-stream-caption" style={{ left: "17%", top: "92%" }}>
          conjugated bile acids
        </span>

        <span className="bsh-stream-badge" style={{ left: "94%", top: "16%" }}>
          DCA
        </span>
        <span className="bsh-stream-plus" style={{ left: "94%", top: "26%" }}>
          +
        </span>
        <span className="bsh-stream-badge" style={{ left: "94%", top: "36%" }}>
          Glycine
        </span>

        <span className="bsh-stream-badge" style={{ left: "94%", top: "60%" }}>
          UDCA
        </span>
        <span className="bsh-stream-plus" style={{ left: "94%", top: "70%" }}>
          +
        </span>
        <span className="bsh-stream-badge" style={{ left: "94%", top: "80%" }}>
          Taurine
        </span>
        <span className="bsh-stream-caption" style={{ left: "80%", top: "92%" }}>
          deconjugated bile acid
        </span>
      </div>
    </div>
  );
}
