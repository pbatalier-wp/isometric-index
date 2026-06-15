import { useRef } from "react";
import { motion } from "motion/react";
import type { ResearchArea, ResearchArticle } from "../types/research";
import { CARD_H, CARD_W } from "../utils/isometricLayout";
import { TILE_SIZE } from "./ArticleTile";

interface AreaTransitionCardsProps {
  area: ResearchArea;
  articles: ResearchArticle[];
  fromPositions: Map<string, { x: number; y: number }>;
  toPositions: { article: ResearchArticle; x: number; y: number; zIndex: number }[];
  onComplete: () => void;
}

export function AreaTransitionCards({
  area,
  articles,
  fromPositions,
  toPositions,
  onComplete,
}: AreaTransitionCardsProps) {
  const completedRef = useRef(0);

  const handleComplete = () => {
    completedRef.current += 1;
    if (completedRef.current === articles.length) onComplete();
  };

  return (
    <>
      {articles.map((article, index) => {
        const from = fromPositions.get(article.id);
        const to = toPositions[index];
        if (!from || !to) return null;

        return (
          <motion.div
            key={article.id}
            initial={{
              left: from.x - TILE_SIZE / 2,
              top: from.y - TILE_SIZE / 2,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
            animate={{
              left: to.x,
              top: to.y,
              width: CARD_W,
              height: CARD_H,
            }}
            transition={{
              type: "spring",
              stiffness: 85,
              damping: 18,
              mass: 1,
            }}
            onAnimationComplete={handleComplete}
            style={{
              position: "absolute",
              zIndex: 200 + to.zIndex,
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              initial={{ rotateY: 0, borderRadius: 6.4 }}
              animate={{ rotateY: -15, borderRadius: 4 }}
              transition={{
                type: "spring",
                stiffness: 85,
                damping: 18,
              }}
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                backgroundColor: area.accentColor,
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={article.thumbnail}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}
