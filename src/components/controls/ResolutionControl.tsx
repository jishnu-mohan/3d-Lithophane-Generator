import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { DEFAULT_PARAMS } from '@/types/lithophane';

export function ResolutionControl() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  const pixelW = Math.round(params.widthMM * params.resolution);
  const pixelH = Math.round(params.heightMM * params.resolution);
  const estimatedTriangles = pixelW * pixelH * 4;
  const isHighRes = estimatedTriangles > 2_000_000;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Detail Level
          </span>
          <span className="text-muted-foreground">{params.resolution} px/mm</span>
        </div>
        <Slider
          value={[params.resolution]}
          min={1}
          max={10}
          step={1}
          snapDefault={DEFAULT_PARAMS.resolution}
          onValueChange={([v]) => updateParams({ resolution: v })}
        />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>~{(estimatedTriangles / 1000).toFixed(0)}k triangles</span>
          {isHighRes && (
            <span className="rounded bg-destructive/10 text-destructive px-1.5 py-0.5 text-[10px] font-medium">
              High
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
