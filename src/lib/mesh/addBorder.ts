import type { HeightmapData } from '@/types/lithophane';
import type { FrameStyle, CornerStyle } from '@/types/lithophane';

export interface FrameOptions {
  frameStyle: FrameStyle;
  cornerStyle: CornerStyle;
  cornerRadius: number;
  resolution: number;
}

export interface BorderPixels {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function addBorder(
  heightmap: HeightmapData,
  borderPixels: BorderPixels,
  options?: FrameOptions
): HeightmapData {
  const { top, right, bottom, left } = borderPixels;
  if (top <= 0 && right <= 0 && bottom <= 0 && left <= 0) return heightmap;

  const { width, height, data } = heightmap;
  const newW = width + left + right;
  const newH = height + top + bottom;
  const newData = new Float32Array(newW * newH);

  const frameStyle = options?.frameStyle ?? 'flat';
  const cornerStyle = options?.cornerStyle ?? 'square';
  const cornerRadiusMM = options?.cornerRadius ?? 2;
  const resolution = options?.resolution ?? 4;
  const cornerRadiusPx =
    cornerStyle === 'rounded' ? Math.round(cornerRadiusMM * resolution) : 0;

  // Per-corner radius cap: arc cannot exceed the smaller of the two adjacent sides.
  const radiusTL = Math.min(cornerRadiusPx, top, left);
  const radiusTR = Math.min(cornerRadiusPx, top, right);
  const radiusBL = Math.min(cornerRadiusPx, bottom, left);
  const radiusBR = Math.min(cornerRadiusPx, bottom, right);

  for (let r = 0; r < newH; r++) {
    for (let c = 0; c < newW; c++) {
      const inContent =
        r >= top && r < top + height && c >= left && c < left + width;

      if (inContent) {
        newData[r * newW + c] = data[(r - top) * width + (c - left)];
        continue;
      }

      // Rounded corner clipping (per-corner radius)
      if (cornerRadiusPx > 0) {
        if (
          isOutsideRoundedCorner(c, r, newW, newH, {
            tl: radiusTL,
            tr: radiusTR,
            bl: radiusBL,
            br: radiusBR,
          })
        ) {
          newData[r * newW + c] = 0;
          continue;
        }
      }

      newData[r * newW + c] = getBorderValue(
        c,
        r,
        newW,
        newH,
        borderPixels,
        frameStyle,
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
  borderPixels: BorderPixels,
  style: FrameStyle,
): number {
  if (style === 'flat') return 1.0;
  if (style === 'raised') return 1.3;

  // Groove: outer and inner edges at 1.0, middle channel at 0.3
  if (style === 'groove') {
    const { top, right, bottom, left } = borderPixels;
    const distFromEdge = Math.min(x, y, w - 1 - x, h - 1 - y);
    const distFromContent = Math.min(
      Math.abs(x - left),
      Math.abs(y - top),
      Math.abs(x - (w - 1 - right)),
      Math.abs(y - (h - 1 - bottom)),
    );
    const minSide = Math.max(1, Math.min(top, right, bottom, left));
    const grooveWidth = Math.max(1, Math.floor(minSide / 3));

    if (distFromEdge < grooveWidth || distFromContent < grooveWidth) {
      return 1.0;
    }
    return 0.3;
  }

  return 1.0;
}

interface CornerRadii {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}

function isOutsideRoundedCorner(
  x: number,
  y: number,
  w: number,
  h: number,
  radii: CornerRadii,
): boolean {
  const corners: { cx: number; cy: number; r: number }[] = [
    { cx: radii.tl, cy: radii.tl, r: radii.tl },
    { cx: w - 1 - radii.tr, cy: radii.tr, r: radii.tr },
    { cx: radii.bl, cy: h - 1 - radii.bl, r: radii.bl },
    { cx: w - 1 - radii.br, cy: h - 1 - radii.br, r: radii.br },
  ];

  for (const { cx, cy, r } of corners) {
    if (r <= 0) continue;
    const inCornerBox =
      (x <= cx && y <= cy) ||
      (x >= cx && y <= cy && cx === w - 1 - r) ||
      (x <= cx && y >= cy && cy === h - 1 - r) ||
      (x >= cx && y >= cy && cx === w - 1 - r && cy === h - 1 - r);

    if (inCornerBox) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > r * r) {
        return true;
      }
    }
  }

  return false;
}
