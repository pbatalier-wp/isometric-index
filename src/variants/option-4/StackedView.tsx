import { useCallback, useMemo, useRef, useState } from "react";
import { researchArticles } from "../../data/articles";
import { getAreaBySlug } from "../../data/areas";
import { useResearchNav } from "../../context/ResearchNavContext";
import { useOpenArticle } from "../../hooks/useOpenArticle";
import { ConcentricOrbitSection } from "./components/ConcentricOrbitSection";
import { ResearchIndexGrid } from "./components/ResearchIndexGrid";
import {
  filterArticles,
  filterByTheme,
  type ArticleTypeFilter,
} from "./utils/filterArticles";

export default function StackedView() {
  const openArticle = useOpenArticle();
  const orbitSectionRef = useRef<HTMLDivElement>(null);
  const [revealedArticleIds, setRevealedArticleIds] = useState<Set<string>>(() => new Set());
  const [selectedTypes, setSelectedTypes] = useState<ArticleTypeFilter[]>([]);
  const [activeAreaSlug, setActiveAreaSlug] = useState<string | null>(null);

  const highlightedAreaId = activeAreaSlug ? (getAreaBySlug(activeAreaSlug)?.id ?? null) : null;

  const filteredArticles = useMemo(() => {
    const byTheme = activeAreaSlug
      ? filterByTheme(
          researchArticles,
          [getAreaBySlug(activeAreaSlug)?.id].filter((id): id is string => Boolean(id)),
        )
      : researchArticles;
    return filterArticles(byTheme, selectedTypes, []);
  }, [activeAreaSlug, selectedTypes]);

  const handleToggleType = useCallback((type: ArticleTypeFilter) => {
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((value) => value !== type) : [...current, type],
    );
  }, []);

  const handleAreaSelect = useCallback((slug: string) => {
    setActiveAreaSlug(slug);
  }, []);

  const handleBackToAllResearch = useCallback(() => {
    setActiveAreaSlug(null);
  }, []);

  const handleArticleClick = useCallback(
    (article: { slug: string; id: string }) => {
      setRevealedArticleIds((current) => new Set(current).add(article.id));
      openArticle(article.slug, article.id);
    },
    [openArticle],
  );

  useResearchNav({
    activeSlug: activeAreaSlug,
    hidden: false,
    disabled: false,
    leadDisabled: activeAreaSlug === null,
    placement: "top",
    onSelectArea: handleAreaSelect,
    onBackToConcentric: handleBackToAllResearch,
  });

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "var(--color-bg)",
      }}
    >
      <ResearchIndexGrid
        articles={filteredArticles}
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
        onArticleClick={handleArticleClick}
      />
      <div ref={orbitSectionRef}>
        <ConcentricOrbitSection
          revealedArticleIds={revealedArticleIds}
          highlightedAreaId={highlightedAreaId}
          onArticleClick={handleArticleClick}
        />
      </div>
    </div>
  );
}
