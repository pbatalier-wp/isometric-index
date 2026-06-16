import type { ResearchArticle } from "../../../types/research";

export const H_CARD_W = 196;
export const H_CARD_H = 248;
export const H_CARD_GAP = 8;
export const H_FEATURED_W = 392;
export const H_FEATURED_H = 496;

const STRIDE = H_CARD_W + H_CARD_GAP;

export interface HorizontalScrollPosition {
  article: ResearchArticle;
  x: number;
  y: number;
  zIndex: number;
}

export function computeHorizontalScrollPositions(
  articles: ResearchArticle[],
  scrollX: number,
  viewportWidth: number,
  viewportHeight: number,
): HorizontalScrollPosition[] {
  const cardCount = articles.length;
  if (cardCount === 0) return [];

  const loopSpan = cardCount * STRIDE;
  const y = (viewportHeight - H_CARD_H) / 2;
  const trackCenter = viewportWidth / 2;

  return articles.map((article, index) => {
    const rawPos = index * STRIDE - scrollX;
    const pos = ((rawPos % loopSpan) + loopSpan) % loopSpan;
    const x = trackCenter - loopSpan / 2 + pos;

    return {
      article,
      x,
      y,
      zIndex: index + 1,
    };
  });
}
