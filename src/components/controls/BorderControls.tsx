import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { InfoTip } from '@/components/ui/info-tip';

export function BorderControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          Border
        </Label>
        <InfoTip text="Adds a solid frame around the lithophane at maximum thickness. This strengthens the edges and makes the print more durable." />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs">Enable Border</Label>
        <Switch
          checked={params.borderEnabled}
          onCheckedChange={(v) => updateParams({ borderEnabled: v })}
        />
      </div>
      {params.borderEnabled && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1">
              Border Width
              <InfoTip text="Width of the solid frame in millimeters. 2-3mm works well for most prints." />
            </span>
            <span className="text-muted-foreground">
              {params.borderThickness.toFixed(1)} mm
            </span>
          </div>
          <Slider
            value={[params.borderThickness]}
            min={0.5}
            max={10}
            step={0.5}
            onValueChange={([v]) => updateParams({ borderThickness: v })}
          />
        </div>
      )}
    </div>
  );
}
