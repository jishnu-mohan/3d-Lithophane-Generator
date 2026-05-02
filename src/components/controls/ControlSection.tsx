import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import type { ParamSection } from '@/types/store';
import { InfoTip } from '@/components/ui/info-tip';
import { cn } from '@/lib/utils';

interface ControlSectionProps {
  label: string;
  /** Optional store section for the reset button. Omit to hide. */
  resetSection?: ParamSection;
  /** Optional inline tooltip explaining what this section does. */
  info?: string;
  /** Optional helper line under the label. */
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function ControlSection({
  label,
  resetSection,
  info,
  hint,
  className,
  children,
}: ControlSectionProps) {
  const reset = useLithophaneStore((s) => s.resetSection);

  return (
    <section className={cn('space-y-3 group/section', className)}>
      <header className="flex items-baseline justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-mono-label">{label}</span>
            {info && <InfoTip text={info} />}
          </div>
          {hint && (
            <span className="text-[11px] text-text-tertiary mt-0.5">{hint}</span>
          )}
        </div>
        {resetSection && (
          <button
            type="button"
            onClick={() => reset(resetSection)}
            title={`Reset ${label.toLowerCase()}`}
            aria-label={`Reset ${label.toLowerCase()}`}
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded',
              'text-text-tertiary transition-colors',
              'hover:text-accent-aurora',
            )}
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
      </header>
      {children}
    </section>
  );
}

/** A faint horizontal divider that fits the Aurora aesthetic. */
export function ControlDivider() {
  return (
    <div
      role="separator"
      className="h-px my-4"
      style={{
        background:
          'linear-gradient(90deg, transparent, var(--stroke-subtle), transparent)',
      }}
    />
  );
}
