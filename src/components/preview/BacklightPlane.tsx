import { useLithophaneStore } from '@/store/useLithophaneStore';

export function Backlight() {
  const { lightingMode, backlightIntensity, backlightColor } =
    useLithophaneStore((s) => s.viewState);

  if (lightingMode !== 'back-lighted') return null;

  return (
    <>
      {/* Primary backlight behind the model */}
      <pointLight
        position={[0, 0, -10]}
        color={backlightColor}
        intensity={backlightIntensity * 80}
        distance={200}
        decay={1.5}
      />
      {/* Wider fill from behind to cover edges */}
      <spotLight
        position={[0, 0, -20]}
        color={backlightColor}
        intensity={backlightIntensity * 40}
        angle={Math.PI / 3}
        penumbra={0.8}
        distance={250}
        decay={1.5}
        target-position={[0, 0, 0]}
      />
    </>
  );
}
