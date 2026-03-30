import type { HeightmapData } from '@/types/lithophane';

const TAB_HEIGHT_MM = 15;
const FOLD_LINE_POSITION = 0.15; // 15% from top of tab = fold line

export function addStandTab(
  heightmap: HeightmapData,
  resolution: number
): HeightmapData {
  const { width, height, data } = heightmap;
  const tabHeightPx = Math.round(TAB_HEIGHT_MM * resolution);
  const foldRow = Math.round(tabHeightPx * FOLD_LINE_POSITION);

  const newH = height + tabHeightPx;
  const newData = new Float32Array(width * newH);

  // Copy original heightmap
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      newData[r * width + c] = data[r * width + c];
    }
  }

  // Fill tab area
  for (let r = 0; r < tabHeightPx; r++) {
    for (let c = 0; c < width; c++) {
      const tabRow = height + r;
      // Fold line groove
      if (r === foldRow || r === foldRow + 1) {
        newData[tabRow * width + c] = 0.4;
      } else {
        newData[tabRow * width + c] = 1.0;
      }
    }
  }

  return { data: newData, width, height: newH };
}
