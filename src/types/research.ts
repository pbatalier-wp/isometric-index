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

export interface ArticleTrailSegment {
  fromArticleId: string;
  toArticleId: string;
  timestamp: Date;
}

export type ArticleContentBlock =
  | { type: "paragraph"; text: string; variant?: "body" | "lead" }
  | { type: "heading"; level: 2 | 3; text: string }
  | {
      type: "list";
      ordered?: boolean;
      items: Array<string | { term: string; text: string }>;
    }
  | { type: "divider" }
  | { type: "figure"; src: string; alt?: string; caption?: string }
  | { type: "references"; items: string[] };

export interface ArticleContent {
  slug: string;
  abstract: string;
  blocks: ArticleContentBlock[];
}

export interface ArticleRouteState {
  background?: {
    pathname: string;
    search: string;
    hash: string;
  };
}
