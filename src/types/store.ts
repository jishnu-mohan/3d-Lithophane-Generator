import type { HeightmapData, LithophaneParams } from './lithophane';
import type { ViewState } from './view';

export type ParamSection =
  | 'dimensions'
  | 'thickness'
  | 'shape'
  | 'image'
  | 'frame'
  | 'base';

export interface Preset {
  name: string;
  params: LithophaneParams;
  createdAt: number;
}

export interface LithophaneState {
  imageFile: File | null;
  imageDataURL: string | null;
  heightmap: HeightmapData | null;
  isProcessing: boolean;
  params: LithophaneParams;
  aspectRatioLocked: boolean;
  originalAspectRatio: number | null;

  // View state
  viewState: ViewState;
  updateViewState: (partial: Partial<ViewState>) => void;

  // Undo/redo
  undoStack: LithophaneParams[];
  redoStack: LithophaneParams[];
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;

  // Presets
  presets: Preset[];
  savePreset: (name: string) => void;
  loadPreset: (index: number) => void;
  deletePreset: (index: number) => void;

  // Actions
  setImage: (file: File, dataURL: string) => void;
  updateParams: (partial: Partial<LithophaneParams>) => void;
  setHeightmap: (data: HeightmapData) => void;
  setProcessing: (v: boolean) => void;
  reset: () => void;
  resetSection: (section: ParamSection) => void;
}
