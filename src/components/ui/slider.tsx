import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

type RadixSliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

interface SliderProps extends RadixSliderProps {
  /**
   * Optional default value used for snap-to-default (double-click and
   * shift-near-default). When provided, a faint tick mark is drawn on the
   * track at this position. Single-value sliders only.
   */
  snapDefault?: number;
}

const SNAP_THRESHOLD = 0.03;

/**
 * Aurora slider — thin track, luminous fill, glowing thumb. Wraps Radix
 * Slider with three additions on top of the v6 API:
 *   - a pulse on the Range fill when a drag commits (CSS @keyframes)
 *   - a Geist-Mono value bubble that materializes on hover / drag
 *   - snap-to-default (double-click and shift-release within 3% of the default)
 */
const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, snapDefault, onValueCommit, onValueChange, ...props }, ref) => {
  const min = (props.min ?? 0) as number;
  const max = (props.max ?? 100) as number;
  const value = props.value ?? props.defaultValue ?? [min];
  const range = Math.max(max - min, 0.0001);
  const primary = Array.isArray(value) ? (value[0] ?? min) : min;
  const pct = ((primary - min) / range) * 100;
  const defaultPct =
    snapDefault !== undefined ? ((snapDefault - min) / range) * 100 : null;

  const [hovered, setHovered] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [pulseKey, setPulseKey] = React.useState(0);

  function handleValueCommit(values: number[]) {
    setDragging(false);
    setPulseKey((k) => k + 1);
    onValueCommit?.(values);
  }

  function handleValueChange(values: number[]) {
    onValueChange?.(values);
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLSpanElement>) {
    if (snapDefault === undefined) return;
    e.preventDefault();
    onValueChange?.([snapDefault]);
    onValueCommit?.([snapDefault]);
    setPulseKey((k) => k + 1);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLSpanElement>) {
    if (snapDefault === undefined) return;
    if (!e.shiftKey) return;
    const distance = Math.abs(primary - snapDefault) / range;
    if (distance > 0 && distance <= SNAP_THRESHOLD) {
      onValueChange?.([snapDefault]);
      onValueCommit?.([snapDefault]);
      setPulseKey((k) => k + 1);
    }
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'group/slider relative flex w-full touch-none select-none items-center py-2',
        className,
      )}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      onPointerDown={() => setDragging(true)}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onDoubleClick={handleDoubleClick}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-[3px] w-full grow overflow-visible rounded-full"
        style={{
          background:
            'linear-gradient(90deg, var(--stroke-subtle), oklch(from var(--stroke-subtle) calc(l + 0.05) c h))',
        }}
      >
        {/* Default tick mark (snap target) */}
        {defaultPct !== null && (
          <span
            aria-hidden
            className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${defaultPct}%`,
              background: 'var(--stroke-strong)',
              opacity: 0.5,
            }}
          />
        )}
        {/* Filled range with optional commit pulse */}
        <SliderPrimitive.Range
          key={pulseKey}
          className="absolute h-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, oklch(from var(--accent-aurora) l c h / 0.7), var(--accent-aurora))',
            boxShadow: '0 0 8px var(--accent-aurora-glow)',
            animation: pulseKey > 0 ? 'aurora-glow-pulse 0.5s ease-out 1' : undefined,
          }}
        />
      </SliderPrimitive.Track>
      {/* Value bubble — visible on hover or while dragging */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md px-2 py-0.5',
          'glass-panel-soft text-mono-readout text-[10px] text-text-primary',
          'transition-opacity duration-150',
          hovered || dragging ? 'opacity-100' : 'opacity-0',
        )}
        style={{ left: `${pct}%` }}
      >
        {formatValue(primary, props.step)}
      </span>
      <SliderPrimitive.Thumb
        className={cn(
          'block h-3.5 w-3.5 rounded-full transition-transform duration-150',
          'hover:scale-110 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-aurora-glow)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-elevated)]',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
        style={{
          background:
            'radial-gradient(circle at 35% 30%, oklch(from var(--accent-aurora) calc(l + 0.1) c h), var(--accent-aurora) 70%, oklch(from var(--accent-aurora) calc(l - 0.1) c h))',
          border: '1px solid oklch(from var(--accent-aurora) calc(l + 0.1) c h / 0.6)',
          boxShadow:
            '0 0 12px var(--accent-aurora-glow), 0 0 2px var(--accent-aurora), inset 0 1px 0 oklch(1 0 0 / 0.3)',
        }}
      />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

function formatValue(v: number, step?: number): string {
  // Pick precision based on step (0.1 → 1 decimal, 0.01 → 2 decimals, etc.)
  if (step === undefined || step >= 1) return Math.round(v).toString();
  const decimals = Math.min(3, Math.max(0, -Math.floor(Math.log10(step))));
  return v.toFixed(decimals);
}

export { Slider };
