import { useEffect, useState } from 'react';

const STORAGE_KEY = 'aurora-ui-mode-v1';

export type UIMode = 'aurora' | 'basic';

const DEFAULT: UIMode = 'aurora';

function readPersisted(): UIMode {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'basic' ? 'basic' : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function writePersisted(mode: UIMode) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* swallow quota / private-mode errors */
  }
}

/**
 * Toggleable UI fidelity. Aurora = full glass + drifting gradients + glows;
 * basic = flat surfaces, no backdrop-blur, no animations — for low-power
 * machines or when GPU compositing is a bottleneck. The mode is reflected as
 * a `basic-ui` class on `<html>` so CSS overrides can key off it.
 */
export function useUIMode() {
  const [mode, setMode] = useState<UIMode>(readPersisted);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('basic-ui', mode === 'basic');
    writePersisted(mode);
  }, [mode]);

  return [mode, setMode] as const;
}
