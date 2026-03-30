import * as THREE from 'three';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { saveAs } from 'file-saver';

export function exportSTL(geometry: THREE.BufferGeometry, filename: string) {
  const mesh = new THREE.Mesh(geometry);
  const exporter = new STLExporter();
  const buffer = exporter.parse(mesh, { binary: true });
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, filename);
}
