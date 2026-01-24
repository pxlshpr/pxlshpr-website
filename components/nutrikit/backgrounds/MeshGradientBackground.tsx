/**
 * Mesh Gradient Background
 *
 * Original animated mesh gradient with multiple radial gradients.
 * Uses transform and hue-rotate animations for smooth movement.
 *
 * Note: This did NOT work for Safari theme-color detection when
 * using a solid background base. The transparent version (mesh-gradient-transparent)
 * also didn't work because Safari couldn't detect the underlying html background.
 */
export default function MeshGradientBackground() {
  return (
    <>
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
    </>
  );
}

/**
 * Alternative: Transparent version (no solid background base)
 */
export function MeshGradientTransparent() {
  return (
    <>
      <div className="mesh-gradient-transparent" />
      <div className="noise-overlay" />
    </>
  );
}

/**
 * Required CSS already in globals.css:
 *
 * .mesh-gradient - Full version with var(--background) base
 * .mesh-gradient-transparent - Just radial gradients, no solid base
 * .noise-overlay - Subtle texture overlay
 *
 * Animation: meshMove 18s ease-in-out infinite alternate
 * - Uses transform scale/translate
 * - Uses filter hue-rotate/brightness
 */
