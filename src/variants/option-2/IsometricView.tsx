import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDialKit } from "dialkit";
import { ORBIT_DIAL_CONFIG } from "../../config/orbit";
import { TRANSITION_DEFAULTS } from "./config/transitions";
import { useResearchNav } from "../../context/ResearchNavContext";
import { useIsArticleOverlayOpen } from "../../context/ArticleOverlayContext";
import { useViewVariantTransition } from "../../context/ViewVariantContext";
import { getAreaBySlug } from "../../data/areas";
import { getArticlesByArea } from "../../data/articles";
import { AreaTransitionCards } from "../../components/AreaTransitionCards";
import { useOpenArticle } from "../../hooks/useOpenArticle";
import { computeOrbitPositions } from "../../utils/clusterLayout";
import { horizontalToMorph, orbitCenterToMorph } from "./config/morph";
import { buildMorphTransition } from "../../utils/transitionMotion";
import { HorizontalArticleCard } from "./components/HorizontalArticleCard";
import { computeHorizontalScrollPositions } from "./utils/horizontalScrollLayout";

interface LocationState {
  fromTransition?: boolean;
  rotation?: number;
}

export default function IsometricView() {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState | null) ?? {};
  const [skipCardEnterAnimation] = useState(() => Boolean(locationState.fromTransition));
  const savedRotation = locationState.rotation ?? 0;
  const orbit = useDialKit("Orbit", ORBIT_DIAL_CONFIG);
  const openArticle = useOpenArticle();
  const isArticleOpen = useIsArticleOverlayOpen();
  const { setTransitioning } = useViewVariantTransition();

  const area = areaSlug ? getAreaBySlug(areaSlug) : undefined;
  const articles = area ? getArticlesByArea(area.id) : [];

  const [scrollX, setScrollX] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [macroTransition, setMacroTransition] = useState(false);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const accRef = useRef(0);

  useEffect(() => {
    setTransitioning(macroTransition);
    return () => setTransitioning(false);
  }, [macroTransition, setTransitioning]);

  useEffect(() => {
    if (!location.state || isArticleOpen) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [isArticleOpen, location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!area) navigate("/", { replace: true });
  }, [area, navigate]);

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (macroTransition || isArticleOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      accRef.current += e.deltaX + e.deltaY * 0.4;
      setScrollX(accRef.current);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isArticleOpen, macroTransition]);

  const handleBackToMacro = useCallback(() => {
    if (macroTransition || isArticleOpen) return;
    setHoveredId(null);
    setMacroTransition(true);
  }, [isArticleOpen, macroTransition]);

  const handleAreaSelect = useCallback(
    (slug: string) => {
      if (!area || slug === area.slug || isArticleOpen) return;
      navigate(`/area/${slug}`);
    },
    [area, isArticleOpen, navigate],
  );

  useResearchNav({
    activeSlug: area?.slug ?? null,
    hidden: false,
    disabled: macroTransition,
    onSelectArea: handleAreaSelect,
    onBackToConcentric: handleBackToMacro,
  });

  if (!area || articles.length === 0) return null;

  const handleMacroTransitionComplete = () => {
    navigate("/", {
      state: {
        fromReverseTransition: true,
        rotation: savedRotation,
        areaSlug: area.slug,
      },
    });
  };

  const horizontalPositions = computeHorizontalScrollPositions(
    articles,
    scrollX,
    size.width,
    size.height,
  );

  const orbitPositions = computeOrbitPositions(
    {
      width: size.width,
      height: size.height,
      rotation: savedRotation,
      radius: orbit.radius,
      ringGap: orbit.ringGap,
      arcSpread: orbit.arcSpread,
    },
    articles,
  );

  const transitionFromByArticle = new Map(
    horizontalPositions.map((position) => [
      position.article.id,
      horizontalToMorph(position.x, position.y),
    ]),
  );

  const transitionToByArticle = new Map(
    orbitPositions.map((position) => [
      position.article.id,
      orbitCenterToMorph(position.x, position.y),
    ]),
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--color-bg)",
        pointerEvents: macroTransition ? "none" : "auto",
      }}
    >
      {!macroTransition &&
        horizontalPositions.map(({ article, x, y, zIndex }) => (
          <HorizontalArticleCard
            key={article.id}
            article={article}
            x={x}
            y={y}
            zIndex={zIndex}
            isHovered={hoveredId === article.id}
            skipEnterAnimation={skipCardEnterAnimation}
            onHover={setHoveredId}
            onClick={() => {
              setHoveredId(null);
              openArticle(article.slug, article.id);
            }}
          />
        ))}

      {macroTransition && (
        <AreaTransitionCards
          area={area}
          articles={articles}
          fromByArticle={transitionFromByArticle}
          toByArticle={transitionToByArticle}
          direction="to-concentric"
          morphTransition={buildMorphTransition(TRANSITION_DEFAULTS.toConcentric)}
          flattenDuration={TRANSITION_DEFAULTS.toConcentric.flattenDuration}
          onComplete={handleMacroTransitionComplete}
        />
      )}
    </div>
  );
}
