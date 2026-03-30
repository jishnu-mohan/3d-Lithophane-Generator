import type { HeightmapData } from '@/types/lithophane';

export function addHangingHole(
  heightmap: HeightmapData,
  holeDiameterMM: number,
  resolution: number,
  borderThicknessMM: number
): HeightmapData {
  const { width, height, data } = heightmap;
  const result = new Float32Array(data);

  const radiusPx = Math.round((holeDiameterMM / 2) * resolution);
  const borderPx = Math.round(borderThicknessMM * resolution);

  // Center hole horizontally, vertically centered within top border
  const cx = Math.round(width / 2);
  const cy = Math.round(borderPx / 2);

  for (let r = Math.max(0, cy - radiusPx); r <= Math.min(height - 1, cy + radiusPx); r++) {
    for (let c = Math.max(0, cx - radiusPx); c <= Math.min(width - 1, cx + radiusPx); c++) {
      const dx = c - cx;
      const dy = r - cy;
      if (dx * dx + dy * dy <= radiusPx * radiusPx) {
        result[r * width + c] = 0;
      }
    }
  }

  return { data: result, width, height };
}
