import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Viewport } from '@/components/layout/Viewport';
import { StatusRail } from '@/components/layout/StatusRail';
import { ImageUpload } from '@/components/upload/ImageUpload';
import { StagePanel } from '@/components/floating/StagePanel';
import { InspectorPanel } from '@/components/floating/InspectorPanel';
import { TelemetryCard } from '@/components/floating/TelemetryCard';
import { ViewportHUD } from '@/components/hud/ViewportHUD';
import { StageTrail } from '@/components/ui/stage-trail';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { useHeightmap } from '@/hooks/useHeightmap';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useLayoutState } from '@/lib/layout-persistence';
import { trailIntro, slideFromLeft, slideFromRight, slideFromBottom } from '@/lib/motion';

function App() {
  useHeightmap();
  const imageFile = useLithophaneStore((s) => s.imageFile);
  const undo = useLithophaneStore((s) => s.undo);
  const redo = useLithophaneStore((s) => s.redo);
  const [layout, setLayout] = useLayoutState();

  // Keyboard shortcuts: undo / redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // Auto-collapse Inspector when viewport is too narrow.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 1279px)');
    const apply = (matches: boolean) => {
      if (matches) {
        setLayout((s) => (s.inspectorCollapsed ? s : { ...s, inspectorCollapsed: true }));
      }
    };
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setLayout]);

  return (
    <TooltipProvider>
      <main className="relative h-screen w-screen overflow-hidden bg-surface-base">
        {/* Layer 1: viewport (canvas + aurora background) */}
        <Viewport />

        {/* Layer 2: image upload — only when no image, sits above canvas */}
        {!imageFile && <ImageUpload />}

        {/* Layer 3: HUD — decorative, never blocks input */}
        <ViewportHUD />

        {/* Layer 4: floating overlay (panels, trail, status rail) */}
        <div
          id="overlay-root"
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 'var(--z-panel)' }}
        >
          {/* Top stage trail */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={trailIntro}
            className="absolute inset-x-0 top-3 flex justify-center"
          >
            <StageTrail
              active={layout.activeStage}
              onChange={(next) =>
                setLayout((s) => ({ ...s, activeStage: next }))
              }
            />
          </motion.div>

          {/* Left: stage panel */}
          <motion.div initial="hidden" animate="visible" variants={slideFromLeft}>
            <StagePanel
              active={layout.activeStage}
              collapsed={layout.stageCollapsed}
              onCollapsedChange={(v) =>
                setLayout((s) => ({ ...s, stageCollapsed: v }))
              }
            />
          </motion.div>

          {/* Right: inspector */}
          <motion.div initial="hidden" animate="visible" variants={slideFromRight}>
            <InspectorPanel
              collapsed={layout.inspectorCollapsed}
              onCollapsedChange={(v) =>
                setLayout((s) => ({ ...s, inspectorCollapsed: v }))
              }
            />
          </motion.div>

          {/* Bottom-right: telemetry card */}
          {imageFile && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <TelemetryCard className="absolute bottom-16 right-4 w-[220px]" />
            </motion.div>
          )}

          {/* Bottom: status rail */}
          <motion.div initial="hidden" animate="visible" variants={slideFromBottom}>
            <StatusRail />
          </motion.div>
        </div>
      </main>
    </TooltipProvider>
  );
}

export default App;
