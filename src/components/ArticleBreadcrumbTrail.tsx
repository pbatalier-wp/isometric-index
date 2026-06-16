import { motion } from "motion/react";
import type { ArticlePosition, ArticleTrailSegment } from "../types/research";
import { buildTrailSegmentPath } from "../utils/trailPath";

interface ArticleBreadcrumbTrailProps {
  width: number;
  height: number;
  segments: ArticleTrailSegment[];
  positions: ArticlePosition[];
  hidden?: boolean;
}

const TRAIL_STROKE = "#292929";
const TRAIL_STROKE_OPACITY = 0.35;
const TRAIL_STROKE_WIDTH = 1.5;
const TRAIL_DASH = "4 6";

function formatTrailTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ArticleBreadcrumbTrail({
  width,
  height,
  segments,
  positions,
  hidden = false,
}: ArticleBreadcrumbTrailProps) {
  const positionById = new Map(positions.map((position) => [position.article.id, position]));

  return (
    <motion.div
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.35 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {segments.map((segment) => {
          const from = positionById.get(segment.fromArticleId);
          const to = positionById.get(segment.toArticleId);
          if (!from || !to) return null;

          const path = buildTrailSegmentPath(from, to);

          return (
            <motion.path
              key={`${segment.fromArticleId}-${segment.toArticleId}-${segment.timestamp.getTime()}`}
              d={path.d}
              fill="none"
              stroke={TRAIL_STROKE}
              strokeOpacity={TRAIL_STROKE_OPACITY}
              strokeWidth={TRAIL_STROKE_WIDTH}
              strokeDasharray={TRAIL_DASH}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          );
        })}
      </svg>
      {segments.map((segment) => {
        const from = positionById.get(segment.fromArticleId);
        const to = positionById.get(segment.toArticleId);
        if (!from || !to) return null;

        const path = buildTrailSegmentPath(from, to);

        return (
          <motion.div
            key={`label-${segment.fromArticleId}-${segment.toArticleId}-${segment.timestamp.getTime()}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            style={{
              position: "absolute",
              left: path.labelX,
              top: path.labelY,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8px",
              borderRadius: 6,
              background: "var(--color-bg)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              lineHeight: "normal",
              color: "var(--color-trail-label)",
              whiteSpace: "nowrap",
            }}
          >
            {formatTrailTime(segment.timestamp)}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
