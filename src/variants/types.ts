import type { ComponentType } from "react";

export type ViewVariantRouting = "spatial" | "stacked";

export interface ViewVariant {
  id: string;
  label: string;
  description?: string;
  routing?: ViewVariantRouting;
  ConcentricView: ComponentType;
  IsometricView: ComponentType;
  ArticleModal?: ComponentType;
}
