import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InfoTip } from '@/components/ui/info-tip';

export function BaseControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          Base
        </Label>
        <InfoTip text="Thickness of the solid back layer behind the image surface. Provides structural support and blocks ambient light for better contrast." />
      </div>
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
