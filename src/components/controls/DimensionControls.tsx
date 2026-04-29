import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Button } from '@/components/ui/button';
import { ScrubInput } from '@/components/ui/scrub-input';
import { Lock, Unlock } from 'lucide-react';

export function DimensionControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);
  const aspectRatioLocked = useLithophaneStore((s) => s.aspectRatioLocked);

  return (
    <div className="flex items-end gap-2">
      <ScrubInput
        className="flex-1"
        label="Width"
        unit="mm"
        value={params.widthMM}
        min={10}
        max={300}
        step={1}
        onChange={(v) => updateParams({ widthMM: v })}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 mb-1"
        onClick={() =>
          useLithophaneStore.setState((s) => ({
            aspectRatioLocked: !s.aspectRatioLocked,
          }))
        }
        title={aspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
        aria-label={aspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
      >
        {aspectRatioLocked ? (
          <Lock
            className="h-3.5 w-3.5"
            style={{ color: 'var(--accent-aurora)' }}
          />
        ) : (
          <Unlock className="h-3.5 w-3.5" />
        )}
      </Button>
      <ScrubInput
        className="flex-1"
        label="Height"
        unit="mm"
        value={params.heightMM}
        min={10}
        max={300}
        step={1}
        onChange={(v) => updateParams({ heightMM: v })}
      />
    </div>
  );
}
