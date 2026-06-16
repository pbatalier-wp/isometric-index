import type { ResearchArticle } from "../../../types/research";
import { ResearchArticleList } from "../../../components/ResearchArticleList";

interface ColumnArticleListProps {
  articles: ResearchArticle[];
  onArticleClick: (article: ResearchArticle) => void;
}

export function ColumnArticleList({ articles, onArticleClick }: ColumnArticleListProps) {
  return <ResearchArticleList articles={articles} onArticleClick={onArticleClick} />;
}
