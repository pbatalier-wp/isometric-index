import type { Transition } from "motion/react";
import type { TransitionValues, TransitionEasing } from "../config/transitions";

export function buildMorphTransition(values: TransitionValues): Transition {
  if (values.easing === "spring") {
    return values.spring;
  }

  return {
    duration: values.duration,
    ease: easingCurve(values.easing),
  };
}

export function buildFlattenTransition(flattenDuration: number): Transition {
  return { duration: flattenDuration, ease: [0.22, 1, 0.36, 1] };
}

function easingCurve(easing: Exclude<TransitionEasing, "spring">) {
  switch (easing) {
    case "easeInOut":
      return [0.65, 0, 0.35, 1] as const;
    case "circOut":
      return "circOut" as const;
    case "easeOut":
    default:
      return [0.22, 1, 0.36, 1] as const;
  }
}
