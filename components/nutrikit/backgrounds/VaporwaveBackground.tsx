'use client';

/**
 * Vaporwave / Outrun Background
 *
 * Features:
 * - Floating sun gradient orb
 * - Perspective grid floor (iconic outrun highway effect)
 * - CRT scanlines (via body::before in globals.css)
 * - RGB chromatic aberration (via body::after in globals.css)
 */
export default function VaporwaveBackground() {
  return (
    <>
      {/* Floating Sun - Massive blurred gradient orb */}
      <div className="floating-sun" aria-hidden="true" />

      {/* Perspective Grid Floor */}
      <div className="perspective-grid" aria-hidden="true" />
    </>
  );
}
