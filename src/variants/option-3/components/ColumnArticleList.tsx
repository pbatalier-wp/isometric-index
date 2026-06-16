import { useState } from "react";
import type { ResearchArticle } from "../../../types/research";
import "./column-article-list.css";

interface ColumnArticleListProps {
  articles: ResearchArticle[];
  onArticleClick: (article: ResearchArticle) => void;
}

export function ColumnArticleList({ articles, onArticleClick }: ColumnArticleListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <ul className="column-article-list">
      {articles.map((article) => (
        <li
          key={article.id}
          className="column-article-list-row"
          onMouseEnter={() => setHoveredId(article.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="column-article-list-row-main">
            <div className="column-article-list-thumb">
              <img src={article.thumbnail} alt="" />
            </div>
            <p className="column-article-list-title">{article.title}</p>
          </div>
          <time className="column-article-list-date" dateTime={article.date}>
            {article.date}
          </time>
          <button
            type="button"
            className="column-article-list-read"
            tabIndex={hoveredId === article.id ? 0 : -1}
            onClick={() => onArticleClick(article)}
          >
            Read paper
            <span className="column-article-list-read-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
