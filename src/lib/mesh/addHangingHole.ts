import type { HeightmapData } from '@/types/lithophane';

/**
 * Mark a circular cutout for a hanging mount at a normalized position
 * within the framed heightmap. (0,0) is top-left, (1,1) is bottom-right.
 *
 * The cutout is marked with a sentinel value (`-1`) in the heightmap.
 * `generateFlat` reads this sentinel and skips both front- and back-face
 * quads, producing an actual through-hole rather than a thin spot.
 *
 * The center is clamped so the full disk always fits inside the print.
 */
export function addHangingHole(
  heightmap: HeightmapData,
  holeDiameterMM: number,
  resolution: number,
  posX: number,
  posY: number,
): HeightmapData {
  const { width, height, data } = heightmap;
  const result = new Float32Array(data);

  const radiusPx = Math.round((holeDiameterMM / 2) * resolution);
  const margin = Math.max(2, Math.round(resolution * 0.5));
  const minCx = radiusPx + margin;
  const maxCx = width - 1 - radiusPx - margin;
  const minCy = radiusPx + margin;
  const maxCy = height - 1 - radiusPx - margin;

  let cx = Math.round(posX * (width - 1));
  let cy = Math.round(posY * (height - 1));
  if (maxCx >= minCx) cx = Math.min(maxCx, Math.max(minCx, cx));
  if (maxCy >= minCy) cy = Math.min(maxCy, Math.max(minCy, cy));

  for (
    let r = Math.max(0, cy - radiusPx);
    r <= Math.min(height - 1, cy + radiusPx);
    r++
  ) {
    for (
      let c = Math.max(0, cx - radiusPx);
      c <= Math.min(width - 1, cx + radiusPx);
      c++
    ) {
      const dx = c - cx;
      const dy = r - cy;
      if (dx * dx + dy * dy <= radiusPx * radiusPx) {
        result[r * width + c] = -1;
      }
    }
  }

  return { data: result, width, height };
}
