import { createContext, useContext, type ReactNode } from "react";

const ArticleOverlayContext = createContext(false);

export function ArticleOverlayProvider({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return <ArticleOverlayContext.Provider value={open}>{children}</ArticleOverlayContext.Provider>;
}

export function useIsArticleOverlayOpen() {
  return useContext(ArticleOverlayContext);
}
