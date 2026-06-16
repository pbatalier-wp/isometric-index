import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useArticleTrail } from "../context/ArticleTrailContext";
import type { ArticleRouteState } from "../types/research";

export function useOpenArticle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { recordArticleVisit } = useArticleTrail();

  return useCallback(
    (slug: string, articleId: string) => {
      recordArticleVisit(articleId);
      const background =
        location.pathname.startsWith("/article/")
          ? (location.state as ArticleRouteState | null)?.background
          : {
              pathname: location.pathname,
              search: location.search,
              hash: location.hash,
            };

      navigate(`/article/${slug}`, {
        state: { background } satisfies ArticleRouteState,
      });
    },
    [location, navigate, recordArticleVisit],
  );
}
