import { useMemo } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { generateMesh } from '@/lib/mesh/meshFactory';
import { addBorder } from '@/lib/mesh/addBorder';
import { addHangingHole } from '@/lib/mesh/addHangingHole';
import { addStandTab } from '@/lib/mesh/addStandTab';
import { transformHeightmap } from '@/lib/mesh/transformHeightmap';
import type * as THREE from 'three';

export function useLithophaneGeometry(): THREE.BufferGeometry | null {
  const heightmap = useLithophaneStore((s) => s.heightmap);
  const params = useLithophaneStore((s) => s.params);

  return useMemo(() => {
    if (!heightmap) return null;

    let hm = heightmap;

    // Transform the image content within its grid (offset + zoom + rotation)
    // before any border is added, so the frame stays at full thickness on all
    // sides. Vacated cells fill with 0 (renders as flat base inside the frame).
    {
      const r = params.resolution;
      hm = transformHeightmap(hm, {
        offsetXPx: params.imageOffsetX * r,
        offsetYPx: params.imageOffsetY * r,
        zoom: params.imageZoom,
        rotationRad: (params.imageRotationDeg * Math.PI) / 180,
      });
    }

    if (params.borderEnabled) {
      const r = params.resolution;
      const px = (mm: number) => Math.round(mm * r);
      const borderPixels = {
        top: px(params.borderThicknessTop),
        right: px(params.borderThicknessRight),
        bottom: px(params.borderThicknessBottom),
        left: px(params.borderThicknessLeft),
      };
      const anySide =
        borderPixels.top > 0 ||
        borderPixels.right > 0 ||
        borderPixels.bottom > 0 ||
        borderPixels.left > 0;
      if (anySide) {
        hm = addBorder(hm, borderPixels, {
          frameStyle: params.frameStyle,
          cornerStyle: params.cornerStyle,
          cornerRadius: params.cornerRadius,
          resolution: r,
        });
      }
    }

    if (params.borderEnabled && params.hangingHoleEnabled && params.shape === 'flat') {
      hm = addHangingHole(
        hm,
        params.hangingHoleDiameter,
        params.resolution,
        params.hangingHoleX,
        params.hangingHoleY,
      );
    }

    if (params.standTabEnabled && params.shape === 'flat') {
      hm = addStandTab(hm, params.resolution);
    }

    return generateMesh(hm, params);
  }, [heightmap, params]);
}
