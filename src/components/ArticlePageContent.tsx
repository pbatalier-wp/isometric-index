import type { ArticleContent } from "../types/research";
import type { ResearchArticle } from "../types/research";
import { ArticleContentRenderer } from "./ArticleContentRenderer";

interface ArticlePageContentProps {
  article: ResearchArticle;
  content: ArticleContent;
}

export function ArticlePageContent({ article, content }: ArticlePageContentProps) {
  return (
    <article className="article-page">
      <header className="article-page-header">
        <p className="article-authors">{article.authors.join(", ")}</p>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-date">{article.date}</p>
        <p className="article-abstract-label">Abstract</p>
        <p className="article-abstract-lead">{content.abstract}</p>
      </header>
      <ArticleContentRenderer blocks={content.blocks} />
      <footer className="article-page-footer">
        <a href={article.href} target="_blank" rel="noopener noreferrer" className="article-external-link">
          Read on withpersona.com
        </a>
      </footer>
    </article>
  );
}
