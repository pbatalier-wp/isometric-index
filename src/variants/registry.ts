import { option1 } from "./option-1";
import { option2 } from "./option-2";
import { option3 } from "./option-3";
import type { ViewVariant } from "./types";

export const VIEW_VARIANTS: ViewVariant[] = [option1, option2, option3];
export const DEFAULT_VARIANT_ID = "option-1";

export function getVariantById(id: string): ViewVariant {
  const variant = VIEW_VARIANTS.find((v) => v.id === id);
  if (!variant) {
    return VIEW_VARIANTS[0];
  }
  return variant;
}
