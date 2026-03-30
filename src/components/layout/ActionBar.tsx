import { useMemo } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useLithophaneGeometry } from '@/hooks/useLithophaneGeometry';
import { exportSTL } from '@/lib/export/exportSTL';
import { Button } from '@/components/ui/button';
import { Download, Undo2, Redo2 } from 'lucide-react';

export function ActionBar() {
  const params = useLithophaneStore((s) => s.params);
  const heightmap = useLithophaneStore((s) => s.heightmap);
  const undo = useLithophaneStore((s) => s.undo);
  const redo = useLithophaneStore((s) => s.redo);
  const canUndo = useLithophaneStore((s) => s.canUndo);
  const canRedo = useLithophaneStore((s) => s.canRedo);
  const geometry = useLithophaneGeometry();

  const estimatedSize = useMemo(() => {
    if (!geometry?.index) return null;
    const triangles = geometry.index.count / 3;
    const bytes = 80 + 4 + triangles * 50;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [geometry]);

  const handleExport = () => {
    if (!geometry) return;
    const filename = `lithophane-${params.shape}-${params.widthMM}x${params.heightMM}mm.stl`;
    exportSTL(geometry, filename);
  };

  return (
    <div className="h-14 border-t border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-5 shadow-[0_-1px_12px_0_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>
        <div className="text-xs font-medium text-muted-foreground ml-2">
          {heightmap
            ? `${heightmap.width} x ${heightmap.height} px`
            : 'No image loaded'}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {estimatedSize && (
          <span className="text-xs text-muted-foreground">~{estimatedSize}</span>
        )}
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
          onClick={handleExport}
          disabled={!geometry}
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export STL
        </Button>
      </div>
    </div>
  );
}
