import type { ResearchArticle, ArticlePosition } from "../types/research";
import { researchAreas } from "../data/areas";
import { researchArticles } from "../data/articles";

export interface OrbitConfig {
  width: number;
  height: number;
  rotation: number;
  radius: number;
  ringGap: number;
  arcSpread: number;
}

export function computeOrbitPositions(
  config: OrbitConfig,
  articles: ResearchArticle[] = researchArticles,
): ArticlePosition[] {
  const { width, height, rotation, radius, ringGap, arcSpread } = config;
  const centerX = width / 2;
  const centerY = height / 2;
  const positions: ArticlePosition[] = [];

  researchAreas.forEach((area, ringIndex) => {
    const areaArticles = articles.filter((article) => article.areaId === area.id);
    const r = radius + ringIndex * ringGap;

    areaArticles.forEach((article, index) => {
      const sectorOffset =
        areaArticles.length === 1
          ? 0
          : (index / (areaArticles.length - 1) - 0.5) * arcSpread;
      const angle = rotation + area.clusterAngle + sectorOffset;

      positions.push({
        article,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      });
    });
  });

  return positions;
}

export function getOrbitRingRadii(
  radius: number,
  ringGap: number,
  ringCount: number = researchAreas.length,
): number[] {
  return Array.from({ length: ringCount }, (_, index) => radius + index * ringGap);
}
