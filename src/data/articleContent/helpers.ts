import type { ArticleContentBlock } from "../../types/research";

export function paragraphs(...texts: string[]): ArticleContentBlock[] {
  return texts.map((text) => ({ type: "paragraph", text }));
}

export function section(title: string, ...blocks: ArticleContentBlock[]): ArticleContentBlock[] {
  return [{ type: "heading", level: 2, text: title }, ...blocks];
}
