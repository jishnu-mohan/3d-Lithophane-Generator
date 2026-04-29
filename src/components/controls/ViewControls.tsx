import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { InfoTip } from '@/components/ui/info-tip';
import { ColorPicker } from '@/components/ui/color-picker';
import { ControlSection, ControlDivider } from './ControlSection';
import { LightingCards } from './LightingCards';
import {
  RotateCw,
  Grid3X3,
  Box,
  Camera,
} from 'lucide-react';
import type { CameraPreset } from '@/types/view';

const CAMERA_PRESETS: { label: string; value: CameraPreset }[] = [
  { label: 'Front', value: 'front' },
  { label: 'Back', value: 'back' },
  { label: 'Top', value: 'top' },
  { label: 'Side', value: 'side' },
];

export function ViewControls() {
  const viewState = useLithophaneStore((s) => s.viewState);
  const updateViewState = useLithophaneStore((s) => s.updateViewState);

  return (
    <div className="space-y-4">
      <ControlSection label="Lighting">
        <LightingCards />

        {viewState.lightingMode === 'back-lighted' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Light color</span>
              <ColorPicker
                value={viewState.backlightColor}
                onChange={(c) => updateViewState({ backlightColor: c })}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Intensity</span>
                <span className="text-mono-readout text-text-tertiary">
                  {Math.round((viewState.backlightIntensity * 100) / 3)}%
                </span>
              </div>
              <Slider
                value={[viewState.backlightIntensity]}
                min={0}
                max={3}
                step={0.1}
                onValueChange={([v]) =>
                  updateViewState({ backlightIntensity: v })
                }
              />
            </div>
          </div>
        )}
      </ControlSection>

      <ControlDivider />
      <ControlSection label="Material">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            Color
            <InfoTip text="Preview color only — does not affect the exported STL." />
          </span>
          <ColorPicker
            value={viewState.materialColor}
            onChange={(c) => updateViewState({ materialColor: c })}
          />
        </div>
      </ControlSection>

      <ControlDivider />
      <ControlSection label="Display">
        <ToggleRow
          icon={<Box className="h-3 w-3" />}
          label="Wireframe"
          checked={viewState.wireframe}
          onChange={(v) => updateViewState({ wireframe: v })}
        />
        <ToggleRow
          icon={<RotateCw className="h-3 w-3" />}
          label="Auto-rotate"
          checked={viewState.autoRotate}
          onChange={(v) => updateViewState({ autoRotate: v })}
        />
        <ToggleRow
          icon={<Grid3X3 className="h-3 w-3" />}
          label="Show grid"
          checked={viewState.showGrid}
          onChange={(v) => updateViewState({ showGrid: v })}
        />
      </ControlSection>

      <ControlDivider />
      <ControlSection label="Camera">
        <div className="grid grid-cols-4 gap-1.5">
          {CAMERA_PRESETS.map(({ label, value }) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              className="h-7 text-[10px] px-1"
              onClick={() => updateViewState({ cameraPreset: value })}
            >
              {label}
            </Button>
          ))}
        </div>
        <p className="text-[11px] text-text-tertiary mt-2 flex items-center gap-1">
          <Camera className="h-3 w-3" />
          Drag in the viewport to orbit · scroll to zoom
        </p>
      </ControlSection>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="flex items-center gap-2 text-xs text-text-secondary">
        {icon}
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
