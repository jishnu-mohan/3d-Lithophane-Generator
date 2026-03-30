export function applySharpness(
  gray: Float32Array,
  width: number,
  height: number,
  amount: number
): Float32Array {
  if (amount === 0) return gray;

  const strength = amount / 50; // 0-100 maps to 0-2

  // 3x3 box blur
  const blurred = new Float32Array(gray.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            sum += gray[ny * width + nx];
            count++;
          }
        }
      }
      blurred[y * width + x] = sum / count;
    }
  }

  // Unsharp mask: sharp = original + strength * (original - blurred)
  const result = new Float32Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    result[i] = Math.max(0, Math.min(255, gray[i] + strength * (gray[i] - blurred[i])));
  }

  return result;
}
