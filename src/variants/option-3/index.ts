import type { ViewVariant } from "../types";
import ConcentricView from "./ConcentricView";
import IsometricView from "./IsometricView";

export const option3: ViewVariant = {
  id: "option-3",
  label: "Option 3",
  description: "Column gallery with staggered morph and auto-scroll",
  ConcentricView,
  IsometricView,
};
