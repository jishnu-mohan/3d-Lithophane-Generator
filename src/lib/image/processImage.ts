import type { HeightmapData, ImageRotation } from '@/types/lithophane';
import { imageToCanvas } from './imageToCanvas';
import { canvasToGrayscale } from './canvasToGrayscale';
import { adjustBrightnessContrast } from './adjustBrightnessContrast';
import { applyGamma } from './applyGamma';
import { applySharpness } from './applySharpness';
import { grayscaleToHeightmap } from './grayscaleToHeightmap';

export interface ProcessImageParams {
  widthMM: number;
  heightMM: number;
  resolution: number;
  brightness: number;
  contrast: number;
  invert: boolean;
  gamma: number;
  sharpness: number;
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  rotation: ImageRotation;
  cropEnabled: boolean;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

export function processImage(
  bitmap: ImageBitmap,
  params: ProcessImageParams
): HeightmapData {
  const pixelW = Math.round(params.widthMM * params.resolution);
  const pixelH = Math.round(params.heightMM * params.resolution);

  const imageData = imageToCanvas(bitmap, pixelW, pixelH, {
    mirrorHorizontal: params.mirrorHorizontal,
    mirrorVertical: params.mirrorVertical,
    rotation: params.rotation,
    cropEnabled: params.cropEnabled,
    cropX: params.cropX,
    cropY: params.cropY,
    cropWidth: params.cropWidth,
    cropHeight: params.cropHeight,
  });

  let gray = canvasToGrayscale(imageData);
  gray = adjustBrightnessContrast(gray, params.brightness, params.contrast);
  gray = applyGamma(gray, params.gamma);
  gray = applySharpness(gray, imageData.width, imageData.height, params.sharpness);

  return grayscaleToHeightmap(gray, imageData.width, imageData.height, params.invert);
}
