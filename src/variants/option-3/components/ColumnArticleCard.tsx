import { AnimatePresence, motion } from "motion/react";
import type { ResearchArticle } from "../../../types/research";
import { COLUMN_BORDER_RADIUS, COLUMN_CARD_SIZE } from "../utils/columnLayout";

interface ColumnArticleCardProps {
  article: ResearchArticle;
  x: number;
  y: number;
  zIndex: number;
  isHovered: boolean;
  skipEnterAnimation?: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

export function ColumnArticleCard({
  article,
  x,
  y,
  zIndex,
  isHovered,
  skipEnterAnimation = false,
  onHover,
  onClick,
}: ColumnArticleCardProps) {
  const left = x - COLUMN_CARD_SIZE / 2;
  const top = y - COLUMN_CARD_SIZE / 2;

  return (
    <motion.div
      initial={skipEnterAnimation ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        left,
        top,
        width: COLUMN_CARD_SIZE,
        zIndex: isHovered ? 50 : zIndex,
        cursor: "pointer",
      }}
      onMouseEnter={() => onHover(article.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div
        style={{
          width: COLUMN_CARD_SIZE,
          height: COLUMN_CARD_SIZE,
          borderRadius: COLUMN_BORDER_RADIUS,
          overflow: "hidden",
          background: "#e2e2e3",
          border: "1px solid rgba(0, 0, 0, 0.08)",
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

      <AnimatePresence>
        {isHovered && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 8,
              fontFamily: "var(--font-serif)",
              fontSize: 14,
              color: "var(--color-text-muted)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            {article.title}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
