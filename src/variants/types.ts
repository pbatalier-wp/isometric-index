import type { ComponentType } from "react";

export interface ViewVariant {
  id: string;
  label: string;
  description?: string;
  ConcentricView: ComponentType;
  IsometricView: ComponentType;
  ArticleModal?: ComponentType;
}
