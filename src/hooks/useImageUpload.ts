import { useCallback } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export function useImageUpload() {
  const setImage = useLithophaneStore((s) => s.setImage);

  const processFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert('Unsupported file type. Please upload JPG, PNG, WebP, or BMP.');
        return;
      }
      if (file.size > MAX_SIZE) {
        alert('File too large. Maximum size is 50MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return { handleDrop, handleFileSelect, processFile };
}
