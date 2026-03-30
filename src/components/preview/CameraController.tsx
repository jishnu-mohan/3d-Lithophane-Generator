import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import * as THREE from 'three';

const PRESETS: Record<string, [number, number, number]> = {
  front: [0, 0, 120],
  back: [0, 0, -120],
  top: [0, 120, 0.01],
  side: [120, 0, 0],
};

const LERP_SPEED = 0.08;

export function CameraController() {
  const camera = useThree((s) => s.camera);
  const cameraPreset = useLithophaneStore((s) => s.viewState.cameraPreset);
  const updateViewState = useLithophaneStore((s) => s.updateViewState);
  const targetRef = useRef<THREE.Vector3 | null>(null);

  useFrame(() => {
    if (cameraPreset && PRESETS[cameraPreset]) {
      const [x, y, z] = PRESETS[cameraPreset];
      if (!targetRef.current) {
        targetRef.current = new THREE.Vector3(x, y, z);
      }

      camera.position.lerp(targetRef.current, LERP_SPEED);

      const dist = camera.position.distanceTo(targetRef.current);
      if (dist < 0.5) {
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        targetRef.current = null;
        updateViewState({ cameraPreset: null });
      } else {
        camera.lookAt(0, 0, 0);
      }
    }
  });

  return null;
}
