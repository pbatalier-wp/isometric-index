import { useEffect, useRef, useState } from "react";
import { useDialKit } from "dialkit";
import { ORBIT_DIAL_CONFIG } from "../../../config/orbit";
import { useArticleTrail } from "../../../context/ArticleTrailContext";
import { useIsArticleOverlayOpen } from "../../../context/ArticleOverlayContext";
import { ArticleBreadcrumbTrail } from "../../../components/ArticleBreadcrumbTrail";
import { ArticleHoverCard } from "../../../components/ArticleHoverCard";
import { ArticleTile } from "../../../components/ArticleTile";
import { OrbitPath } from "../../../components/OrbitPath";
import type { ResearchArticle } from "../../../types/research";
import { computeOrbitPositions } from "../../../utils/clusterLayout";

interface ConcentricOrbitSectionProps {
  revealedArticleIds: ReadonlySet<string>;
  highlightedAreaId: string | null;
  onArticleClick: (article: ResearchArticle) => void;
}

export function ConcentricOrbitSection({
  revealedArticleIds,
  highlightedAreaId,
  onArticleClick,
}: ConcentricOrbitSectionProps) {
  const orbit = useDialKit("Orbit", ORBIT_DIAL_CONFIG);
  const { trailSegments } = useArticleTrail();
  const isArticleOpen = useIsArticleOverlayOpen();
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [rotation, setRotation] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      rotationRef.current += orbit.speed * dt;
      setRotation(rotationRef.current);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [orbit.speed]);

  const positions = computeOrbitPositions({
    width: size.width,
    height: size.height,
    rotation,
    radius: orbit.radius,
    ringGap: orbit.ringGap,
    arcSpread: orbit.arcSpread,
  });

  const hoveredArticle = hoveredId
    ? positions.find(
        (position) =>
          position.article.id === hoveredId && revealedArticleIds.has(position.article.id),
      )
    : null;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      {orbit.showPath && (
        <OrbitPath
          width={size.width}
          height={size.height}
          radius={orbit.radius}
          ringGap={orbit.ringGap}
          opacity={orbit.pathOpacity}
        />
      )}

      {trailSegments.length > 0 && (
        <ArticleBreadcrumbTrail
          width={size.width}
          height={size.height}
          segments={trailSegments}
          positions={positions}
          zIndex={5}
        />
      )}

      {positions.map(({ article, x, y }) => {
        const isRevealed = revealedArticleIds.has(article.id);
        const isHovered = isRevealed && hoveredId === article.id;
        const isThemeDimmed =
          highlightedAreaId !== null && article.areaId !== highlightedAreaId && isRevealed;
        const isHoverDimmed = isRevealed && hoveredId !== null && !isHovered;

        return (
          <ArticleTile
            key={article.id}
            article={article}
            x={x}
            y={y}
            isHovered={isHovered}
            isDimmed={isThemeDimmed}
            opacityOnlyDimmed={isHoverDimmed}
            isObfuscated={!isRevealed}
            isFocused={false}
            interactive={isRevealed}
            baseZIndex={isRevealed ? 20 : 1}
            onHover={setHoveredId}
            onClick={() => {
              setHoveredId(null);
              onArticleClick(article);
            }}
          />
        );
      })}

      {hoveredArticle && !isArticleOpen && (
        <ArticleHoverCard
          article={hoveredArticle.article}
          x={hoveredArticle.x}
          y={hoveredArticle.y}
        />
      )}
    </section>
  );
}
