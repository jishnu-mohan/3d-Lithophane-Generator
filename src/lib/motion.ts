/**
 * Aurora motion tokens — single source of easings, durations, and reusable
 * variants. Keep all named moments wired through this file so timing stays
 * coherent across the app.
 */
import type { Transition, Variants } from 'motion/react';

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  standard: [0.4, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
};

export const dur = {
  snap: 0.18,
  reveal: 0.42,
  choreo: 0.6,
} as const;

export const trans = {
  snap: { duration: dur.snap, ease: ease.out } satisfies Transition,
  reveal: { duration: dur.reveal, ease: ease.out } satisfies Transition,
  choreo: { duration: dur.choreo, ease: ease.out } satisfies Transition,
} as const;

/** Top stage trail: drops in from above. */
export const trailIntro: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: trans.reveal },
};

/** Floating panels — left edge slides in, right edge slides in. */
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { ...trans.reveal, delay: 0.08 } },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { ...trans.reveal, delay: 0.12 } },
};

export const slideFromBottom: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ...trans.reveal, delay: 0.16 } },
};

/** HUD corner brackets — gentle scale + fade. */
export const bracketReveal: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { ...trans.reveal, delay: 0.3 + i * 0.06 },
  }),
};

/** Stage panel content swap on stage change. */
export const stageSwap: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: dur.snap, ease: ease.out, delay: 0.06 } },
  exit: { opacity: 0, y: -8, transition: { duration: dur.snap, ease: ease.in } },
};

/** Card press feel — quick hover lift. */
export const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: trans.snap },
  tap: { scale: 0.98, transition: trans.snap },
};
