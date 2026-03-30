export function applyGamma(
  gray: Float32Array,
  gamma: number
): Float32Array {
  if (gamma === 1.0) return gray;

  const invGamma = 1.0 / gamma;
  const result = new Float32Array(gray.length);

  for (let i = 0; i < gray.length; i++) {
    result[i] = 255 * Math.pow(gray[i] / 255, invGamma);
  }

  return result;
}
