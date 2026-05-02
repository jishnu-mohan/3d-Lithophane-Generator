import { useMemo } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useLithophaneGeometry } from '@/hooks/useLithophaneGeometry';
import { cn } from '@/lib/utils';

/**
 * Live numeric readout card — triangle count, dimensions, file estimate.
 * Floats above the status rail in the bottom-right.
 */
export function TelemetryCard({ className }: { className?: string }) {
  const heightmap = useLithophaneStore((s) => s.heightmap);
  const params = useLithophaneStore((s) => s.params);
  const isProcessing = useLithophaneStore((s) => s.isProcessing);
  const geometry = useLithophaneGeometry();

  const triangles = useMemo(() => {
    if (!geometry?.index) return null;
    return geometry.index.count / 3;
  }, [geometry]);

  const sizeEstimate = useMemo(() => {
    if (!triangles) return null;
    const bytes = 80 + 4 + triangles * 50;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [triangles]);

  return (
    <div
      className={cn('pointer-events-auto glass-panel-soft', className)}
      style={{ zIndex: 'var(--z-panel)' }}
      onWheelCapture={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-3 border-b border-stroke-subtle px-3 py-2">
        <span className="text-mono-label">Telemetry</span>
        {isProcessing && <ProcessingDot />}
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-3 py-3">
        <Readout label="Source" value={heightmap ? `${heightmap.width}×${heightmap.height} px` : '—'} />
        <Readout label="Print" value={`${params.widthMM}×${params.heightMM} mm`} />
        <Readout
          label="Triangles"
          value={triangles ? formatNumber(triangles) : '—'}
          warn={triangles ? triangles > 2_000_000 : false}
        />
        <Readout label="STL est." value={sizeEstimate ?? '—'} />
      </dl>
    </div>
  );
}

function Readout({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <>
      <dt className="text-mono-label py-0.5">{label}</dt>
      <dd
        className={cn(
          'text-mono-readout text-xs text-text-primary py-0.5 text-right',
          warn && 'text-accent-warm',
        )}
      >
        {value}
      </dd>
    </>
  );
}

function ProcessingDot() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="relative inline-block h-1.5 w-1.5 rounded-full"
        style={{
          background: 'var(--accent-warm)',
          boxShadow: '0 0 8px var(--accent-warm-glow)',
          animation: 'aurora-pulse 1.4s ease-in-out infinite',
        }}
      />
      <span className="text-mono-label text-accent-warm">processing</span>
    </span>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toFixed(0);
}
