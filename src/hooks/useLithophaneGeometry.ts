import { useMemo } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { generateMesh } from '@/lib/mesh/meshFactory';
import { addBorder } from '@/lib/mesh/addBorder';
import { addHangingHole } from '@/lib/mesh/addHangingHole';
import { addStandTab } from '@/lib/mesh/addStandTab';
import type * as THREE from 'three';

export function useLithophaneGeometry(): THREE.BufferGeometry | null {
  const heightmap = useLithophaneStore((s) => s.heightmap);
  const params = useLithophaneStore((s) => s.params);

  return useMemo(() => {
    if (!heightmap) return null;

    let hm = heightmap;

    if (params.borderEnabled && params.borderThickness > 0) {
      const borderPixels = Math.round(params.borderThickness * params.resolution);
      hm = addBorder(hm, borderPixels, {
        frameStyle: params.frameStyle,
        cornerStyle: params.cornerStyle,
        cornerRadius: params.cornerRadius,
        resolution: params.resolution,
      });
    }

    if (params.borderEnabled && params.hangingHoleEnabled && params.shape === 'flat') {
      hm = addHangingHole(hm, params.hangingHoleDiameter, params.resolution, params.borderThickness);
    }

    if (params.standTabEnabled && params.shape === 'flat') {
      hm = addStandTab(hm, params.resolution);
    }

    return generateMesh(hm, params);
  }, [heightmap, params]);
}
