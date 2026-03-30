# 3D Lithophane Generator

A browser-based lithophane generator — upload an image, adjust parameters, preview a 3D lithophane in real time, and export as STL for 3D printing.

## Features

- **Image processing** — brightness, contrast, gamma, sharpness, crop, mirror, and rotation controls
- **Multiple shapes** — flat, curved, cylindrical, and lampshade lithophanes
- **Frame options** — configurable border, corner styles, hanging hole, and stand tab
- **3D preview** — real-time Three.js preview with lighting modes (no light, back lighted, normal gradient)
- **STL export** — binary STL export ready for 3D printing

## Tech Stack

- React 19, TypeScript, Tailwind CSS v4
- Three.js via React Three Fiber
- Zustand for state management
- Vite for bundling
- shadcn/ui components

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and bundle for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |
