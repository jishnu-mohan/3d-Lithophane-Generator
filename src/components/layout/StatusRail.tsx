import { useMemo } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useLithophaneGeometry } from '@/hooks/useLithophaneGeometry';
import { exportSTL } from '@/lib/export/exportSTL';
import { Button } from '@/components/ui/button';
import { PresetsControl } from '@/components/controls/PresetsControl';
import { Download, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatusRail() {
  const params = useLithophaneStore((s) => s.params);
  const heightmap = useLithophaneStore((s) => s.heightmap);
  const undo = useLithophaneStore((s) => s.undo);
  const redo = useLithophaneStore((s) => s.redo);
  const canUndo = useLithophaneStore((s) => s.canUndo);
  const canRedo = useLithophaneStore((s) => s.canRedo);
  const geometry = useLithophaneGeometry();

  const triangles = geometry?.index ? geometry.index.count / 3 : null;

  const sizeEstimate = useMemo(() => {
    if (!triangles) return null;
    const bytes = 80 + 4 + triangles * 50;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [triangles]);

  const handleExport = () => {
    if (!geometry) return;
    const filename = `lithophane-${params.shape}-${params.widthMM}x${params.heightMM}mm.stl`;
    exportSTL(geometry, filename);
  };

  return (
    <div
      className="pointer-events-children pointer-events-none absolute inset-x-4 bottom-3 flex items-center gap-3"
      style={{ zIndex: 'var(--z-panel)' }}
    >
      {/* Brand wordmark */}
      <div className="glass-panel-soft pointer-events-auto px-4 py-2 flex items-baseline gap-2">
        <span
          className="text-[15px] font-display italic tracking-tight"
          style={{ color: 'var(--accent-aurora)', textShadow: '0 0 12px var(--accent-aurora-glow)' }}
        >
          Aurora
        </span>
        <span className="text-mono-label">lithophane studio</span>
      </div>

      {/* Undo / redo cluster */}
      <div className="glass-panel-soft pointer-events-auto px-1.5 py-1 flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (⌘Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (⌘⇧Z)"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Heightmap dims */}
      {heightmap && (
        <div className="glass-panel-soft pointer-events-auto px-3 py-1.5 hidden md:flex items-center gap-2">
          <span className="text-mono-label">heightmap</span>
          <span className="text-mono-readout text-xs text-text-secondary">
            {heightmap.width}×{heightmap.height}
          </span>
        </div>
      )}

      <div className="flex-1" />

      {/* Presets */}
      <div className="pointer-events-auto">
        <PresetsControl />
      </div>

      {/* Export */}
      <Button
        size="sm"
        onClick={handleExport}
        disabled={!geometry}
        className={cn(
          'pointer-events-auto h-9 px-4 gap-2',
          'bg-[var(--accent-aurora)] text-[var(--primary-foreground)] hover:opacity-90',
          'border border-[var(--accent-aurora-glow)]',
          'shadow-[0_0_24px_var(--accent-aurora-glow)] hover:shadow-[0_0_32px_var(--accent-aurora-glow)]',
          'transition-all duration-200',
        )}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="text-xs font-medium tracking-tight">Export STL</span>
        {sizeEstimate && (
          <span className="text-mono-readout text-[10px] opacity-80 ml-1">
            ~{sizeEstimate}
          </span>
        )}
      </Button>
    </div>
  );
}
