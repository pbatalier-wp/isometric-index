import type { ResearchArticle } from "../../../types/research";
import { ResearchArticleList } from "../../../components/ResearchArticleList";
import type { ArticleTypeFilter } from "../utils/filterArticles";
import { ResearchIndexFilters } from "./ResearchIndexFilters";

interface ResearchIndexGridProps {
  articles: ResearchArticle[];
  selectedTypes: ArticleTypeFilter[];
  onToggleType: (type: ArticleTypeFilter) => void;
  onArticleClick: (article: ResearchArticle) => void;
}

export function ResearchIndexGrid({
  articles,
  selectedTypes,
  onToggleType,
  onArticleClick,
}: ResearchIndexGridProps) {
  return (
    <section
      style={{
        padding: "96px 32px 80px",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 1fr) minmax(0, 2fr)",
          gap: 48,
          alignItems: "start",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 1.24,
              letterSpacing: "-0.96px",
              color: "var(--color-text)",
            }}
          >
            Research Index
          </h1>
          <ResearchIndexFilters selectedTypes={selectedTypes} onToggleType={onToggleType} />
          <div style={{ marginTop: 64, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div
              style={{
                width: 124,
                height: 70,
                borderRadius: 8,
                border: "1px solid rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
                flexShrink: 0,
                background: "#e2e2e3",
              }}
            >
              <img
                src="/thumbnails/atlas.png"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ position: "relative", paddingRight: 28 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-serif)",
                  fontSize: 16,
                  lineHeight: 1.24,
                  letterSpacing: "-0.16px",
                  color: "var(--color-text)",
                }}
              >
                Behind Persona Research
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontFamily: "var(--font-serif)",
                  fontSize: 16,
                  lineHeight: 1.24,
                  letterSpacing: "-0.16px",
                  color: "var(--color-text)",
                  opacity: 0.35,
                }}
              >
                Watch film
              </p>
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  right: 0,
                  top: 26,
                  fontSize: 18,
                  opacity: 0.3,
                  color: "var(--color-text)",
                }}
              >
                →
              </span>
            </div>
          </div>
        </div>
        <ResearchArticleList articles={articles} onArticleClick={onArticleClick} />
      </div>
    </section>
  );
}
