import { motion } from "motion/react";
import type { ResearchArea, ResearchArticle } from "../../../types/research";
import { ColumnArticleList } from "./ColumnArticleList";

interface ColumnCenterContentProps {
  area: ResearchArea;
  articles: ResearchArticle[];
  visible: boolean;
  fromTransition: boolean;
  onArticleClick: (article: ResearchArticle) => void;
}

function buildAreaSummary(articles: ResearchArticle[]): string {
  const summary = articles[0]?.summary ?? "";
  if (summary.length <= 280) return summary;
  return `${summary.slice(0, 277).trimEnd()}…`;
}

export function ColumnCenterContent({
  area,
  articles,
  visible,
  fromTransition,
  onArticleClick,
}: ColumnCenterContentProps) {
  return (
    <motion.div
      data-column-center-content
      initial={fromTransition ? { opacity: 0, filter: "blur(4px)" } : false}
      animate={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(4px)",
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: fromTransition ? 0.4 : 0,
      }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "min(720px, calc(100vw - 96px))",
        width: "100%",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        padding: "0 24px",
        zIndex: 10,
        pointerEvents: "auto",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 36,
          fontWeight: 500,
          color: "var(--color-text)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {area.label}
      </h2>
      <p
        style={{
          marginTop: 4,
          fontFamily: "var(--font-serif)",
          fontSize: 18,
          color: "var(--color-text-muted)",
        }}
      >
        Research
      </p>
      <p
        style={{
          marginTop: 24,
          fontFamily: "var(--font-serif)",
          fontSize: 16,
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}
      >
        {buildAreaSummary(articles)}
      </p>
      <div style={{ marginTop: 48 }}>
        <ColumnArticleList articles={articles} onArticleClick={onArticleClick} />
      </div>
    </motion.div>
  );
}
