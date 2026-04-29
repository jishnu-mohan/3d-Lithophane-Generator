import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cn } from '@/lib/utils';

interface ScrubInputProps {
  label: string;
  unit?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  className?: string;
  style?: CSSProperties;
}

const CLICK_THRESHOLD_PX = 4;
const CLICK_THRESHOLD_MS = 220;

/**
 * Drag-to-scrub numeric input. Pointer-down on the label captures the pointer
 * and integrates horizontal motion into the value. A short click without
 * meaningful movement focuses the underlying number input for typing.
 *
 * Modifier keys: shift = ×0.1 fine, alt/option = ×10 coarse.
 */
export function ScrubInput({
  label,
  unit,
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
  style,
}: ScrubInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startTime: number;
    startValue: number;
    moved: boolean;
  } | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [draftText, setDraftText] = useState<string | null>(null);

  function clamp(v: number) {
    let next = v;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    return next;
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLLabelElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startTime: performance.now(),
      startValue: value,
      moved: false,
    };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLLabelElement>) {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const deltaPx = e.clientX - drag.startX;
    if (Math.abs(deltaPx) >= CLICK_THRESHOLD_PX) {
      drag.moved = true;
      if (!isScrubbing) setIsScrubbing(true);
    }
    if (!drag.moved) return;

    let increment = step;
    if (e.shiftKey) increment = step / 10;
    if (e.altKey) increment = step * 10;
    const raw = drag.startValue + deltaPx * increment;
    // Snap to step grid.
    const snapped = Math.round(raw / increment) * increment;
    const next = clamp(snapped);
    if (next !== value) onChange(next);
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLLabelElement>) {
    const drag = dragStateRef.current;
    if (!drag) return;
    e.currentTarget.releasePointerCapture(drag.pointerId);
    const elapsed = performance.now() - drag.startTime;
    // Click without drag → focus the input for keyboard editing.
    if (!drag.moved && elapsed < CLICK_THRESHOLD_MS) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    dragStateRef.current = null;
    setIsScrubbing(false);
  }

  function handlePointerCancel(e: ReactPointerEvent<HTMLLabelElement>) {
    const drag = dragStateRef.current;
    if (!drag) return;
    try {
      e.currentTarget.releasePointerCapture(drag.pointerId);
    } catch {
      /* ignore */
    }
    dragStateRef.current = null;
    setIsScrubbing(false);
  }

  function commitDraft() {
    if (draftText === null) return;
    const parsed = Number(draftText);
    if (Number.isFinite(parsed)) {
      onChange(clamp(parsed));
    }
    setDraftText(null);
  }

  return (
    <div className={cn('flex flex-col gap-1', className)} style={style}>
      <label
        className={cn(
          'group flex items-center gap-1.5 select-none',
          'text-xs text-text-secondary',
          'cursor-ew-resize',
          isScrubbing && 'text-accent-aurora',
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        title="Drag to scrub · click to type · ⇧ fine · ⌥ coarse"
      >
        <span>{label}</span>
        {unit && (
          <span className="text-mono-label text-text-tertiary">{unit}</span>
        )}
      </label>
      <div
        className={cn(
          'flex items-center rounded-md border bg-[oklch(from_var(--surface-base)_l_c_h_/_0.5)]',
          'transition-colors',
          isScrubbing
            ? 'border-[var(--accent-aurora-glow)] shadow-[inset_0_0_8px_var(--accent-aurora-glow)]'
            : 'border-stroke-subtle',
        )}
      >
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={draftText ?? value}
          onChange={(e) => setDraftText(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitDraft();
              inputRef.current?.blur();
            } else if (e.key === 'Escape') {
              setDraftText(null);
              inputRef.current?.blur();
            }
          }}
          className={cn(
            'w-full bg-transparent border-0 outline-none text-mono-readout text-sm text-text-primary',
            'px-2 py-1.5',
            '[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
            '[appearance:textfield]',
          )}
        />
      </div>
    </div>
  );
}
