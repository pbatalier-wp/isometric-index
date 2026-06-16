import type { ResearchArticle } from "../types/research";

const MAX_AUTHOR_SPOKES = 4;

export interface ArticleSpokeNode {
  id: string;
  label: string;
  value: string;
}

export function buildArticleSpokeNodes(article: ResearchArticle): ArticleSpokeNode[] {
  const nodes: ArticleSpokeNode[] = [
    { id: "date", label: "Date", value: article.date },
  ];

  const authors = article.authors;
  const visibleAuthors = authors.slice(0, MAX_AUTHOR_SPOKES);
  const overflow = authors.length - visibleAuthors.length;

  visibleAuthors.forEach((author, index) => {
    const isLast = index === visibleAuthors.length - 1;
    nodes.push({
      id: `author-${index}`,
      label: "Author",
      value: isLast && overflow > 0 ? `${author} +${overflow} more` : author,
    });
  });

  return nodes;
}
