import { motion } from "motion/react";
import type { ResearchArticle } from "../types/research";

const TILE_SIZE = 80;

interface ArticleTileProps {
  article: ResearchArticle;
  x: number;
  y: number;
  isHovered: boolean;
  isDimmed: boolean;
  opacityOnlyDimmed?: boolean;
  isHeavilyDimmed?: boolean;
  isObfuscated?: boolean;
  isExiting?: boolean;
  isEntering?: boolean;
  isFocused: boolean;
  allowClickWhenDimmed?: boolean;
  interactive?: boolean;
  baseZIndex?: number;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

export function ArticleTile({
  article,
  x,
  y,
  isHovered,
  isDimmed,
  opacityOnlyDimmed = false,
  isHeavilyDimmed = false,
  isObfuscated = false,
  isExiting = false,
  isEntering = false,
  isFocused,
  allowClickWhenDimmed = false,
  interactive = true,
  baseZIndex = 1,
  onHover,
  onClick,
}: ArticleTileProps) {
  const showHover = interactive && isHovered;
  const opacity = isExiting
    ? 0
    : isObfuscated
      ? 0.35
      : isHeavilyDimmed
        ? 0.18
        : isDimmed || opacityOnlyDimmed
          ? 0.3
          : 1;
  const filter = isExiting
    ? "blur(10px)"
    : isObfuscated
      ? "blur(14px)"
      : isHeavilyDimmed
        ? "blur(14px)"
        : isDimmed
          ? "blur(5px)"
          : "blur(0px)";

  return (
    <motion.div
      initial={isEntering ? { opacity: 0, scale: 0.85, filter: "blur(6px)" } : false}
      animate={{
        opacity,
        filter,
        scale: isExiting ? 0.75 : showHover ? 1.05 : 1,
      }}
      transition={{
        duration: isExiting ? 0.45 : isEntering ? 0.5 : isObfuscated ? 0.4 : isHeavilyDimmed ? 0.35 : 0.2,
      }}
      onMouseEnter={interactive ? () => onHover(article.id) : undefined}
      onMouseLeave={interactive ? () => onHover(null) : undefined}
      onClick={interactive ? onClick : undefined}
      style={{
        position: "absolute",
        left: x - TILE_SIZE / 2,
        top: y - TILE_SIZE / 2,
        width: TILE_SIZE,
        height: TILE_SIZE,
        cursor: interactive ? "pointer" : "default",
        visibility: isFocused ? "hidden" : "visible",
        pointerEvents:
          !interactive || isExiting || (isDimmed && !allowClickWhenDimmed) ? "none" : "auto",
        zIndex: showHover ? 100 : baseZIndex,
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
