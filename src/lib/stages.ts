import type { StageId } from './layout-persistence';

export interface Stage {
  id: StageId;
  index: string;
  label: string;
  blurb: string;
}

export const STAGES: readonly Stage[] = [
  { id: 'source', index: '01', label: 'Source', blurb: 'Image · adjust · crop' },
  { id: 'geometry', index: '02', label: 'Geometry', blurb: 'Shape · size · curve' },
  { id: 'frame', index: '03', label: 'Frame', blurb: 'Border · base · mounting' },
  { id: 'render', index: '04', label: 'Render', blurb: 'Light · material · view' },
] as const;
