import type { ViewVariant } from "../types";
import ConcentricView from "./ConcentricView";
import IsometricView from "./IsometricView";

export const option1: ViewVariant = {
  id: "option-1",
  label: "Option 1",
  description: "Orbit morph with flatten reverse transition",
  ConcentricView,
  IsometricView,
};
