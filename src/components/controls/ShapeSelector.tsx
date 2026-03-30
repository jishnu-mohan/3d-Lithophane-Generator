import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Label } from '@/components/ui/label';
import type { Shape } from '@/types/lithophane';
import { cn } from '@/lib/utils';
import { InfoTip } from '@/components/ui/info-tip';

const shapes: { value: Shape; label: string }[] = [
  { value: 'flat', label: 'Flat' },
  { value: 'curved', label: 'Curved' },
  { value: 'cylindrical', label: 'Cylinder' },
  { value: 'lampshade', label: 'Lamp' },
];

export function ShapeSelector() {
  const shape = useLithophaneStore((s) => s.params.shape);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
          Shape
        </Label>
        <InfoTip text="Flat: standard panel for framing or standing. Curved: arched panel. Cylinder: wraps image into a full tube (great for candle holders). Lamp: tapered cylinder for lamp shades." />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {shapes.map((s) => (
          <button
            key={s.value}
            onClick={() => updateParams({ shape: s.value })}
            className={cn(
              'rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200',
              shape === s.value
                ? 'bg-primary/15 text-primary ring-1 ring-primary/30 shadow-sm shadow-primary/10'
                : 'bg-transparent text-muted-foreground ring-1 ring-border/50 hover:bg-accent hover:text-foreground hover:ring-border'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
