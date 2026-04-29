import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import type { Shape } from '@/types/lithophane';
import { cn } from '@/lib/utils';

interface ShapeOption {
  value: Shape;
  label: string;
  description: string;
  icon: () => ReactElement;
}

const SHAPES: ShapeOption[] = [
  {
    value: 'flat',
    label: 'Flat',
    description: 'Frame or stand',
    icon: () => (
      <svg viewBox="0 0 64 48" className="h-9 w-12">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        >
          <path d="M14 14 L50 14 L58 22 L22 22 Z" opacity="0.6" />
          <path d="M14 14 L14 38 L22 46 L22 22" opacity="0.5" />
          <path d="M22 22 L58 22 L58 46 L22 46 Z" />
        </g>
      </svg>
    ),
  },
  {
    value: 'curved',
    label: 'Curved',
    description: 'Arched panel',
    icon: () => (
      <svg viewBox="0 0 64 48" className="h-9 w-12">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        >
          <path d="M14 38 Q32 18 50 38" />
          <path d="M14 38 L14 24 Q32 4 50 24 L50 38" opacity="0.6" />
          <path d="M14 38 L14 24" opacity="0.5" />
          <path d="M50 38 L50 24" opacity="0.5" />
        </g>
      </svg>
    ),
  },
  {
    value: 'cylindrical',
    label: 'Cylinder',
    description: '360° wrap',
    icon: () => (
      <svg viewBox="0 0 64 48" className="h-9 w-12">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        >
          <ellipse cx="32" cy="12" rx="14" ry="4" />
          <path d="M18 12 L18 36" />
          <path d="M46 12 L46 36" />
          <path d="M18 36 Q32 42 46 36" />
          <path d="M18 36 Q32 30 46 36" opacity="0.4" strokeDasharray="2 2" />
        </g>
      </svg>
    ),
  },
  {
    value: 'lampshade',
    label: 'Lamp',
    description: 'Tapered cone',
    icon: () => (
      <svg viewBox="0 0 64 48" className="h-9 w-12">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        >
          <ellipse cx="32" cy="12" rx="9" ry="3" />
          <path d="M23 12 L17 38" />
          <path d="M41 12 L47 38" />
          <ellipse cx="32" cy="38" rx="15" ry="4" />
          <path d="M17 38 Q32 32 47 38" opacity="0.4" strokeDasharray="2 2" />
        </g>
      </svg>
    ),
  },
];

export function ShapeSelector() {
  const shape = useLithophaneStore((s) => s.params.shape);
  const updateParams = useLithophaneStore((s) => s.updateParams);

  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Shape">
      {SHAPES.map((opt) => {
        const isActive = shape === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => updateParams({ shape: opt.value })}
            className={cn(
              'group relative flex flex-col items-start gap-1.5 rounded-lg p-3',
              'transition-colors duration-200',
              'border',
              isActive
                ? 'border-transparent'
                : 'border-stroke-subtle bg-[oklch(from_var(--surface-base)_l_c_h_/_0.4)] hover:border-stroke-strong',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="shape-halo"
                aria-hidden
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  border: '1px solid var(--accent-aurora-glow)',
                  background:
                    'oklch(from var(--accent-aurora) l c h / 0.08)',
                  boxShadow:
                    '0 0 20px var(--accent-aurora-glow), inset 0 1px 0 oklch(1 0 0 / 0.06)',
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <div
              className={cn(
                'relative z-[1] flex h-12 w-full items-center justify-center rounded-md transition-colors',
                isActive
                  ? 'text-accent-aurora'
                  : 'text-text-tertiary group-hover:text-text-secondary',
              )}
            >
              <Icon />
            </div>
            <div className="relative z-[1] flex flex-col items-start text-left">
              <span
                className={cn(
                  'text-xs font-medium tracking-tight',
                  isActive ? 'text-accent-aurora' : 'text-text-primary',
                )}
              >
                {opt.label}
              </span>
              <span className="text-[10px] text-text-tertiary">
                {opt.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
