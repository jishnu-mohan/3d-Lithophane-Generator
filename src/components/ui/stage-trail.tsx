import { useRef, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { STAGES } from '@/lib/stages';
import type { StageId } from '@/lib/layout-persistence';

interface StageTrailProps {
  active: StageId;
  onChange: (next: StageId) => void;
}

export function StageTrail({ active, onChange }: StageTrailProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKey(e: KeyboardEvent<HTMLButtonElement>, current: number) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (current + dir + STAGES.length) % STAGES.length;
      const target = STAGES[next];
      onChange(target.id);
      refs.current[target.id]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(STAGES[0].id);
      refs.current[STAGES[0].id]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = STAGES[STAGES.length - 1];
      onChange(last.id);
      refs.current[last.id]?.focus();
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Workflow stages"
      className={cn(
        'pointer-events-auto inline-flex items-stretch',
        'glass-panel-soft px-1 py-1',
      )}
    >
      {STAGES.map((stage, i) => {
        const isActive = stage.id === active;
        return (
          <button
            key={stage.id}
            ref={(el) => {
              refs.current[stage.id] = el;
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`stage-panel-${stage.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(stage.id)}
            onKeyDown={(e) => handleKey(e, i)}
            className={cn(
              'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              isActive
                ? 'text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            <span
              className={cn(
                'text-mono-readout text-[10px]',
                isActive ? 'text-accent-aurora' : 'text-text-tertiary',
              )}
            >
              {stage.index}
            </span>
            <span className="text-xs font-medium tracking-tight">
              {stage.label}
            </span>
            {isActive && (
              <motion.span
                layoutId="stage-underline"
                aria-hidden
                className="absolute inset-x-2 -bottom-px h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, var(--accent-aurora), transparent)',
                  boxShadow: '0 0 8px var(--accent-aurora-glow)',
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
