export type Shape = 'flat' | 'curved' | 'cylindrical' | 'lampshade';
export type FrameStyle = 'flat' | 'raised' | 'groove';
export type CornerStyle = 'square' | 'rounded';
export type ImageRotation = 0 | 90 | 180 | 270;

export interface HeightmapData {
  data: Float32Array;
  width: number;
  height: number;
}

export interface LithophaneParams {
  widthMM: number;
  heightMM: number;
  minThickness: number;
  maxThickness: number;
  resolution: number;
  shape: Shape;
  curveAmount: number;
  baseThickness: number;
  invert: boolean;

  // Frame
  borderEnabled: boolean;
  borderThicknessTop: number;
  borderThicknessRight: number;
  borderThicknessBottom: number;
  borderThicknessLeft: number;
  frameStyle: FrameStyle;
  cornerStyle: CornerStyle;
  cornerRadius: number;
  hangingHoleEnabled: boolean;
  hangingHoleDiameter: number;
  standTabEnabled: boolean;

  // Image adjustments
  brightness: number;
  contrast: number;
  gamma: number;
  sharpness: number;
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  rotation: ImageRotation;

  // Crop
  cropEnabled: boolean;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

export const DEFAULT_PARAMS: LithophaneParams = {
  widthMM: 100,
  heightMM: 75,
  minThickness: 0.4,
  maxThickness: 3.0,
  resolution: 4,
  shape: 'flat',
  curveAmount: 0.3,
  baseThickness: 0.8,
  invert: false,

  // Frame
  borderEnabled: true,
  borderThicknessTop: 2,
  borderThicknessRight: 2,
  borderThicknessBottom: 2,
  borderThicknessLeft: 2,
  frameStyle: 'flat',
  cornerStyle: 'square',
  cornerRadius: 2,
  hangingHoleEnabled: false,
  hangingHoleDiameter: 4,
  standTabEnabled: false,

  // Image adjustments
  brightness: 0,
  contrast: 0,
  gamma: 1.0,
  sharpness: 0,
  mirrorHorizontal: false,
  mirrorVertical: false,
  rotation: 0,

  // Crop
  cropEnabled: false,
  cropX: 0,
  cropY: 0,
  cropWidth: 1,
  cropHeight: 1,
};
