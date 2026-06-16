import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { useDialKit } from "dialkit";
import { ORBIT_DIAL_CONFIG } from "../config/orbit";
import { TRANSITION_DIAL_CONFIG, asTransitionValues } from "../config/transitions";
import { useResearchNav } from "../context/ResearchNavContext";
import { getAreaBySlug } from "../data/areas";
import { getArticlesByArea } from "../data/articles";
import { ArticleModal } from "../components/ArticleModal";
import { AreaTransitionCards } from "../components/AreaTransitionCards";
import { computeOrbitPositions } from "../utils/clusterLayout";
import { computeIsometricPositions, CARD_H, CARD_W } from "../utils/isometricLayout";
import { isometricToMorph, orbitCenterToMorph } from "../utils/transitionMorph";
import { buildMorphTransition } from "../utils/transitionMotion";
import type { FocusedArticle } from "../types/research";

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
  const transitions = useDialKit("Transitions", TRANSITION_DIAL_CONFIG);

  const area = areaSlug ? getAreaBySlug(areaSlug) : undefined;
  const articles = area ? getArticlesByArea(area.id) : [];

  const [scroll, setScroll] = useState(0);
  const [focused, setFocused] = useState<FocusedArticle | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [macroTransition, setMacroTransition] = useState(false);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const accRef = useRef(0);
  const dismissRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!location.state) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!area) navigate("/", { replace: true });
  }, [area, navigate]);

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (macroTransition) return;

    const onWheel = (e: WheelEvent) => {
      if (focused) return;
      e.preventDefault();
      accRef.current += e.deltaY * 0.4;
      setScroll(accRef.current);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [focused, macroTransition]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBackToMacro = useCallback(() => {
    if (macroTransition || focused) return;
    setMacroTransition(true);
  }, [macroTransition, focused]);

  const handleAreaSelect = useCallback(
    (slug: string) => {
      if (!area || slug === area.slug) return;
      navigate(`/area/${slug}`);
    },
    [area, navigate],
  );

  useResearchNav({
    activeSlug: area?.slug ?? null,
    hidden: focused !== null,
    disabled: transitioning || macroTransition,
    onSelectArea: handleAreaSelect,
    onBackToConcentric: handleBackToMacro,
  });

  if (!area || articles.length === 0) return null;

  const handleModalDismiss = () => {
    setTransitioning(true);
    setFocused(null);
    setTimeout(() => setTransitioning(false), 100);
  };

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
        pointerEvents: transitioning || macroTransition ? "none" : "auto",
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

      {!macroTransition &&
        isometricPositions.map(({ article, x, y, zIndex }) => {
          const isThisFocused = focused?.article.id === article.id;

          return (
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
                visibility: isThisFocused ? "hidden" : "visible",
              }}
              onClick={() =>
                setFocused({
                  article,
                  originX: x,
                  originY: y,
                  zIndex,
                  width: CARD_W,
                  height: CARD_H,
                  rotateY: -15,
                })
              }
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
          );
        })}

      {macroTransition && (
        <AreaTransitionCards
          area={area}
          articles={articles}
          fromByArticle={transitionFromByArticle}
          toByArticle={transitionToByArticle}
          direction="to-concentric"
          morphTransition={buildMorphTransition(asTransitionValues(transitions.toConcentric))}
          flattenDuration={asTransitionValues(transitions.toConcentric).flattenDuration}
          onComplete={handleMacroTransitionComplete}
        />
      )}

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
