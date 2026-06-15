import type { ResearchArticle, ArticlePosition } from "../types/research";
import { researchAreas } from "../data/areas";
import { researchArticles } from "../data/articles";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function computeArticlePositions(
  width: number,
  height: number,
  articles: ResearchArticle[] = researchArticles,
): ArticlePosition[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const clusterRadius = Math.min(width, height) * 0.32;

  return articles.map((article) => {
    const area = researchAreas.find((a) => a.id === article.areaId);
    const clusterAngle = area?.clusterAngle ?? 0;
    const clusterCx = centerX + Math.cos(clusterAngle) * clusterRadius;
    const clusterCy = centerY + Math.sin(clusterAngle) * clusterRadius;

    const seed = hashString(article.id);
    const seedAngle = ((seed % 360) / 360) * Math.PI * 2;
    const spreadRadius = 60 + (seed % 100);

    return {
      article,
      x: clusterCx + Math.cos(seedAngle) * spreadRadius,
      y: clusterCy + Math.sin(seedAngle) * spreadRadius,
    };
  });
}
