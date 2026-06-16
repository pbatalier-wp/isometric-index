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
