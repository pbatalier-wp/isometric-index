import type { ViewVariant } from "../types";
import StackedView from "./StackedView";
import IsometricRedirect from "./IsometricRedirect";

export const option4: ViewVariant = {
  id: "option-4",
  label: "Option 4",
  description: "Stacked research grid with read-only concentric reveal",
  routing: "stacked",
  ConcentricView: StackedView,
  IsometricView: IsometricRedirect,
};
