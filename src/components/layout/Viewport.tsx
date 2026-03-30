import { LithophaneScene } from '@/components/preview/LithophaneScene';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Loader2 } from 'lucide-react';

export function Viewport() {
  const isProcessing = useLithophaneStore((s) => s.isProcessing);
  const imageFile = useLithophaneStore((s) => s.imageFile);

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-background via-background to-muted/20">
      {!imageFile && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-muted-foreground/50 text-sm font-medium">
            Upload an image to generate a lithophane
          </p>
        </div>
      )}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
      <LithophaneScene />
    </div>
  );
}
