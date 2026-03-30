import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InfoTip } from '@/components/ui/info-tip';

export function ThicknessControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  return (
    <div className="space-y-4">
      <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
        Thickness
      </Label>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Min Thickness
            <InfoTip text="The thinnest part of the lithophane where the image is brightest. Lower values let more light through, revealing lighter areas of the image." />
          </span>
          <span className="text-muted-foreground">{params.minThickness.toFixed(1)} mm</span>
        </div>
        <Slider
          value={[params.minThickness]}
          min={0.1}
          max={2}
          step={0.1}
          onValueChange={([v]) => updateParams({ minThickness: v })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Max Thickness
            <InfoTip text="The thickest part where the image is darkest. Higher values block more light, giving better contrast between light and dark areas." />
          </span>
          <span className="text-muted-foreground">{params.maxThickness.toFixed(1)} mm</span>
        </div>
        <Slider
          value={[params.maxThickness]}
          min={1}
          max={8}
          step={0.1}
          onValueChange={([v]) => updateParams({ maxThickness: v })}
        />
      </div>
    </div>
  );
}
