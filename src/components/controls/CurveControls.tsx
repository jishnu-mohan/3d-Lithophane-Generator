import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InfoTip } from '@/components/ui/info-tip';

export function CurveControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  if (params.shape === 'flat') return null;

  const label =
    params.shape === 'lampshade' ? 'Taper Amount' : 'Curve Amount';

  const tooltip =
    params.shape === 'lampshade'
      ? 'How much the lamp shade tapers from bottom to top. 0% is a straight cylinder, 100% gives a strong cone shape.'
      : params.shape === 'cylindrical'
        ? 'Not used for full cylinders -- the image always wraps 360 degrees.'
        : 'How far the panel bends into an arc. 0% is flat, 100% is a half-circle.';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          {label}
        </Label>
        <InfoTip text={tooltip} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>{label}</span>
          <span className="text-muted-foreground">
            {(params.curveAmount * 100).toFixed(0)}%
          </span>
        </div>
        <Slider
          value={[params.curveAmount]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={([v]) => updateParams({ curveAmount: v })}
        />
      </div>
    </div>
  );
}
