import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDialKit } from "dialkit";
import { ORBIT_DIAL_CONFIG } from "../../config/orbit";
import { useResearchNav } from "../../context/ResearchNavContext";
import { useIsArticleOverlayOpen } from "../../context/ArticleOverlayContext";
import { useViewVariantTransition } from "../../context/ViewVariantContext";
import { getAreaBySlug } from "../../data/areas";
import { getArticlesByArea } from "../../data/articles";
import { useOpenArticle } from "../../hooks/useOpenArticle";
import { computeOrbitPositions } from "../../utils/clusterLayout";
import { columnToMorph, orbitCenterToMorph } from "./config/morph";
import { ColumnArticleCard } from "./components/ColumnArticleCard";
import { ColumnCenterContent } from "./components/ColumnCenterContent";
import { ColumnTransitionCards } from "./components/ColumnTransitionCards";
import {
  computeColumnPositions,
  computeColumnPositionsForTransition,
} from "./utils/columnLayout";

const AUTO_SCROLL_SPEED = 28;

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

  const [scrollY, setScrollY] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [macroTransition, setMacroTransition] = useState(false);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const scrollRef = useRef(0);

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

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      scrollRef.current += AUTO_SCROLL_SPEED * dt;
      setScrollY(scrollRef.current);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isArticleOpen, macroTransition]);

  useEffect(() => {
    if (macroTransition || isArticleOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollRef.current += e.deltaY * 0.4;
      setScrollY(scrollRef.current);
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

  const columnPositions = computeColumnPositions(
    articles,
    scrollY,
    size.width,
    size.height,
  );

  const transitionColumnPositions = computeColumnPositionsForTransition(
    articles,
    scrollY,
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
    transitionColumnPositions.map((position) => [
      position.article.id,
      columnToMorph(position.x, position.y),
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
      {!macroTransition && (
        <>
          <ColumnCenterContent
            area={area}
            articles={articles}
            visible={!macroTransition}
            fromTransition={skipCardEnterAnimation}
          />
          {columnPositions.map(({ instanceId, article, x, y, zIndex }) => (
            <ColumnArticleCard
              key={instanceId}
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
        </>
      )}

      {macroTransition && (
        <ColumnTransitionCards
          area={area}
          articles={articles}
          fromByArticle={transitionFromByArticle}
          toByArticle={transitionToByArticle}
          onComplete={handleMacroTransitionComplete}
        />
      )}
    </div>
  );
}
