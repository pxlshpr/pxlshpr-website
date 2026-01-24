/**
 * Aurora Background Effect
 *
 * Three blurred orbs that float around with hue-shifting animation.
 * Uses pointer-events: none so it doesn't block interactions.
 *
 * Note: This did NOT work for Safari theme-color detection.
 * The orbs overlay on top but Safari still doesn't pick up the background.
 */
export default function AuroraBackground() {
  return (
    <div className="aurora-overlay">
      <div className="aurora-orb aurora-1" />
      <div className="aurora-orb aurora-2" />
      <div className="aurora-orb aurora-3" />
    </div>
  );
}

/**
 * Required CSS (add to globals.css):
 *
 * .aurora-overlay {
 *   position: fixed;
 *   inset: 0;
 *   pointer-events: none;
 *   overflow: hidden;
 *   z-index: 0;
 * }
 *
 * .aurora-orb {
 *   position: absolute;
 *   border-radius: 50%;
 *   opacity: 0.5;
 *   filter: blur(80px);
 * }
 *
 * .aurora-1 {
 *   width: 60vmax;
 *   height: 60vmax;
 *   background: rgba(160, 99, 255, 0.4);
 *   animation: aurora1 20s ease-in-out infinite, hueShift 15s linear infinite;
 * }
 *
 * .aurora-2 {
 *   width: 50vmax;
 *   height: 50vmax;
 *   background: rgba(71, 172, 177, 0.35);
 *   animation: aurora2 25s ease-in-out infinite, hueShift 20s linear infinite;
 * }
 *
 * .aurora-3 {
 *   width: 45vmax;
 *   height: 45vmax;
 *   background: rgba(223, 0, 255, 0.3);
 *   animation: aurora3 18s ease-in-out infinite, hueShift 25s linear infinite;
 * }
 */
