import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useDialKit } from "dialkit";
import { getAreaBySlug, researchAreas } from "../data/areas";
import { getArticlesByArea } from "../data/articles";
import { ArticleModal } from "../components/ArticleModal";
import { ArticleTile, TILE_SIZE } from "../components/ArticleTile";
import { ArticleHoverCard } from "../components/ArticleHoverCard";
import { AreaPillNav } from "../components/AreaPillNav";
import { AreaTransitionCards } from "../components/AreaTransitionCards";
import { CenterMark } from "../components/CenterMark";
import { OrbitPath } from "../components/OrbitPath";
import { computeOrbitPositions } from "../utils/clusterLayout";
import { computeIsometricPositions } from "../utils/isometricLayout";
import type { ArticlePosition, FocusedArticle } from "../types/research";

function ViewToggle({ hidden }: { hidden: boolean }) {
  return (
    <motion.div
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.35 }}
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2,
        zIndex: 50,
        pointerEvents: hidden ? "none" : "auto",
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
    </motion.div>
  );
}

function StatusChrome({ hidden }: { hidden: boolean }) {
  return (
    <motion.div
      animate={{ opacity: hidden ? 0 : 0.5 }}
      transition={{ duration: 0.35 }}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: 35,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-text)",
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
          zIndex: 50,
        }}
      >
        info
      </div>
    </motion.div>
  );
}

interface AreaTransitionState {
  slug: string;
  fromPositions: ArticlePosition[];
}

export default function ConcentricIndex() {
  const navigate = useNavigate();
  const orbit = useDialKit("Orbit", {
    showPath: false,
    radius: [360, 80, 400],
    ringGap: [30, 0, 120],
    speed: [0.04, 0, 0.6],
    arcSpread: [0.4, 0.1, 1.2],
    pathOpacity: [0.38, 0, 1],
  });

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focused, setFocused] = useState<FocusedArticle | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [areaTransition, setAreaTransition] = useState<AreaTransitionState | null>(null);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [rotation, setRotation] = useState(0);
  const dismissRef = useRef<(() => void) | null>(null);
  const rotationRef = useRef(0);

  const transitioningArea = areaTransition ? getAreaBySlug(areaTransition.slug) : undefined;
  const transitioningArticles = transitioningArea
    ? getArticlesByArea(transitioningArea.id)
    : [];

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

  useEffect(() => {
    if (areaTransition) return;

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
  }, [orbit.speed, areaTransition]);

  const positions = areaTransition
    ? areaTransition.fromPositions
    : computeOrbitPositions({
        width: size.width,
        height: size.height,
        rotation,
        radius: orbit.radius,
        ringGap: orbit.ringGap,
        arcSpread: orbit.arcSpread,
      });

  const hoveredArticle = hoveredId ? positions.find((p) => p.article.id === hoveredId) : null;

  const handleModalDismiss = () => {
    setTransitioning(true);
    setFocused(null);
    setTimeout(() => setTransitioning(false), 100);
  };

  const handleAreaSelect = (slug: string) => {
    if (areaTransition || focused) return;
    setActiveSlug(slug);
    setHoveredId(null);
    setAreaTransition({ slug, fromPositions: positions });
  };

  const handleAreaTransitionComplete = () => {
    if (!areaTransition) return;
    navigate(`/area/${areaTransition.slug}`, { state: { fromTransition: true } });
  };

  const isAreaTransitioning = areaTransition !== null;
  const transitionFromMap = new Map(
    areaTransition?.fromPositions.map((position) => [
      position.article.id,
      { x: position.x, y: position.y },
    ]) ?? [],
  );
  const transitionToPositions = transitioningArea
    ? computeIsometricPositions(
        transitioningArticles,
        0,
        size.width,
        size.height,
      )
    : [];

  return (
    <motion.div
      animate={{
        perspective: isAreaTransitioning ? 4000 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--color-bg)",
        perspectiveOrigin: "50% 50%",
        pointerEvents: transitioning || isAreaTransitioning ? "none" : "auto",
      }}
    >
      <ViewToggle hidden={isAreaTransitioning} />
      <StatusChrome hidden={isAreaTransitioning} />

      {orbit.showPath && !isAreaTransitioning && (
        <OrbitPath
          width={size.width}
          height={size.height}
          radius={orbit.radius}
          ringGap={orbit.ringGap}
          opacity={orbit.pathOpacity}
        />
      )}

      <motion.div
        animate={{ opacity: isAreaTransitioning ? 0 : 1, scale: isAreaTransitioning ? 0.8 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <CenterMark />
      </motion.div>

      {positions.map(({ article, x, y }) => {
        const isSelectedArea = transitioningArea?.id === article.areaId;
        if (isAreaTransitioning && isSelectedArea) return null;

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
            isExiting={isAreaTransitioning}
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

      {isAreaTransitioning && transitioningArea && (
        <AreaTransitionCards
          area={transitioningArea}
          articles={transitioningArticles}
          fromPositions={transitionFromMap}
          toPositions={transitionToPositions}
          onComplete={handleAreaTransitionComplete}
        />
      )}

      {hoveredArticle && !focused && !isAreaTransitioning && (
        <ArticleHoverCard
          article={hoveredArticle.article}
          x={hoveredArticle.x}
          y={hoveredArticle.y}
        />
      )}

      <AreaPillNav
        areas={researchAreas}
        activeSlug={areaTransition?.slug ?? activeSlug}
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
    </motion.div>
  );
}
