export function adjustBrightnessContrast(
  gray: Float32Array,
  brightness: number,
  contrast: number
): Float32Array {
  const result = new Float32Array(gray.length);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < gray.length; i++) {
    let v = gray[i] + brightness;
    v = factor * (v - 128) + 128;
    result[i] = Math.max(0, Math.min(255, v));
  }

  return result;
}
