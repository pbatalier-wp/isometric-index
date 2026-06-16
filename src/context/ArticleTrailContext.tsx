import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ArticleTrailSegment } from "../types/research";

interface ArticleTrailContextValue {
  trailSegments: ArticleTrailSegment[];
  recordArticleVisit: (articleId: string) => void;
  clearTrail: () => void;
}

const ArticleTrailContext = createContext<ArticleTrailContextValue | null>(null);

export function ArticleTrailProvider({ children }: { children: ReactNode }) {
  const [trailSegments, setTrailSegments] = useState<ArticleTrailSegment[]>([]);
  const committedArticleIdRef = useRef<string | null>(null);

  const recordArticleVisit = useCallback((articleId: string) => {
    const fromArticleId = committedArticleIdRef.current;
    if (fromArticleId && fromArticleId !== articleId) {
      setTrailSegments((segments) => [
        ...segments,
        {
          fromArticleId,
          toArticleId: articleId,
          timestamp: new Date(),
        },
      ]);
    }
    committedArticleIdRef.current = articleId;
  }, []);

  const clearTrail = useCallback(() => {
    setTrailSegments([]);
    committedArticleIdRef.current = null;
  }, []);

  const value = useMemo(
    () => ({ trailSegments, recordArticleVisit, clearTrail }),
    [trailSegments, recordArticleVisit, clearTrail],
  );

  return <ArticleTrailContext.Provider value={value}>{children}</ArticleTrailContext.Provider>;
}

export function useArticleTrail() {
  const context = useContext(ArticleTrailContext);
  if (!context) {
    throw new Error("useArticleTrail must be used within ArticleTrailProvider");
  }
  return context;
}
