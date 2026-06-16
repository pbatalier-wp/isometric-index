import { Route, Routes, useLocation } from "react-router-dom";
import { ArticlePageModal } from "../components/ArticlePageModal";
import { ArticleOverlayProvider } from "../context/ArticleOverlayContext";
import ConcentricIndex from "../pages/ConcentricIndex";
import IsometricView from "../pages/IsometricView";
import type { ArticleRouteState } from "../types/research";

export default function IndexLayout() {
  const location = useLocation();
  const state = location.state as ArticleRouteState | null;
  const background = state?.background;
  const isArticleRoute = location.pathname.startsWith("/article/");

  const spatialLocation =
    isArticleRoute && background
      ? {
          ...location,
          pathname: background.pathname,
          search: background.search,
          hash: background.hash,
        }
      : location;

  return (
    <ArticleOverlayProvider open={isArticleRoute}>
      <Routes location={spatialLocation}>
        <Route path="/" element={<ConcentricIndex />} />
        <Route path="/area/:areaSlug" element={<IsometricView />} />
      </Routes>
      <Routes>
        <Route path="/article/:slug" element={<ArticlePageModal />} />
      </Routes>
    </ArticleOverlayProvider>
  );
}
