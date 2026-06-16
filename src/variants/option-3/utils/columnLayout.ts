import type { ResearchArticle } from "../../../types/research";

export const COLUMN_CARD_SIZE = 200;
export const COLUMN_ROW_GAP = 230;
export const COLUMN_BORDER_RADIUS = COLUMN_CARD_SIZE * (6.4 / 80);
export const COLUMN_X_OFFSET_FACTOR = 0.32;

export const COLUMNS = [
  { id: "left", xFactor: -COLUMN_X_OFFSET_FACTOR },
  { id: "right", xFactor: COLUMN_X_OFFSET_FACTOR },
] as const;

export type ColumnId = (typeof COLUMNS)[number]["id"];

export interface ColumnPosition {
  instanceId: string;
  article: ResearchArticle;
  x: number;
  y: number;
  zIndex: number;
  columnId: ColumnId;
}

function columnX(viewportWidth: number, xFactor: number) {
  return viewportWidth / 2 + viewportWidth * xFactor;
}

export function computeColumnPositions(
  articles: ResearchArticle[],
  scrollY: number,
  viewportWidth: number,
  viewportHeight: number,
): ColumnPosition[] {
  if (articles.length === 0) return [];

  const columns = COLUMNS.map((column) => ({
    ...column,
    x: columnX(viewportWidth, column.xFactor),
    items: [] as ResearchArticle[],
  }));

  articles.forEach((article, index) => {
    columns[index % columns.length].items.push(article);
  });

  const positions: ColumnPosition[] = [];
  const centerY = viewportHeight / 2;

  columns.forEach((column) => {
    const cardCount = column.items.length;
    if (cardCount === 0) return;

    const loopSpan = cardCount * COLUMN_ROW_GAP;
    const copiesNeeded = Math.ceil(viewportHeight / loopSpan) + 2;

    for (let copy = -copiesNeeded; copy <= copiesNeeded; copy += 1) {
      column.items.forEach((article, index) => {
        const y = centerY + index * COLUMN_ROW_GAP - scrollY + copy * loopSpan;

        if (y < -COLUMN_CARD_SIZE || y > viewportHeight + COLUMN_CARD_SIZE) return;

        positions.push({
          instanceId: `${column.id}-${article.id}-${copy}-${index}`,
          article,
          x: column.x,
          y,
          zIndex: (index % cardCount) + 1,
          columnId: column.id,
        });
      });
    }
  });

  return positions;
}

export function computeColumnPositionsForTransition(
  articles: ResearchArticle[],
  scrollY: number,
  viewportWidth: number,
  viewportHeight: number,
): ColumnPosition[] {
  const uniqueByArticle = new Map<string, ColumnPosition>();

  computeColumnPositions(articles, scrollY, viewportWidth, viewportHeight).forEach((position) => {
    if (!uniqueByArticle.has(position.article.id)) {
      uniqueByArticle.set(position.article.id, position);
    }
  });

  return [...uniqueByArticle.values()];
}
