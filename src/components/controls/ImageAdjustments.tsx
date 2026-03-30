import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { InfoTip } from '@/components/ui/info-tip';
import {
  FlipHorizontal,
  FlipVertical,
  RotateCw,
} from 'lucide-react';
import type { ImageRotation } from '@/types/lithophane';

const ROTATIONS: { label: string; value: ImageRotation }[] = [
  { label: '0°', value: 0 },
  { label: '90°', value: 90 },
  { label: '180°', value: 180 },
  { label: '270°', value: 270 },
];

export function ImageAdjustments() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          Image Adjustments
        </Label>
        <InfoTip text="Fine-tune how the image translates to thickness. These adjustments affect the heightmap, not the original image." />
      </div>

      {/* Brightness */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Brightness
            <InfoTip text="Shifts all pixels lighter or darker. Increase to make the overall lithophane thinner." />
          </span>
          <span className="text-muted-foreground">{params.brightness}</span>
        </div>
        <Slider
          value={[params.brightness]}
          min={-100}
          max={100}
          step={1}
          onValueChange={([v]) => updateParams({ brightness: v })}
        />
      </div>

      {/* Contrast */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Contrast
            <InfoTip text="Controls the difference between the lightest and darkest areas." />
          </span>
          <span className="text-muted-foreground">{params.contrast}</span>
        </div>
        <Slider
          value={[params.contrast]}
          min={-100}
          max={100}
          step={1}
          onValueChange={([v]) => updateParams({ contrast: v })}
        />
      </div>

      {/* Gamma */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Gamma
            <InfoTip text="Adjusts midtone distribution. Values below 1.0 brighten midtones; above 1.0 darken them. Critical for lithophane quality." />
          </span>
          <span className="text-muted-foreground">{params.gamma.toFixed(2)}</span>
        </div>
        <Slider
          value={[params.gamma]}
          min={0.1}
          max={3.0}
          step={0.05}
          onValueChange={([v]) => updateParams({ gamma: v })}
        />
      </div>

      {/* Sharpness */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            Sharpness
            <InfoTip text="Enhances edge detail using unsharp mask. Helps preserve fine details in the lithophane." />
          </span>
          <span className="text-muted-foreground">{params.sharpness}</span>
        </div>
        <Slider
          value={[params.sharpness]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => updateParams({ sharpness: v })}
        />
      </div>

      {/* Invert */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Label className="text-xs">Invert Image</Label>
          <InfoTip text="Swaps light and dark areas. Use this if your lithophane looks like a negative." />
        </span>
        <Switch
          checked={params.invert}
          onCheckedChange={(v) => updateParams({ invert: v })}
        />
      </div>

      {/* Mirror */}
      <div className="flex items-center gap-2">
        <span className="text-xs mr-auto">Mirror</span>
        <Button
          variant={params.mirrorHorizontal ? 'default' : 'outline'}
          size="icon"
          className="h-7 w-7"
          onClick={() => updateParams({ mirrorHorizontal: !params.mirrorHorizontal })}
        >
          <FlipHorizontal className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={params.mirrorVertical ? 'default' : 'outline'}
          size="icon"
          className="h-7 w-7"
          onClick={() => updateParams({ mirrorVertical: !params.mirrorVertical })}
        >
          <FlipVertical className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <span className="flex items-center gap-1 text-xs">
          <RotateCw className="h-3 w-3" />
          Rotation
        </span>
        <div className="grid grid-cols-4 gap-1">
          {ROTATIONS.map(({ label, value }) => (
            <Button
              key={value}
              variant={params.rotation === value ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-[10px] px-1"
              onClick={() => updateParams({ rotation: value })}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
