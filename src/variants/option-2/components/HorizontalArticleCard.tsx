import { AnimatePresence, motion } from "motion/react";
import type { ResearchArticle } from "../../../types/research";
import {
  H_CARD_H,
  H_CARD_W,
  H_FEATURED_H,
  H_FEATURED_W,
} from "../utils/horizontalScrollLayout";

interface HorizontalArticleCardProps {
  article: ResearchArticle;
  x: number;
  y: number;
  zIndex: number;
  isHovered: boolean;
  skipEnterAnimation?: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

export function HorizontalArticleCard({
  article,
  x,
  y,
  zIndex,
  isHovered,
  skipEnterAnimation = false,
  onHover,
  onClick,
}: HorizontalArticleCardProps) {
  const width = isHovered ? H_FEATURED_W : H_CARD_W;
  const height = isHovered ? H_FEATURED_H : H_CARD_H;
  const left = isHovered ? x - (H_FEATURED_W - H_CARD_W) / 2 : x;
  const top = isHovered ? y - (H_FEATURED_H - H_CARD_H) / 2 : y;

  return (
    <motion.div
      initial={skipEnterAnimation ? false : { left, top, width, height }}
      animate={{ left, top, width, height }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        zIndex: isHovered ? 50 : zIndex,
        cursor: "pointer",
      }}
      onMouseEnter={() => onHover(article.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              left: 0,
              bottom: "100%",
              marginBottom: 12,
              width: H_FEATURED_W,
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                color: "var(--color-text)",
                opacity: 0.6,
                lineHeight: 1.08,
                letterSpacing: "-0.384px",
                marginBottom: 4,
              }}
            >
              {article.date}
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                color: "var(--color-text)",
                lineHeight: 1.28,
                letterSpacing: "-0.384px",
              }}
            >
              {article.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 8,
          overflow: "hidden",
          background: isHovered ? "#dbdbdb" : "#e2e2e3",
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
      </div>
    </motion.div>
  );
}
