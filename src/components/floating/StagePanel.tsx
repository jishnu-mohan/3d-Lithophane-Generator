import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useImageUpload } from '@/hooks/useImageUpload';
import { FloatingPanel } from './FloatingPanel';
import { ControlSection, ControlDivider } from '@/components/controls/ControlSection';
import { ShapeSelector } from '@/components/controls/ShapeSelector';
import { DimensionControls } from '@/components/controls/DimensionControls';
import { ThicknessControls } from '@/components/controls/ThicknessControls';
import { ResolutionControl } from '@/components/controls/ResolutionControl';
import { CurveControls } from '@/components/controls/CurveControls';
import { BaseControls } from '@/components/controls/BaseControls';
import { ImageAdjustments } from '@/components/controls/ImageAdjustments';
import { CropTool } from '@/components/controls/CropTool';
import { FrameControls } from '@/components/controls/FrameControls';
import { ViewControls } from '@/components/controls/ViewControls';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { STAGES, type Stage } from '@/lib/stages';
import type { StageId } from '@/lib/layout-persistence';

interface StagePanelProps {
  active: StageId;
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
}

export function StagePanel({ active, collapsed, onCollapsedChange }: StagePanelProps) {
  const stage: Stage = STAGES.find((s) => s.id === active) ?? STAGES[0];

  return (
    <FloatingPanel
      anchor="left"
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      title={stage.label}
      kicker={`Stage ${stage.index} · ${stage.blurb}`}
      widthClass="w-[340px]"
      positionClass="left-4 top-20"
      className="bottom-20"
    >
      <div id={`stage-panel-${active}`} role="tabpanel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {active === 'source' && <SourceStage />}
            {active === 'geometry' && <GeometryStage />}
            {active === 'frame' && <FrameStage />}
            {active === 'render' && <RenderStage />}
          </motion.div>
        </AnimatePresence>
      </div>
    </FloatingPanel>
  );
}

function SourceStage() {
  const imageDataURL = useLithophaneStore((s) => s.imageDataURL);
  const { handleFileSelect } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <ControlSection label="Source Image">
        {imageDataURL ? (
          <div className="space-y-2">
            <div
              className="relative overflow-hidden rounded-lg border"
              style={{ borderColor: 'var(--stroke-subtle)' }}
            >
              <img
                src={imageDataURL}
                alt="Source"
                className="w-full h-auto object-contain max-h-44 bg-[oklch(0_0_0_/_0.3)]"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              <ImageIcon className="h-3 w-3 mr-1.5" />
              Replace image
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/bmp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div
            className="rounded-lg border border-dashed p-6 text-center text-xs text-text-tertiary"
            style={{ borderColor: 'var(--stroke-subtle)' }}
          >
            Drop an image onto the canvas to begin.
          </div>
        )}
      </ControlSection>

      {imageDataURL && (
        <>
          <ControlDivider />
          <ControlSection label="Crop">
            <CropTool />
          </ControlSection>

          <ControlDivider />
          <ControlSection label="Adjustments" resetSection="image">
            <ImageAdjustments />
          </ControlSection>
        </>
      )}
    </div>
  );
}

function GeometryStage() {
  return (
    <div className="space-y-4">
      <ControlSection label="Shape" resetSection="shape">
        <ShapeSelector />
      </ControlSection>

      <ControlDivider />
      <ControlSection label="Dimensions" resetSection="dimensions">
        <DimensionControls />
      </ControlSection>

      <ControlDivider />
      <ControlSection label="Thickness" resetSection="thickness">
        <ThicknessControls />
      </ControlSection>

      <ControlDivider />
      <ControlSection label="Resolution">
        <ResolutionControl />
      </ControlSection>

      <CurveControls />

      <ControlDivider />
      <ControlSection label="Base" resetSection="base">
        <BaseControls />
      </ControlSection>
    </div>
  );
}

function FrameStage() {
  return (
    <div className="space-y-4">
      <ControlSection label="Frame & Mounts" resetSection="frame">
        <FrameControls />
      </ControlSection>
    </div>
  );
}

function RenderStage() {
  return <ViewControls />;
}
