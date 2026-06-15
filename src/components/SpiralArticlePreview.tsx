import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { FocusedArticle } from "../types/research";
import { TILE_SIZE } from "./ArticleTile";

interface SpiralArticlePreviewProps {
  focused: FocusedArticle;
  onDismiss: () => void;
  dismissRef: React.MutableRefObject<(() => void) | null>;
}

const PANEL_WIDTH = 480;

export function SpiralArticlePreview({
  focused,
  onDismiss,
  dismissRef,
}: SpiralArticlePreviewProps) {
  const [visible, setVisible] = useState(true);
  const { article, originX, originY, width, height } = focused;
  const anchorX = originX + width / 2;
  const anchorY = originY + height / 2;

  const tileLeft = anchorX - TILE_SIZE / 2;
  const tileTop = anchorY - TILE_SIZE / 2;

  let panelLeft = tileLeft;
  if (typeof window !== "undefined" && panelLeft + PANEL_WIDTH > window.innerWidth - 24) {
    panelLeft = Math.max(24, window.innerWidth - 24 - PANEL_WIDTH);
  }

  let panelTop = tileTop;
  if (typeof window !== "undefined" && panelTop + 220 > window.innerHeight - 80) {
    panelTop = Math.max(24, window.innerHeight - 80 - 220);
  }

  const handleDismiss = () => setVisible(false);

  useEffect(() => {
    dismissRef.current = handleDismiss;
    return () => {
      dismissRef.current = null;
    };
  });

  return (
    <AnimatePresence onExitComplete={onDismiss}>
      {visible && (
        <>
          <motion.div
            key="spiral-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={handleDismiss}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(250, 250, 253, 0.72)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              zIndex: 10000,
            }}
          />
          <motion.div
            key="spiral-panel"
            initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.85 }}
            style={{
              position: "absolute",
              left: panelLeft,
              top: panelTop,
              width: PANEL_WIDTH,
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              padding: 16,
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.92)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
              zIndex: 10001,
              cursor: "default",
            }}
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                borderRadius: 8,
                border: "1px solid rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={article.thumbnail}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2, delay: 0.04, ease: "easeOut" }}
              style={{ flex: 1, minWidth: 0, paddingTop: 2 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 16,
                  color: "var(--color-text)",
                  lineHeight: 1.24,
                  letterSpacing: "-0.16px",
                  marginBottom: 8,
                }}
              >
                {article.title}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    color: "var(--color-text)",
                    opacity: 0.35,
                    lineHeight: 1.24,
                  }}
                >
                  {article.date}
                </p>
                {article.isTool && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--color-text)",
                      opacity: 0.5,
                      letterSpacing: "0.05em",
                    }}
                  >
                    [ tool ]
                  </span>
                )}
              </div>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.85, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.22, delay: 0.08, ease: "easeOut" }}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 14,
                  color: "var(--color-text)",
                  lineHeight: 1.5,
                }}
              >
                {article.summary}
              </motion.p>
              {article.authors.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.12 }}
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 13,
                    color: "var(--color-text)",
                    marginTop: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {article.authors.join(", ")}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
