import { useEffect, useRef } from "react";
import { motion, useAnimate } from "motion/react";
import type { FocusedArticle } from "../types/research";

interface ArticleModalProps {
  focused: FocusedArticle;
  onDismiss: () => void;
  dismissRef: React.MutableRefObject<(() => void) | null>;
}

export function ArticleModal({ focused, onDismiss, dismissRef }: ArticleModalProps) {
  const [scope, animate] = useAnimate();
  const backdropRef = useRef<HTMLDivElement>(null);
  const { article, originX, originY, zIndex, width, height, rotateY = 0 } = focused;

  const handleDismiss = () => {
    if (backdropRef.current) {
      animate(backdropRef.current, { opacity: 0 }, { duration: 0.2 });
    }
    animate(scope.current, { zIndex: zIndex - 1 }, { duration: 0 })
      .then(() =>
        animate(
          scope.current,
          {
            x: 0,
            y: 0,
            left: originX + 150,
            top: originY,
            width,
            height,
            borderRadius: 6.4,
            rotateY: 0,
          },
          { type: "spring", stiffness: 400, damping: 40, restDelta: 1, restSpeed: 10 },
        ),
      )
      .then(() =>
        animate(scope.current, { left: originX, rotateY }, { duration: 0.15, ease: "easeIn" }),
      )
      .then(() => onDismiss());
  };

  useEffect(() => {
    dismissRef.current = handleDismiss;
    return () => {
      dismissRef.current = null;
    };
  });

  useEffect(() => {
    animate(
      scope.current,
      {
        left: originX + 150,
        top: originY,
        width,
        height,
        borderRadius: 6.4,
        rotateY: 0,
      },
      { duration: 0.2, ease: "easeOut" },
    ).then(() =>
      animate(
        scope.current,
        {
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          width: 480,
          height: 400,
          borderRadius: 12,
        },
        { type: "spring", stiffness: 280, damping: 28 },
      ),
    );
  }, []);

  return (
    <>
      <motion.div
        ref={backdropRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleDismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 10000,
        }}
      />
      <motion.div
        ref={scope}
        onClick={handleDismiss}
        initial={{
          left: originX,
          top: originY,
          width,
          height,
          borderRadius: 6.4,
          rotateY,
          x: 0,
          y: 0,
          zIndex: 99999,
        }}
        style={{
          position: "absolute",
          backgroundColor: "#fff",
          border: "1px solid rgba(0,0,0,0.12)",
          cursor: "pointer",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={article.thumbnail}
          alt=""
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ padding: "20px 24px", flex: 1, overflow: "auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontWeight: 400,
              color: "var(--color-text)",
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            {article.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 14,
              color: "var(--color-text-muted)",
              marginBottom: 12,
            }}
          >
            {article.date}
            {article.authors.length > 0 && ` · ${article.authors.join(", ")}`}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 15,
              color: "var(--color-text)",
              lineHeight: 1.5,
              opacity: 0.85,
            }}
          >
            {article.summary}
          </p>
        </div>
      </motion.div>
    </>
  );
}
