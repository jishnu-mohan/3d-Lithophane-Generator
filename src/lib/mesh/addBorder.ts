import type { HeightmapData } from '@/types/lithophane';
import type { FrameStyle, CornerStyle } from '@/types/lithophane';

export interface FrameOptions {
  frameStyle: FrameStyle;
  cornerStyle: CornerStyle;
  cornerRadius: number;
  resolution: number;
}

export function addBorder(
  heightmap: HeightmapData,
  borderPixels: number,
  options?: FrameOptions
): HeightmapData {
  if (borderPixels <= 0) return heightmap;

  const { width, height, data } = heightmap;
  const newW = width + borderPixels * 2;
  const newH = height + borderPixels * 2;
  const newData = new Float32Array(newW * newH);

  const frameStyle = options?.frameStyle ?? 'flat';
  const cornerStyle = options?.cornerStyle ?? 'square';
  const cornerRadiusMM = options?.cornerRadius ?? 2;
  const resolution = options?.resolution ?? 4;
  const cornerRadiusPx = cornerStyle === 'rounded'
    ? Math.round(cornerRadiusMM * resolution)
    : 0;

  // Fill border based on frame style
  for (let r = 0; r < newH; r++) {
    for (let c = 0; c < newW; c++) {
      const inContent =
        r >= borderPixels &&
        r < borderPixels + height &&
        c >= borderPixels &&
        c < borderPixels + width;

      if (inContent) {
        newData[r * newW + c] = data[(r - borderPixels) * width + (c - borderPixels)];
        continue;
      }

      // Check rounded corner clipping
      if (cornerRadiusPx > 0) {
        const clipped = isOutsideRoundedCorner(
          c, r, newW, newH, cornerRadiusPx
        );
        if (clipped) {
          newData[r * newW + c] = 0;
          continue;
        }
      }

      // Compute border pixel value based on frame style
      newData[r * newW + c] = getBorderValue(
        c, r, newW, newH, borderPixels, frameStyle
      );
    }
  }

  return { data: newData, width: newW, height: newH };
}

function getBorderValue(
  x: number,
  y: number,
  w: number,
  h: number,
  borderPixels: number,
  style: FrameStyle
): number {
  if (style === 'flat') return 1.0;
  if (style === 'raised') return 1.3;

  // Groove: outer and inner edges at 1.0, middle channel at 0.3
  if (style === 'groove') {
    const distFromEdge = Math.min(x, y, w - 1 - x, h - 1 - y);
    const distFromContent = Math.min(
      Math.abs(x - borderPixels),
      Math.abs(y - borderPixels),
      Math.abs(x - (w - 1 - borderPixels)),
      Math.abs(y - (h - 1 - borderPixels))
    );
    const grooveWidth = Math.max(1, Math.floor(borderPixels / 3));

    if (distFromEdge < grooveWidth || distFromContent < grooveWidth) {
      return 1.0;
    }
    return 0.3;
  }

  return 1.0;
}

function isOutsideRoundedCorner(
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): boolean {
  // Check each corner
  const corners = [
    { cx: radius, cy: radius },                  // top-left
    { cx: w - 1 - radius, cy: radius },           // top-right
    { cx: radius, cy: h - 1 - radius },           // bottom-left
    { cx: w - 1 - radius, cy: h - 1 - radius },   // bottom-right
  ];

  for (const { cx, cy } of corners) {
    const inCornerBox =
      (x <= cx && y <= cy) ||                   // top-left
      (x >= cx && y <= cy && cx === w - 1 - radius) ||  // top-right
      (x <= cx && y >= cy && cy === h - 1 - radius) ||  // bottom-left
      (x >= cx && y >= cy && cx === w - 1 - radius && cy === h - 1 - radius); // bottom-right

    if (inCornerBox) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > radius * radius) {
        return true;
      }
    }
  }

  return false;
}
