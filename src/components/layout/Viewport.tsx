import { LithophaneScene } from '@/components/preview/LithophaneScene';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useUIMode } from '@/lib/ui-mode';
import { Loader2 } from 'lucide-react';

export function Viewport() {
  const isProcessing = useLithophaneStore((s) => s.isProcessing);
  const imageFile = useLithophaneStore((s) => s.imageFile);
  const [uiMode] = useUIMode();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {uiMode === 'aurora' && <AuroraBackground />}

      <div
        className="absolute inset-0"
        style={{ zIndex: 'var(--z-canvas)' }}
      >
        <LithophaneScene />
      </div>

      {!imageFile && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 'var(--z-hud)' }}
        >
          <p className="text-mono-label text-text-tertiary">
            awaiting source image
          </p>
        </div>
      )}

      {isProcessing && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 'var(--z-hud)',
            background:
              'radial-gradient(ellipse 60% 40% at 50% 50%, oklch(from var(--surface-base) l c h / 0.7) 0%, transparent 80%)',
          }}
        >
          <div className="flex items-center gap-3 px-4 py-2 glass-panel-soft">
            <Loader2
              className="h-4 w-4 animate-spin"
              style={{ color: 'var(--accent-warm)' }}
            />
            <span className="text-mono-readout text-xs text-text-secondary">
              processing heightmap
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
