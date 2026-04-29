import { motion } from 'motion/react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import type { LightingMode } from '@/types/view';
import { cn } from '@/lib/utils';

interface LightingOption {
  value: LightingMode;
  label: string;
  hint: string;
  preview: 'flat' | 'studio' | 'backlit';
}

const OPTIONS: LightingOption[] = [
  { value: 'no-light', label: 'Flat', hint: 'Silhouette', preview: 'flat' },
  { value: 'normal-gradient', label: 'Studio', hint: 'Default', preview: 'studio' },
  { value: 'back-lighted', label: 'Backlit', hint: 'Through-light', preview: 'backlit' },
];

export function LightingCards() {
  const mode = useLithophaneStore((s) => s.viewState.lightingMode);
  const updateViewState = useLithophaneStore((s) => s.updateViewState);

  return (
    <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Lighting mode">
      {OPTIONS.map((opt) => {
        const isActive = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => updateViewState({ lightingMode: opt.value })}
            className={cn(
              'group relative flex flex-col items-center gap-1.5 rounded-lg p-2',
              'transition-colors duration-200 border',
              isActive
                ? 'border-transparent'
                : 'border-stroke-subtle bg-[oklch(from_var(--surface-base)_l_c_h_/_0.4)] hover:border-stroke-strong',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="lighting-halo"
                aria-hidden
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  border: '1px solid var(--accent-aurora-glow)',
                  background:
                    'oklch(from var(--accent-aurora) l c h / 0.08)',
                  boxShadow: '0 0 16px var(--accent-aurora-glow)',
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <div className="relative z-[1] w-full">
              <Diorama preview={opt.preview} active={isActive} />
            </div>
            <span
              className={cn(
                'relative z-[1] text-[10px] font-medium tracking-tight',
                isActive ? 'text-accent-aurora' : 'text-text-secondary',
              )}
            >
              {opt.label}
            </span>
            <span className="relative z-[1] text-[9px] text-text-tertiary">{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

function Diorama({
  preview,
  active,
}: {
  preview: 'flat' | 'studio' | 'backlit';
  active: boolean;
}) {
  return (
    <div
      className="relative h-10 w-full overflow-hidden rounded-md border"
      style={{
        borderColor: 'var(--stroke-subtle)',
        background:
          'linear-gradient(180deg, oklch(from var(--surface-base) calc(l - 0.02) c h), oklch(from var(--surface-base) calc(l + 0.04) c h))',
      }}
    >
      {/* The "model": a soft puck */}
      <div
        className="absolute left-1/2 top-1/2 h-6 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={
          preview === 'flat'
            ? {
                background: 'oklch(0.85 0.04 90)',
              }
            : preview === 'studio'
              ? {
                  background:
                    'radial-gradient(circle at 30% 25%, oklch(0.95 0.03 90), oklch(0.6 0.04 90) 80%)',
                  boxShadow: 'inset -2px -3px 5px oklch(0 0 0 / 0.35)',
                }
              : {
                  background:
                    'radial-gradient(circle at 50% 60%, oklch(from var(--accent-warm) calc(l + 0.05) c h / 0.95), oklch(0.55 0.06 70))',
                  boxShadow:
                    'inset 0 0 6px oklch(from var(--accent-warm) l c h / 0.7), 0 0 10px oklch(from var(--accent-warm) l c h / 0.45)',
                }
        }
      />
      {preview === 'backlit' && (
        <div
          className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, oklch(from var(--accent-warm) l c h / 0.35), transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
      )}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-2 bottom-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--accent-aurora), transparent)',
          }}
        />
      )}
    </div>
  );
}
