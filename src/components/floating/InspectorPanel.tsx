import { useLithophaneStore } from '@/store/useLithophaneStore';
import { FloatingPanel } from './FloatingPanel';
import { ControlSection, ControlDivider } from '@/components/controls/ControlSection';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  RotateCw,
  Grid3X3,
  Box as BoxIcon,
} from 'lucide-react';
import type { CameraPreset } from '@/types/view';

const CAMERA_FACES: { label: string; value: CameraPreset; placement: string }[] = [
  { label: 'Top', value: 'top', placement: 'col-start-2 row-start-1' },
  { label: 'Side', value: 'side', placement: 'col-start-1 row-start-2' },
  { label: 'Front', value: 'front', placement: 'col-start-2 row-start-2' },
  { label: 'Back', value: 'back', placement: 'col-start-3 row-start-2' },
];

interface InspectorPanelProps {
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
}

export function InspectorPanel({ collapsed, onCollapsedChange }: InspectorPanelProps) {
  const viewState = useLithophaneStore((s) => s.viewState);
  const updateViewState = useLithophaneStore((s) => s.updateViewState);

  return (
    <FloatingPanel
      anchor="right"
      title="Inspector"
      kicker="View · Camera"
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      widthClass="w-[260px]"
      positionClass="right-4 top-20"
    >
      <div className="space-y-4">
        <ControlSection label="Camera">
          <div className="grid grid-cols-3 grid-rows-2 gap-1.5 max-w-[180px] mx-auto">
            {CAMERA_FACES.map(({ label, value, placement }) => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                className={`h-8 text-[10px] px-1 ${placement}`}
                onClick={() => updateViewState({ cameraPreset: value })}
              >
                {label}
              </Button>
            ))}
          </div>
          <p className="text-[11px] text-text-tertiary mt-2 text-center">
            Drag to orbit · scroll to zoom
          </p>
        </ControlSection>

        <ControlDivider />

        <ControlSection label="Display">
          <ToggleRow
            icon={<BoxIcon className="h-3 w-3" />}
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
            label="Grid"
            checked={viewState.showGrid}
            onChange={(v) => updateViewState({ showGrid: v })}
          />
        </ControlSection>
      </div>
    </FloatingPanel>
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
