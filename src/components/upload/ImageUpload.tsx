import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

export function ImageUpload() {
  const { handleDrop, handleFileSelect } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-colors ${
        isDragging ? 'bg-[oklch(from_var(--accent-aurora)_l_c_h_/_0.05)]' : ''
      }`}
      style={{ zIndex: 15 }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        setIsDragging(false);
        handleDrop(e);
      }}
    >
      <button
        type="button"
        aria-label="Upload image"
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center gap-5 px-14 py-12 cursor-pointer transition-all duration-200 glass-panel focus-visible:outline-none focus-visible:shadow-[0_0_32px_var(--accent-aurora-glow)] ${
          isDragging
            ? 'glow-aurora-lg'
            : 'hover:shadow-[0_0_32px_var(--accent-aurora-glow)]'
        }`}
      >
        {/* Corner brackets */}
        <span aria-hidden className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[var(--accent-aurora)]" />
        <span aria-hidden className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--accent-aurora)]" />
        <span aria-hidden className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[var(--accent-aurora)]" />
        <span aria-hidden className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[var(--accent-aurora)]" />

        <div
          className="rounded-full p-4"
          style={{
            background: 'oklch(from var(--accent-aurora) l c h / 0.08)',
            boxShadow: 'inset 0 0 24px oklch(from var(--accent-aurora) l c h / 0.15)',
          }}
        >
          <Upload className="h-8 w-8" style={{ color: 'var(--accent-aurora)' }} />
        </div>
        <div className="text-center max-w-xs">
          <p className="text-mono-label mb-2">drop zone · acquire signal</p>
          <p className="text-lg font-display italic tracking-tight text-text-primary">
            Drop an image to begin
          </p>
          <p className="text-xs text-text-tertiary mt-1.5">
            or click to browse — JPG · PNG · WebP · BMP
          </p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/bmp"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
