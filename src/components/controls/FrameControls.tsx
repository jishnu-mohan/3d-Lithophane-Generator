import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { InfoTip } from '@/components/ui/info-tip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FrameStyle, CornerStyle } from '@/types/lithophane';

export function FrameControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);
  const isFlat = params.shape === 'flat';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          Frame
        </Label>
        <InfoTip text="Adds a solid frame around the lithophane. Strengthens edges and improves print durability." />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Enable Frame</Label>
        <Switch
          checked={params.borderEnabled}
          onCheckedChange={(v) => updateParams({ borderEnabled: v })}
        />
      </div>

      {params.borderEnabled && (
        <>
          {/* Border Width */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                Frame Width
                <InfoTip text="Width of the solid frame in millimeters." />
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

          {/* Frame Style */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                Style
                <InfoTip text="Flat: uniform thickness. Raised: taller than the image. Groove: decorative channel cut into the frame." />
              </span>
            </div>
            <Select
              value={params.frameStyle}
              onValueChange={(v) => updateParams({ frameStyle: v as FrameStyle })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="raised">Raised</SelectItem>
                <SelectItem value="groove">Groove</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Corner Style */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                Corners
                <InfoTip text="Rounded corners give a softer look to the frame." />
              </span>
            </div>
            <Select
              value={params.cornerStyle}
              onValueChange={(v) => updateParams({ cornerStyle: v as CornerStyle })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Corner Radius */}
          {params.cornerStyle === 'rounded' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Corner Radius</span>
                <span className="text-muted-foreground">
                  {params.cornerRadius} mm
                </span>
              </div>
              <Slider
                value={[params.cornerRadius]}
                min={1}
                max={10}
                step={0.5}
                onValueChange={([v]) => updateParams({ cornerRadius: v })}
              />
            </div>
          )}

          {/* Hanging Hole (flat only) */}
          {isFlat && (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs">
                  Hanging Hole
                  <InfoTip text="Adds a thin spot at the top center of the frame for wall mounting. Punch through after printing." />
                </span>
                <Switch
                  checked={params.hangingHoleEnabled}
                  onCheckedChange={(v) => updateParams({ hangingHoleEnabled: v })}
                />
              </div>
              {params.hangingHoleEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Hole Diameter</span>
                    <span className="text-muted-foreground">
                      {params.hangingHoleDiameter} mm
                    </span>
                  </div>
                  <Slider
                    value={[params.hangingHoleDiameter]}
                    min={2}
                    max={10}
                    step={0.5}
                    onValueChange={([v]) => updateParams({ hangingHoleDiameter: v })}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Stand Tab (flat only, outside border toggle) */}
      {isFlat && (
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs">
            Stand Tab
            <InfoTip text="Adds a fold-out stand at the bottom so the lithophane can stand upright on a surface." />
          </span>
          <Switch
            checked={params.standTabEnabled}
            onCheckedChange={(v) => updateParams({ standTabEnabled: v })}
          />
        </div>
      )}
    </div>
  );
}
