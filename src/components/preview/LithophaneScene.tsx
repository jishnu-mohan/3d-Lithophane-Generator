import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewcube } from '@react-three/drei';
import { LithophaneMesh } from './LithophaneMesh';
import { Backlight } from './BacklightPlane';
import { CameraController } from './CameraController';
import { useLithophaneStore } from '@/store/useLithophaneStore';

// Aurora-themed hex approximations of the OKLCH tokens (drei needs CSS hex / three.js Color).
const GIZMO_COLORS = {
  face: '#1c2236',         // surface-elevated approx
  hover: '#82d6e5',        // accent-aurora approx
  text: '#f0f4ff',         // text-primary approx
  stroke: '#4ba0b8',       // stroke-aurora approx
};

export function LithophaneScene() {
  const { showGrid, autoRotate, lightingMode } = useLithophaneStore(
    (s) => s.viewState,
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 120], fov: 50, near: 0.1, far: 2000 }}
      gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {lightingMode === 'no-light' ? (
        <ambientLight intensity={0.8} />
      ) : (
        <>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 10]} intensity={0.6} />
          <directionalLight position={[0, 0, -10]} intensity={0.3} />
        </>
      )}
      <LithophaneMesh />
      <Backlight />
      {showGrid && (
        <Grid
          position={[0, -60, 0]}
          args={[200, 200]}
          cellSize={10}
          cellColor="#2a2a35"
          sectionSize={50}
          sectionColor="#3a3a48"
          fadeDistance={300}
          infiniteGrid
        />
      )}
      <CameraController />
      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        minDistance={10}
        maxDistance={500}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        makeDefault
      />
      <GizmoHelper alignment="top-right" margin={[64, 64]}>
        <GizmoViewcube
          color={GIZMO_COLORS.face}
          hoverColor={GIZMO_COLORS.hover}
          textColor={GIZMO_COLORS.text}
          strokeColor={GIZMO_COLORS.stroke}
          opacity={0.92}
        />
      </GizmoHelper>
    </Canvas>
  );
}
