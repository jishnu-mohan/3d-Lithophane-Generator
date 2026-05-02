import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { InfoTip } from '@/components/ui/info-tip';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DEFAULT_PARAMS,
  type FrameStyle,
  type CornerStyle,
} from '@/types/lithophane';

type Side = 'Top' | 'Right' | 'Bottom' | 'Left';
const SIDE_KEYS: Record<
  Side,
  'borderThicknessTop' | 'borderThicknessRight' | 'borderThicknessBottom' | 'borderThicknessLeft'
> = {
  Top: 'borderThicknessTop',
  Right: 'borderThicknessRight',
  Bottom: 'borderThicknessBottom',
  Left: 'borderThicknessLeft',
};

export function FrameControls() {
  const params = useLithophaneStore((s) => s.params);
  const updateParams = useLithophaneStore((s) => s.updateParams);
  const isFlat = params.shape === 'flat';

  const t = params.borderThicknessTop;
  const r = params.borderThicknessRight;
  const b = params.borderThicknessBottom;
  const l = params.borderThicknessLeft;
  const allEqual = t === r && r === b && b === l;

  // Split mode is sticky: if values are asymmetric on mount, start in split mode;
  // otherwise start linked. Clicking the chain icon toggles explicitly.
  const [splitMode, setSplitMode] = useState(!allEqual);

  const setAll = (v: number) =>
    updateParams({
      borderThicknessTop: v,
      borderThicknessRight: v,
      borderThicknessBottom: v,
      borderThicknessLeft: v,
    });

  const handleLinkToggle = (next: boolean) => {
    if (!next) {
      // Re-link: collapse to Top value across all four sides
      setAll(t);
    }
    setSplitMode(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Enable Frame</Label>
        <Switch
          checked={params.borderEnabled}
          onCheckedChange={(v) => updateParams({ borderEnabled: v })}
        />
      </div>

      {params.borderEnabled && (
        <>
          {/* Frame width — linked or per-side */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span>Frame Width</span>
              <InfoTip text="Frame thickness in millimeters. Switch on 'Per-side widths' to set each edge independently." />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-text-secondary">
                Per-side widths
              </Label>
              <Switch checked={splitMode} onCheckedChange={handleLinkToggle} />
            </div>

            {!splitMode ? (
              <SideSlider label="All sides" value={t} onChange={setAll} />
            ) : (
              <div className="space-y-2">
                {(Object.keys(SIDE_KEYS) as Side[]).map((side) => (
                  <SideSlider
                    key={side}
                    label={side}
                    value={params[SIDE_KEYS[side]]}
                    onChange={(v) => updateParams({ [SIDE_KEYS[side]]: v })}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Image Transform — moves / scales / rotates the image inside the frame */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span>Image Transform</span>
              <InfoTip text="Move, scale, or rotate the image within the frame. The frame stays intact; vacated area becomes flat base." />
            </div>
            <OffsetRow
              label="Offset X"
              value={params.imageOffsetX}
              minMM={-params.widthMM / 2}
              maxMM={params.widthMM / 2}
              onChange={(v) => updateParams({ imageOffsetX: v })}
            />
            <OffsetRow
              label="Offset Y"
              value={params.imageOffsetY}
              minMM={-params.heightMM / 2}
              maxMM={params.heightMM / 2}
              onChange={(v) => updateParams({ imageOffsetY: v })}
            />
            <NumericRow
              label="Zoom"
              unit="×"
              value={params.imageZoom}
              min={0.25}
              max={4}
              step={0.05}
              decimals={2}
              defaultValue={1}
              onChange={(v) => updateParams({ imageZoom: v })}
            />
            <NumericRow
              label="Rotation"
              unit="°"
              value={params.imageRotationDeg}
              min={-180}
              max={180}
              step={1}
              decimals={0}
              defaultValue={0}
              onChange={(v) => updateParams({ imageRotationDeg: v })}
            />
          </div>

          {/* Frame Style */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                Style
                <InfoTip text="Flat: uniform thickness. Raised: taller than the image. Groove: decorative channel cut into the frame." />
              </span>
            </div>
            <Select
              value={params.frameStyle}
              onValueChange={(v) => updateParams({ frameStyle: v as FrameStyle })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="raised">Raised</SelectItem>
                <SelectItem value="groove">Groove</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Corner Style */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                Corners
                <InfoTip text="Rounded corners give a softer look to the frame." />
              </span>
            </div>
            <Select
              value={params.cornerStyle}
              onValueChange={(v) => updateParams({ cornerStyle: v as CornerStyle })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Corner Radius */}
          {params.cornerStyle === 'rounded' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Corner Radius</span>
                <span className="text-mono-readout text-text-tertiary">
                  {params.cornerRadius} mm
                </span>
              </div>
              <Slider
                value={[params.cornerRadius]}
                min={1}
                max={10}
                step={0.5}
                snapDefault={DEFAULT_PARAMS.cornerRadius}
                onValueChange={([v]) => updateParams({ cornerRadius: v })}
              />
            </div>
          )}

          {/* Hanging Hole (flat only) */}
          {isFlat && (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs">
                  Hanging Hole
                  <InfoTip text="Adds a circular cutout for wall mounting. Use the Position X / Y sliders to place it anywhere on the print." />
                </span>
                <Switch
                  checked={params.hangingHoleEnabled}
                  onCheckedChange={(v) => updateParams({ hangingHoleEnabled: v })}
                />
              </div>
              {params.hangingHoleEnabled && (
                <>
                  <PositionRow
                    label="Position X"
                    norm={params.hangingHoleX}
                    sizeMM={params.widthMM}
                    snapDefault={DEFAULT_PARAMS.hangingHoleX}
                    onChange={(v) => updateParams({ hangingHoleX: v })}
                  />
                  <PositionRow
                    label="Position Y"
                    norm={params.hangingHoleY}
                    sizeMM={params.heightMM}
                    snapDefault={DEFAULT_PARAMS.hangingHoleY}
                    onChange={(v) => updateParams({ hangingHoleY: v })}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Hole Diameter</span>
                      <span className="text-mono-readout text-text-tertiary">
                        {params.hangingHoleDiameter} mm
                      </span>
                    </div>
                    <Slider
                      value={[params.hangingHoleDiameter]}
                      min={2}
                      max={10}
                      step={0.5}
                      snapDefault={DEFAULT_PARAMS.hangingHoleDiameter}
                      onValueChange={([v]) => updateParams({ hangingHoleDiameter: v })}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Stand Tab (flat only, outside border toggle) */}
      {isFlat && (
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs">
            Stand Tab
            <InfoTip text="Adds a fold-out stand at the bottom so the lithophane can stand upright on a surface." />
          </span>
          <Switch
            checked={params.standTabEnabled}
            onCheckedChange={(v) => updateParams({ standTabEnabled: v })}
          />
        </div>
      )}
    </div>
  );
}

function PositionRow({
  label,
  norm,
  sizeMM,
  snapDefault,
  onChange,
}: {
  label: string;
  norm: number;
  sizeMM: number;
  snapDefault: number;
  onChange: (next: number) => void;
}) {
  const mm = norm * sizeMM;
  const [draft, setDraft] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  function commitDraft(raw: string) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setDraft(null);
      return;
    }
    const clamped = Math.min(sizeMM, Math.max(0, parsed));
    onChange(sizeMM > 0 ? clamped / sizeMM : 0);
    setDraft(null);
  }

  const isDefault = Math.abs(norm - snapDefault) < 1e-6;

  return (
    <div className="group/row space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          <button
            type="button"
            onClick={() => {
              setDraft(null);
              onChange(snapDefault);
            }}
            disabled={isDefault}
            title={`Reset ${label.toLowerCase()} to ${(snapDefault * sizeMM).toFixed(1)} mm`}
            aria-label={`Reset ${label.toLowerCase()}`}
            className={cn(
              'inline-flex h-4 w-4 items-center justify-center rounded',
              'text-text-tertiary transition-colors',
              'hover:text-accent-aurora',
              'disabled:pointer-events-none disabled:opacity-30',
            )}
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center rounded-md border bg-[oklch(from_var(--surface-base)_l_c_h_/_0.5)]',
              'transition-colors',
              focused
                ? 'border-[var(--accent-aurora-glow)] shadow-[inset_0_0_8px_var(--accent-aurora-glow)]'
                : 'border-stroke-subtle',
            )}
          >
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={sizeMM}
              step={0.1}
              value={draft ?? mm.toFixed(2)}
              onFocus={(e) => {
                setFocused(true);
                e.currentTarget.select();
              }}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={(e) => {
                setFocused(false);
                if (draft !== null) commitDraft(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitDraft(e.currentTarget.value);
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  setDraft(null);
                  e.currentTarget.blur();
                }
              }}
              className={cn(
                'w-14 bg-transparent border-0 outline-none text-mono-readout text-xs text-text-primary text-right',
                'px-2 py-0.5',
                '[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
                '[appearance:textfield]',
              )}
            />
            <span className="pr-2 text-mono-label text-[10px] text-text-tertiary">
              mm
            </span>
          </div>
          <span className="w-9 text-right text-mono-readout text-text-tertiary tabular-nums">
            {Math.round(norm * 100)}%
          </span>
        </div>
      </div>
      <Slider
        value={[norm]}
        min={0}
        max={1}
        step={0.01}
        snapDefault={snapDefault}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function OffsetRow({
  label,
  value,
  minMM,
  maxMM,
  onChange,
}: {
  label: string;
  value: number;
  minMM: number;
  maxMM: number;
  onChange: (next: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  // Clamp display so the slider stays in range when border widths shrink.
  const clamped = Math.min(maxMM, Math.max(minMM, value));
  const isDefault = Math.abs(clamped) < 1e-6;
  const sliderRange = Math.max(0.5, maxMM - minMM);
  const sliderStep = sliderRange < 4 ? 0.1 : 0.5;
  const disabled = sliderRange < 0.1;

  function commitDraft(raw: string) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setDraft(null);
      return;
    }
    onChange(Math.min(maxMM, Math.max(minMM, parsed)));
    setDraft(null);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">{label}</span>
          <button
            type="button"
            onClick={() => {
              setDraft(null);
              onChange(0);
            }}
            disabled={isDefault}
            title={`Reset ${label.toLowerCase()} to 0 mm`}
            aria-label={`Reset ${label.toLowerCase()}`}
            className={cn(
              'inline-flex h-4 w-4 items-center justify-center rounded',
              'text-text-tertiary transition-colors',
              'hover:text-accent-aurora',
              'disabled:pointer-events-none disabled:opacity-30',
            )}
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
        <div
          className={cn(
            'flex items-center rounded-md border bg-[oklch(from_var(--surface-base)_l_c_h_/_0.5)]',
            'transition-colors',
            focused
              ? 'border-[var(--accent-aurora-glow)] shadow-[inset_0_0_8px_var(--accent-aurora-glow)]'
              : 'border-stroke-subtle',
          )}
        >
          <input
            type="number"
            inputMode="decimal"
            min={minMM}
            max={maxMM}
            step={0.1}
            disabled={disabled}
            value={draft ?? clamped.toFixed(1)}
            onFocus={(e) => {
              setFocused(true);
              e.currentTarget.select();
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => {
              setFocused(false);
              if (draft !== null) commitDraft(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitDraft(e.currentTarget.value);
                e.currentTarget.blur();
              } else if (e.key === 'Escape') {
                setDraft(null);
                e.currentTarget.blur();
              }
            }}
            className={cn(
              'w-14 bg-transparent border-0 outline-none text-mono-readout text-xs text-text-primary text-right',
              'px-2 py-0.5',
              '[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
              '[appearance:textfield]',
            )}
          />
          <span className="pr-2 text-mono-label text-[10px] text-text-tertiary">
            mm
          </span>
        </div>
      </div>
      <Slider
        value={[clamped]}
        min={minMM}
        max={maxMM}
        step={sliderStep}
        snapDefault={0}
        disabled={disabled}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function NumericRow({
  label,
  unit,
  value,
  min,
  max,
  step,
  decimals,
  defaultValue,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals: number;
  defaultValue: number;
  onChange: (next: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const clamped = Math.min(max, Math.max(min, value));
  const isDefault = Math.abs(clamped - defaultValue) < Math.max(step / 2, 1e-6);

  function commitDraft(raw: string) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setDraft(null);
      return;
    }
    onChange(Math.min(max, Math.max(min, parsed)));
    setDraft(null);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">{label}</span>
          <button
            type="button"
            onClick={() => {
              setDraft(null);
              onChange(defaultValue);
            }}
            disabled={isDefault}
            title={`Reset ${label.toLowerCase()} to ${defaultValue}${unit}`}
            aria-label={`Reset ${label.toLowerCase()}`}
            className={cn(
              'inline-flex h-4 w-4 items-center justify-center rounded',
              'text-text-tertiary transition-colors',
              'hover:text-accent-aurora',
              'disabled:pointer-events-none disabled:opacity-30',
            )}
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
        <div
          className={cn(
            'flex items-center rounded-md border bg-[oklch(from_var(--surface-base)_l_c_h_/_0.5)]',
            'transition-colors',
            focused
              ? 'border-[var(--accent-aurora-glow)] shadow-[inset_0_0_8px_var(--accent-aurora-glow)]'
              : 'border-stroke-subtle',
          )}
        >
          <input
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={draft ?? clamped.toFixed(decimals)}
            onFocus={(e) => {
              setFocused(true);
              e.currentTarget.select();
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => {
              setFocused(false);
              if (draft !== null) commitDraft(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitDraft(e.currentTarget.value);
                e.currentTarget.blur();
              } else if (e.key === 'Escape') {
                setDraft(null);
                e.currentTarget.blur();
              }
            }}
            className={cn(
              'w-14 bg-transparent border-0 outline-none text-mono-readout text-xs text-text-primary text-right',
              'px-2 py-0.5',
              '[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
              '[appearance:textfield]',
            )}
          />
          <span className="pr-2 text-mono-label text-[10px] text-text-tertiary">
            {unit}
          </span>
        </div>
      </div>
      <Slider
        value={[clamped]}
        min={min}
        max={max}
        step={step}
        snapDefault={defaultValue}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function SideSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-text-secondary">{label}</span>
        <span className="text-mono-readout text-text-tertiary">
          {value.toFixed(1)} mm
        </span>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={10}
        step={0.5}
        snapDefault={DEFAULT_PARAMS.borderThicknessTop}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

