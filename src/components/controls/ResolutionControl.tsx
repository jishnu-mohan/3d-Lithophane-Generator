import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InfoTip } from '@/components/ui/info-tip';

export function ResolutionControl() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  const pixelW = Math.round(params.widthMM * params.resolution);
  const pixelH = Math.round(params.heightMM * params.resolution);
  const estimatedTriangles = pixelW * pixelH * 4;
  const isHighRes = estimatedTriangles > 2_000_000;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          Resolution
        </Label>
        <InfoTip text="How many pixels per millimeter to sample from the image. Higher values capture more detail but produce larger files and may slow down the preview." />
      </div>
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
