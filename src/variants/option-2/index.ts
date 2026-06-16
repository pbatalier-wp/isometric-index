import type { ViewVariant } from "../types";
import ConcentricView from "./ConcentricView";
import IsometricView from "./IsometricView";

export const option2: ViewVariant = {
  id: "option-2",
  label: "Option 2",
  description: "Horizontal infinite scroll with hover metadata",
  ConcentricView,
  IsometricView,
};
