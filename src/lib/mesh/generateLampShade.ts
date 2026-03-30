import * as THREE from 'three';
import type { HeightmapData, LithophaneParams } from '@/types/lithophane';
import { computeNormals } from './computeNormals';

export function generateLampShade(
  heightmap: HeightmapData,
  params: LithophaneParams
): THREE.BufferGeometry {
  const { width: cols, height: rows, data } = heightmap;
  const { widthMM, heightMM, minThickness, maxThickness, baseThickness, curveAmount } = params;

  const thicknessRange = maxThickness - minThickness;
  const baseRadius = widthMM / (2 * Math.PI);
  const topRadius = baseRadius * (1 - curveAmount * 0.5);
  const bottomRadius = baseRadius * (1 + curveAmount * 0.5);
  const cellH = heightMM / (rows - 1);

  const seamCols = cols + 1;
  const outerCount = rows * seamCols;
  const innerCount = rows * seamCols;
  const capVerts = seamCols * 2 * 2;
  const totalVerts = outerCount + innerCount + capVerts;

  const positions = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const indices: number[] = [];

  let vi = 0;

  const getRadius = (r: number) => {
    const t = r / (rows - 1);
    return topRadius + (bottomRadius - topRadius) * t;
  };

  // Outer surface
  for (let r = 0; r < rows; r++) {
    const rad0 = getRadius(r);
    for (let c = 0; c <= cols; c++) {
      const cc = c % cols;
      const angle = (c / cols) * Math.PI * 2;
      const y = (rows - 1 - r) * cellH - heightMM / 2;
      const h = data[r * cols + cc];
      const rad = rad0 + minThickness + h * thicknessRange;

      positions[vi * 3] = rad * Math.cos(angle);
      positions[vi * 3 + 1] = y;
      positions[vi * 3 + 2] = rad * Math.sin(angle);
      uvs[vi * 2] = c / cols;
      uvs[vi * 2 + 1] = 1 - r / (rows - 1);
      vi++;
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < seamCols - 1; c++) {
      const tl = r * seamCols + c;
      const tr = tl + 1;
      const bl = (r + 1) * seamCols + c;
      const br = bl + 1;
      indices.push(tl, tr, bl);
      indices.push(tr, br, bl);
    }
  }

  // Inner surface
  const innerStart = vi;
  for (let r = 0; r < rows; r++) {
    const rad0 = getRadius(r);
    for (let c = 0; c <= cols; c++) {
      const angle = (c / cols) * Math.PI * 2;
      const y = (rows - 1 - r) * cellH - heightMM / 2;
      const rad = rad0 - baseThickness;

      positions[vi * 3] = rad * Math.cos(angle);
      positions[vi * 3 + 1] = y;
      positions[vi * 3 + 2] = rad * Math.sin(angle);
      uvs[vi * 2] = c / cols;
      uvs[vi * 2 + 1] = 1 - r / (rows - 1);
      vi++;
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < seamCols - 1; c++) {
      const tl = innerStart + r * seamCols + c;
      const tr = tl + 1;
      const bl = innerStart + (r + 1) * seamCols + c;
      const br = bl + 1;
      indices.push(tl, bl, tr);
      indices.push(tr, bl, br);
    }
  }

  // Top cap
  const topOuterStart = vi;
  for (let c = 0; c <= cols; c++) {
    const oi = c;
    positions[vi * 3] = positions[oi * 3];
    positions[vi * 3 + 1] = positions[oi * 3 + 1];
    positions[vi * 3 + 2] = positions[oi * 3 + 2];
    uvs[vi * 2] = c / cols;
    uvs[vi * 2 + 1] = 1;
    vi++;
  }
  const topInnerStart = vi;
  for (let c = 0; c <= cols; c++) {
    const ii = innerStart + c;
    positions[vi * 3] = positions[ii * 3];
    positions[vi * 3 + 1] = positions[ii * 3 + 1];
    positions[vi * 3 + 2] = positions[ii * 3 + 2];
    uvs[vi * 2] = c / cols;
    uvs[vi * 2 + 1] = 0;
    vi++;
  }
  for (let c = 0; c < seamCols - 1; c++) {
    indices.push(topOuterStart + c, topOuterStart + c + 1, topInnerStart + c);
    indices.push(topInnerStart + c, topOuterStart + c + 1, topInnerStart + c + 1);
  }

  // Bottom cap
  const bottomOuterStart = vi;
  for (let c = 0; c <= cols; c++) {
    const oi = (rows - 1) * seamCols + c;
    positions[vi * 3] = positions[oi * 3];
    positions[vi * 3 + 1] = positions[oi * 3 + 1];
    positions[vi * 3 + 2] = positions[oi * 3 + 2];
    uvs[vi * 2] = c / cols;
    uvs[vi * 2 + 1] = 1;
    vi++;
  }
  const bottomInnerStart = vi;
  for (let c = 0; c <= cols; c++) {
    const ii = innerStart + (rows - 1) * seamCols + c;
    positions[vi * 3] = positions[ii * 3];
    positions[vi * 3 + 1] = positions[ii * 3 + 1];
    positions[vi * 3 + 2] = positions[ii * 3 + 2];
    uvs[vi * 2] = c / cols;
    uvs[vi * 2 + 1] = 0;
    vi++;
  }
  for (let c = 0; c < seamCols - 1; c++) {
    indices.push(bottomOuterStart + c, bottomInnerStart + c, bottomOuterStart + c + 1);
    indices.push(bottomInnerStart + c, bottomInnerStart + c + 1, bottomOuterStart + c + 1);
  }

  const indexArray = new Uint32Array(indices);
  const normals = computeNormals(positions.slice(0, vi * 3), indexArray);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, vi * 3), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs.slice(0, vi * 2), 2));
  geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));

  return geometry;
}
