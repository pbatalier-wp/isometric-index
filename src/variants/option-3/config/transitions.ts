import type { TransitionValues } from "../../../types/transitions";

export const STAGGER_DELAY = 0.05;

export const TRANSITION_DEFAULTS = {
  toIsometric: {
    easing: "easeOut" as const,
    duration: 0.6,
    spring: {
      type: "spring" as const,
      visualDuration: 0.6,
      bounce: 0,
    },
  },
  toConcentric: {
    easing: "easeOut" as const,
    duration: 0.6,
    spring: {
      type: "spring" as const,
      visualDuration: 0.6,
      bounce: 0,
    },
  },
} satisfies Record<string, TransitionValues>;
