import { useState } from 'react';
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
import {
  DEFAULT_PARAMS,
  type FrameStyle,
  type CornerStyle,
} from '@/types/lithophane';

type Side = 'Top' | 'Right' | 'Bottom' | 'Left';
const SIDE_KEYS: Record<
  Side,
  'borderThicknessTop' | 'borderThicknessRight' | 'borderThicknessBottom' | 'borderThicknessLeft'
> = {
  Top: 'borderThicknessTop',
  Right: 'borderThicknessRight',
  Bottom: 'borderThicknessBottom',
  Left: 'borderThicknessLeft',
};

export function FrameControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);
  const isFlat = params.shape === 'flat';

  const t = params.borderThicknessTop;
  const r = params.borderThicknessRight;
  const b = params.borderThicknessBottom;
  const l = params.borderThicknessLeft;
  const allEqual = t === r && r === b && b === l;

  // Split mode is sticky: if values are asymmetric on mount, start in split mode;
  // otherwise start linked. Clicking the chain icon toggles explicitly.
  const [splitMode, setSplitMode] = useState(!allEqual);

  const setAll = (v: number) =>
    updateParams({
      borderThicknessTop: v,
      borderThicknessRight: v,
      borderThicknessBottom: v,
      borderThicknessLeft: v,
    });

  const handleLinkToggle = (next: boolean) => {
    if (!next) {
      // Re-link: collapse to Top value across all four sides
      setAll(t);
    }
    setSplitMode(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Enable Frame</Label>
        <Switch
          checked={params.borderEnabled}
          onCheckedChange={(v) => updateParams({ borderEnabled: v })}
        />
      </div>

      {params.borderEnabled && (
        <>
          {/* Frame width — linked or per-side */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span>Frame Width</span>
              <InfoTip text="Frame thickness in millimeters. Switch on 'Per-side widths' to set each edge independently." />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-text-secondary">
                Per-side widths
              </Label>
              <Switch checked={splitMode} onCheckedChange={handleLinkToggle} />
            </div>

            {!splitMode ? (
              <SideSlider label="All sides" value={t} onChange={setAll} />
            ) : (
              <div className="space-y-2">
                {(Object.keys(SIDE_KEYS) as Side[]).map((side) => (
                  <SideSlider
                    key={side}
                    label={side}
                    value={params[SIDE_KEYS[side]]}
                    onChange={(v) => updateParams({ [SIDE_KEYS[side]]: v })}
                  />
                ))}
              </div>
            )}
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
                <span className="text-mono-readout text-text-tertiary">
                  {params.cornerRadius} mm
                </span>
              </div>
              <Slider
                value={[params.cornerRadius]}
                min={1}
                max={10}
                step={0.5}
                snapDefault={DEFAULT_PARAMS.cornerRadius}
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
                  <InfoTip text="Adds a thin spot at the top center of the frame for wall mounting. Punch through after printing. Sits inside the top border." />
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
                    <span className="text-mono-readout text-text-tertiary">
                      {params.hangingHoleDiameter} mm
                    </span>
                  </div>
                  <Slider
                    value={[params.hangingHoleDiameter]}
                    min={2}
                    max={10}
                    step={0.5}
                    snapDefault={DEFAULT_PARAMS.hangingHoleDiameter}
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

function SideSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-text-secondary">{label}</span>
        <span className="text-mono-readout text-text-tertiary">
          {value.toFixed(1)} mm
        </span>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={10}
        step={0.5}
        snapDefault={DEFAULT_PARAMS.borderThicknessTop}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}
