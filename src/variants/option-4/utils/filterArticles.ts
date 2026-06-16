import type { ResearchArticle } from "../../../types/research";

export type ArticleTypeFilter = "tool" | "paper" | "blog";

function articleType(article: ResearchArticle): ArticleTypeFilter {
  if (article.isTool) return "tool";
  return "paper";
}

export function filterByType(
  articles: ResearchArticle[],
  types: ArticleTypeFilter[],
): ResearchArticle[] {
  if (types.length === 0) return articles;
  return articles.filter((article) => types.includes(articleType(article)));
}

export function filterByTheme(
  articles: ResearchArticle[],
  areaIds: string[],
): ResearchArticle[] {
  if (areaIds.length === 0) return articles;
  return articles.filter((article) => areaIds.includes(article.areaId));
}

export function filterArticles(
  articles: ResearchArticle[],
  types: ArticleTypeFilter[],
  areaIds: string[],
): ResearchArticle[] {
  return filterByTheme(filterByType(articles, types), areaIds);
}
