import { processImage, type ProcessImageParams } from '../lib/image/processImage';

export interface WorkerMessage {
  bitmap: ImageBitmap;
  params: ProcessImageParams;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { bitmap, params } = e.data;
  const heightmap = processImage(bitmap, params);
  self.postMessage(
    { data: heightmap.data, width: heightmap.width, height: heightmap.height },
    { transfer: [heightmap.data.buffer] }
  );
};
