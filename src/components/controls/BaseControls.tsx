import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { InfoTip } from '@/components/ui/info-tip';

export function BaseControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Base Thickness
            <InfoTip text="How thick the solid backing is. 0.8mm is a good default. Set to 0 for no backing (image-only, very fragile)." />
          </span>
          <span className="text-muted-foreground">
            {params.baseThickness.toFixed(1)} mm
          </span>
        </div>
        <Slider
          value={[params.baseThickness]}
          min={0}
          max={3}
          step={0.1}
          onValueChange={([v]) => updateParams({ baseThickness: v })}
        />
      </div>
    </div>
  );
}
