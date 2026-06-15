import type { ResearchArticle } from "../types/research";

export const CARD_W = 200;
export const CARD_H = 260;
export const STEP_X = 40;

export interface IsometricPosition {
  article: ResearchArticle;
  x: number;
  y: number;
  zIndex: number;
}

export function computeIsometricPositions(
  articles: ResearchArticle[],
  scroll: number,
  width: number,
  height: number,
): IsometricPosition[] {
  const cardCount = articles.length;
  if (cardCount === 0) return [];

  const loopSpan = cardCount * STEP_X;

  return articles.map((article, index) => {
    const rawPos = index * STEP_X - scroll;
    const pos = ((rawPos % loopSpan) + loopSpan) % loopSpan;
    const x = width - CARD_W + 40 - (pos / loopSpan) * (width + loopSpan);
    const y = 40 + (pos / loopSpan) * (height + 200);

    return {
      article,
      x,
      y,
      zIndex: Math.round(pos),
    };
  });
}
