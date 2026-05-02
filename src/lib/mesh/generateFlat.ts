import * as THREE from 'three';
import type { HeightmapData, LithophaneParams } from '@/types/lithophane';
import { computeNormals } from './computeNormals';

/**
 * A heightmap cell whose value is < 0 is treated as a sentinel for "no
 * geometry here" — used by the hanging-hole logic to punch real cutouts.
 */
const isSentinel = (h: number) => h < 0;

export function generateFlat(
  heightmap: HeightmapData,
  params: LithophaneParams
): THREE.BufferGeometry {
  const { width: cols, height: rows, data } = heightmap;
  const { widthMM, heightMM, minThickness, maxThickness, baseThickness } = params;

  const thicknessRange = maxThickness - minThickness;
  const cellW = widthMM / (cols - 1);
  const cellH = heightMM / (rows - 1);

  // Front face + back face + side walls (outer perimeter) + room for hole inner walls.
  const frontCount = rows * cols;
  const backCount = rows * cols;
  const topWall = cols;
  const bottomWall = cols;
  const leftWall = rows;
  const rightWall = rows;
  const wallCount = (topWall + bottomWall + leftWall + rightWall) * 2;
  const totalVerts = frontCount + backCount + wallCount;

  const positions = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const indices: number[] = [];

  let vi = 0;

  // Front face vertices. Sentinels get clamped to minThickness so orphan
  // vertices don't sit behind the back face if anything ever indexes them.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW - widthMM / 2;
      const y = (rows - 1 - r) * cellH - heightMM / 2;
      const h = data[r * cols + c];
      const z = isSentinel(h) ? minThickness : minThickness + h * thicknessRange;

      positions[vi * 3] = x;
      positions[vi * 3 + 1] = y;
      positions[vi * 3 + 2] = z;
      uvs[vi * 2] = c / (cols - 1);
      uvs[vi * 2 + 1] = 1 - r / (rows - 1);
      vi++;
    }
  }

  // Front face indices — skip any quad that touches a sentinel.
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const tlH = data[r * cols + c];
      const trH = data[r * cols + c + 1];
      const blH = data[(r + 1) * cols + c];
      const brH = data[(r + 1) * cols + c + 1];
      if (isSentinel(tlH) || isSentinel(trH) || isSentinel(blH) || isSentinel(brH)) continue;

      const tl = r * cols + c;
      const tr = tl + 1;
      const bl = (r + 1) * cols + c;
      const br = bl + 1;
      indices.push(tl, bl, tr);
      indices.push(tr, bl, br);
    }
  }

  // Back face vertices (z = -baseThickness)
  const backStart = vi;
  const backZ = -baseThickness;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW - widthMM / 2;
      const y = (rows - 1 - r) * cellH - heightMM / 2;

      positions[vi * 3] = x;
      positions[vi * 3 + 1] = y;
      positions[vi * 3 + 2] = backZ;
      uvs[vi * 2] = c / (cols - 1);
      uvs[vi * 2 + 1] = 1 - r / (rows - 1);
      vi++;
    }
  }

  // Back face indices (reversed winding) — same skip logic.
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const tlH = data[r * cols + c];
      const trH = data[r * cols + c + 1];
      const blH = data[(r + 1) * cols + c];
      const brH = data[(r + 1) * cols + c + 1];
      if (isSentinel(tlH) || isSentinel(trH) || isSentinel(blH) || isSentinel(brH)) continue;

      const tl = backStart + r * cols + c;
      const tr = tl + 1;
      const bl = backStart + (r + 1) * cols + c;
      const br = bl + 1;
      indices.push(tl, tr, bl);
      indices.push(tr, br, bl);
    }
  }

  // Inner walls around hole boundaries. For every cell that is "fully body"
  // (no sentinel corner), if any of its 4 neighbors is "any-sentinel", add a
  // wall on the shared edge connecting front and back faces. Walls reuse the
  // already-allocated front/back vertices.
  const cellHasSentinel = (r: number, c: number): boolean => {
    if (r < 0 || r >= rows - 1 || c < 0 || c >= cols - 1) return false;
    return (
      isSentinel(data[r * cols + c]) ||
      isSentinel(data[r * cols + c + 1]) ||
      isSentinel(data[(r + 1) * cols + c]) ||
      isSentinel(data[(r + 1) * cols + c + 1])
    );
  };

  const addInnerWall = (
    frontTop: number,
    frontBot: number,
    backTop: number,
    backBot: number,
  ) => {
    // Two triangles, both windings emitted so the wall reads correctly under
    // double-sided rendering and slicers ignore winding inconsistencies.
    indices.push(frontTop, backTop, frontBot);
    indices.push(frontBot, backTop, backBot);
  };

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      if (cellHasSentinel(r, c)) continue; // not a fully-body cell — its quad is skipped, walls come from neighbors
      // Right edge: between body cell (r,c) and any-sentinel cell (r, c+1)
      if (cellHasSentinel(r, c + 1)) {
        const tl = r * cols + (c + 1);
        const bl = (r + 1) * cols + (c + 1);
        addInnerWall(tl, bl, backStart + tl, backStart + bl);
      }
      // Bottom edge
      if (cellHasSentinel(r + 1, c)) {
        const tl = (r + 1) * cols + c;
        const tr = (r + 1) * cols + (c + 1);
        addInnerWall(tl, tr, backStart + tl, backStart + tr);
      }
      // Left edge
      if (cellHasSentinel(r, c - 1)) {
        const tl = r * cols + c;
        const bl = (r + 1) * cols + c;
        addInnerWall(tl, bl, backStart + tl, backStart + bl);
      }
      // Top edge
      if (cellHasSentinel(r - 1, c)) {
        const tl = r * cols + c;
        const tr = r * cols + (c + 1);
        addInnerWall(tl, tr, backStart + tl, backStart + tr);
      }
    }
  }

  // Outer side walls
  const addWallQuad = (a: number, b: number, c: number, d: number) => {
    indices.push(a, b, c);
    indices.push(c, b, d);
  };

  // Top wall (r=0)
  const topFrontStart = vi;
  for (let c = 0; c < cols; c++) {
    positions[vi * 3] = positions[c * 3];
    positions[vi * 3 + 1] = positions[c * 3 + 1];
    positions[vi * 3 + 2] = positions[c * 3 + 2];
    uvs[vi * 2] = c / (cols - 1);
    uvs[vi * 2 + 1] = 1;
    vi++;
  }
  const topBackStart = vi;
  for (let c = 0; c < cols; c++) {
    const bi = backStart + c;
    positions[vi * 3] = positions[bi * 3];
    positions[vi * 3 + 1] = positions[bi * 3 + 1];
    positions[vi * 3 + 2] = positions[bi * 3 + 2];
    uvs[vi * 2] = c / (cols - 1);
    uvs[vi * 2 + 1] = 0;
    vi++;
  }
  for (let c = 0; c < cols - 1; c++) {
    addWallQuad(
      topBackStart + c, topBackStart + c + 1,
      topFrontStart + c, topFrontStart + c + 1
    );
  }

  // Bottom wall (r=rows-1)
  const bottomFrontStart = vi;
  for (let c = 0; c < cols; c++) {
    const fi = (rows - 1) * cols + c;
    positions[vi * 3] = positions[fi * 3];
    positions[vi * 3 + 1] = positions[fi * 3 + 1];
    positions[vi * 3 + 2] = positions[fi * 3 + 2];
    uvs[vi * 2] = c / (cols - 1);
    uvs[vi * 2 + 1] = 1;
    vi++;
  }
  const bottomBackStart = vi;
  for (let c = 0; c < cols; c++) {
    const bi = backStart + (rows - 1) * cols + c;
    positions[vi * 3] = positions[bi * 3];
    positions[vi * 3 + 1] = positions[bi * 3 + 1];
    positions[vi * 3 + 2] = positions[bi * 3 + 2];
    uvs[vi * 2] = c / (cols - 1);
    uvs[vi * 2 + 1] = 0;
    vi++;
  }
  for (let c = 0; c < cols - 1; c++) {
    addWallQuad(
      bottomFrontStart + c, bottomFrontStart + c + 1,
      bottomBackStart + c, bottomBackStart + c + 1
    );
  }

  // Left wall (c=0)
  const leftFrontStart = vi;
  for (let r = 0; r < rows; r++) {
    const fi = r * cols;
    positions[vi * 3] = positions[fi * 3];
    positions[vi * 3 + 1] = positions[fi * 3 + 1];
    positions[vi * 3 + 2] = positions[fi * 3 + 2];
    uvs[vi * 2] = r / (rows - 1);
    uvs[vi * 2 + 1] = 1;
    vi++;
  }
  const leftBackStart = vi;
  for (let r = 0; r < rows; r++) {
    const bi = backStart + r * cols;
    positions[vi * 3] = positions[bi * 3];
    positions[vi * 3 + 1] = positions[bi * 3 + 1];
    positions[vi * 3 + 2] = positions[bi * 3 + 2];
    uvs[vi * 2] = r / (rows - 1);
    uvs[vi * 2 + 1] = 0;
    vi++;
  }
  for (let r = 0; r < rows - 1; r++) {
    addWallQuad(
      leftFrontStart + r, leftFrontStart + r + 1,
      leftBackStart + r, leftBackStart + r + 1
    );
  }

  // Right wall (c=cols-1)
  const rightFrontStart = vi;
  for (let r = 0; r < rows; r++) {
    const fi = r * cols + (cols - 1);
    positions[vi * 3] = positions[fi * 3];
    positions[vi * 3 + 1] = positions[fi * 3 + 1];
    positions[vi * 3 + 2] = positions[fi * 3 + 2];
    uvs[vi * 2] = r / (rows - 1);
    uvs[vi * 2 + 1] = 1;
    vi++;
  }
  const rightBackStart = vi;
  for (let r = 0; r < rows; r++) {
    const bi = backStart + r * cols + (cols - 1);
    positions[vi * 3] = positions[bi * 3];
    positions[vi * 3 + 1] = positions[bi * 3 + 1];
    positions[vi * 3 + 2] = positions[bi * 3 + 2];
    uvs[vi * 2] = r / (rows - 1);
    uvs[vi * 2 + 1] = 0;
    vi++;
  }
  for (let r = 0; r < rows - 1; r++) {
    addWallQuad(
      rightBackStart + r, rightBackStart + r + 1,
      rightFrontStart + r, rightFrontStart + r + 1
    );
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
