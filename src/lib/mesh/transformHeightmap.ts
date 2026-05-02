import type { HeightmapData } from '@/types/lithophane';

interface TransformOptions {
  /** Horizontal shift in pixels. Positive moves content right. */
  offsetXPx?: number;
  /** Vertical shift in pixels. Positive moves content down. */
  offsetYPx?: number;
  /** Uniform scale around the image center. 1 = identity. */
  zoom?: number;
  /** Rotation around the image center, in radians, clockwise. */
  rotationRad?: number;
  /** Value written to vacated cells (default 0 → flat base). */
  fillValue?: number;
}

/**
 * Resample the heightmap with an affine transform (offset + zoom + rotation
 * around the center) in a single pass, using bilinear interpolation. Output
 * grid dimensions are preserved so subsequent border / mount operations work
 * unchanged. Out-of-bounds source samples are replaced with `fillValue`.
 */
export function transformHeightmap(
  hm: HeightmapData,
  opts: TransformOptions,
): HeightmapData {
  const {
    offsetXPx = 0,
    offsetYPx = 0,
    zoom = 1,
    rotationRad = 0,
    fillValue = 0,
  } = opts;

  const isIdentity =
    offsetXPx === 0 &&
    offsetYPx === 0 &&
    zoom === 1 &&
    rotationRad === 0;
  if (isIdentity) return hm;

  const { width, height, data } = hm;
  const result = new Float32Array(width * height);
  if (fillValue !== 0) result.fill(fillValue);

  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const invZoom = zoom !== 0 ? 1 / zoom : 1;
  // Inverse rotation: rotate output coords by -θ to find source location.
  const cos = Math.cos(-rotationRad);
  const sin = Math.sin(-rotationRad);

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      // Output relative to center, with offset removed.
      const dx = c - cx - offsetXPx;
      const dy = r - cy - offsetYPx;
      // Inverse zoom around center.
      const sx = dx * invZoom;
      const sy = dy * invZoom;
      // Inverse rotation around center.
      const srcX = sx * cos - sy * sin + cx;
      const srcY = sx * sin + sy * cos + cy;

      if (srcX < 0 || srcX > width - 1 || srcY < 0 || srcY > height - 1) {
        // Leave as fillValue.
        continue;
      }

      // Bilinear sample.
      const x0 = Math.floor(srcX);
      const y0 = Math.floor(srcY);
      const x1 = Math.min(width - 1, x0 + 1);
      const y1 = Math.min(height - 1, y0 + 1);
      const fx = srcX - x0;
      const fy = srcY - y0;

      const v00 = data[y0 * width + x0];
      const v10 = data[y0 * width + x1];
      const v01 = data[y1 * width + x0];
      const v11 = data[y1 * width + x1];

      const top = v00 * (1 - fx) + v10 * fx;
      const bot = v01 * (1 - fx) + v11 * fx;
      result[r * width + c] = top * (1 - fy) + bot * fy;
    }
  }

  return { data: result, width, height };
}
