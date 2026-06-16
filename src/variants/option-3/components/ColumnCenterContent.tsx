import { motion } from "motion/react";
import type { ResearchArea, ResearchArticle } from "../../../types/research";

interface ColumnCenterContentProps {
  area: ResearchArea;
  articles: ResearchArticle[];
  visible: boolean;
  fromTransition: boolean;
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
}: ColumnCenterContentProps) {
  return (
    <motion.div
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
        maxWidth: 448,
        width: "100%",
        padding: "0 24px",
        zIndex: 10,
        pointerEvents: "none",
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
    </motion.div>
  );
}
