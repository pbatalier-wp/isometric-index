import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useDialKit } from "dialkit";
import { ORBIT_DIAL_CONFIG } from "../../config/orbit";
import { TRANSITION_DEFAULTS } from "./config/transitions";
import { useArticleTrail } from "../../context/ArticleTrailContext";
import { useIsArticleOverlayOpen } from "../../context/ArticleOverlayContext";
import { useViewVariantTransition } from "../../context/ViewVariantContext";
import { getAreaBySlug } from "../../data/areas";
import { getArticlesByArea } from "../../data/articles";
import { ArticleBreadcrumbTrail } from "../../components/ArticleBreadcrumbTrail";
import { ArticleTile } from "../../components/ArticleTile";
import { ArticleHoverCard } from "../../components/ArticleHoverCard";
import { useResearchNav } from "../../context/ResearchNavContext";
import { AreaTransitionCards } from "../../components/AreaTransitionCards";
import { CenterMark } from "../../components/CenterMark";
import { OrbitPath } from "../../components/OrbitPath";
import { useOpenArticle } from "../../hooks/useOpenArticle";
import { computeOrbitPositions } from "../../utils/clusterLayout";
import { computeHorizontalScrollPositions } from "./utils/horizontalScrollLayout";
import { horizontalToMorph, orbitCenterToMorph } from "./config/morph";
import { buildMorphTransition } from "../../utils/transitionMotion";
import type { ArticlePosition } from "../../types/research";

interface LocationState {
  fromReverseTransition?: boolean;
  rotation?: number;
  areaSlug?: string;
}

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

export default function ConcentricView() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState | null) ?? {};
  const orbit = useDialKit("Orbit", ORBIT_DIAL_CONFIG);
  const openArticle = useOpenArticle();
  const { trailSegments } = useArticleTrail();
  const isArticleOpen = useIsArticleOverlayOpen();
  const { setTransitioning } = useViewVariantTransition();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [areaTransition, setAreaTransition] = useState<AreaTransitionState | null>(null);
  const [fadingInOthers, setFadingInOthers] = useState(
    Boolean(locationState.fromReverseTransition),
  );
  const [exitedAreaId] = useState(
    locationState.areaSlug ? getAreaBySlug(locationState.areaSlug)?.id : undefined,
  );
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [rotation, setRotation] = useState(locationState.rotation ?? 0);
  const rotationRef = useRef(locationState.rotation ?? 0);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const transitioningArea = areaTransition ? getAreaBySlug(areaTransition.slug) : undefined;
  const transitioningArticles = transitioningArea
    ? getArticlesByArea(transitioningArea.id)
    : [];

  const isAreaTransitioning = areaTransition !== null;

  useEffect(() => {
    setTransitioning(isAreaTransitioning);
    return () => setTransitioning(false);
  }, [isAreaTransitioning, setTransitioning]);

  useEffect(() => {
    if (!location.state || isArticleOpen) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [isArticleOpen, location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!fadingInOthers) return;
    const timeout = setTimeout(() => setFadingInOthers(false), 600);
    return () => clearTimeout(timeout);
  }, [fadingInOthers]);

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (areaTransition || isArticleOpen) return;

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
  }, [orbit.speed, areaTransition, isArticleOpen]);

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

  const handleAreaSelect = useCallback(
    (slug: string) => {
      if (areaTransition || isArticleOpen) return;
      setActiveSlug(slug);
      setHoveredId(null);
      setAreaTransition({ slug, fromPositions: positions });
    },
    [areaTransition, isArticleOpen, positions],
  );

  useResearchNav({
    activeSlug: areaTransition?.slug ?? activeSlug,
    hidden: false,
    disabled: isAreaTransitioning,
    onSelectArea: handleAreaSelect,
    onBackToConcentric: () => {},
  });

  const handleAreaTransitionComplete = () => {
    if (!areaTransition) return;
    navigate(`/area/${areaTransition.slug}`, {
      state: { fromTransition: true, rotation: rotationRef.current },
    });
  };

  const transitionFromByArticle = new Map(
    transitioningArticles
      .map((article) => {
        const position = areaTransition?.fromPositions.find((p) => p.article.id === article.id);
        return position ? [article.id, orbitCenterToMorph(position.x, position.y)] as const : null;
      })
      .filter((entry): entry is [string, ReturnType<typeof orbitCenterToMorph>] => entry !== null),
  );
  const transitionToByArticle = new Map(
    computeHorizontalScrollPositions(transitioningArticles, 0, size.width, size.height).map(
      (position) => [position.article.id, horizontalToMorph(position.x, position.y)] as const,
    ),
  );

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
        pointerEvents: isAreaTransitioning ? "none" : "auto",
      }}
    >
      <ViewToggle hidden={isAreaTransitioning && !fadingInOthers} />
      <StatusChrome hidden={isAreaTransitioning && !fadingInOthers} />

      {orbit.showPath && !isAreaTransitioning && (
        <OrbitPath
          width={size.width}
          height={size.height}
          radius={orbit.radius}
          ringGap={orbit.ringGap}
          opacity={orbit.pathOpacity}
        />
      )}

      {!isAreaTransitioning && trailSegments.length > 0 && (
        <ArticleBreadcrumbTrail
          width={size.width}
          height={size.height}
          segments={trailSegments}
          positions={positions}
          hidden={isAreaTransitioning}
        />
      )}

      <motion.div
        animate={{ opacity: isAreaTransitioning ? 0 : 1, scale: isAreaTransitioning ? 0.8 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <CenterMark disabled={isAreaTransitioning || isArticleOpen} />
      </motion.div>

      {positions.map(({ article, x, y }) => {
        const isSelectedArea = transitioningArea?.id === article.areaId;
        if (isAreaTransitioning && isSelectedArea) return null;

        const isHovered = hoveredId === article.id;
        const isDimmed = hoveredId !== null && !isHovered;
        const isEntering = fadingInOthers && article.areaId !== exitedAreaId;

        return (
          <ArticleTile
            key={article.id}
            article={article}
            x={x}
            y={y}
            isHovered={isHovered}
            isDimmed={isDimmed}
            isExiting={isAreaTransitioning}
            isEntering={isEntering}
            isFocused={false}
            onHover={setHoveredId}
            onClick={() => {
              setHoveredId(null);
              openArticle(article.slug, article.id);
            }}
          />
        );
      })}

      {isAreaTransitioning && transitioningArea && (
        <AreaTransitionCards
          area={transitioningArea}
          articles={transitioningArticles}
          fromByArticle={transitionFromByArticle}
          toByArticle={transitionToByArticle}
          direction="to-isometric"
          morphTransition={buildMorphTransition(TRANSITION_DEFAULTS.toIsometric)}
          onComplete={handleAreaTransitionComplete}
        />
      )}

      {hoveredArticle && !isArticleOpen && !isAreaTransitioning && (
        <ArticleHoverCard
          article={hoveredArticle.article}
          x={hoveredArticle.x}
          y={hoveredArticle.y}
        />
      )}
    </motion.div>
  );
}
