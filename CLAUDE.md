# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based lithophane generator — users upload an image, adjust parameters, preview a 3D lithophane in real time, and export as STL for 3D printing. Built with React 19, Three.js (via React Three Fiber), TypeScript, and Tailwind CSS v4.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check with `tsc -b` then bundle with Vite
- `npm run lint` — ESLint across the project
- `npm run preview` — serve the production build locally

No test framework is configured.

## Architecture

**State management:** Single Zustand store (`src/store/useLithophaneStore.ts`) holds the uploaded image, heightmap data, processing state, and all lithophane parameters. Components read slices via selectors.

**Image processing pipeline:** Runs in a Web Worker (`src/workers/imageProcessor.worker.ts`) to keep the UI responsive. The pipeline is: `imageToCanvas` → `canvasToGrayscale` → `adjustBrightnessContrast` → `grayscaleToHeightmap`. Each step is a pure function in `src/lib/image/`. The `useHeightmap` hook orchestrates triggering the worker when image or relevant params change.

**Mesh generation:** `src/lib/mesh/meshFactory.ts` dispatches to shape-specific generators (flat, curved, cylindrical, lampshade) based on the `shape` param. Each generator takes a `HeightmapData` + `LithophaneParams` and returns a `THREE.BufferGeometry`. Borders are added as a preprocessing step on the heightmap via `addBorder`. The `useLithophaneGeometry` hook memoizes geometry from store state.

**3D preview:** React Three Fiber scene in `src/components/preview/`. `LithophaneMesh` renders the geometry; `BacklightPlane` simulates backlighting; `LithophaneScene` composes the scene with camera/controls.

**UI:** shadcn/ui components (New York style, Zinc base color) in `src/components/ui/`. Control panels in `src/components/controls/` map to parameter groups. Layout split: `Sidebar` (controls), `Viewport` (3D canvas), `ActionBar` (export/reset).

**Export:** `src/lib/export/exportSTL.ts` uses Three.js STLExporter to generate binary STL, saved via file-saver.

## Path Aliases

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`). Always use `@/` imports.

## Key Types

Core types in `src/types/lithophane.ts`: `Shape`, `HeightmapData`, `LithophaneParams` with `DEFAULT_PARAMS`. Store types in `src/types/store.ts`.
