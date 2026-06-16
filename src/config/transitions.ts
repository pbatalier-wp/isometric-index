export const TRANSITION_DIAL_CONFIG = {
  toIsometric: {
    easing: {
      type: "select" as const,
      options: ["spring", "easeOut", "easeInOut", "circOut"],
      default: "easeInOut",
    },
    duration: [0.5, 0.15, 1.2] as [number, number, number],
    spring: {
      type: "spring" as const,
      visualDuration: 0.55,
      bounce: 0.12,
      __mode: "simple" as const,
    },
  },
  toConcentric: {
    easing: {
      type: "select" as const,
      options: ["spring", "easeOut", "easeInOut", "circOut"],
      default: "easeOut",
    },
    duration: [0.5, 0.15, 1.2] as [number, number, number],
    flattenDuration: [0.16, 0.05, 0.5] as [number, number, number],
    spring: {
      type: "spring" as const,
      visualDuration: 0.5,
      bounce: 0.08,
      __mode: "simple" as const,
    },
  },
};

export type TransitionEasing = "spring" | "easeOut" | "easeInOut" | "circOut";

export interface TransitionDialValues {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asTransitionValues(values: any): TransitionDialValues {
  return values as TransitionDialValues;
}
