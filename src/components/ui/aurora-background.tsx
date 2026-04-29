/**
 * Drifting aurora atmosphere — three blurred radial gradients animated via
 * pure CSS keyframes (no JS), with a faint blueprint grid masked toward the
 * edges. Mounts behind the R3F canvas; the canvas clears to transparent so
 * this layer shows through.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 'var(--z-aurora-bg)' }}
    >
      {/* Deep base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 30%, oklch(from var(--surface-base) calc(l + 0.04) c h) 0%, var(--surface-base) 60%, oklch(from var(--surface-base) calc(l - 0.04) c h) 100%)',
        }}
      />

      {/* Aurora bloom A — cyan, top-left drift */}
      <div
        className="absolute -inset-[20%] opacity-60"
        style={{
          background:
            'radial-gradient(closest-side, var(--accent-aurora-glow) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift-a 38s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Aurora bloom B — warm amber, slow counter-drift */}
      <div
        className="absolute -inset-[20%] opacity-25"
        style={{
          background:
            'radial-gradient(closest-side, var(--accent-warm-glow) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-b 52s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Aurora bloom C — cyan-violet, deep drift */}
      <div
        className="absolute -inset-[20%] opacity-40"
        style={{
          background:
            'radial-gradient(closest-side, oklch(0.55 0.16 280 / 0.45) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'aurora-drift-c 64s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Blueprint grid — fades toward edges */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--hud-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--hud-grid) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 50%, oklch(from var(--surface-base) calc(l - 0.05) c h / 0.6) 100%)',
        }}
      />
    </div>
  );
}
