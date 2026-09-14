/**
 * Dense reusable watercolor SVG field for story sections.
 */
export function WashField({
  variant = "paper",
  className,
}: {
  variant?: "paper" | "night" | "rose" | "indigo";
  className?: string;
}) {
  const uid = variant;
  const paper =
    variant === "night"
      ? ["#1a1410", "#241c16", "#120e0c"]
      : variant === "rose"
        ? ["#e8d5ce", "#f0e4dc", "#dcc8c0"]
        : variant === "indigo"
          ? ["#d4d8e2", "#e2e4ea", "#c8ceda"]
          : ["#d8d2c6", "#e2ddd2", "#cfc8ba"];

  return (
    <svg
      className={className}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={paper[0]} />
          <stop offset="50%" stopColor={paper[1]} />
          <stop offset="100%" stopColor={paper[2]} />
        </linearGradient>
        <filter id={`${uid}-wet`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="3"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
        </filter>
        <filter id={`${uid}-soft`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028"
            numOctaves="2"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" />
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${uid}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
        </filter>
        <radialGradient id={`${uid}-u`} cx="40%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#1e4d8c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1e4d8c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-r`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#c43c2e" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#c43c2e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-o`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-t`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1f7a6c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1f7a6c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-g`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2d6b4f" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#2d6b4f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="1000" fill={`url(#${uid}-paper)`} />

      <g filter={`url(#${uid}-wet)`} opacity="0.95">
        <ellipse cx="320" cy="280" rx="340" ry="260" fill={`url(#${uid}-u)`} />
        <ellipse cx="1180" cy="220" rx="280" ry="240" fill={`url(#${uid}-r)`} />
        <ellipse cx="980" cy="720" rx="360" ry="280" fill={`url(#${uid}-t)`} />
        <ellipse cx="420" cy="760" rx="300" ry="220" fill={`url(#${uid}-o)`} />
        <ellipse cx="780" cy="480" rx="220" ry="180" fill={`url(#${uid}-g)`} />
      </g>

      <g filter={`url(#${uid}-soft)`} opacity="0.75">
        <circle cx="200" cy="520" r="90" fill="#1e4d8c" opacity="0.35" />
        <circle cx="1400" cy="560" r="110" fill="#c43c2e" opacity="0.3" />
        <circle cx="700" cy="160" r="70" fill="#c9a227" opacity="0.28" />
        <circle cx="1100" cy="860" r="95" fill="#2d6b4f" opacity="0.3" />
      </g>

      {/* Ink drips */}
      <g opacity="0.45">
        <path
          d="M260 180 C255 320 270 480 250 640"
          stroke="#1e4d8c"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M1280 140 C1290 300 1265 460 1300 620"
          stroke="#c43c2e"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="248" cy="660" r="8" fill="#1e4d8c" opacity="0.5" />
        <circle cx="1305" cy="640" r="6" fill="#c43c2e" opacity="0.55" />
      </g>

      {/* Splatters */}
      <g opacity="0.4">
        {[
          [180, 200, 4],
          [210, 240, 2.5],
          [1450, 180, 3.5],
          [1380, 320, 2],
          [900, 120, 3],
          [600, 880, 4],
          [1000, 900, 2.5],
          [400, 100, 2],
        ].map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={i % 2 === 0 ? "#1e4d8c" : "#c43c2e"}
          />
        ))}
      </g>

      <rect
        width="1600"
        height="1000"
        filter={`url(#${uid}-grain)`}
        opacity="0.55"
      />
    </svg>
  );
}
