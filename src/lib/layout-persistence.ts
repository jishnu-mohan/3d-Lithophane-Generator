import { useEffect, useState } from 'react';

const STORAGE_KEY = 'aurora-layout-v1';

export type StageId = 'source' | 'geometry' | 'frame' | 'render';

export interface LayoutState {
  activeStage: StageId;
  stageCollapsed: boolean;
  inspectorCollapsed: boolean;
  telemetryCollapsed: boolean;
}

const DEFAULTS: LayoutState = {
  activeStage: 'source',
  stageCollapsed: false,
  inspectorCollapsed: false,
  telemetryCollapsed: false,
};

function readPersisted(): Partial<LayoutState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<LayoutState>;
  } catch {
    return {};
  }
}

function writePersisted(state: LayoutState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* swallow quota / private-mode errors */
  }
}

export function useLayoutState() {
  const [state, setState] = useState<LayoutState>(() => ({
    ...DEFAULTS,
    ...readPersisted(),
  }));

  useEffect(() => {
    writePersisted(state);
  }, [state]);

  return [state, setState] as const;
}
