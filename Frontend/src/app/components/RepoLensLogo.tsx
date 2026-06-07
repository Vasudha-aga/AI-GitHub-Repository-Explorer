interface RepoLensLogoProps {
  size?: number;
}

/**
 * Custom RepoLens mark — a lens aperture ring with a geometric
 * code-branch node at the centre. Fully SVG, no emoji or icon lib.
 */
export function RepoLensLogo({ size = 36 }: RepoLensLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Brand gradient — blue → purple */}
        <linearGradient id="rl-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#4f8ef7" />
          <stop offset="55%"  stopColor="#6d68f5" />
          <stop offset="100%" stopColor="#9b6ef5" />
        </linearGradient>

        {/* Subtle inner glow */}
        <filter id="rl-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Outer aperture ring with 6 notches ── */}
      <circle cx="20" cy="20" r="18.5" stroke="url(#rl-grad)" strokeWidth="1.6" fill="none" opacity="0.55" />

      {/* 6 aperture blade-tip marks on the ring */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 20 + 15.5 * Math.cos(rad);
        const y1 = 20 + 15.5 * Math.sin(rad);
        const x2 = 20 + 18.5 * Math.cos(rad);
        const y2 = 20 + 18.5 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#rl-grad)" strokeWidth="2" strokeLinecap="round" />;
      })}

      {/* ── Inner lens circle ── */}
      <circle cx="20" cy="20" r="11" stroke="url(#rl-grad)" strokeWidth="1.4" fill="none" opacity="0.35" />

      {/* ── Central node ── */}
      <circle cx="20" cy="20" r="3" fill="url(#rl-grad)" filter="url(#rl-glow)" />

      {/* ── Three branch arms radiating at 0°, 120°, 240° ── */}
      {[0, 120, 240].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        /* arm goes from centre-node edge to inner ring edge */
        const x1 = 20 + 3.8 * Math.cos(rad);
        const y1 = 20 + 3.8 * Math.sin(rad);
        const x2 = 20 + 10.2 * Math.cos(rad);
        const y2 = 20 + 10.2 * Math.sin(rad);
        const nx = 20 + 11 * Math.cos(rad);
        const ny = 20 + 11 * Math.sin(rad);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#rl-grad)" strokeWidth="1.5" strokeLinecap="round" />
            {/* Small node at arm tip on inner ring */}
            <circle cx={nx} cy={ny} r="1.8" fill="url(#rl-grad)" opacity="0.9" />
          </g>
        );
      })}

      {/* ── Lens glare — small arc highlight top-left ── */}
      <path
        d="M 13 10 A 10 10 0 0 1 19 8"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
