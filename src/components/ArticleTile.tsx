import { motion } from "motion/react";
import type { ResearchArticle } from "../types/research";

const TILE_SIZE = 80;

interface ArticleTileProps {
  article: ResearchArticle;
  x: number;
  y: number;
  isHovered: boolean;
  isDimmed: boolean;
  isHeavilyDimmed?: boolean;
  isExiting?: boolean;
  isEntering?: boolean;
  isFocused: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

export function ArticleTile({
  article,
  x,
  y,
  isHovered,
  isDimmed,
  isHeavilyDimmed = false,
  isExiting = false,
  isEntering = false,
  isFocused,
  onHover,
  onClick,
}: ArticleTileProps) {
  return (
    <motion.div
      initial={isEntering ? { opacity: 0, scale: 0.85, filter: "blur(6px)" } : false}
      animate={{
        opacity: isExiting ? 0 : isHeavilyDimmed ? 0.18 : isDimmed ? 0.3 : 1,
        filter: isExiting ? "blur(10px)" : isHeavilyDimmed ? "blur(14px)" : isDimmed ? "blur(5px)" : "blur(0px)",
        scale: isExiting ? 0.75 : isHovered ? 1.05 : 1,
      }}
      transition={{ duration: isExiting ? 0.45 : isEntering ? 0.5 : isHeavilyDimmed ? 0.35 : 0.2 }}
      onMouseEnter={() => onHover(article.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      style={{
        position: "absolute",
        left: x - TILE_SIZE / 2,
        top: y - TILE_SIZE / 2,
        width: TILE_SIZE,
        height: TILE_SIZE,
        cursor: "pointer",
        visibility: isFocused ? "hidden" : "visible",
        pointerEvents: isDimmed || isExiting ? "none" : "auto",
        zIndex: isHovered ? 100 : 1,
      }}
    >
      <div
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          borderRadius: 6.4,
          border: "0.8px solid rgba(0,0,0,0.12)",
          overflow: "hidden",
          background: "#fff",
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
      </div>
    </motion.div>
  );
}

export { TILE_SIZE };
