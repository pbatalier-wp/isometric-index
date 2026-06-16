import { Route, Routes, useLocation } from "react-router-dom";
import { ArticlePageModal } from "../components/ArticlePageModal";
import { ArticleOverlayProvider } from "../context/ArticleOverlayContext";
import { useViewVariant } from "../context/ViewVariantContext";
import type { ArticleRouteState } from "../types/research";

export default function IndexLayout() {
  const location = useLocation();
  const { activeVariant } = useViewVariant();
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

  const {
    ConcentricView,
    IsometricView,
    ArticleModal: VariantArticleModal,
  } = activeVariant;
  const ArticleModal = VariantArticleModal ?? ArticlePageModal;

  return (
    <ArticleOverlayProvider open={isArticleRoute}>
      <Routes key={activeVariant.id} location={spatialLocation}>
        <Route path="/" element={<ConcentricView />} />
        <Route path="/area/:areaSlug" element={<IsometricView />} />
      </Routes>
      <Routes>
        <Route path="/article/:slug" element={<ArticleModal />} />
      </Routes>
    </ArticleOverlayProvider>
  );
}
