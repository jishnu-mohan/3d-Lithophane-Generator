import { useId, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FloatingPanelAnchor = 'left' | 'right' | 'bottom-right';

interface FloatingPanelProps {
  title: string;
  /** Optional kicker shown above the title in mono font (e.g. stage number). */
  kicker?: string;
  anchor: FloatingPanelAnchor;
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
  /** Width when expanded. */
  widthClass?: string;
  /** Tailwind classes controlling absolute placement. */
  positionClass?: string;
  className?: string;
  children: ReactNode;
  /** Right-aligned slot in the panel header (e.g. action buttons). */
  headerExtras?: ReactNode;
}

/**
 * Aurora floating panel: a frosted-glass card anchored to one edge of the
 * viewport overlay. Collapsing shrinks it to a vertical/horizontal "docked
 * tab" at the same edge, keeping the model visible.
 *
 * Pointer events: the parent overlay-root layer is `pointer-events: none`;
 * this panel's outer wrapper opts in via `pointer-events-auto` so OrbitControls
 * keeps working in the empty viewport space around it.
 */
export function FloatingPanel({
  title,
  kicker,
  anchor,
  collapsed,
  onCollapsedChange,
  widthClass = 'w-[320px]',
  positionClass,
  className,
  children,
  headerExtras,
}: FloatingPanelProps) {
  const headingId = useId();

  if (collapsed) {
    return (
      <DockedTab
        title={title}
        anchor={anchor}
        onExpand={() => onCollapsedChange(false)}
        positionClass={positionClass}
      />
    );
  }

  return (
    <section
      role="region"
      aria-labelledby={headingId}
      className={cn(
        'pointer-events-auto absolute flex flex-col',
        'glass-panel',
        widthClass,
        positionClass,
        className,
      )}
      style={{
        zIndex: 'var(--z-panel)',
        maxHeight: 'calc(100% - 2rem)',
      }}
      onWheelCapture={(e) => e.stopPropagation()}
    >
      <header className="flex items-center justify-between gap-2 border-b border-stroke-subtle px-4 pt-3 pb-2.5">
        <div className="flex flex-col gap-0.5 min-w-0">
          {kicker && (
            <span className="text-mono-label text-[var(--text-tertiary)] truncate">
              {kicker}
            </span>
          )}
          <h2
            id={headingId}
            className="text-sm font-medium tracking-tight text-text-primary truncate"
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {headerExtras}
          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            aria-label={`Collapse ${title}`}
            className={cn(
              'inline-flex h-6 w-6 items-center justify-center rounded-md',
              'text-text-tertiary hover:text-text-primary',
              'hover:bg-[oklch(1_0_0_/_0.05)] transition-colors',
            )}
          >
            <CollapseIcon anchor={anchor} />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-4">
        {children}
      </div>
    </section>
  );
}

function CollapseIcon({ anchor }: { anchor: FloatingPanelAnchor }) {
  if (anchor === 'left') return <ChevronLeft className="h-3.5 w-3.5" />;
  if (anchor === 'right') return <ChevronRight className="h-3.5 w-3.5" />;
  return <ChevronDown className="h-3.5 w-3.5" />;
}

interface DockedTabProps {
  title: string;
  anchor: FloatingPanelAnchor;
  onExpand: () => void;
  positionClass?: string;
}

function DockedTab({ title, anchor, onExpand, positionClass }: DockedTabProps) {
  const isVertical = anchor === 'left' || anchor === 'right';
  const placement =
    positionClass ??
    (anchor === 'left'
      ? 'top-1/2 -translate-y-1/2 left-3'
      : anchor === 'right'
        ? 'top-1/2 -translate-y-1/2 right-3'
        : 'bottom-3 right-3');

  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Expand ${title}`}
      className={cn(
        'pointer-events-auto absolute glass-panel-soft',
        'flex items-center gap-2 px-3 py-2',
        'text-mono-label text-text-secondary hover:text-accent-aurora',
        'hover:border-accent-aurora-glow transition-colors',
        isVertical && 'flex-col py-3 px-2',
        placement,
      )}
      style={{ zIndex: 'var(--z-panel)' }}
    >
      <ExpandIcon anchor={anchor} />
      <span
        className={cn(isVertical && '[writing-mode:vertical-rl] rotate-180')}
      >
        {title}
      </span>
    </button>
  );
}

function ExpandIcon({ anchor }: { anchor: FloatingPanelAnchor }) {
  if (anchor === 'left') return <ChevronRight className="h-3.5 w-3.5" />;
  if (anchor === 'right') return <ChevronLeft className="h-3.5 w-3.5" />;
  return <ChevronDown className="h-3.5 w-3.5 rotate-180" />;
}
