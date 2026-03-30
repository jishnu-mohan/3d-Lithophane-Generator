import type { ImageRotation } from '@/types/lithophane';

const MAX_DIMENSION = 1000;

export interface ImageTransformOptions {
  mirrorHorizontal?: boolean;
  mirrorVertical?: boolean;
  rotation?: ImageRotation;
  cropEnabled?: boolean;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export function imageToCanvas(
  bitmap: ImageBitmap,
  targetWidth: number,
  targetHeight: number,
  options: ImageTransformOptions = {}
): ImageData {
  const {
    mirrorHorizontal = false,
    mirrorVertical = false,
    rotation = 0,
    cropEnabled = false,
    cropX = 0,
    cropY = 0,
    cropWidth = 1,
    cropHeight = 1,
  } = options;

  // Compute source rect for crop
  const sx = cropEnabled ? Math.round(cropX * bitmap.width) : 0;
  const sy = cropEnabled ? Math.round(cropY * bitmap.height) : 0;
  const sw = cropEnabled ? Math.round(cropWidth * bitmap.width) : bitmap.width;
  const sh = cropEnabled ? Math.round(cropHeight * bitmap.height) : bitmap.height;

  // For 90/270 rotation, swap target dimensions
  const rotated90 = rotation === 90 || rotation === 270;
  const canvasW = Math.min(rotated90 ? targetHeight : targetWidth, MAX_DIMENSION);
  const canvasH = Math.min(rotated90 ? targetWidth : targetHeight, MAX_DIMENSION);

  // Final output dimensions (after rotation)
  const outW = rotated90 ? canvasH : canvasW;
  const outH = rotated90 ? canvasW : canvasH;

  const canvas = new OffscreenCanvas(outW, outH);
  const ctx = canvas.getContext('2d')!;

  ctx.save();

  // Move to center for transforms
  ctx.translate(outW / 2, outH / 2);

  // Apply rotation
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Apply mirror
  const scaleX = mirrorHorizontal ? -1 : 1;
  const scaleY = mirrorVertical ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  // Draw centered (before rotation, use canvas dimensions)
  ctx.drawImage(bitmap, sx, sy, sw, sh, -canvasW / 2, -canvasH / 2, canvasW, canvasH);

  ctx.restore();

  return ctx.getImageData(0, 0, outW, outH);
}
