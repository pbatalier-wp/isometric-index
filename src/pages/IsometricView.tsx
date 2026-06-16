import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { useDialKit } from "dialkit";
import { ORBIT_DIAL_CONFIG } from "../config/orbit";
import { TRANSITION_DEFAULTS } from "../config/transitions";
import { useResearchNav } from "../context/ResearchNavContext";
import { useIsArticleOverlayOpen } from "../context/ArticleOverlayContext";
import { getAreaBySlug } from "../data/areas";
import { getArticlesByArea } from "../data/articles";
import { AreaTransitionCards } from "../components/AreaTransitionCards";
import { ArticleBreadcrumbTrail } from "../components/ArticleBreadcrumbTrail";
import { useArticleTrail } from "../context/ArticleTrailContext";
import { useOpenArticle } from "../hooks/useOpenArticle";
import { computeOrbitPositions } from "../utils/clusterLayout";
import { computeIsometricPositions, CARD_H, CARD_W } from "../utils/isometricLayout";
import { isometricToMorph, orbitCenterToMorph } from "../utils/transitionMorph";
import { buildMorphTransition } from "../utils/transitionMotion";

interface LocationState {
  fromTransition?: boolean;
  rotation?: number;
}

export default function IsometricView() {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState | null) ?? {};
  const fromTransition = Boolean(locationState.fromTransition);
  const savedRotation = locationState.rotation ?? 0;
  const orbit = useDialKit("Orbit", ORBIT_DIAL_CONFIG);
  const openArticle = useOpenArticle();
  const isArticleOpen = useIsArticleOverlayOpen();
  const { trailSegments } = useArticleTrail();

  const area = areaSlug ? getAreaBySlug(areaSlug) : undefined;
  const articles = area ? getArticlesByArea(area.id) : [];

  const [scroll, setScroll] = useState(0);
  const [macroTransition, setMacroTransition] = useState(false);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const accRef = useRef(0);

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
      accRef.current += e.deltaY * 0.4;
      setScroll(accRef.current);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isArticleOpen, macroTransition]);

  const handleBackToMacro = useCallback(() => {
    if (macroTransition || isArticleOpen) return;
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

  const isometricPositions = computeIsometricPositions(
    articles,
    scroll,
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
    isometricPositions.map((position) => [
      position.article.id,
      isometricToMorph(position.x, position.y),
    ]),
  );

  const transitionToByArticle = new Map(
    orbitPositions.map((position) => [
      position.article.id,
      orbitCenterToMorph(position.x, position.y),
    ]),
  );

  const trailPositions = isometricPositions.map(({ article, x, y }) => ({
    article,
    x: x + CARD_W / 2,
    y: y + CARD_H / 2,
  }));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        perspective: "4000px",
        perspectiveOrigin: "50% 50%",
        background: "var(--color-bg)",
        pointerEvents: macroTransition ? "none" : "auto",
      }}
    >
      <motion.div
        initial={fromTransition ? { opacity: 0, y: -8 } : false}
        animate={{ opacity: macroTransition ? 0 : 0.5, y: 0 }}
        transition={{ delay: fromTransition && !macroTransition ? 0.2 : 0, duration: 0.35 }}
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-serif)",
          fontSize: 16,
          color: "var(--color-text)",
          zIndex: 50,
        }}
      >
        {area.label}
      </motion.div>

      {!macroTransition && trailSegments.length > 0 && (
        <ArticleBreadcrumbTrail
          width={size.width}
          height={size.height}
          segments={trailSegments}
          positions={trailPositions}
        />
      )}

      {!macroTransition &&
        isometricPositions.map(({ article, x, y, zIndex }) => (
          <motion.div
            key={article.id}
            initial={fromTransition ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover="hover"
            style={{
              position: "absolute",
              left: x,
              top: y,
              zIndex,
              cursor: "pointer",
            }}
            onClick={() => openArticle(article.slug, article.id)}
          >
            <motion.div
              variants={{
                hover: { y: -50, transition: { duration: 0.2 } },
                initial: { y: 0 },
              }}
              style={{
                width: CARD_W,
                height: CARD_H,
                backgroundColor: area.accentColor,
                transform: "rotateY(-15deg)",
                transformOrigin: "center center",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <img
                src={article.thumbnail}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </motion.div>
          </motion.div>
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
