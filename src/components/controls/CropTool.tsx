import { useRef, useState, useCallback } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Button } from '@/components/ui/button';
import { Crop, Check, X } from 'lucide-react';

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragHandle = 'tl' | 'tr' | 'bl' | 'br' | 'move' | null;

export function CropTool() {
  const imageDataURL = useLithophaneStore((s) => s.imageDataURL);
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  const [active, setActive] = useState(false);
  const [crop, setCrop] = useState<CropRect>({
    x: params.cropX,
    y: params.cropY,
    w: params.cropWidth,
    h: params.cropHeight,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{
    handle: DragHandle;
    startX: number;
    startY: number;
    startCrop: CropRect;
  } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, handle: DragHandle) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragging.current = {
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startCrop: { ...crop },
      };
    },
    [crop]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = (e.clientX - dragging.current.startX) / rect.width;
      const dy = (e.clientY - dragging.current.startY) / rect.height;
      const { handle, startCrop: s } = dragging.current;

      let next: CropRect;
      if (handle === 'move') {
        const nx = Math.max(0, Math.min(1 - s.w, s.x + dx));
        const ny = Math.max(0, Math.min(1 - s.h, s.y + dy));
        next = { x: nx, y: ny, w: s.w, h: s.h };
      } else {
        next = { ...s };
        if (handle === 'tl' || handle === 'bl') {
          const newX = Math.max(0, Math.min(s.x + s.w - 0.05, s.x + dx));
          next.w = s.w - (newX - s.x);
          next.x = newX;
        }
        if (handle === 'tr' || handle === 'br') {
          next.w = Math.max(0.05, Math.min(1 - s.x, s.w + dx));
        }
        if (handle === 'tl' || handle === 'tr') {
          const newY = Math.max(0, Math.min(s.y + s.h - 0.05, s.y + dy));
          next.h = s.h - (newY - s.y);
          next.y = newY;
        }
        if (handle === 'bl' || handle === 'br') {
          next.h = Math.max(0.05, Math.min(1 - s.y, s.h + dy));
        }
      }
      setCrop(next);
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const applyCrop = () => {
    updateParams({
      cropEnabled: true,
      cropX: crop.x,
      cropY: crop.y,
      cropWidth: crop.w,
      cropHeight: crop.h,
    });
    setActive(false);
  };

  const cancelCrop = () => {
    setCrop({
      x: params.cropX,
      y: params.cropY,
      w: params.cropWidth,
      h: params.cropHeight,
    });
    setActive(false);
  };

  const resetCrop = () => {
    updateParams({
      cropEnabled: false,
      cropX: 0,
      cropY: 0,
      cropWidth: 1,
      cropHeight: 1,
    });
    setCrop({ x: 0, y: 0, w: 1, h: 1 });
  };

  if (!imageDataURL) return null;

  if (!active) {
    return (
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={() => setActive(true)}
        >
          <Crop className="h-3 w-3 mr-1" />
          Crop
        </Button>
        {params.cropEnabled && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={resetCrop}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    );
  }

  const handleStyle = 'absolute w-3 h-3 bg-primary border-2 border-background rounded-sm shadow-md z-10';

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden border border-border/50 select-none cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img
          src={imageDataURL}
          alt="Crop preview"
          className="w-full h-auto"
          draggable={false}
        />
        {/* Dark overlay outside crop area */}
        <div
          className="absolute inset-0 bg-black/50 pointer-events-none"
          style={{
            clipPath: `polygon(
              0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
              ${crop.x * 100}% ${crop.y * 100}%,
              ${crop.x * 100}% ${(crop.y + crop.h) * 100}%,
              ${(crop.x + crop.w) * 100}% ${(crop.y + crop.h) * 100}%,
              ${(crop.x + crop.w) * 100}% ${crop.y * 100}%,
              ${crop.x * 100}% ${crop.y * 100}%
            )`,
          }}
        />
        {/* Crop region (movable) */}
        <div
          className="absolute border-2 border-primary/80 cursor-move"
          style={{
            left: `${crop.x * 100}%`,
            top: `${crop.y * 100}%`,
            width: `${crop.w * 100}%`,
            height: `${crop.h * 100}%`,
          }}
          onPointerDown={(e) => handlePointerDown(e, 'move')}
        />
        {/* Corner handles */}
        <div
          className={`${handleStyle} cursor-nw-resize`}
          style={{ left: `calc(${crop.x * 100}% - 6px)`, top: `calc(${crop.y * 100}% - 6px)` }}
          onPointerDown={(e) => handlePointerDown(e, 'tl')}
        />
        <div
          className={`${handleStyle} cursor-ne-resize`}
          style={{ left: `calc(${(crop.x + crop.w) * 100}% - 6px)`, top: `calc(${crop.y * 100}% - 6px)` }}
          onPointerDown={(e) => handlePointerDown(e, 'tr')}
        />
        <div
          className={`${handleStyle} cursor-sw-resize`}
          style={{ left: `calc(${crop.x * 100}% - 6px)`, top: `calc(${(crop.y + crop.h) * 100}% - 6px)` }}
          onPointerDown={(e) => handlePointerDown(e, 'bl')}
        />
        <div
          className={`${handleStyle} cursor-se-resize`}
          style={{ left: `calc(${(crop.x + crop.w) * 100}% - 6px)`, top: `calc(${(crop.y + crop.h) * 100}% - 6px)` }}
          onPointerDown={(e) => handlePointerDown(e, 'br')}
        />
      </div>
      <div className="flex gap-1.5">
        <Button size="sm" className="flex-1 h-7 text-xs" onClick={applyCrop}>
          <Check className="h-3 w-3 mr-1" />
          Apply
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={cancelCrop}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
