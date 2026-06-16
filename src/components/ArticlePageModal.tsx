import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Transition, type Easing } from "motion/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ARTICLE_MODAL_SETTINGS,
  JULY_MODAL_LINEAR_EASE,
} from "../config/articleModal";
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
  const modal = ARTICLE_MODAL_SETTINGS;

  const panelEase = useMemo<Easing | Easing[]>(() => {
    if (modal.panel.useJulyEasing) return JULY_MODAL_LINEAR_EASE as Easing;
    const easing = modal.panel.easing;
    return easing.type === "easing" ? easing.ease : [0.645, 0.045, 0.355, 1];
  }, [modal.panel.easing, modal.panel.useJulyEasing]);

  const backdropTransition = useMemo<Transition>(
    () => ({
      duration: modal.backdrop.duration,
      ease: panelEase,
    }),
    [modal.backdrop.duration, panelEase],
  );

  const panelTransition = useMemo<Transition>(
    () => ({
      duration: modal.panel.duration,
      ease: panelEase,
    }),
    [modal.panel.duration, panelEase],
  );

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
          animate={{ opacity: modal.backdrop.opacity }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
          onClick={close}
        >
          <motion.div
            key="article-panel"
            className="article-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={article.title}
            initial={{
              opacity: modal.panel.enter.fromOpacity,
              scale: modal.panel.enter.fromScale,
              y: `${modal.panel.enter.fromYPercent}%`,
            }}
            animate={{
              opacity: modal.panel.enter.toOpacity,
              scale: modal.panel.enter.toScale,
              y: modal.panel.enter.toY,
            }}
            exit={{
              opacity: modal.panel.exit.opacity,
              scale: modal.panel.exit.scale,
              y: `${modal.panel.exit.yPercent}%`,
            }}
            transition={panelTransition}
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
