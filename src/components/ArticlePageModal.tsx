import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getArticleBySlug } from "../data/articles";
import { getArticleContent } from "../data/articleContent";
import type { ArticleRouteState } from "../types/research";
import { ArticlePageContent } from "./ArticlePageContent";

export function ArticlePageModal() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  const article = slug ? getArticleBySlug(slug) : undefined;
  const content = slug ? getArticleContent(slug) : undefined;

  const handleExitComplete = useCallback(() => {
    const state = location.state as ArticleRouteState | null;
    const background = state?.background;
    const destination = background
      ? `${background.pathname}${background.search}${background.hash}`
      : "/";

    navigate(destination, { replace: true });
  }, [location.state, navigate]);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  if (!article || !content) {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="article-backdrop"
          className="article-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.div
            key="article-panel"
            className="article-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={article.title}
            initial={{ opacity: 0, scale: 0.98, y: "40%" }}
            animate={{ opacity: 1, scale: 1, y: 32 }}
            exit={{ opacity: 0, scale: 0.98, y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 40 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="article-modal-close" aria-label="Close" onClick={close}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <ArticlePageContent article={article} content={content} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
