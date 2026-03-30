import type * as THREE from 'three';
import type { HeightmapData, LithophaneParams, Shape } from '@/types/lithophane';
import { generateFlat } from './generateFlat';
import { generateCurved } from './generateCurved';
import { generateCylindrical } from './generateCylindrical';
import { generateLampShade } from './generateLampShade';

const generators: Record<Shape, (h: HeightmapData, p: LithophaneParams) => THREE.BufferGeometry> = {
  flat: generateFlat,
  curved: generateCurved,
  cylindrical: generateCylindrical,
  lampshade: generateLampShade,
};

export function generateMesh(
  heightmap: HeightmapData,
  params: LithophaneParams
): THREE.BufferGeometry {
  const gen = generators[params.shape];
  return gen(heightmap, params);
}
