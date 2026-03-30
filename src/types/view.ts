export type CameraPreset = 'front' | 'back' | 'top' | 'side';
export type LightingMode = 'no-light' | 'back-lighted' | 'normal-gradient';

export interface ViewState {
  lightingMode: LightingMode;
  backlightIntensity: number;
  backlightColor: string;
  materialColor: string;
  wireframe: boolean;
  autoRotate: boolean;
  showGrid: boolean;
  cameraPreset: CameraPreset | null;
}

export const DEFAULT_VIEW_STATE: ViewState = {
  lightingMode: 'normal-gradient',
  backlightIntensity: 1.0,
  backlightColor: '#ffffff',
  materialColor: '#f5f0e8',
  wireframe: false,
  autoRotate: false,
  showGrid: true,
  cameraPreset: null,
};
