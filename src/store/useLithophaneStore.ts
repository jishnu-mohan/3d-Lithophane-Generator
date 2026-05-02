import { create } from 'zustand';
import { DEFAULT_PARAMS } from '@/types/lithophane';
import { DEFAULT_VIEW_STATE } from '@/types/view';
import type { LithophaneParams } from '@/types/lithophane';
import type { LithophaneState, ParamSection, Preset } from '@/types/store';

const PRESETS_KEY = 'lithophane-presets';
const MAX_UNDO = 50;

/**
 * Migrate legacy params shape:
 *   borderThickness: number  →  borderThicknessTop/Right/Bottom/Left: number
 * Older presets stored a single scalar; spread it to all four sides on load.
 */
function migrateParams(
  p: Partial<LithophaneParams> & {
    borderThickness?: number;
    hangingHoleOrientation?: 'horizontal' | 'vertical';
  },
): Partial<LithophaneParams> {
  let next: Partial<LithophaneParams> & {
    borderThickness?: number;
    hangingHoleOrientation?: 'horizontal' | 'vertical';
  } = p;

  // Legacy uniform borderThickness → per-side
  if (
    typeof next.borderThickness === 'number' &&
    next.borderThicknessTop === undefined
  ) {
    const v = next.borderThickness;
    const { borderThickness: _b, ...rest } = next;
    void _b;
    next = {
      ...rest,
      borderThicknessTop: v,
      borderThicknessRight: v,
      borderThicknessBottom: v,
      borderThicknessLeft: v,
    };
  }

  // Legacy orientation → X/Y position
  if (
    next.hangingHoleOrientation !== undefined &&
    next.hangingHoleX === undefined
  ) {
    const { hangingHoleOrientation: orient, ...rest } = next;
    next =
      orient === 'vertical'
        ? { ...rest, hangingHoleX: 0.05, hangingHoleY: 0.1 }
        : { ...rest, hangingHoleX: 0.5, hangingHoleY: 0.05 };
  }

  return next;
}

function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Preset[];
    return parsed.map((preset) => ({
      ...preset,
      params: { ...DEFAULT_PARAMS, ...migrateParams(preset.params) } as LithophaneParams,
    }));
  } catch {
    return [];
  }
}

function savePresetsToStorage(presets: Preset[]) {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

const SECTION_KEYS: Record<ParamSection, (keyof LithophaneParams)[]> = {
  dimensions: ['widthMM', 'heightMM'],
  thickness: ['minThickness', 'maxThickness'],
  shape: ['shape', 'curveAmount'],
  image: [
    'brightness',
    'contrast',
    'invert',
    'gamma',
    'sharpness',
    'mirrorHorizontal',
    'mirrorVertical',
    'rotation',
    'cropEnabled',
    'cropX',
    'cropY',
    'cropWidth',
    'cropHeight',
  ],
  frame: [
    'borderEnabled',
    'borderThicknessTop',
    'borderThicknessRight',
    'borderThicknessBottom',
    'borderThicknessLeft',
    'frameStyle',
    'cornerStyle',
    'cornerRadius',
    'hangingHoleEnabled',
    'hangingHoleDiameter',
    'hangingHoleX',
    'hangingHoleY',
    'standTabEnabled',
  ],
  base: ['baseThickness'],
};

let lastSnapshotTime = 0;

export const useLithophaneStore = create<LithophaneState>((set, get) => ({
  imageFile: null,
  imageDataURL: null,
  heightmap: null,
  isProcessing: false,
  params: { ...DEFAULT_PARAMS },
  aspectRatioLocked: true,
  originalAspectRatio: null,

  // View state
  viewState: { ...DEFAULT_VIEW_STATE },
  updateViewState: (partial) =>
    set((s) => ({ viewState: { ...s.viewState, ...partial } })),

  // Undo/redo
  undoStack: [],
  redoStack: [],
  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  undo: () => {
    const { undoStack, redoStack, params } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    set({
      params: prev,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, params],
    });
  },

  redo: () => {
    const { undoStack, redoStack, params } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      params: next,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, params],
    });
  },

  // Presets
  presets: loadPresets(),

  savePreset: (name) => {
    const preset: Preset = {
      name,
      params: { ...get().params },
      createdAt: Date.now(),
    };
    const presets = [...get().presets, preset];
    set({ presets });
    savePresetsToStorage(presets);
  },

  loadPreset: (index) => {
    const preset = get().presets[index];
    if (!preset) return;
    const { undoStack, params } = get();
    const migrated = migrateParams(preset.params);
    set({
      params: { ...DEFAULT_PARAMS, ...migrated } as LithophaneParams,
      undoStack: [...undoStack.slice(-(MAX_UNDO - 1)), params],
      redoStack: [],
    });
  },

  deletePreset: (index) => {
    const presets = get().presets.filter((_, i) => i !== index);
    set({ presets });
    savePresetsToStorage(presets);
  },

  setImage: (file, dataURL) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      const { widthMM } = get().params;
      set({
        imageFile: file,
        imageDataURL: dataURL,
        originalAspectRatio: ratio,
        params: {
          ...get().params,
          heightMM: Math.round(widthMM / ratio),
        },
      });
    };
    img.src = dataURL;
  },

  updateParams: (partial) => {
    const state = get();
    const next = { ...state.params, ...partial };

    if (state.aspectRatioLocked && state.originalAspectRatio) {
      if (partial.widthMM !== undefined && partial.heightMM === undefined) {
        next.heightMM = Math.round(partial.widthMM / state.originalAspectRatio);
      } else if (partial.heightMM !== undefined && partial.widthMM === undefined) {
        next.widthMM = Math.round(partial.heightMM * state.originalAspectRatio);
      }
    }

    // Debounced undo snapshot: only push if >500ms since last snapshot
    const now = Date.now();
    const updates: Partial<LithophaneState> = { params: next, redoStack: [] };
    if (now - lastSnapshotTime > 500) {
      updates.undoStack = [
        ...state.undoStack.slice(-(MAX_UNDO - 1)),
        state.params,
      ];
      lastSnapshotTime = now;
    }

    set(updates as LithophaneState);
  },

  setHeightmap: (data) => set({ heightmap: data }),
  setProcessing: (v) => set({ isProcessing: v }),

  reset: () =>
    set({
      imageFile: null,
      imageDataURL: null,
      heightmap: null,
      isProcessing: false,
      params: { ...DEFAULT_PARAMS },
      aspectRatioLocked: true,
      originalAspectRatio: null,
      undoStack: [],
      redoStack: [],
    }),

  resetSection: (section) => {
    const keys = SECTION_KEYS[section];
    if (!keys) return;
    const state = get();
    const patch: Partial<LithophaneParams> = {};
    for (const key of keys) {
      (patch as Record<string, unknown>)[key] = DEFAULT_PARAMS[key];
    }
    // Push undo snapshot
    set({
      params: { ...state.params, ...patch },
      undoStack: [...state.undoStack.slice(-(MAX_UNDO - 1)), state.params],
      redoStack: [],
    });
  },
}));
