import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { researchAreas } from "../data/areas";
import { ArticleModal } from "../components/ArticleModal";
import { ArticleTile, TILE_SIZE } from "../components/ArticleTile";
import { ArticleHoverCard } from "../components/ArticleHoverCard";
import { AreaPillNav } from "../components/AreaPillNav";
import { CenterMark } from "../components/CenterMark";
import { computeArticlePositions } from "../utils/clusterLayout";
import type { FocusedArticle } from "../types/research";

function ViewToggle() {
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2,
        zIndex: 50,
      }}
    >
      <button
        type="button"
        aria-label="Spatial view"
        style={{
          width: 49,
          height: 37,
          borderRadius: 6,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "var(--color-pill-active)",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="#292929" strokeWidth="1.2" />
          <rect x="10" y="1" width="6" height="6" rx="1" stroke="#292929" strokeWidth="1.2" />
          <rect x="1" y="10" width="6" height="6" rx="1" stroke="#292929" strokeWidth="1.2" />
          <rect x="10" y="10" width="6" height="6" rx="1" stroke="#292929" strokeWidth="1.2" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="List view"
        disabled
        style={{
          width: 49,
          height: 37,
          borderRadius: 6,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "transparent",
          cursor: "not-allowed",
          opacity: 0.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <line x1="2" y1="4" x2="15" y2="4" stroke="#292929" strokeWidth="1.2" />
          <line x1="2" y1="8.5" x2="15" y2="8.5" stroke="#292929" strokeWidth="1.2" />
          <line x1="2" y1="13" x2="15" y2="13" stroke="#292929" strokeWidth="1.2" />
        </svg>
      </button>
    </div>
  );
}

function StatusChrome() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: 35,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-text)",
          opacity: 0.5,
          zIndex: 50,
        }}
      >
        11:00 /
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: 140,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-text)",
          opacity: 0.5,
          zIndex: 50,
        }}
      >
        72°F
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 32,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-text)",
          opacity: 0.5,
          zIndex: 50,
        }}
      >
        info
      </div>
    </>
  );
}

export default function ConcentricIndex() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focused, setFocused] = useState<FocusedArticle | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const dismissRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const positions = computeArticlePositions(size.width, size.height);
  const hoveredArticle = hoveredId ? positions.find((p) => p.article.id === hoveredId) : null;

  const handleModalDismiss = () => {
    setTransitioning(true);
    setFocused(null);
    setTimeout(() => setTransitioning(false), 100);
  };

  const handleAreaSelect = (slug: string) => {
    setActiveSlug(slug);
    navigate(`/area/${slug}`);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--color-bg)",
        pointerEvents: transitioning ? "none" : "auto",
      }}
    >
      <ViewToggle />
      <StatusChrome />
      <CenterMark />

      {positions.map(({ article, x, y }) => {
        const isHovered = hoveredId === article.id;
        const isDimmed = hoveredId !== null && !isHovered;
        const isFocused = focused?.article.id === article.id;

        return (
          <ArticleTile
            key={article.id}
            article={article}
            x={x}
            y={y}
            isHovered={isHovered}
            isDimmed={isDimmed}
            isFocused={isFocused}
            onHover={setHoveredId}
            onClick={() =>
              setFocused({
                article,
                originX: x - TILE_SIZE / 2,
                originY: y - TILE_SIZE / 2,
                zIndex: 10,
                width: TILE_SIZE,
                height: TILE_SIZE,
              })
            }
          />
        );
      })}

      {hoveredArticle && !focused && (
        <ArticleHoverCard
          article={hoveredArticle.article}
          x={hoveredArticle.x}
          y={hoveredArticle.y}
        />
      )}

      <AreaPillNav
        areas={researchAreas}
        activeSlug={activeSlug}
        onSelect={handleAreaSelect}
      />

      {focused && (
        <ArticleModal
          key={focused.article.id}
          focused={focused}
          onDismiss={handleModalDismiss}
          dismissRef={dismissRef}
        />
      )}
    </div>
  );
}
