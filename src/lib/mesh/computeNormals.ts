import * as THREE from 'three';

export function computeNormals(
  positions: Float32Array,
  indices: Uint32Array
): Float32Array {
  const normals = new Float32Array(positions.length);
  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const vC = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();

  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];

    vA.set(positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2]);
    vB.set(positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]);
    vC.set(positions[c * 3], positions[c * 3 + 1], positions[c * 3 + 2]);

    ab.subVectors(vB, vA);
    ac.subVectors(vC, vA);
    ab.cross(ac);

    normals[a * 3] += ab.x;
    normals[a * 3 + 1] += ab.y;
    normals[a * 3 + 2] += ab.z;
    normals[b * 3] += ab.x;
    normals[b * 3 + 1] += ab.y;
    normals[b * 3 + 2] += ab.z;
    normals[c * 3] += ab.x;
    normals[c * 3 + 1] += ab.y;
    normals[c * 3 + 2] += ab.z;
  }

  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.sqrt(
      normals[i] * normals[i] +
      normals[i + 1] * normals[i + 1] +
      normals[i + 2] * normals[i + 2]
    );
    if (len > 0) {
      normals[i] /= len;
      normals[i + 1] /= len;
      normals[i + 2] /= len;
    }
  }

  return normals;
}
