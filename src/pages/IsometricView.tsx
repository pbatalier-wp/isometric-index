import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { getAreaBySlug } from "../data/areas";
import { getArticlesByArea } from "../data/articles";
import { ArticleModal } from "../components/ArticleModal";
import type { FocusedArticle } from "../types/research";

const CARD_W = 200;
const CARD_H = 260;
const STEP_X = 40;

export default function IsometricView() {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const navigate = useNavigate();
  const area = areaSlug ? getAreaBySlug(areaSlug) : undefined;
  const articles = area ? getArticlesByArea(area.id) : [];

  const [scroll, setScroll] = useState(0);
  const [focused, setFocused] = useState<FocusedArticle | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const accRef = useRef(0);
  const dismissRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!area) navigate("/", { replace: true });
  }, [area, navigate]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (focused) return;
      e.preventDefault();
      accRef.current += e.deltaY * 0.4;
      setScroll(accRef.current);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [focused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!area || articles.length === 0) return null;

  const handleModalDismiss = () => {
    setTransitioning(true);
    setFocused(null);
    setTimeout(() => setTransitioning(false), 100);
  };

  const cardCount = articles.length;
  const loopSpan = cardCount * STEP_X;

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
        pointerEvents: transitioning ? "none" : "auto",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 100,
          background: "transparent",
          border: "none",
          fontFamily: "var(--font-serif)",
          fontSize: 16,
          color: "var(--color-text)",
          opacity: 0.6,
          cursor: "pointer",
          letterSpacing: "-0.16px",
        }}
      >
        ← All research
      </button>

      <div
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-serif)",
          fontSize: 16,
          color: "var(--color-text)",
          opacity: 0.5,
          zIndex: 50,
        }}
      >
        {area.label}
      </div>

      {articles.map((article, i) => {
        const rawPos = i * STEP_X - scroll;
        const pos = ((rawPos % loopSpan) + loopSpan) % loopSpan;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const x = vw - CARD_W + 40 - (pos / loopSpan) * (vw + loopSpan);
        const y = 40 + (pos / loopSpan) * (vh + 200);

        const isThisFocused = focused?.article.id === article.id;

        return (
          <motion.div
            key={article.id}
            whileHover="hover"
            style={{
              position: "absolute",
              left: x,
              top: y,
              zIndex: Math.round(pos),
              cursor: "pointer",
              visibility: isThisFocused ? "hidden" : "visible",
            }}
            onClick={() =>
              setFocused({
                article,
                originX: x,
                originY: y,
                zIndex: Math.round(pos),
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
