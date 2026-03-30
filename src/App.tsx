import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Viewport } from '@/components/layout/Viewport';
import { ActionBar } from '@/components/layout/ActionBar';
import { ImageUpload } from '@/components/upload/ImageUpload';
import { useHeightmap } from '@/hooks/useHeightmap';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

function App() {
  useHeightmap();
  const imageFile = useLithophaneStore((s) => s.imageFile);
  const undo = useLithophaneStore((s) => s.undo);
  const redo = useLithophaneStore((s) => s.redo);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  return (
    <TooltipProvider>
      <div className="h-screen w-screen flex flex-col">
        <div className="flex flex-1 min-h-0">
          {/* Sidebar - hidden on small screens unless toggled */}
          <div
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } md:block absolute md:relative z-40 h-full`}
          >
            <Sidebar />
          </div>

          <div className="flex-1 relative min-w-0">
            {/* Sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 z-20 md:hidden bg-background/80 backdrop-blur-sm shadow-md rounded-lg"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>

            {!imageFile && <ImageUpload />}
            <Viewport />
          </div>
        </div>
        <ActionBar />
      </div>
    </TooltipProvider>
  );
}

export default App;
