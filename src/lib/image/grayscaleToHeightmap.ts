import type { HeightmapData } from '@/types/lithophane';

export function grayscaleToHeightmap(
  gray: Float32Array,
  width: number,
  height: number,
  invert: boolean
): HeightmapData {
  const data = new Float32Array(gray.length);

  for (let i = 0; i < gray.length; i++) {
    let v = gray[i] / 255;
    if (invert) v = 1 - v;
    data[i] = v;
  }

  return { data, width, height };
}
