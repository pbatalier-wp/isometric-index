export type TransitionEasing = "spring" | "easeOut" | "easeInOut" | "circOut";

export interface TransitionValues {
  easing: TransitionEasing;
  duration: number;
  spring: {
    type: "spring";
    visualDuration?: number;
    bounce?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  flattenDuration?: number;
}

export const TRANSITION_DEFAULTS = {
  toIsometric: {
    easing: "easeInOut",
    duration: 0.5,
    spring: {
      type: "spring" as const,
      visualDuration: 0.55,
      bounce: 0.12,
    },
  },
  toConcentric: {
    easing: "easeOut",
    duration: 0.5,
    flattenDuration: 0.16,
    spring: {
      type: "spring" as const,
      visualDuration: 0.5,
      bounce: 0.08,
    },
  },
} satisfies Record<string, TransitionValues>;
