import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { ControlSection, ControlDivider } from './ControlSection';

export function CurveControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  if (params.shape === 'flat') return null;

  const label = params.shape === 'lampshade' ? 'Taper Amount' : 'Curve Amount';

  const tooltip =
    params.shape === 'lampshade'
      ? 'How much the lamp shade tapers from bottom to top. 0% is a straight cylinder, 100% gives a strong cone shape.'
      : params.shape === 'cylindrical'
        ? 'Not used for full cylinders — the image always wraps 360°.'
        : 'How far the panel bends into an arc. 0% is flat, 100% is a half-circle.';

  return (
    <>
      <ControlDivider />
      <ControlSection label={label} info={tooltip}>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">{label}</span>
            <span className="text-mono-readout text-text-tertiary">
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
      </ControlSection>
    </>
  );
}
