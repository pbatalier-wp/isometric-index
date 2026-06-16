import type { ResearchArticle } from "../types/research";
import "./research-article-list.css";

interface ResearchArticleListProps {
  articles: ResearchArticle[];
  onArticleClick: (article: ResearchArticle) => void;
}

export function ResearchArticleList({ articles, onArticleClick }: ResearchArticleListProps) {
  return (
    <ul className="research-article-list">
      {articles.map((article) => (
        <li key={article.id}>
          <button
            type="button"
            className="research-article-list-row"
            onClick={() => onArticleClick(article)}
          >
            <div className="research-article-list-row-main">
              <div className="research-article-list-thumb">
                <img src={article.thumbnail} alt="" />
              </div>
              <p className="research-article-list-title">{article.title}</p>
            </div>
            <time className="research-article-list-date" dateTime={article.date}>
              {article.date}
            </time>
            <span className="research-article-list-read">
              Read paper
              <span className="research-article-list-read-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
