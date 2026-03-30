import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { InfoTip } from '@/components/ui/info-tip';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  RotateCw,
  Grid3X3,
  Box,
  SunMedium,
  Camera,
} from 'lucide-react';
import type { CameraPreset, LightingMode } from '@/types/view';

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
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3 text-muted-foreground/70" />
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          View Options
        </Label>
      </div>

      {/* Lighting Mode */}
      <div className="space-y-2">
        <span className="flex items-center gap-1 text-xs">
          <SunMedium className="h-3 w-3" />
          Lighting
        </span>
        <Select
          value={viewState.lightingMode}
          onValueChange={(v) =>
            updateViewState({ lightingMode: v as LightingMode })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-light">No light</SelectItem>
            <SelectItem value="back-lighted">Back lighted</SelectItem>
            <SelectItem value="normal-gradient">Normal gradient</SelectItem>
          </SelectContent>
        </Select>

        {viewState.lightingMode === 'back-lighted' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs">Light color</span>
              <ColorPicker
                value={viewState.backlightColor}
                onChange={(c) => updateViewState({ backlightColor: c })}
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Light intensity</span>
                <span className="text-muted-foreground">
                  {Math.round(viewState.backlightIntensity * 100 / 3)}%
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
          </>
        )}
      </div>

      {/* Material Color */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs">
          Material Color
          <InfoTip text="Preview color only — does not affect the exported STL." />
        </span>
        <ColorPicker
          value={viewState.materialColor}
          onChange={(c) => updateViewState({ materialColor: c })}
        />
      </div>

      {/* Wireframe */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs">
          <Box className="h-3 w-3" />
          Wireframe
        </span>
        <Switch
          checked={viewState.wireframe}
          onCheckedChange={(v) => updateViewState({ wireframe: v })}
        />
      </div>

      {/* Auto-rotate */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs">
          <RotateCw className="h-3 w-3" />
          Auto-rotate
        </span>
        <Switch
          checked={viewState.autoRotate}
          onCheckedChange={(v) => updateViewState({ autoRotate: v })}
        />
      </div>

      {/* Grid */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs">
          <Grid3X3 className="h-3 w-3" />
          Show Grid
        </span>
        <Switch
          checked={viewState.showGrid}
          onCheckedChange={(v) => updateViewState({ showGrid: v })}
        />
      </div>

      {/* Camera Presets */}
      <div className="space-y-2">
        <span className="flex items-center gap-1 text-xs">
          <Camera className="h-3 w-3" />
          Camera
        </span>
        <div className="grid grid-cols-4 gap-1">
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
      </div>
    </div>
  );
}
