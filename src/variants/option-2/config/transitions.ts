import type { TransitionValues } from "../../../types/transitions";

export const TRANSITION_DEFAULTS = {
  toIsometric: {
    easing: "easeInOut" as const,
    duration: 0.5,
    spring: {
      type: "spring" as const,
      visualDuration: 0.55,
      bounce: 0.12,
    },
  },
  toConcentric: {
    easing: "easeOut" as const,
    duration: 0.5,
    flattenDuration: 0.16,
    spring: {
      type: "spring" as const,
      visualDuration: 0.5,
      bounce: 0.08,
    },
  },
} satisfies Record<string, TransitionValues>;
