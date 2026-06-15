import type { ResearchArticle } from "../types/research";
import { TILE_SIZE } from "./ArticleTile";

interface ArticleHoverCardProps {
  article: ResearchArticle;
  x: number;
  y: number;
}

export function ArticleHoverCard({ article, x, y }: ArticleHoverCardProps) {
  const cardWidth = 400;
  const offsetX = 24;
  const offsetY = -TILE_SIZE / 2;

  let left = x + TILE_SIZE / 2 + offsetX;
  let top = y + offsetY;

  if (typeof window !== "undefined" && left + cardWidth > window.innerWidth - 24) {
    left = x - TILE_SIZE / 2 - cardWidth - offsetX;
  }

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        display: "flex",
        gap: 24,
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        background: "transparent",
        pointerEvents: "none",
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.12)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={article.thumbnail}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ paddingTop: 4, paddingBottom: 4 }}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 16,
            color: "var(--color-text)",
            lineHeight: 1.24,
            letterSpacing: "-0.16px",
            marginBottom: 4,
            maxWidth: 280,
          }}
        >
          {article.title}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              color: "var(--color-text)",
              opacity: 0.35,
              lineHeight: 1.24,
            }}
          >
            {article.date}
          </p>
          {article.isTool && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--color-text)",
                opacity: 0.5,
                letterSpacing: "0.05em",
              }}
            >
              [ tool ]
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
