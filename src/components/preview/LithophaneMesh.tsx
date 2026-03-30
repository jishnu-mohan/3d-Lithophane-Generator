import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useLithophaneGeometry } from '@/hooks/useLithophaneGeometry';
import { useLithophaneStore } from '@/store/useLithophaneStore';

function useBacklitTexture() {
  const imageDataURL = useLithophaneStore((s) => s.imageDataURL);
  const lightingMode = useLithophaneStore((s) => s.viewState.lightingMode);

  return useMemo(() => {
    if (lightingMode !== 'back-lighted' || !imageDataURL) return null;

    const img = new Image();
    img.src = imageDataURL;

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    if (canvas.width === 0 || canvas.height === 0) return null;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Convert to grayscale in-place
    for (let i = 0; i < pixels.length; i += 4) {
      const gray =
        0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      pixels[i] = gray;
      pixels[i + 1] = gray;
      pixels[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [imageDataURL, lightingMode]);
}

export function LithophaneMesh() {
  const geometry = useLithophaneGeometry();
  const { materialColor, wireframe, lightingMode } = useLithophaneStore(
    (s) => s.viewState,
  );
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useBacklitTexture();

  useEffect(() => {
    if (meshRef.current && geometry) {
      meshRef.current.geometry.dispose();
      meshRef.current.geometry = geometry;
    }
  }, [geometry]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      {lightingMode === 'back-lighted' && texture ? (
        <meshBasicMaterial map={texture} side={2} wireframe={wireframe} />
      ) : (
        <meshStandardMaterial
          color={materialColor}
          roughness={0.8}
          metalness={0}
          side={2}
          wireframe={wireframe}
        />
      )}
    </mesh>
  );
}
