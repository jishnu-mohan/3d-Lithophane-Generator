import { useEffect, useRef } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';

export function useHeightmap() {
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const imageFile = useLithophaneStore((s) => s.imageFile);
  const params = useLithophaneStore((s) => s.params);
  const setHeightmap = useLithophaneStore((s) => s.setHeightmap);
  const setProcessing = useLithophaneStore((s) => s.setProcessing);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setProcessing(true);

      try {
        const bitmap = await createImageBitmap(imageFile);

        workerRef.current?.terminate();
        const worker = new Worker(
          new URL('../workers/imageProcessor.worker.ts', import.meta.url),
          { type: 'module' }
        );
        workerRef.current = worker;

        worker.onmessage = (e) => {
          const { data, width, height } = e.data;
          setHeightmap({
            data: new Float32Array(data),
            width,
            height,
          });
          setProcessing(false);
        };

        worker.onerror = () => {
          setProcessing(false);
        };

        worker.postMessage(
          {
            bitmap,
            params: {
              widthMM: params.widthMM,
              heightMM: params.heightMM,
              resolution: params.resolution,
              brightness: params.brightness,
              contrast: params.contrast,
              invert: params.invert,
              gamma: params.gamma,
              sharpness: params.sharpness,
              mirrorHorizontal: params.mirrorHorizontal,
              mirrorVertical: params.mirrorVertical,
              rotation: params.rotation,
              cropEnabled: params.cropEnabled,
              cropX: params.cropX,
              cropY: params.cropY,
              cropWidth: params.cropWidth,
              cropHeight: params.cropHeight,
            },
          },
          { transfer: [bitmap] }
        );
      } catch {
        setProcessing(false);
      }
    }, 300);
  }, [
    imageFile,
    params.widthMM,
    params.heightMM,
    params.resolution,
    params.brightness,
    params.contrast,
    params.invert,
    params.gamma,
    params.sharpness,
    params.mirrorHorizontal,
    params.mirrorVertical,
    params.rotation,
    params.cropEnabled,
    params.cropX,
    params.cropY,
    params.cropWidth,
    params.cropHeight,
    setHeightmap,
    setProcessing,
  ]);
}
