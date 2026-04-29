import { motion } from 'motion/react';
import { useLithophaneStore } from '@/store/useLithophaneStore';

const POSITIONS = [
  { id: 'top-left', placement: 'top-4 left-4', rotation: '' },
  { id: 'top-right', placement: 'top-4 right-4', rotation: 'rotate-90' },
  { id: 'bottom-right', placement: 'bottom-4 right-4', rotation: 'rotate-180' },
  { id: 'bottom-left', placement: 'bottom-4 left-4', rotation: '-rotate-90' },
] as const;

/**
 * Decorative HUD overlay framing the 3D canvas: four corner brackets +
 * a faint center crosshair shown until a model loads.
 *
 * Entirely `pointer-events: none` — never blocks OrbitControls.
 */
export function ViewportHUD() {
  const heightmap = useLithophaneStore((s) => s.heightmap);
  const hasModel = !!heightmap;

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 'var(--z-hud)' }}
    >
      {POSITIONS.map((p, i) => (
        <motion.svg
          key={p.id}
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className={`absolute ${p.placement} ${p.rotation}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3 + i * 0.06,
          }}
        >
          <path
            d="M 1.5 12 L 1.5 1.5 L 12 1.5"
            fill="none"
            stroke="var(--hud-bracket)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <circle cx="1.5" cy="1.5" r="1" fill="var(--hud-bracket)" opacity="0.7" />
        </motion.svg>
      ))}

      {!hasModel && <CenterReticle />}
    </div>
  );
}

function CenterReticle() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42, delay: 0.5 }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="var(--hud-bracket)"
          strokeWidth="0.75"
          strokeDasharray="2 4"
        />
        <line x1="28" y1="14" x2="28" y2="20" stroke="var(--hud-bracket)" strokeWidth="0.75" />
        <line x1="28" y1="36" x2="28" y2="42" stroke="var(--hud-bracket)" strokeWidth="0.75" />
        <line x1="14" y1="28" x2="20" y2="28" stroke="var(--hud-bracket)" strokeWidth="0.75" />
        <line x1="36" y1="28" x2="42" y2="28" stroke="var(--hud-bracket)" strokeWidth="0.75" />
        <circle cx="28" cy="28" r="1.5" fill="var(--hud-bracket)" />
      </svg>
    </motion.div>
  );
}
