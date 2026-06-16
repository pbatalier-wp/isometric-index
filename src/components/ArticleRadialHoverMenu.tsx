import { motion } from "motion/react";
import type { ResearchArticle } from "../types/research";
import { buildArticleSpokeNodes } from "../utils/articleSpokeNodes";
import { computeRadialSpokeLayout } from "../utils/radialSpokeLayout";
import { CARD_H, CARD_W } from "../utils/isometricLayout";

interface ArticleRadialHoverMenuProps {
  article: ResearchArticle;
  centerX: number;
  centerY: number;
  viewport: { width: number; height: number };
}

const SPOKE_STROKE = "#292929";
const SPOKE_OPACITY = 0.35;
const ENTER_STAGGER = 0.06;
const EXIT_STAGGER = 0.04;

function SpokePath({
  pathD,
  index,
  count,
}: {
  pathD: string;
  index: number;
  count: number;
}) {
  const enterDelay = index * ENTER_STAGGER;
  const exitDelay = (count - index - 1) * EXIT_STAGGER;

  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke={SPOKE_STROKE}
      strokeOpacity={SPOKE_OPACITY}
      strokeWidth={1}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.35, ease: "easeOut", delay: enterDelay },
      }}
      exit={{
        pathLength: 0,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeIn", delay: exitDelay },
      }}
    />
  );
}

function SpokeNode({
  label,
  value,
  x,
  y,
  angle,
  index,
  count,
}: {
  label: string;
  value: string;
  x: number;
  y: number;
  angle: number;
  index: number;
  count: number;
}) {
  const enterDelay = index * ENTER_STAGGER + 0.08;
  const exitDelay = (count - index - 1) * EXIT_STAGGER;
  const slideX = Math.cos(angle) * 8;
  const slideY = Math.sin(angle) * 8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: slideX, y: slideY }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.25, ease: "easeOut", delay: enterDelay },
      }}
      exit={{
        opacity: 0,
        scale: 0,
        x: slideX,
        y: slideY,
        transition: { duration: 0.2, ease: "easeIn", delay: exitDelay },
      }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 166,
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 6,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.2, delay: enterDelay } }}
        exit={{ scale: 0, transition: { duration: 0.15, delay: exitDelay } }}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: SPOKE_STROKE,
          opacity: 0.35,
          margin: "0 auto 6px",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          lineHeight: "normal",
          color: "var(--color-text)",
          opacity: 0.5,
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 14,
          lineHeight: 1.28,
          color: "var(--color-text)",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </motion.div>
  );
}

export function ArticleRadialHoverMenu({
  article,
  centerX,
  centerY,
  viewport,
}: ArticleRadialHoverMenuProps) {
  const spokeNodes = buildArticleSpokeNodes(article);
  const layout = computeRadialSpokeLayout({
    centerX,
    centerY,
    cardWidth: CARD_W,
    cardHeight: CARD_H,
    count: spokeNodes.length,
    seed: article.id,
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg
        width={viewport.width}
        height={viewport.height}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {layout.map((node, index) => (
          <SpokePath
            key={spokeNodes[index].id}
            pathD={node.pathD}
            index={index}
            count={layout.length}
          />
        ))}
      </svg>

      {spokeNodes.map((node, index) => {
        const position = layout[index];
        if (!position) return null;

        return (
          <SpokeNode
            key={node.id}
            label={node.label}
            value={node.value}
            x={position.x}
            y={position.y}
            angle={position.angle}
            index={index}
            count={spokeNodes.length}
          />
        );
      })}
    </motion.div>
  );
}
