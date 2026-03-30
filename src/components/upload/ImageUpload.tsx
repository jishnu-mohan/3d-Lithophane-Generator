import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

export function ImageUpload() {
  const { handleDrop, handleFileSelect } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-md transition-colors ${
        isDragging ? 'bg-accent/20' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        setIsDragging(false);
        handleDrop(e);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <div
        className={`flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-14 cursor-pointer transition-all duration-200 shadow-2xl shadow-black/20 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40'
        }`}
      >
        <Upload className="h-12 w-12 text-muted-foreground/50" />
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight">Drop an image here</p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse (JPG, PNG, WebP, BMP)
          </p>
        </div>
      </div>
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
