import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';
import { InfoTip } from '@/components/ui/info-tip';

export function DimensionControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);
  const aspectRatioLocked = useLithophaneStore((s) => s.aspectRatioLocked);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          Dimensions
        </Label>
        <InfoTip text="Physical size of the printed lithophane in millimeters. Use the lock button to maintain the original image aspect ratio." />
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className="text-xs">Width (mm)</Label>
          <Input
            type="number"
            min={10}
            max={300}
            value={params.widthMM}
            onChange={(e) => updateParams({ widthMM: Number(e.target.value) })}
            className="h-8 text-sm"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() =>
            useLithophaneStore.setState((s) => ({
              aspectRatioLocked: !s.aspectRatioLocked,
            }))
          }
        >
          {aspectRatioLocked ? (
            <Lock className="h-3.5 w-3.5" />
          ) : (
            <Unlock className="h-3.5 w-3.5" />
          )}
        </Button>
        <div className="flex-1">
          <Label className="text-xs">Height (mm)</Label>
          <Input
            type="number"
            min={10}
            max={300}
            value={params.heightMM}
            onChange={(e) => updateParams({ heightMM: Number(e.target.value) })}
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
