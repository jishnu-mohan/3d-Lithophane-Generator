import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useUIMode } from '@/lib/ui-mode';
import { FloatingPanel } from './FloatingPanel';
import { ControlSection, ControlDivider } from '@/components/controls/ControlSection';
import { ColorPicker } from '@/components/ui/color-picker';
import { Switch } from '@/components/ui/switch';
import {
  RotateCw,
  Grid3X3,
  Box as BoxIcon,
  Sparkles,
} from 'lucide-react';

interface InspectorPanelProps {
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
}

export function InspectorPanel({ collapsed, onCollapsedChange }: InspectorPanelProps) {
  const viewState = useLithophaneStore((s) => s.viewState);
  const updateViewState = useLithophaneStore((s) => s.updateViewState);
  const [uiMode, setUIMode] = useUIMode();

  return (
    <FloatingPanel
      anchor="right"
      title="Inspector"
      kicker="View · Material"
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      widthClass="w-[260px]"
      positionClass="right-4 top-36"
    >
      <div className="space-y-4">
        <ControlSection label="Material">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Surface color</span>
            <ColorPicker
              value={viewState.materialColor}
              onChange={(c) => updateViewState({ materialColor: c })}
            />
          </div>
          <p className="text-[11px] text-text-tertiary mt-2">
            Preview only — not exported with STL.
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
          <ToggleRow
            icon={<Sparkles className="h-3 w-3" />}
            label="Aurora effects"
            checked={uiMode === 'aurora'}
            onChange={(v) => setUIMode(v ? 'aurora' : 'basic')}
            hint="Disable for low-power machines"
          />
        </ControlSection>

        <ControlDivider />

        <p className="text-[11px] text-text-tertiary leading-relaxed">
          Use the cube in the top-right to orient the camera. Drag the
          viewport to orbit · scroll to zoom.
        </p>
      </div>
    </FloatingPanel>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="flex items-center gap-2 text-xs text-text-secondary min-w-0">
        {icon}
        <span className="flex flex-col min-w-0">
          <span className="truncate">{label}</span>
          {hint && (
            <span className="text-[10px] text-text-tertiary truncate">{hint}</span>
          )}
        </span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
