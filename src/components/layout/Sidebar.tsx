import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useImageUpload } from '@/hooks/useImageUpload';
import { DimensionControls } from '@/components/controls/DimensionControls';
import { ShapeSelector } from '@/components/controls/ShapeSelector';
import { ThicknessControls } from '@/components/controls/ThicknessControls';
import { ResolutionControl } from '@/components/controls/ResolutionControl';
import { CurveControls } from '@/components/controls/CurveControls';
import { ImageAdjustments } from '@/components/controls/ImageAdjustments';
import { FrameControls } from '@/components/controls/FrameControls';
import { BaseControls } from '@/components/controls/BaseControls';
import { ViewControls } from '@/components/controls/ViewControls';
import { CropTool } from '@/components/controls/CropTool';
import { PresetsControl } from '@/components/controls/PresetsControl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ImageIcon, RotateCcw, Box, Image, Frame, Eye } from 'lucide-react';
import { useRef } from 'react';
import type { ParamSection } from '@/types/store';

function SectionHeader({
  label,
  section,
}: {
  label: string;
  section: ParamSection;
}) {
  const resetSection = useLithophaneStore((s) => s.resetSection);

  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
        {label}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 opacity-0 hover:opacity-100 focus:opacity-100 text-muted-foreground/50 hover:text-muted-foreground transition-opacity"
        onClick={() => resetSection(section)}
        title={`Reset ${label.toLowerCase()}`}
      >
        <RotateCcw className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
}

function ImageSection() {
  const imageDataURL = useLithophaneStore((s) => s.imageDataURL);
  const { handleFileSelect } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {imageDataURL ? (
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden border border-border/50 bg-muted/50 shadow-sm">
            <img
              src={imageDataURL}
              alt="Source"
              className="w-full h-auto object-contain max-h-40"
            />
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 transition-all duration-150 hover:shadow-sm h-7 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              <ImageIcon className="h-3 w-3 mr-1" />
              Change
            </Button>
          </div>
          <CropTool />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/bmp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/40 p-8 text-center text-sm text-muted-foreground/60">
          Upload an image to start
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="w-80 h-full border-r border-sidebar-border bg-sidebar-background/95 backdrop-blur-xl flex flex-col shadow-[1px_0_24px_0_rgba(0,0,0,0.25)]">
      <div className="px-5 py-4 border-b border-sidebar-border flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight">Lithophane Generator</h1>
        <PresetsControl />
      </div>

      <Tabs defaultValue="model" className="flex-1 min-h-0 flex flex-col gap-0">
        <div className="px-3 pt-3 pb-0">
          <TabsList className="w-full">
            <TabsTrigger value="model" className="gap-1 text-xs">
              <Box className="h-3 w-3" />
              Model
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-1 text-xs">
              <Image className="h-3 w-3" />
              Image
            </TabsTrigger>
            <TabsTrigger value="frame" className="gap-1 text-xs">
              <Frame className="h-3 w-3" />
              Frame
            </TabsTrigger>
            <TabsTrigger value="view" className="gap-1 text-xs">
              <Eye className="h-3 w-3" />
              View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="model" className="flex-1 overflow-y-auto px-5 py-5 space-y-5 m-0">
          <SectionHeader label="Shape" section="shape" />
          <ShapeSelector />
          <Separator />
          <SectionHeader label="Dimensions" section="dimensions" />
          <DimensionControls />
          <Separator />
          <SectionHeader label="Thickness" section="thickness" />
          <ThicknessControls />
          <Separator />
          <ResolutionControl />
          <CurveControls />
          <Separator />
          <BaseControls />
        </TabsContent>

        <TabsContent value="image" className="flex-1 overflow-y-auto px-5 py-5 space-y-5 m-0">
          <ImageSection />
          <Separator />
          <ImageAdjustments />
        </TabsContent>

        <TabsContent value="frame" className="flex-1 overflow-y-auto px-5 py-5 space-y-5 m-0">
          <FrameControls />
        </TabsContent>

        <TabsContent value="view" className="flex-1 overflow-y-auto px-5 py-5 space-y-5 m-0">
          <ViewControls />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
