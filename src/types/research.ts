export interface ResearchArea {
  id: string;
  slug: string;
  label: string;
  accentColor: string;
  clusterAngle: number;
}

export interface ResearchArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  authors: string[];
  summary: string;
  areaId: string;
  href: string;
  thumbnail: string;
  isTool?: boolean;
}

export interface ArticlePosition {
  article: ResearchArticle;
  x: number;
  y: number;
}

export interface FocusedArticle {
  article: ResearchArticle;
  originX: number;
  originY: number;
  zIndex: number;
  width: number;
  height: number;
  rotateY?: number;
}
