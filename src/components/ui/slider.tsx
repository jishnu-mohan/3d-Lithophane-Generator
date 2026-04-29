import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

/**
 * Aurora slider — thin track, luminous fill, glowing thumb. Wraps Radix
 * Slider so the API is identical to the previous shadcn slider.
 */
const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'group/slider relative flex w-full touch-none select-none items-center py-2',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-[3px] w-full grow overflow-hidden rounded-full"
      style={{
        background:
          'linear-gradient(90deg, var(--stroke-subtle), oklch(from var(--stroke-subtle) calc(l + 0.05) c h))',
      }}
    >
      <SliderPrimitive.Range
        className="absolute h-full"
        style={{
          background:
            'linear-gradient(90deg, oklch(from var(--accent-aurora) l c h / 0.7), var(--accent-aurora))',
          boxShadow: '0 0 8px var(--accent-aurora-glow)',
        }}
      />
    </SliderPrimitive.Track>
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
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
