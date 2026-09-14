"use client";

/**
 * Dense abstract watercolor painting as the hero field —
 * wet-edge blooms, drips, splatters, overlapping pigment.
 */
export function HeroWash({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="paper-base" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d8d2c6" />
            <stop offset="40%" stopColor="#e2ddd2" />
            <stop offset="100%" stopColor="#cfc8ba" />
          </linearGradient>

          <filter id="wet-edge">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="wet-edge-soft">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="grain-paper">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.09" />
            </feComponentTransfer>
          </filter>
          <radialGradient id="u" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e4d8c" stopOpacity="0.72" />
            <stop offset="55%" stopColor="#3a6ea8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1e4d8c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="r" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#c43c2e" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#e07060" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c43c2e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#2d6b4f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2d6b4f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="o" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1f7a6c" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1f7a6c" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#paper-base)" />

        {/* Large abstract color fields */}
        <g filter="url(#wet-edge)" className="hero-float-a">
          <ellipse cx="1280" cy="180" rx="340" ry="300" fill="url(#u)" />
          <path
            d="M 980 40 C 1180 80, 1400 -20, 1580 120 L 1600 420 C 1420 380, 1200 460, 1020 300 Z"
            fill="#1e4d8c"
            opacity="0.28"
          />
        </g>

        <g filter="url(#wet-edge)" className="hero-float-b">
          <ellipse cx="280" cy="420" rx="380" ry="320" fill="url(#r)" />
          <ellipse cx="160" cy="620" rx="220" ry="180" fill="url(#o)" />
        </g>

        <g filter="url(#wet-edge-soft)" className="hero-float-c">
          <ellipse cx="900" cy="720" rx="420" ry="280" fill="url(#t)" />
          <ellipse cx="1100" cy="820" rx="260" ry="200" fill="url(#g)" />
          <ellipse cx="700" cy="880" rx="200" ry="140" fill="url(#u)" opacity="0.7" />
        </g>

        {/* Brush drips */}
        <g opacity="0.45" strokeLinecap="round">
          <path
            d="M 420 120 Q 430 280 418 520"
            fill="none"
            stroke="#1e4d8c"
            strokeWidth="14"
            opacity="0.5"
          />
          <path
            d="M 460 80 Q 455 300 470 560"
            fill="none"
            stroke="#c43c2e"
            strokeWidth="7"
            opacity="0.55"
          />
          <path
            d="M 1320 300 Q 1335 480 1310 780"
            fill="none"
            stroke="#1f7a6c"
            strokeWidth="11"
            opacity="0.4"
          />
          <path
            d="M 780 40 Q 790 200 775 380"
            fill="none"
            stroke="#c9a227"
            strokeWidth="9"
            opacity="0.45"
          />
        </g>

        {/* Irregular ink calligraphy stroke */}
        <path
          filter="url(#wet-edge-soft)"
          d="M 80 780 C 320 640, 560 900, 880 700 S 1280 620, 1560 760"
          fill="none"
          stroke="#243044"
          strokeWidth="28"
          strokeOpacity="0.14"
          strokeLinecap="round"
        />
        <path
          d="M 120 800 C 360 680, 580 860, 900 740 S 1260 680, 1520 790"
          fill="none"
          stroke="#c43c2e"
          strokeWidth="6"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />

        {/* Pigment splatters */}
        <g>
          {[
            [180, 160, 8, "#1e4d8c"],
            [240, 210, 4, "#c43c2e"],
            [520, 90, 6, "#1f7a6c"],
            [610, 140, 3, "#c9a227"],
            [980, 260, 7, "#1e4d8c"],
            [1050, 310, 3, "#c43c2e"],
            [1400, 480, 9, "#2d6b4f"],
            [1480, 540, 4, "#1e4d8c"],
            [860, 480, 5, "#c9a227"],
            [300, 700, 6, "#1f7a6c"],
            [680, 620, 4, "#c43c2e"],
            [1200, 160, 5, "#c9a227"],
          ].map(([x, y, r, c], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={c as string}
              opacity={0.45 + (i % 3) * 0.1}
            />
          ))}
        </g>

        {/* Cross-hatch sketch marks — gallery sketchbook vibe */}
        <g stroke="#243044" strokeOpacity="0.12" strokeWidth="1.2">
          <path d="M 1040 520 L 1180 660" />
          <path d="M 1060 500 L 1220 640" />
          <path d="M 1080 490 L 1240 610" />
          <path d="M 200 280 L 340 200" />
          <path d="M 220 300 L 380 210" />
        </g>

        <rect width="1600" height="1000" filter="url(#grain-paper)" />
      </svg>

      <span className="hero-petal hero-petal-1" />
      <span className="hero-petal hero-petal-2" />
      <span className="hero-petal hero-petal-3" />
      <span className="hero-petal hero-petal-4" />
      <span className="hero-petal hero-petal-5" />
    </div>
  );
}
