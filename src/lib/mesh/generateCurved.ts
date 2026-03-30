import * as THREE from 'three';
import type { HeightmapData, LithophaneParams } from '@/types/lithophane';
import { generateFlat } from './generateFlat';
import { computeNormals } from './computeNormals';

export function generateCurved(
  heightmap: HeightmapData,
  params: LithophaneParams
): THREE.BufferGeometry {
  if (params.curveAmount < 0.01) {
    return generateFlat(heightmap, params);
  }

  const { width: cols, height: rows, data } = heightmap;
  const { widthMM, heightMM, minThickness, maxThickness, baseThickness, curveAmount } = params;

  const thicknessRange = maxThickness - minThickness;
  const maxAngle = curveAmount * Math.PI;
  const arcRadius = widthMM / maxAngle;

  const cellH = heightMM / (rows - 1);

  const frontCount = rows * cols;
  const backCount = rows * cols;
  const totalVerts = frontCount + backCount;

  const positions = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const indices: number[] = [];

  let vi = 0;

  // Front face - curved
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const flatX = (c / (cols - 1)) * widthMM;
      const y = (rows - 1 - r) * cellH - heightMM / 2;
      const h = data[r * cols + c];
      const flatZ = minThickness + h * thicknessRange;

      const theta = (flatX / widthMM - 0.5) * maxAngle;
      const rad = arcRadius + flatZ;
      const x = rad * Math.sin(theta);
      const z = rad * Math.cos(theta) - arcRadius;

      positions[vi * 3] = x;
      positions[vi * 3 + 1] = y;
      positions[vi * 3 + 2] = z;
      uvs[vi * 2] = c / (cols - 1);
      uvs[vi * 2 + 1] = 1 - r / (rows - 1);
      vi++;
    }
  }

  // Front face indices
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const tl = r * cols + c;
      const tr = tl + 1;
      const bl = (r + 1) * cols + c;
      const br = bl + 1;
      indices.push(tl, bl, tr);
      indices.push(tr, bl, br);
    }
  }

  // Back face - curved at inner radius
  const backStart = vi;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const flatX = (c / (cols - 1)) * widthMM;
      const y = (rows - 1 - r) * cellH - heightMM / 2;

      const theta = (flatX / widthMM - 0.5) * maxAngle;
      const rad = arcRadius - baseThickness;
      const x = rad * Math.sin(theta);
      const z = rad * Math.cos(theta) - arcRadius;

      positions[vi * 3] = x;
      positions[vi * 3 + 1] = y;
      positions[vi * 3 + 2] = z;
      uvs[vi * 2] = c / (cols - 1);
      uvs[vi * 2 + 1] = 1 - r / (rows - 1);
      vi++;
    }
  }

  // Back face indices (reversed winding)
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const tl = backStart + r * cols + c;
      const tr = tl + 1;
      const bl = backStart + (r + 1) * cols + c;
      const br = bl + 1;
      indices.push(tl, tr, bl);
      indices.push(tr, br, bl);
    }
  }

  // Side walls: top, bottom, left, right
  // Top (r=0)
  for (let c = 0; c < cols - 1; c++) {
    const ft = c;
    const ftn = c + 1;
    const bt = backStart + c;
    const btn = backStart + c + 1;
    indices.push(bt, btn, ft);
    indices.push(ft, btn, ftn);
  }
  // Bottom (r=rows-1)
  for (let c = 0; c < cols - 1; c++) {
    const fb = (rows - 1) * cols + c;
    const fbn = fb + 1;
    const bb = backStart + (rows - 1) * cols + c;
    const bbn = bb + 1;
    indices.push(fb, fbn, bb);
    indices.push(bb, fbn, bbn);
  }
  // Left (c=0)
  for (let r = 0; r < rows - 1; r++) {
    const fl = r * cols;
    const fln = (r + 1) * cols;
    const bl = backStart + r * cols;
    const bln = backStart + (r + 1) * cols;
    indices.push(fl, fln, bl);
    indices.push(bl, fln, bln);
  }
  // Right (c=cols-1)
  for (let r = 0; r < rows - 1; r++) {
    const fr = r * cols + (cols - 1);
    const frn = (r + 1) * cols + (cols - 1);
    const br = backStart + r * cols + (cols - 1);
    const brn = backStart + (r + 1) * cols + (cols - 1);
    indices.push(br, brn, fr);
    indices.push(fr, brn, frn);
  }

  const indexArray = new Uint32Array(indices);
  const normals = computeNormals(positions, indexArray);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));

  return geometry;
}
