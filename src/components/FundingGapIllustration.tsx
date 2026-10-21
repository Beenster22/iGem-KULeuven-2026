// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21
// Purpose: the illustration under the Legislators & Advocates introduction on
// the Human Practices page — two cliff edges with a gap between them, and a
// crowd of women silhouettes waiting on the left-hand edge. Drawn from the
// team's sketch (a gap, with a bunch of women in front of it). A few
// crumbs fall into the gap on a loop (see .funding-gap-crumb in App.css),
// which stops for readers who prefer reduced motion.

type Hair = "long" | "bun" | "ponytail" | "bob";

interface WomanProps {
  x: number;
  scale: number;
  hair: Hair;
  trousers?: boolean;
}

// One silhouette in its own frame: feet on y = 0, about 100 tall, centred on
// x = 0, facing right towards the gap (mirrored, so the ponytail swings out
// behind on the left).
function Woman({ x, scale, hair, trousers = false }: WomanProps) {
  return (
    <g transform={`translate(${x} 130) scale(${-scale} ${scale})`}>
      <circle cx={0} cy={-86} r={9} />
      {hair === "long" && <path d="M-10 -86 Q-11 -98 0 -98 Q11 -98 10 -86 L12 -66 L-12 -66 Z" />}
      {hair === "bun" && <circle cx={2} cy={-98} r={5.5} />}
      {hair === "ponytail" && <path d="M6 -94 Q16 -92 15 -78 Q14 -70 18 -64 Q8 -68 7 -80 Z" />}
      {hair === "bob" && <path d="M-11 -84 Q-12 -99 0 -99 Q12 -99 11 -84 L11 -76 L-11 -76 Z" />}
      {trousers ? (
        <>
          <path d="M-8 -75 Q-12 -74 -12 -64 L-10 -42 L10 -42 L12 -64 Q12 -74 8 -75 Z" />
          <path d="M-6 -44 L-6 0 M6 -44 L6 0" fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M-7 -75 Q-12 -74 -13 -62 L-18 -30 L18 -30 L13 -62 Q12 -74 7 -75 Z" />
          <path d="M-6 -32 L-6 0 M6 -32 L6 0" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
        </>
      )}
      <path d="M-11 -70 L-16 -44 M11 -70 L16 -44" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

// Front of the crowd (nearest the gap) first.
const WOMEN: WomanProps[] = [
  { x: 268, scale: 0.9, hair: "ponytail" },
  { x: 238, scale: 0.84, hair: "bun", trousers: true },
  { x: 208, scale: 0.94, hair: "long" },
  { x: 178, scale: 0.8, hair: "bob" },
  { x: 148, scale: 0.92, hair: "ponytail", trousers: true },
  { x: 118, scale: 0.86, hair: "long" },
  { x: 88, scale: 0.95, hair: "bun" },
];

export function FundingGapIllustration() {
  return (
    <figure className="funding-gap">
      <svg viewBox="0 0 600 210" role="img" aria-labelledby="funding-gap-title">
        <title id="funding-gap-title">
          Two cliff edges with a gap between them; a group of women waits on the left-hand edge, unable to cross.
        </title>

        <path className="funding-gap-ground" d="M0 130 H290 L301 146 L289 162 L299 181 L287 210 H0 Z" />
        <path className="funding-gap-ground" d="M600 130 H410 L399 148 L411 166 L397 184 L408 210 H600 Z" />

        <circle className="funding-gap-crumb" cx={296} cy={152} r={3} />
        <circle className="funding-gap-crumb" cx={403} cy={160} r={2.5} />
        <circle className="funding-gap-crumb" cx={292} cy={175} r={2} />


        <g className="funding-gap-women">
          {WOMEN.map((woman) => (
            <Woman key={woman.x} {...woman} />
          ))}
        </g>
      </svg>
    </figure>
  );
}
